import { CareerEventStep, Character } from "../common/character";
import { Attribute } from "../helpers/attributes";
import { Skill } from "../helpers/skills";
import { StepContext, modifyCharacterAttribute, modifyCharacterDiscipline } from "../state/characterActions";
import store from "../state/store";
import { IAttributeController } from "./attributeController";
import { IDisciplineController } from "./disciplineListComponent";

export class CareerEventDisciplineController implements IDisciplineController {

    readonly character: Character;
    readonly careerEventStep: CareerEventStep;
    readonly context: StepContext;
    readonly disciplines: Skill[];

    constructor(character: Character, careerEventStep: CareerEventStep, context: StepContext, disciplines: Skill[]) {
        this.character = character;
        this.disciplines = disciplines;
        this.context = context;
        this.careerEventStep = careerEventStep;
    }

    isShown(discipline: Skill) {
        return this.disciplines.indexOf(discipline) >= 0;
    }
    isEditable(discipline: Skill): boolean {
        return true;
    }
    getValue(discipline: Skill): number {
        return this.character.skills[discipline].expertise;
    }
    canIncrease(discipline: Skill): boolean {
        return this.getValue(discipline) < Character.maxDiscipline(this.character) &&
            (this.getValue(discipline) < (Character.maxDiscipline(this.character) - 1) || !this.character.hasMaxedSkill())
            && this.careerEventStep.discipline == null;
    }
    canDecrease(discipline: Skill): boolean {
        return this.careerEventStep?.discipline === discipline;
    }
    onIncrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, this.context, true));
    }
    onDecrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, this.context, false));
    }
}

export class CareerEventAttributeController implements IAttributeController {

    readonly character: Character;
    readonly careerEventStep: CareerEventStep;
    readonly context: StepContext;
    readonly attributes: Attribute[];

    constructor(character: Character, careerEventStep: CareerEventStep, context: StepContext, attributes: Attribute[]) {
        this.character = character;
        this.attributes = attributes;
        this.context = context;
        this.careerEventStep = careerEventStep;
    }

    isShown(attribute: Attribute) {
        return this.attributes.indexOf(attribute) >= 0;
    }
    isEditable(attribute: Attribute): boolean {
        return true;
    }
    getValue(attribute: Attribute): number {
        return this.character.attributes[attribute].value;
    }
    canIncrease(attribute: Attribute): boolean {
        return this.getValue(attribute) < Character.maxAttribute(this.character) &&
            (this.getValue(attribute) < (Character.maxAttribute(this.character) - 1) || !this.character.hasMaxedAttribute())
            && this.careerEventStep.attribute == null;
    }
    canDecrease(attribute: Attribute): boolean {
        return this.careerEventStep?.attribute === attribute;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, this.context, true));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, this.context, false));
    }
    get instructions() {
        return []
    }
}

