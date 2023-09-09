import i18n from 'i18next';
import { makeKey } from '../common/translationKey';

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
    DiscoveryS1S2,
    DiscoveryCampaign,
    PicardS1,
    UtopiaPlanitia,
    LowerDecksCampaign,
    CaptainsLog,
    AnimatedSeries,


    ContinuingMissions,

    None
}

export enum SourceType {
    CoreBook,
    DivisionBook,
    QuadrantBook,
    CrewBook,
    CampaignBook,
    Expansion,
    Misc,
    Unofficial
}

class SourceTypeModel {
    type: SourceType;
    name: string;

    constructor(type: SourceType, name: string) {
        this.type = type;
        this.name = name;
    }

    get localizedName() {
        return i18n.t(makeKey('Source.type.', SourceType[this.type]));
    }
}

class SourceViewModel {
    id: Source;
    type: SourceType;
    name: string;
    available: boolean;

    constructor(id: Source, type: SourceType, name: string, available: boolean = true) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.available = available;
    }

    get localizedName() {
        let key = makeKey('Source.book.', Source[this.id]);
        let result = i18n.t(key);
        return result === key ? this.name : result;
    }

}

class Sources {
    private types: SourceTypeModel[] = [
        new SourceTypeModel(SourceType.CoreBook, "Core Rulebooks"),
        new SourceTypeModel(SourceType.CrewBook, "Crew Books"),
        new SourceTypeModel(SourceType.QuadrantBook, "Quadrant Books"),
        new SourceTypeModel(SourceType.DivisionBook, "Division Books"),
        new SourceTypeModel(SourceType.CampaignBook, "Campaign Books"),
        new SourceTypeModel(SourceType.Expansion, "Major Expansion Books"),
        new SourceTypeModel(SourceType.Misc, "Misc/Other Books"),
        new SourceTypeModel(SourceType.Unofficial, "Unofficial Books"),
    ];

    private _sources: { [id: number]: SourceViewModel } = {
        [Source.Core]: new SourceViewModel(Source.Core, SourceType.CoreBook, "Core"),
        [Source.AlphaQuadrant]: new SourceViewModel(Source.AlphaQuadrant, SourceType.QuadrantBook, "Alpha Quadrant"),
        [Source.BetaQuadrant]: new SourceViewModel(Source.BetaQuadrant, SourceType.QuadrantBook, "Beta Quadrant"),
        [Source.GammaQuadrant]: new SourceViewModel(Source.GammaQuadrant, SourceType.QuadrantBook, "Gamma Quadrant"),
        [Source.DeltaQuadrant]: new SourceViewModel(Source.DeltaQuadrant, SourceType.QuadrantBook, "Delta Quadrant"),
        [Source.CommandDivision]: new SourceViewModel(Source.CommandDivision, SourceType.DivisionBook, "Command Division"),
        [Source.OperationsDivision]: new SourceViewModel(Source.OperationsDivision, SourceType.DivisionBook, "Operations Division"),
        [Source.SciencesDivision]: new SourceViewModel(Source.SciencesDivision, SourceType.DivisionBook, "Sciences Division"),
        [Source.TNG]: new SourceViewModel(Source.TNG, SourceType.CrewBook, "TNG"),
        [Source.DS9]: new SourceViewModel(Source.DS9, SourceType.CrewBook, "DS9"),
        [Source.Voyager]: new SourceViewModel(Source.Voyager, SourceType.CrewBook, "Voyager"),
        [Source.TheseAreTheVoyages]: new SourceViewModel(Source.TheseAreTheVoyages, SourceType.Misc, "These are the Voy"),
        [Source.TribblePlayerCharacter]: new SourceViewModel(Source.TribblePlayerCharacter, SourceType.Misc, "Tribble Player Char"),
        [Source.KlingonCore]: new SourceViewModel(Source.KlingonCore, SourceType.CoreBook, "Klingon Core"),
        [Source.ShackletonExpanse]: new SourceViewModel(Source.ShackletonExpanse, SourceType.CampaignBook, "Shackleton Expanse"),
        [Source.IdwYearFive]: new SourceViewModel(Source.IdwYearFive, SourceType.Misc, "IDW Year Five"),
        [Source.PlayersGuide]: new SourceViewModel(Source.PlayersGuide, SourceType.Expansion, "Player's Guide"),
        [Source.TricorderSet]: new SourceViewModel(Source.TricorderSet, SourceType.CoreBook, "Tricorder Set"),
        [Source.DiscoveryS1S2]: new SourceViewModel(Source.DiscoveryS1S2, SourceType.CrewBook, "Discovery S1/S2"),
        [Source.PicardS1]: new SourceViewModel(Source.PicardS1, SourceType.CrewBook, "Picard S1"),
        [Source.DiscoveryCampaign]: new SourceViewModel(Source.DiscoveryCampaign, SourceType.CampaignBook, "Discovery Campaign"),
        [Source.UtopiaPlanitia]: new SourceViewModel(Source.UtopiaPlanitia, SourceType.Expansion, "Utopia Planitia"),
        [Source.LowerDecksCampaign]: new SourceViewModel(Source.LowerDecksCampaign, SourceType.CampaignBook, "Lower Decks Campaign"),
        [Source.CaptainsLog]: new SourceViewModel(Source.CaptainsLog, SourceType.CoreBook, "Captain's Log", false),
        [Source.ContinuingMissions]: new SourceViewModel(Source.ContinuingMissions, SourceType.Unofficial, "Continuing Missions", false),
        [Source.AnimatedSeries]: new SourceViewModel(Source.AnimatedSeries, SourceType.Expansion, "Animated Series", false),
    };

    getSources() {
        let sources: SourceViewModel[] = [];
        for (let source in this._sources) {
            let src = this._sources[source];
            sources.push(src);
        }
        return sources;
    }

    getSourcesByType(type: SourceType) {
        return this.getSources().filter(s => s.type === type);
    }


    getTypes() {
        return this.types;
    }

    getSourceName(sources: Source[], alwaysShow: boolean = false) {
        let result = "";
        sources.forEach((s) => {
            if (s !== Source.None && (this._sources[s].available || alwaysShow)) {
                result = (result === "") ? this._sources[s].localizedName : (result + ", " + this._sources[s].localizedName);
            }
        });
        return result;
    }
}

export const SourcesHelper = new Sources();
