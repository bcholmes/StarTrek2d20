import { Character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { SpeciesHelper, SpeciesModel } from "../helpers/species";
import { Species } from "../helpers/speciesEnum";
import { StepContext, modifyCharacterAttribute } from "../state/characterActions";
import store from "../state/store";
import { IAttributeController } from "./attributeController";

export class SpeciesAttributeController implements IAttributeController {

    readonly character: Character;
    readonly species: SpeciesModel;

    constructor(character: Character, species: SpeciesModel) {
        this.character = character;
        this.species = species;
    }

    isShown(attribute: Attribute) {
        return this.species.attributes.indexOf(attribute) >= 0;
    }
    isEditable(attribute: Attribute): boolean {
        return this.species.attributes.length > 3;
    }
    getValue(attribute: Attribute): number {
        return this.character.attributes[attribute].value;
    }
    canIncrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.speciesStep?.attributes?.length < 3 && this.character.speciesStep?.attributes?.indexOf(attribute) < 0;
    }
    canDecrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.speciesStep?.attributes?.indexOf(attribute) >= 0;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Species));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Species, false));
    }
    get instructions() {
        return []
    }

    public static create(character: Character, species: SpeciesModel) {
        if (species.id === Species.Ktarian) {
            return new KtarianSpeciesAttributeController(character, species);
        } else if (species.id === Species.Kobali) {
            return new KobaliSpeciesAttributeController(character, species);
        } else {
            return new SpeciesAttributeController(character, species);
        }
    }
}

export class CustomSpeciesAttributeController implements IAttributeController {
    readonly character: Character;

    constructor(character: Character) {
        this.character = character;
    }

    isShown(attribute: Attribute) {
        return true;
    }
    isEditable(attribute: Attribute): boolean {
        return true;
    }
    getValue(attribute: Attribute): number {
        return this.character.attributes[attribute].value;
    }
    canIncrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.speciesStep?.attributes?.length < 3 && this.character.speciesStep?.attributes?.indexOf(attribute) < 0;
    }
    canDecrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.speciesStep?.attributes?.indexOf(attribute) >= 0;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Species));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Species, false));
    }
    get instructions() {
        return []
    }
}

class KtarianSpeciesAttributeController extends SpeciesAttributeController {

    isShown(attribute: Attribute) {
        return super.isShown(attribute)
            || this.species.secondaryAttributes.indexOf(attribute) >= 0;
    }
    isEditable(attribute: Attribute) {
        return this.species.secondaryAttributes.indexOf(attribute) >= 0;
    }
}

class KobaliSpeciesAttributeController extends SpeciesAttributeController {

    originalSpecies: SpeciesModel;

    constructor(character: Character, species: SpeciesModel) {
        super(character, species);
        this.originalSpecies = SpeciesHelper.getSpeciesByType(character.speciesStep.originalSpecies);
    }

    isShown(attribute: Attribute) {
        return this.species.secondaryAttributes.indexOf(attribute) >= 0
            || this.originalSpecies.attributes.indexOf(attribute) >= 0
            || this.originalSpecies.secondaryAttributes.indexOf(attribute) >= 0;
    }

    isEditable(attribute: Attribute) {
        return true;
    }

    countOriginalSpeciesAttributes() {
        let result = 0;
        this.originalSpecies.attributes.forEach(a => result += (this.character.speciesStep.attributes.indexOf(a) >= 0) ? 1 : 0);
        return result;
    }

    canIncrease(attribute: Attribute): boolean {
        if (this.character.speciesStep.attributes.length === 3) {
            return false;
        } else {
            return this.character.speciesStep.attributes.indexOf(attribute) < 0;
        }
    }

    canDecrease(attribute: Attribute) {
        if (this.originalSpecies.attributes.indexOf(attribute) >= 0 && this.countOriginalSpeciesAttributes() >= 3) {
            return this.isEditable(attribute) && this.character.speciesStep.attributes.indexOf(attribute) >= 0;
        } else if (this.originalSpecies.attributes.indexOf(attribute) >= 0) {
            return false;
        } else {
            return super.canDecrease(attribute);
        }
    }

    get instructions() {
        return ["By default, Kobali characters have the attribute increases of the original species, but can substitute one of those attributes for either Reason or Fitness."];
    }
}
