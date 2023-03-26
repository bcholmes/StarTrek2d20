import i18n from "i18next";
import { makeKey } from "../common/translationKey";

export enum Era {
    Enterprise,
    OriginalSeries,
    NextGeneration
}

class EraModel {
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

class Eras {
    private _eras: { [id: number]: EraModel } = {
        [Era.Enterprise]: new EraModel(Era.Enterprise, "Enterprise (mid-22nd century)"),
        [Era.OriginalSeries]: new EraModel(Era.OriginalSeries, "Original Series (mid-23rd century)"),
        [Era.NextGeneration]: new EraModel(Era.NextGeneration, "Next Generation (mid-24th century)")
    };

    getEras() {
        let eras: EraModel[] = [];
        for (let era in this._eras) {
            let er = this._eras[era];
            eras.push(er);
        }

        return eras;
    }
}

export const ErasHelper = new Eras();