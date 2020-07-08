export enum Era {
    Enterprise,
    OriginalSeries,
    NextGeneration
}

class EraModel {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

class EraViewModel extends EraModel {
    id: Era;

    constructor(id: Era, base: EraModel) {
        super(base.name);
        this.id = id;
    }
}

class Eras {
    private _eras: { [id: number]: EraModel } = {
        [Era.Enterprise]: new EraModel("Enterprise (mid-22nd century)"),
        [Era.OriginalSeries]: new EraModel("Original Series (mid-23rd century)"),
        [Era.NextGeneration]: new EraModel("Next Generation (mid-24th century)")
    };

    getEras() {
        var eras: EraViewModel[] = [];
        var n = 0;
        for (var era in this._eras) {
            var er = this._eras[era];
            eras.push(new EraViewModel(n, er));
            n++;
        }

        return eras;
    }
}

export const ErasHelper = new Eras();