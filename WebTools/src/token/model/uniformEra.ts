import i18next from "i18next";
import { makeKey } from "../../common/translationKey";

export enum UniformEra {
    Cardassian,
    Civilian,
    DominionWar,
    Enterprise,
    JemHadar,
    Klingon,
    LowerDecks,
    MonsterMaroon,
    NextGeneration,
    OriginalSeries,
    OriginalSeriesKlingon,
    Romulan,
    Suliban,
    VoyagerDS9,
    Bynar,
    Ferengi,
    StrangeNewWorlds,
}

export class UniformEraModel {
    id: UniformEra;
    name: string;

    constructor(id: UniformEra, name: string) {
        this.id = id;
        this.name = name;
    }

    get localizedName() {
        let key = makeKey('UniformEra.', UniformEra[this.id]);
        let result = i18next.t(makeKey('UniformEra.', UniformEra[this.id]));
        return result === key ? this.name : result;
    }
}

export class UniformEraHelper {

    private static _instance: UniformEraHelper;

    types = [
        new UniformEraModel(UniformEra.Bynar, "Bynar"),
        new UniformEraModel(UniformEra.Cardassian, "Cardassian"),
        new UniformEraModel(UniformEra.Civilian, "Civilian"),
        new UniformEraModel(UniformEra.Enterprise, "Enterprise"),
        new UniformEraModel(UniformEra.Ferengi, "Ferengi"),
        new UniformEraModel(UniformEra.Klingon, "Klingon Armour"),
        new UniformEraModel(UniformEra.DominionWar, "Dominion War"),
        new UniformEraModel(UniformEra.LowerDecks, "Lower Decks"),
        new UniformEraModel(UniformEra.JemHadar, "Jem'Hadar"),
        new UniformEraModel(UniformEra.NextGeneration, "The Next Generation"),
        new UniformEraModel(UniformEra.OriginalSeries, "Original Series"),
        new UniformEraModel(UniformEra.OriginalSeriesKlingon, "Klingon (Original Series)"),
        new UniformEraModel(UniformEra.Romulan, "Romulan"),
//        new UniformEraModel(UniformEra.StrangeNewWorlds, "Strange New Worlds"),
        new UniformEraModel(UniformEra.Suliban, "Suliban"),
        new UniformEraModel(UniformEra.VoyagerDS9, "Voyager/DS9"),
        new UniformEraModel(UniformEra.MonsterMaroon, "The Wrath of Khan and Later Movies"),
    ]

    static get instance() {
        if (UniformEraHelper._instance == null) {
            UniformEraHelper._instance = new UniformEraHelper();
        }
        return UniformEraHelper._instance;
    }
}