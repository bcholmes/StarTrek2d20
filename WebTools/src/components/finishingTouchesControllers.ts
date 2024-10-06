import { Character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { Skill } from "../helpers/skills";
import { StepContext, modifyCharacterAttribute, modifyCharacterDiscipline } from "../state/characterActions";
import store from "../state/store";
import { IAttributeController } from "./attributeController";
import { IDisciplineController } from "./disciplineListComponent";

export class FinishingTouchesAttributeController implements IAttributeController {
    readonly character: Character;
    readonly count: number;

    constructor(character: Character, count: number = 2) {
        this.character = character;
        this.count = count;
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
    getDeltaValue(attribute: Attribute): number|undefined {
        return undefined;
    }
    canIncrease(attribute: Attribute): boolean {
        return this.getValue(attribute) < Character.maxAttribute(this.character) &&
            (this.getValue(attribute) < (Character.maxAttribute(this.character) - 1) || !this.character.hasMaxedAttribute())
            && (this.character.finishingStep?.attributes.length < this.count)
            && (this.character.finishingStep?.attributes.filter(a => a === attribute).length < (this.count - 1));
    }
    canDecrease(attribute: Attribute): boolean {
        return this.character.finishingStep?.attributes.indexOf(attribute) >= 0;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.FinishingTouches, true));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.FinishingTouches, false));
    }
    get instructions() {
        return []
    }
}

export class FinishingTouchesDisciplineController implements IDisciplineController {

    readonly character: Character;
    readonly count: number;

    constructor(character: Character, count: number = 2) {
        this.character = character;
        this.count = count;
    }

    isShown(discipline: Skill) {
        return true;
    }
    isEditable(discipline: Skill): boolean {
        return true;
    }
    getValue(discipline: Skill): number {
        return this.character.departments[discipline];
    }
    canIncrease(discipline: Skill): boolean {
        return this.getValue(discipline) < Character.maxDiscipline(this.character) &&
            (this.getValue(discipline) < (Character.maxDiscipline(this.character) - 1) || !this.character.hasMaxedSkill())
            && (this.character.finishingStep?.disciplines.length < this.count)
            && (this.character.finishingStep?.disciplines.filter(d => d === discipline).length < (this.count - 1));
    }
    canDecrease(discipline: Skill): boolean {
        return this.character.finishingStep?.disciplines.indexOf(discipline) >= 0;
    }
    onIncrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.FinishingTouches, true));
    }
    onDecrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.FinishingTouches, false));
    }
}


