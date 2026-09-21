import i18n from 'i18next';
import { makeKey } from '../common/translationKey';

export enum Source {
  Core,
  Core2ndEdition,
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
  FederationKlingonWar,
  GmToolkit2e,
  TechnicalManual,
  ExplorationGuide,
  Century23,
  SpeciesSourcebook,
  AlliesAndAdversaries,
  Century24,

  ContinuingMissions,

  None,
}

export enum SourceType {
  CoreBook,
  DivisionBook,
  QuadrantBook,
  CrewBook,
  CampaignBook,
  Expansion,
  Expansion2e,
  EraBook,
  Misc,
  Unofficial,
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
  version: 1 | 2;

  constructor(
    id: Source,
    type: SourceType,
    name: string,
    version: 1 | 2 = 1,
    available: boolean = true,
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.available = available;
    this.version = version;
  }

  get localizedName() {
    const key = makeKey('Source.book.', Source[this.id]);
    const result = i18n.t(key);
    return result === key ? this.name : result;
  }
}

class Sources {
  private types: SourceTypeModel[] = [
    new SourceTypeModel(SourceType.CoreBook, 'Core Rulebooks'),
    new SourceTypeModel(SourceType.Expansion2e, 'Expansion Books for 2E'),
    new SourceTypeModel(SourceType.EraBook, 'Era Books'),
    new SourceTypeModel(SourceType.Expansion, 'Expansion Books'),
    new SourceTypeModel(SourceType.CrewBook, 'Crew Books'),
    new SourceTypeModel(SourceType.QuadrantBook, 'Quadrant Books'),
    new SourceTypeModel(SourceType.DivisionBook, 'Division Books'),
    new SourceTypeModel(SourceType.CampaignBook, 'Campaign Books'),
    new SourceTypeModel(SourceType.Misc, 'Misc/Other Books'),
    new SourceTypeModel(SourceType.Unofficial, 'Unofficial Books'),
  ];

