import { Era } from "./eras";
import { Species } from "./speciesEnum";
import i18next, { t } from "i18next";
import { makeKey } from "../common/translationKey";

export enum AlliedMilitaryType {
    Maco,
    AndorianImperialGuard,
    VulcanHighCommand,
    KlingonDefenceForce,
    RomulanStarEmpire,
    BajoranMilitia,
    CardassianUnion,
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
        return t(makeKey('AlliedMilitaryType.name.', AlliedMilitaryType[this.type]));
    }
}

class _AllyHelper {
    options: AlliedMilitary[] = [
        new AlliedMilitary("Andorian Imperial Guard", AlliedMilitaryType.AndorianImperialGuard, [Species.Andorian],
                Era.Enterprise),
        new AlliedMilitary("Bajoran Militia", AlliedMilitaryType.BajoranMilitia, [Species.Bajoran],
                Era.NextGeneration),
        new AlliedMilitary("Cardassian Union", AlliedMilitaryType.CardassianUnion, [Species.Cardassian],
                Era.NextGeneration),
        new AlliedMilitary("Klingon Defence Force",AlliedMilitaryType.KlingonDefenceForce, [Species.KlingonExt, Species.Klingon, Species.KlingonQuchHa],
                Era.Enterprise, Era.OriginalSeries, Era.NextGeneration),
        new AlliedMilitary("MACO", AlliedMilitaryType.Maco, [Species.Human], Era.Enterprise),
        new AlliedMilitary("Romulan Star Empire", AlliedMilitaryType.RomulanStarEmpire, [Species.RomulanExt, Species.Romulan],
                Era.OriginalSeries, Era.NextGeneration),
        new AlliedMilitary("Vulcan High Command", AlliedMilitaryType.VulcanHighCommand, [Species.Vulcan], Era.Enterprise),

        new AlliedMilitary("Other", AlliedMilitaryType.Other, [], Era.Enterprise, Era.OriginalSeries, Era.NextGeneration)
    ]

    selectOptions(era: Era, includeKlingon: boolean) {
        return this.options.filter(o => o.eras.indexOf(era) >= 0 && (o.type !== AlliedMilitaryType.KlingonDefenceForce || includeKlingon));
    }

    findOption(type: AlliedMilitaryType) {
        let temp = this.options.filter(o => o.type === type);
        return temp ? temp[0] : null;
    }
}

const AllyHelper = new _AllyHelper();

export default AllyHelper;