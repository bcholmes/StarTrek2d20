import i18next from "i18next";
import { makeKey } from "../../common/translationKey";

export enum SafetySectionType {
    Violence,
    GameplayMechanics,
    Hatred,
    Helplessness,
    WarCrimes
}

export class SafetySection {
    type: SafetySectionType;
    categories: string[];

    constructor(type: SafetySectionType, ...categories: string[]) {
        this.type = type;
        this.categories = categories ?? [];
    }

    get localizedName() {
        return i18next.t(makeKey("SafetySectionType.", SafetySectionType[this.type]));
    }

    get localizedCategories() {
        return this.categories.map(c => {
            let key = makeKey("SafetySection.category.", c);
            let result = i18next.t(key);
            return result === key ? c : result;
        });
    }
}

export class SafetySections {

    private static _instance: SafetySections;

    sections = [
        new SafetySection(SafetySectionType.Violence,
            "dismemberment", "gore", "massDestructionGenocide", "harmToAnimals",
            "harmToChildren", "hateCrimes"),
        new SafetySection(SafetySectionType.GameplayMechanics, "traitorMechanicsPvP"),
        new SafetySection(SafetySectionType.Hatred, "speciesHate", "homophobia", "racism", "religiousIntolerance", "sexism", "hatefulLanguage"),
        new SafetySection(SafetySectionType.Helplessness, "entrapment", "grief", "imprisonmentRestraint", "noPersonalAgency", "mentalAbuse", "stranded"),
        new SafetySection(SafetySectionType.WarCrimes, "biologicalWeapons", "desecrationOfBodies", "execution", "forcedScientificExperiments",
            "murderOfNonCombatants", "torture")
    ]

    static get instance() {
        if (SafetySections._instance == null) {
            SafetySections._instance = new SafetySections();
        }
        return SafetySections._instance;
    }
}