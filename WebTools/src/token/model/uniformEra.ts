import i18next from "i18next";
import { makeKey } from "../../common/translationKey";

export enum UniformEra {
    Enterprise, OriginalSeries, OriginalSeriesKlingon, Klingon, MonsterMaroon, VoyagerDS9, DominionWar, LowerDecks, Civilian
}

export class UniformEraModel {
    id: UniformEra;
    name: string;

    constructor(id: UniformEra, name: string) {
        this.id = id;
        this.name = name;
    }

    get localizedName() {
        return i18next.t(makeKey('UniformEra.', UniformEra[this.id]));
    }
}

export class UniformEraHelper {

    private static _instance: UniformEraHelper;

    types = [
        new UniformEraModel(UniformEra.Enterprise, "Enterprise"),
        new UniformEraModel(UniformEra.OriginalSeries, "Original Series"),
        new UniformEraModel(UniformEra.OriginalSeriesKlingon, "Klingon (Original Series)"),
        new UniformEraModel(UniformEra.MonsterMaroon, "The Wrath of Khan and Later Movies"),
        new UniformEraModel(UniformEra.Klingon, "Klingon Armour"),
        new UniformEraModel(UniformEra.VoyagerDS9, "Voyager/DS9"),
        new UniformEraModel(UniformEra.DominionWar, "Dominion War"),
        new UniformEraModel(UniformEra.LowerDecks, "Lower Decks"),
        new UniformEraModel(UniformEra.Civilian, "Civilian"),
    ]

    static get instance() {
        if (UniformEraHelper._instance == null) {
            UniformEraHelper._instance = new UniformEraHelper();
        }
        return UniformEraHelper._instance;
    }
}