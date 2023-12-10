import { Character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { SpeciesModel } from "../helpers/species";
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
        } else {
            return new SpeciesAttributeController(character, species);
        }
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