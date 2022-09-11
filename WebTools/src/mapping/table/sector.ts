import { createRandomValue } from "../../common/randomValueGenerator";
import { StarSystem } from "./starSystem";

export class Sector {
    public prefix: string;
    public id: string;
    public systems: StarSystem[] = [];
    public simpleName: string;

    constructor(idPrefix: string) {
        this.prefix = idPrefix;
        this.id = Sector.randomId(idPrefix);
        this.simpleName = this.id;
    }

    private static randomId(prefix: string) {
        return prefix + "-" + createRandomValue();
    }
    get name() {
        if (this.simpleName != null && this.simpleName.length > 0) {
            return this.simpleName;
        } else {
            return this.id;
        }
    }

    get plainText() {
        let systems = this.systems.map(s => s.plainText).join('\n\n');
        return "Sector: " + this.name + "\n\n" + systems;
    }

    get sortedSystems() {
        let result = [ ...this.systems ];
        result.sort((a, b) => {
            if (a.sectorCoordinates.z !== b.sectorCoordinates.z) {
                return a.sectorCoordinates.z - b.sectorCoordinates.z;
            } else if (a.sectorCoordinates.y !== b.sectorCoordinates.y) {
                return a.sectorCoordinates.y - b.sectorCoordinates.y;
            } else {
                return a.sectorCoordinates.x - b.sectorCoordinates.x;
            }
        });
        return result;
    }
}

export class SectorCoordinates {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get description() {
        return "" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2);
    }

    get distanceFromOrigin() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
