import { Era } from "./eras";

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
    type: AlliedMilitaryType;
    eras: Era[];

    constructor(name: string, type: AlliedMilitaryType, ...era: Era[]) {
        this.name = name;
        this.type = type;
        this.eras = era;
    }
}

class _AllyHelper {
    options: AlliedMilitary[] = [
        new AlliedMilitary("Andorian Imperial Guard",AlliedMilitaryType.ANDORIAN_IMPERIAL_GUARD, Era.Enterprise),
        new AlliedMilitary("Bajoran Militia", AlliedMilitaryType.BAJORAN_MILITIA, Era.NextGeneration),
        new AlliedMilitary("Cardassian Union", AlliedMilitaryType.CARDASSIAN_UNION, Era.NextGeneration),
        new AlliedMilitary("Klingon Defence Force",AlliedMilitaryType.KLINGON_DEFENCE_FORCE, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration),
        new AlliedMilitary("MACO", AlliedMilitaryType.MACO, Era.Enterprise),
        new AlliedMilitary("Romulan Star Empire", AlliedMilitaryType.ROMULAN_STAR_EMPIRE, Era.OriginalSeries, Era.NextGeneration),
        new AlliedMilitary("Vulcan High Command", AlliedMilitaryType.VULCAN_HIGH_COMMAND, Era.Enterprise),

        new AlliedMilitary("Other", AlliedMilitaryType.OTHER, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration)
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