import { SectorCoordinates } from "./sector";
import { NotableSpatialPhenomenonModel, Star } from "./star";
import { GasGiantDetails, World } from "./world";

export enum CompanionType {
    Close, Distant
}

export class StarSystem {
    public id: string;
    public star: Star;
    public companionStar?: Star;
    public companionType?: CompanionType;
    public companionOrbitalRadius?: number;
    public worlds: World[] = [];
    public sectorCoordinates: SectorCoordinates;
    public phenomenon: NotableSpatialPhenomenonModel;
    public rootName: string;
    public friendlyName: string;

    constructor (star: Star) {
        this.star = star;
    }

    get isBinary() {
        return this.companionStar != null;
    }

    get name() {
        if (this.friendlyName) {
            return this.friendlyName;
        } else {
            return this.rootName + "-" + this.id;
        }
    }

    get luminosityValue() {
        if (this.companionStar != null && this.companionType === CompanionType.Close) {
            return this.star.luminosityValue + this.companionStar.luminosityValue;
        } else {
            return this.star.luminosityValue;
        }
    }

    isInGardenZone(radius: number) {
        return (this.gardenZoneInnerRadius >= radius && this.gardenZoneOuterRadius < radius)
    }

    clone() {
        let result = new StarSystem(this.star);
        result.id = this.id;
        result.sectorCoordinates = this.sectorCoordinates;
        result.worlds = this.worlds;
        result.companionStar = this.companionStar;
        result.companionType = this.companionType;
        result.phenomenon = this.phenomenon;
        result.rootName = this.rootName;
        result.friendlyName = this.friendlyName;
        return result;
    }

    get gardenZoneInnerRadius() {
        if (this.star && this.luminosityValue) {
            return Math.sqrt(this.luminosityValue) * 0.72;
        } else {
            return undefined;
        }
    }

    get gardenZoneOuterRadius() {
        if (this.star && this.luminosityValue) {
            return Math.sqrt(this.luminosityValue) * 1.45;
        } else {
            return undefined;
        }
    }

    get gardenZoneIdealRadius() {
        if (this.star && this.luminosityValue) {
            return Math.sqrt(this.luminosityValue);
        } else {
            return undefined;
        }
    }

    get plainText() {
        let worlds = this.worlds.map(w => w.plainText).join("\n\n");

        return "Star System: " + this.name + "\n"
            + "Star: " + this.star.plainText
            + (this.companionStar == null ? "" : ("\nCompanion Star: " + this.companionStar.plainText))
            + (this.companionType == null ? "" : ("\nCompanion Type: " + CompanionType[this.companionType]))
            + "\n" + worlds;
    }

    get worldsAndSatelliteWorlds() {
        let result = [];
        this.worlds.forEach(w => {
            result.push(w);
            if (w.worldDetails != null && w.worldDetails instanceof GasGiantDetails) {
                let details = w.worldDetails as GasGiantDetails;
                details.ecosphereWorlds.forEach(e => result.push(e));
            }
        });
        return result;
    }
}
