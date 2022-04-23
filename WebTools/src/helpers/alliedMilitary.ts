import { Era } from "./eras";
import { Species } from "./speciesEnum";

export enum AlliedMilitaryType {
    MACO,
    ANDORIAN_IMPERIAL_GUARD, 
    VULCAN_HIGH_COMMAND,
    KLINGON_DEFENCE_FORCE,
    ROMULAN_STAR_EMPIRE,
    BAJORAN_MILITIA,
    CARDASSIAN_UNION,
    OTHER
}

export class AlliedMilitary {
    name: string;
    species: Species[];
    type: AlliedMilitaryType;
    eras: Era[];

    constructor(name: string, type: AlliedMilitaryType, species: Species[], ...era: Era[]) {
        this.name = name;
        this.species = species;
        this.type = type;
        this.eras = era;
    }
}

class _AllyHelper {
    options: AlliedMilitary[] = [
        new AlliedMilitary("Andorian Imperial Guard", AlliedMilitaryType.ANDORIAN_IMPERIAL_GUARD, [Species.Andorian], 
                Era.Enterprise),
        new AlliedMilitary("Bajoran Militia", AlliedMilitaryType.BAJORAN_MILITIA, [Species.Bajoran], 
                Era.NextGeneration),
        new AlliedMilitary("Cardassian Union", AlliedMilitaryType.CARDASSIAN_UNION, [Species.Cardassian], 
                Era.NextGeneration),
        new AlliedMilitary("Klingon Defence Force",AlliedMilitaryType.KLINGON_DEFENCE_FORCE, [Species.KlingonExt, Species.Klingon, Species.KlingonQuchHa], 
                Era.Enterprise, Era.OriginalSeries, Era.NextGeneration),
        new AlliedMilitary("MACO", AlliedMilitaryType.MACO, [Species.Human], Era.Enterprise),
        new AlliedMilitary("Romulan Star Empire", AlliedMilitaryType.ROMULAN_STAR_EMPIRE, [Species.RomulanExt],
                Era.OriginalSeries, Era.NextGeneration),
        new AlliedMilitary("Vulcan High Command", AlliedMilitaryType.VULCAN_HIGH_COMMAND, [Species.Vulcan], Era.Enterprise),

        new AlliedMilitary("Other", AlliedMilitaryType.OTHER, [], Era.Enterprise, Era.OriginalSeries, Era.NextGeneration)
    ]

    selectOptions(era: Era, includeKlingon: boolean) {
        return this.options.filter(o => o.eras.indexOf(era) >= 0 && (o.type !== AlliedMilitaryType.KLINGON_DEFENCE_FORCE || includeKlingon));
    }

    findOption(type: AlliedMilitaryType) {
        let temp = this.options.filter(o => o.type === type);
        return temp ? temp[0] : null;
    }
}

const AllyHelper = new _AllyHelper();

export default AllyHelper;