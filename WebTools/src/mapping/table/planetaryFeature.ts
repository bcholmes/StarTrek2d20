import { D20 } from "../../common/die";

export interface PlanetaryFeature {
    readonly localizedDescription: string;
}

class StandardPlanetaryFeature implements PlanetaryFeature {
    readonly localizedDescription: string;

    constructor(description: string) {
        this.localizedDescription = description;
    }
}

export const planetaryFeaturesOfInterest = () => {
    const roll = D20.roll();
    switch (roll) {
        case 1:
        case 2:
            return new StandardPlanetaryFeature("Exceedingly dangerous animal or plant life");
        case 3:
        case 4:
            return new StandardPlanetaryFeature("Peaceful primitive inhabitants");
        case 5:
        case 6:
            return new StandardPlanetaryFeature("Warlike primitive inhabitants");
        case 7:
            return new StandardPlanetaryFeature("Peaceful technological inhabitants");
        case 8:
        case 9:
            return new StandardPlanetaryFeature("Warlike technological inhabitants");
        case 10:
        case 11:
            return new StandardPlanetaryFeature("Transcendent inhabitants of great power");
        case 12:
        case 13:
            return new StandardPlanetaryFeature("Ancient ruins or artifacts");
        case 14:
        case 15:
            return new StandardPlanetaryFeature("Off-world visitors");
        case 16:
        case 17:
            return new StandardPlanetaryFeature("Crashed spacecraft");
        case 18:
            return transporterInhibitorFeature();
        case 19:
        case 20:
        default:
            return new StandardPlanetaryFeature("Dangerous natural phenomena");
    }
}


const transporterInhibitorFeature = () => {
    const roll = D20.roll();
    switch (roll) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            return new TransporterInhibitingConditionsFeature("Upper atmosphere contains electromagnetic whirlwinds that inhibit sensors and, by extension, transpoters")
        case 6:
        case 7:
            return new TransporterInhibitingConditionsFeature("Planetary surface has high concentrations of kelbonite, which inhibits sensors and, by extension, transporter")
        case 8:
        case 9:
            return new TransporterInhibitingConditionsFeature("Planetary surface has high quantities of topaline, which inhibits sensors and, by extension, transporter")
        case 10:
            return new TransporterInhibitingConditionsFeature("Planetary surface has high quantities of magnesite, which inhibits sensors and, by extension, transporter")
        case 11:
        case 12:
        case 13:
            return new TransporterInhibitingConditionsFeature("Upper atmosphere contains thoron radiation that interferes with sensors and, by extension, transpoters")
        case 14:
        case 15:
        case 16:
            return new TransporterInhibitingConditionsFeature("Atmosphere contains ionic interference that interferes with sensors and, by extension, transpoters");
        case 17:
        case 18:
            return new TransporterInhibitingConditionsFeature("Atmosphere contains trinimbic interference that reduces the effectiveness of sensors and transpoters");
        case 19:
            return new TransporterInhibitingConditionsFeature("The planetary atmoshere contains an unfamiliar energy phenomenon that interferes with transports");
        case 20:
            return new TransporterInhibitingConditionsFeature("Atmosphere contains hyperonic radition, lethal to humans, and rendering transporters and phasers inoperable");

    }
}


class TransporterInhibitingConditionsFeature implements PlanetaryFeature {

    readonly localizedDescription: string;

    constructor(description: string) {
        this.localizedDescription = description;
    }
}
