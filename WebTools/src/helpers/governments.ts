import { Era } from "./eras";

export enum GovernmentType {
    FEDERATION,
    ANDORIAN,
    VULCAN,
    TELLARITE,
    KLINGON,
    ROMULAN,
    BAJORAN,
    CARDASSIAN,
    DOMINION,
    OTHER
}

export class Government {
    name: string;
    type: GovernmentType;
    eras: Era[];

    constructor(name: string, type: GovernmentType, ...era: Era[]) {
        this.name = name;
        this.type = type;
        this.eras = era;
    }
}

class _Governments {
    options: Government[] = [
        new Government("Andorian",GovernmentType.ANDORIAN, Era.Enterprise),
        new Government("Bajoran", GovernmentType.BAJORAN, Era.NextGeneration),
        new Government("Cardassian", GovernmentType.CARDASSIAN, Era.NextGeneration),
        new Government("Dominion", GovernmentType.DOMINION, Era.NextGeneration),
        new Government("Federation", GovernmentType.FEDERATION, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration),
        new Government("Klingon",GovernmentType.KLINGON, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration),
        new Government("Romulan", GovernmentType.ROMULAN, Era.OriginalSeries, Era.NextGeneration),
        new Government("Tellarite", GovernmentType.TELLARITE, Era.Enterprise),
        new Government("Vulcan", GovernmentType.VULCAN, Era.Enterprise),

        new Government("Other", GovernmentType.OTHER, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration)
    ];

    selectOptions(era: Era) {
        return this.options.filter(o => o.eras.indexOf(era) >= 0);
    }

    findOption(type: GovernmentType) {
        let temp = this.options.filter(o => o.type === type);
        return temp ? temp[0] : null;
    }
}


const Governments = new _Governments();

export default Governments;