  private sources: { [id: number]: SourceViewModel } = {
    [Source.Core]: new SourceViewModel(
      Source.Core,
      SourceType.CoreBook,
      'Core',
    ),
    [Source.Core2ndEdition]: new SourceViewModel(
      Source.Core2ndEdition,
      SourceType.CoreBook,
      'Core (2nd Ed.)',
      2,
    ),
    [Source.AlphaQuadrant]: new SourceViewModel(
      Source.AlphaQuadrant,
      SourceType.QuadrantBook,
      'Alpha Quadrant',
    ),
    [Source.BetaQuadrant]: new SourceViewModel(
      Source.BetaQuadrant,
      SourceType.QuadrantBook,
      'Beta Quadrant',
    ),
    [Source.GammaQuadrant]: new SourceViewModel(
      Source.GammaQuadrant,
      SourceType.QuadrantBook,
      'Gamma Quadrant',
    ),
    [Source.DeltaQuadrant]: new SourceViewModel(
      Source.DeltaQuadrant,
      SourceType.QuadrantBook,
      'Delta Quadrant',
    ),
    [Source.CommandDivision]: new SourceViewModel(
      Source.CommandDivision,
      SourceType.DivisionBook,
      'Command Division',
    ),
    [Source.OperationsDivision]: new SourceViewModel(
      Source.OperationsDivision,
      SourceType.DivisionBook,
      'Operations Division',
    ),
    [Source.SciencesDivision]: new SourceViewModel(
      Source.SciencesDivision,
      SourceType.DivisionBook,
      'Sciences Division',
    ),
    [Source.TNG]: new SourceViewModel(Source.TNG, SourceType.CrewBook, 'TNG'),
    [Source.DS9]: new SourceViewModel(Source.DS9, SourceType.CrewBook, 'DS9'),
    [Source.Voyager]: new SourceViewModel(
      Source.Voyager,
      SourceType.CrewBook,
      'Voyager',
    ),
    [Source.TheseAreTheVoyages]: new SourceViewModel(
      Source.TheseAreTheVoyages,
      SourceType.Misc,
      'These are the Voy',
    ),
    [Source.TribblePlayerCharacter]: new SourceViewModel(
      Source.TribblePlayerCharacter,
      SourceType.Misc,
      'Tribble Player Char',
    ),
    [Source.KlingonCore]: new SourceViewModel(
      Source.KlingonCore,
      SourceType.CoreBook,
      'Klingon Core',
    ),
    [Source.ShackletonExpanse]: new SourceViewModel(
      Source.ShackletonExpanse,
      SourceType.CampaignBook,
      'Shackleton Expanse',
    ),
    [Source.IdwYearFive]: new SourceViewModel(
      Source.IdwYearFive,
      SourceType.Misc,
      'IDW Year Five',
    ),
    [Source.PlayersGuide]: new SourceViewModel(
      Source.PlayersGuide,
      SourceType.Expansion,
      "Player's Guide",
    ),
    [Source.TricorderSet]: new SourceViewModel(
      Source.TricorderSet,
      SourceType.CoreBook,
      'Tricorder Set',
    ),
    [Source.DiscoveryS1S2]: new SourceViewModel(
      Source.DiscoveryS1S2,
      SourceType.CrewBook,
      'Discovery S1/S2',
    ),
    [Source.PicardS1]: new SourceViewModel(
      Source.PicardS1,
      SourceType.CrewBook,
      'Picard S1',
    ),
    [Source.DiscoveryCampaign]: new SourceViewModel(
      Source.DiscoveryCampaign,
      SourceType.CampaignBook,
      'Discovery Campaign',
    ),
    [Source.UtopiaPlanitia]: new SourceViewModel(
      Source.UtopiaPlanitia,
      SourceType.Expansion,
      'Utopia Planitia',
    ),
    [Source.LowerDecksCampaign]: new SourceViewModel(
      Source.LowerDecksCampaign,
      SourceType.CampaignBook,
      'Lower Decks Campaign',
    ),
    [Source.CaptainsLog]: new SourceViewModel(
      Source.CaptainsLog,
      SourceType.CoreBook,
      "Captain's Log",
    ),
    [Source.ContinuingMissions]: new SourceViewModel(
      Source.ContinuingMissions,
      SourceType.Unofficial,
      'Continuing Mission',
    ),
    [Source.AnimatedSeries]: new SourceViewModel(
      Source.AnimatedSeries,
      SourceType.Expansion,
      'Animated Series',
    ),
    [Source.FederationKlingonWar]: new SourceViewModel(
      Source.FederationKlingonWar,
      SourceType.Expansion,
      'Federation-Klingon War',
    ),
    [Source.GmToolkit2e]: new SourceViewModel(
      Source.GmToolkit2e,
      SourceType.Expansion2e,
      'GM Toolkit 2e',
      2,
    ),
    [Source.TechnicalManual]: new SourceViewModel(
      Source.TechnicalManual,
      SourceType.Expansion2e,
      'Technical Manual',
      2,
    ),
    [Source.ExplorationGuide]: new SourceViewModel(
      Source.ExplorationGuide,
      SourceType.Expansion2e,
      'Exploration Guide',
      2,
    ),
    [Source.Century23]: new SourceViewModel(
      Source.Century23,
      SourceType.EraBook,
      '23rd Century Campaign',
      2,
      true,
    ),
    [Source.SpeciesSourcebook]: new SourceViewModel(
      Source.SpeciesSourcebook,
      SourceType.Expansion2e,
      'Species Sourcebook',
      2,
      true,
    ),
    [Source.AlliesAndAdversaries]: new SourceViewModel(
      Source.AlliesAndAdversaries,
      SourceType.Expansion2e,
      'Allies and Adversaries',
      2,
      true,
    ),
    [Source.Century24]: new SourceViewModel(
      Source.Century24,
      SourceType.EraBook,
      '24th Century Campaign',
      2,
      false,
    ),
  };

  getSources() {
    const sources: SourceViewModel[] = [];
    for (const source in this.sources) {
      const src = this.sources[source];
      sources.push(src);
    }
    return sources;
  }

  getSourcesByType(type: SourceType) {
    return this.getSources().filter((s) => s.type === type);
  }

  getTypes() {
    return this.types;
  }

  getSourceName(sources: Source[], alwaysShow: boolean = false) {
    let result = '';
    sources.forEach((s) => {
      if (s !== Source.None && (this.sources[s].available || alwaysShow)) {
        result =
          result === ''
            ? this.sources[s].localizedName
            : result + ', ' + this.sources[s].localizedName;
      }
    });
    return result;
  }
}

export const SourcesHelper = new Sources();
