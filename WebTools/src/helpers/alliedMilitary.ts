import { Era } from "./eras";
import { Species } from "./speciesEnum";
import i18next from "i18next";
import { makeKey } from "../common/translationKey";

export enum AlliedMilitaryType {
    Maco,
    AndorianImperialGuard,
    VulcanHighCommand,
    KlingonDefenceForce,
    RomulanStarEmpire,
    BajoranMilitia,
    CardassianUnion,
    Dominion,
    FerengiMilitary,
    SonACommand,
    TalarianMilitia,
    TzenkethiCoalition,
    Other
}

export class AlliedMilitary {
    name: string;
    species: Species[];
    type: AlliedMilitaryType;
    eras: Era[];

    constructor(name: string, type: AlliedMilitaryType, species: Species[], ...era: Era[]) {
        this.name = name;
        this.species = species || [];
        this.type = type;
        this.eras = era;
    }

    get localizedName() {
        return i18next.t(makeKey('AlliedMilitaryType.name.', AlliedMilitaryType[this.type]));
    }
}

class AllyHelper {

    static _instance: AllyHelper;

    static get instance() {
        if (AllyHelper._instance == null) {
            AllyHelper._instance = new AllyHelper();
        }
        return AllyHelper._instance;
    }

    options: AlliedMilitary[] = [
        new AlliedMilitary("Andorian Imperial Guard", AlliedMilitaryType.AndorianImperialGuard, [Species.Andorian],
                Era.Enterprise),
        new AlliedMilitary("Bajoran Militia", AlliedMilitaryType.BajoranMilitia, [Species.Bajoran],
                Era.NextGeneration, Era.PicardProdigy),
        new AlliedMilitary("Cardassian Union", AlliedMilitaryType.CardassianUnion, [Species.Cardassian],
                Era.NextGeneration, Era.PicardProdigy),
        new AlliedMilitary("Dominion", AlliedMilitaryType.Dominion, [Species.JemHadar], Era.NextGeneration, Era.PicardProdigy),
        new AlliedMilitary("Ferengi", AlliedMilitaryType.FerengiMilitary, [Species.Ferengi], Era.NextGeneration, Era.PicardProdigy),
        new AlliedMilitary("Klingon Defence Force",AlliedMilitaryType.KlingonDefenceForce, [Species.KlingonExt, Species.Klingon, Species.KlingonQuchHa],
                Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32),
        new AlliedMilitary("MACO", AlliedMilitaryType.Maco, [Species.Human], Era.Enterprise),
        new AlliedMilitary("Romulan Star Empire", AlliedMilitaryType.RomulanStarEmpire, [Species.RomulanExt, Species.Romulan, Species.Reman],
                Era.OriginalSeries, Era.NextGeneration),
        new AlliedMilitary("Vulcan High Command", AlliedMilitaryType.VulcanHighCommand, [Species.Vulcan], Era.Enterprise),

        new AlliedMilitary("Other", AlliedMilitaryType.Other, [], Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32)
    ]

    selectOptions(era: Era, includeKlingon: boolean) {
        return this.options.filter(o => o.eras.indexOf(era) >= 0 && (o.type !== AlliedMilitaryType.KlingonDefenceForce || includeKlingon));
    }

    findOption(type: AlliedMilitaryType) {
        let temp = this.options.filter(o => o.type === type);
        return temp ? temp[0] : null;
    }
}

export default AllyHelper;
