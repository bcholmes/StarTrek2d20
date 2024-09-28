import { Era } from "./eras";
import i18next from "i18next";
import { makeKey } from "../common/translationKey";

export enum Polity {
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
    type: Polity;
    eras: Era[];

    constructor(name: string, type: Polity, ...era: Era[]) {
        this.name = name;
        this.type = type;
        this.eras = era;
    }

    get localizedName() {
        return i18next.t(makeKey('GovernmentType.name.', Polity[this.type]));
    }
}

class _Governments {
    options: Government[] = [
        new Government("Andorian",Polity.Andorian, Era.Enterprise),
        new Government("Bajoran", Polity.Bajoran, Era.NextGeneration, Era.PicardProdigy),
        new Government("Cardassian", Polity.Cardassian, Era.NextGeneration, Era.PicardProdigy),
        new Government("Dominion", Polity.Dominion, Era.NextGeneration, Era.PicardProdigy),
        new Government("Federation", Polity.Federation, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32),
        new Government("Klingon",Polity.Klingon, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32),
        new Government("Romulan", Polity.Romulan, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy),
        new Government("Tellarite", Polity.Tellarite, Era.Enterprise),
        new Government("Vulcan", Polity.Vulcan, Era.Enterprise),

        new Government("Other", Polity.Other, Era.Enterprise, Era.OriginalSeries, Era.NextGeneration, Era.PicardProdigy, Era.Discovery32)
    ];

    selectOptions(era: Era) {
        return this.options.filter(o => o.eras.indexOf(era) >= 0);
    }

    findOption(type: Polity) {
        let temp = this.options.filter(o => o.type === type);
        return temp ? temp[0] : null;
    }

    findTypeByName(name: string) {
        let results = this.options.filter(o => Polity[o.type] === name);
        return results.length === 0 ? undefined : results[0].type;
    }
}


const Governments = new _Governments();

export default Governments;
