import i18n from "i18next";
import { makeKey } from "../common/translationKey";

export enum Era {
    Enterprise,
    OriginalSeries,
    NextGeneration,
    PicardProdigy,
    Discovery32
}

export class EraModel {
    id: Era;
    private name: string;

    constructor(id: Era, name: string) {
        this.id = id;
        this.name = name;
    }

    get localizedName() {
        return i18n.t(makeKey('Era.name.', Era[this.id]));
    }
}

export const eraDefaultYear = (era: Era) => {
    switch (era) {
        case Era.Enterprise:
            return 2155;
        case Era.OriginalSeries:
            return 2269;
        case Era.NextGeneration:
            return 2371;
        case Era.PicardProdigy:
            return 2400;
        case Era.Discovery32:
            return 3190;
    }
}

class Eras {
    private _eras: { [id: number]: EraModel } = {
        [Era.Enterprise]: new EraModel(Era.Enterprise, "Enterprise (mid-22nd century)"),
        [Era.OriginalSeries]: new EraModel(Era.OriginalSeries, "Original Series (mid-23rd century)"),
        [Era.NextGeneration]: new EraModel(Era.NextGeneration, "Next Generation (mid-24th century)"),
        [Era.PicardProdigy]: new EraModel(Era.PicardProdigy, "Picard/Prodigy (late 24th, early 25th century)"),
        [Era.Discovery32]: new EraModel(Era.Discovery32, "Discovery (32nd century)")
    };

    getBasicEras() {
        return [ this._eras[Era.Enterprise], this._eras[Era.OriginalSeries], this._eras[Era.NextGeneration]];
    }

    getEras() {
        let eras: EraModel[] = [];
        for (let era in this._eras) {
            let er = this._eras[era];
            eras.push(er);
        }

        return eras;
    }

    getEra(era: Era) {
        return this._eras[era];
    }
    getEraByName(name: string): Era|null {
        let results = Object.keys(this._eras).map(e => this._eras[e].id).filter(e => Era[e] === name);
        if (results.length === 1) {
            return results[0];
        } else {
            return null;
        }
    }
}

export const ErasHelper = new Eras();