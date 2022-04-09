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
    TheseAreTheVoyages,
    TribblePlayerCharacter,
    KlingonCore,
    ShackletonExpanse,
    IdwYearFive,
    PlayersGuide,
    TricorderSet,
    DiscoveryS1,

    None
}

class SourceViewModel {
    id: Source;
    name: string;
    available: boolean;

    constructor(id: Source, name: string, available: boolean = true) {
        this.id = id;
        this.name = name;
        this.available = available;
    }
}

class Sources {
    private _sources: { [id: number]: SourceViewModel } = {
        [Source.Core]: new SourceViewModel(Source.Core, "Core"),
        [Source.AlphaQuadrant]: new SourceViewModel(Source.AlphaQuadrant, "Alpha Quadrant"),
        [Source.BetaQuadrant]: new SourceViewModel(Source.BetaQuadrant, "Beta Quadrant"),
        [Source.GammaQuadrant]: new SourceViewModel(Source.GammaQuadrant, "Gamma Quadrant"),
        [Source.DeltaQuadrant]: new SourceViewModel(Source.DeltaQuadrant, "Delta Quadrant"),
        [Source.CommandDivision]: new SourceViewModel(Source.CommandDivision, "Command Division"),
        [Source.OperationsDivision]: new SourceViewModel(Source.OperationsDivision, "Operations Division"),
        [Source.SciencesDivision]: new SourceViewModel(Source.SciencesDivision, "Sciences Division"),
        [Source.TNG]: new SourceViewModel(Source.TNG, "TNG"),
        [Source.DS9]: new SourceViewModel(Source.DS9, "DS9"),
        [Source.Voyager]: new SourceViewModel(Source.Voyager, "Voyager"),
        [Source.TheseAreTheVoyages]: new SourceViewModel(Source.TheseAreTheVoyages, "These are the Voy"),
        [Source.TribblePlayerCharacter]: new SourceViewModel(Source.TribblePlayerCharacter, "Tribble Player Char"),
        [Source.KlingonCore]: new SourceViewModel(Source.KlingonCore, "Klingon Core"),
        [Source.ShackletonExpanse]: new SourceViewModel(Source.ShackletonExpanse, "Shackleton Expanse"),
        [Source.IdwYearFive]: new SourceViewModel(Source.IdwYearFive, "IDW Year Five"),
        [Source.PlayersGuide]: new SourceViewModel(Source.PlayersGuide, "Player's Guide"),
        [Source.TricorderSet]: new SourceViewModel(Source.TricorderSet, "Tricorder Set"),
        [Source.DiscoveryS1]: new SourceViewModel(Source.DiscoveryS1, "Discovery S1", false),
    };

    getSources() {
        let sources: SourceViewModel[] = [];
        for (let source in this._sources) {
            let src = this._sources[source];
            sources.push(src);
        }
        return sources;
    }

    getSourceName(sources: Source[]) {
        let result = "";
        sources.forEach((s) => { 
            if (s !== Source.None) {
                result = (result === "") ? this._sources[s].name : (result + ", " + this._sources[s].name);
            } 
        });
        return result;
    }
}

export const SourcesHelper = new Sources();
