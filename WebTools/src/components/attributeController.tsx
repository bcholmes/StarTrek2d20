import { Character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { SpeciesHelper, SpeciesModel } from "../helpers/species";
import { Species } from "../helpers/speciesEnum";

export abstract class AttributeController {

    character: Character;
    species: SpeciesModel;
    selections: Attribute[] = [];
    onChanged: (done: boolean) => void;

    constructor(character: Character, onChanged: (done: boolean) => void) {
        this.character = character;
        this.species = SpeciesHelper.getSpeciesByType(character.species);
        this.onChanged = onChanged;
    }

    isShown(attribute: Attribute) {
        return false;
    }
    isEditable(attribute: Attribute) {
        return false;
    }
    getValue(attribute: Attribute) {
        return this.character.attributes[attribute].value;
    }
    canIncrease(attribute: Attribute) {
        if (!this.isEditable(attribute)) {
            return false;
        } else if (this.selections.indexOf(attribute) >= 0) {
            return false;
        } else if (this.selections.length === 3) {
            return false;
        } else if (this.character.hasMaxedAttribute() && this.getValue(attribute) === Character.ABSOLUTE_MAX_ATTRIBUTE - 1) {
            return false;
        } else if (this.getValue(attribute) === Character.maxAttribute(this.character)) {
            return false;
        } else {
            return true;
        }
    }
    canDecrease(attribute: Attribute) {
        return this.isEditable(attribute) && this.selections.indexOf(attribute) >= 0;
    }
    onIncrease(attribute: Attribute) {
        if (this.selections.indexOf(attribute) < 0) {
            this.selections.push(attribute);
            this.character.attributes[attribute].value += 1;
            this.onChanged(this.selections.length === 3);
        }
    }
    onDecrease(attribute: Attribute) {
        if (this.selections.indexOf(attribute) >= 0) {
            this.selections.splice(this.selections.indexOf(attribute), 1);
            this.character.attributes[attribute].value -= 1;
            this.onChanged(this.selections.length === 3);
        }
    }

    get instructions() {
        return [];
    }
}

export class StandardSpeciesAttributeController extends AttributeController {

    constructor(character: Character, onChanged: (done: boolean) => void) {
        super(character, onChanged);
        this.species.attributes.forEach(a => this.selections.push(a));
    }

    isShown(attribute: Attribute) {
        return this.species.attributes.indexOf(attribute) >= 0;
    }
    canIncrease(attribute: Attribute): boolean {
        return false;
    }
    canDecrease(attribute: Attribute): boolean {
        return false;
    }
}

export class HumanSpeciesAttributeController extends AttributeController {

    isShown(attribute: Attribute) {
        return true;
    }
    isEditable(attribute: Attribute) {
        return true;
    }
}

export class KtarianSpeciesAttributeController extends AttributeController {

    constructor(character: Character, onChanged: (done: boolean) => void) {
        super(character, onChanged);
        this.species.attributes.forEach(a => this.selections.push(a));
    }

    isShown(attribute: Attribute) {
        return this.species.attributes.indexOf(attribute) >= 0
            || this.species.secondaryAttributes.indexOf(attribute) >= 0;
    }
    isEditable(attribute: Attribute) {
        return this.species.secondaryAttributes.indexOf(attribute) >= 0;
    }
}

export class KobaliSpeciesAttributeController extends AttributeController {

    originalSpecies: SpeciesModel;

    constructor(character: Character, onChanged: (done: boolean) => void) {
        super(character, onChanged);
        this.originalSpecies = SpeciesHelper.getSpeciesByType(character.originalSpecies);
        if (this.originalSpecies.attributes.length <= 3) {
            this.originalSpecies.attributes.forEach(a => this.selections.push(a));
        }
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
        this.originalSpecies.attributes.forEach(a => result += (this.selections.indexOf(a) >= 0) ? 1 : 0);
        return result;
    }

    canDecrease(attribute: Attribute) {
        if (this.originalSpecies.attributes.indexOf(attribute) >= 0 && this.countOriginalSpeciesAttributes() >= 3) {
            return this.isEditable(attribute) && this.selections.indexOf(attribute) >= 0;
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

class AttributeControllerFactoryImpl {
    create(character: Character, onChanged: (done: boolean) => void = (done) => {}) {
        if (character.species === Species.Human) {
            return new HumanSpeciesAttributeController(character, onChanged);
        } else if (character.species === Species.Ktarian) {
            return new KtarianSpeciesAttributeController(character, onChanged);
        } else if (character.species === Species.Kobali) {
            return new KobaliSpeciesAttributeController(character, onChanged);
        } else {
            return new StandardSpeciesAttributeController(character, onChanged);
        }
    }
}

export const AttributeControllerFactory = new AttributeControllerFactoryImpl();
