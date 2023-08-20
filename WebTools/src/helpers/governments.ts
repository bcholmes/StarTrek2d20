import { Era } from "./eras";
import i18next from "i18next";
import { makeKey } from "../common/translationKey";

export enum GovernmentType {
    Federation,
    Andorian,
    Vulcan,
    Tellarite,
    Klingon,
    Romulan,
    Bajoran,
    Cardassian,
    Dominion,
    Other
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

    get localizedName() {
        return i18next.t(makeKey('GovernmentType.name.', GovernmentType[this.type]));
    }
}

class _Governments {
    options: Government[] = [
        new Government("Andorian",GovernmentType.Andorian, Era.Enterprise),
        new Government("Bajoran", GovernmentType.Bajoran, Era.NextGeneration, Era.PicardProdigy),
        new Government("Cardassian", GovernmentType.Cardassian, Era.NextGeneration, Era.PicardProdigy),
        new Government("Dominion", GovernmentType.Dominion, Era.NextGeneration, Era.PicardProdigy),
        new Government("Federation", GovernmentType.Federation, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32),
        new Government("Klingon",GovernmentType.Klingon, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32),
        new Government("Romulan", GovernmentType.Romulan, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy),
        new Government("Tellarite", GovernmentType.Tellarite, Era.Enterprise),
        new Government("Vulcan", GovernmentType.Vulcan, Era.Enterprise),

        new Government("Other", GovernmentType.Other, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32)
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
