import i18next from "i18next";
import { Species } from "./speciesEnum";
import { makeKey } from "../common/translationKey";

export class SpeciesAbility {
    private readonly species: Species;

    constructor(species: Species) {
        this.species = species;
    }

    get name() {
        let key = makeKey("SpeciesAbility.", Species[this.species]);
        return i18next.t(key);
    }

    get description() {
        let key = makeKey("SpeciesAbility.", Species[this.species], ".description");
        return i18next.t(key);
    }
}

export class SpeciesAbilityList {

    private static _instance: SpeciesAbilityList;

    private items: { [id: number] : SpeciesAbility} = {
        [Species.Aenar]: new SpeciesAbility(Species.Aenar),
        [Species.Andorian]: new SpeciesAbility(Species.Andorian),
        [Species.Bajoran]: new SpeciesAbility(Species.Bajoran),
        [Species.Betazoid]: new SpeciesAbility(Species.Betazoid),
        [Species.Denobulan]: new SpeciesAbility(Species.Denobulan),
        [Species.Ferengi]: new SpeciesAbility(Species.Ferengi),
        [Species.Human]: new SpeciesAbility(Species.Human),
    }

    static get instance() {
        if (SpeciesAbilityList._instance == null) {
            SpeciesAbilityList._instance = new SpeciesAbilityList();
        }
        return SpeciesAbilityList._instance;
    }

    getBySpecies(species: Species) {
        return this.items[species];
    }
}