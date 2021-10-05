export enum Source {
    Core,
    AlphaQuadrant,
    BetaQuadrant,
    GammaQuadrant,
    DeltaQuadrant,
    CommandDivision,
    OperationsDivision,
    SciencesDivision,
    TNG,
    DS9,
    Voyager,
    KlingonCore,
    ShackletonExpanse,
}

class SourceViewModel {
    id: Source;
    name: string;

    constructor(id: Source, name: string) {
        this.id = id;
        this.name = name;
    }
}

class Sources {
    private _sources: { [id: number]: string } = {
        [Source.Core]: "Core",
        [Source.AlphaQuadrant]: "Alpha Quadrant",
        [Source.BetaQuadrant]: "Beta Quadrant",
        [Source.GammaQuadrant]: "Gamma Quadrant",
        [Source.DeltaQuadrant]: "Delta Quadrant",
        [Source.CommandDivision]: "Command Division",
        [Source.OperationsDivision]: "Operations Division",
        [Source.SciencesDivision]: "Sciences Division",
        [Source.TNG]: "TNG",
        [Source.DS9]: "DS9",
        [Source.Voyager]: "Voyager",
        [Source.KlingonCore]: "Klingon Core",
        [Source.ShackletonExpanse]: "Shackleton Expanse",

    };

    getSources() {
        var sources: SourceViewModel[] = [];
        var n = 0;
        for (var source in this._sources) {
            var src = this._sources[source];
            sources.push(new SourceViewModel(n, src));
            n++;
        }
        return sources;
    }

    getSourceName(sources: Source[]) {
        var result = "";
        sources.forEach((s) => { result = (result == "") ? this._sources[s] : (result + ", " + this._sources[s]) })
        return result;
    }
}

export const SourcesHelper = new Sources();
