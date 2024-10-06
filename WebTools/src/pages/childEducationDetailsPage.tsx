import * as React from 'react';
import { Button } from '../components/button';
import { Header } from '../components/header';
import ValueInput from '../components/valueInputWithRandomOption';
import { ICharacterPageProperties } from '../common/iCharacterPageProperties';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import InstructionText from '../components/instructionText';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import store from '../state/store';
import { StepContext, modifyCharacterAttribute, modifyCharacterDiscipline, setCharacterFocus, setCharacterValue } from '../state/characterActions';
import { ValueRandomTable } from '../solo/table/valueRandomTable';
import AttributeListComponent from '../components/attributeListComponent';
import { IAttributeController } from '../components/attributeController';
import { Character } from '../common/character';
import { Attribute } from '../helpers/attributes';
import { Dialog } from '../components/dialog';
import { Navigation } from '../common/navigator';
import { PageIdentity } from './pageIdentity';
import DisciplineListComponent, { IDisciplineController } from '../components/disciplineListComponent';
import { Skill } from '../helpers/skills';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';

class ChildDecrementAttributeController implements IAttributeController {

    readonly character: Character;
    readonly count: number;

    constructor(character: Character) {
        this.character = character;
        this.count = character.age.options.decreaseAttributes;
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
        return this.character.educationStep?.decrementAttributes?.indexOf(attribute) >= 0;
    }
    canDecrease(attribute: Attribute): boolean {
        return this.isEditable(attribute)
            && this.character.educationStep?.decrementAttributes?.length < this.count
            && this.character.educationStep?.decrementAttributes?.indexOf(attribute) < 0;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Education, true, true));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Education, false, true));
    }
    get instructions() {
        return []
    }
}

export class ChildIncrementAttributeController implements IAttributeController {

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
    getDeltaValue(attribute: Attribute): number|undefined {
        return undefined;
    }
    canIncrease(attribute: Attribute): boolean {
        return this.getValue(attribute) < Character.maxAttribute(this.character)
            && (this.getValue(attribute) < (Character.maxAttribute(this.character) - 1) || !this.character.hasMaxedAttribute())
            && this.isEditable(attribute) && this.character.educationStep?.attributes?.length < 3
            && this.character.educationStep.attributes.filter(a => a === attribute).length < 2;
    }
    canDecrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.educationStep?.attributes?.indexOf(attribute) >= 0;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Education));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Education, false));
    }
    get instructions() {
        return []
    }
}

class ChildDecrementDisciplineController implements IDisciplineController {

    readonly character: Character;
    readonly count: number;

    constructor(character: Character) {
        this.character = character;
        this.count = character.age.options.decreaseDisciplines;
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
        return this.character.educationStep?.decrementDisciplines?.indexOf(discipline) >= 0;
    }
    canDecrease(discipline: Skill): boolean {
        return this.isEditable(discipline)
            && this.character.educationStep?.decrementDisciplines?.length < this.count
            && this.character.educationStep?.decrementDisciplines?.indexOf(discipline) < 0;
    }
    onIncrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.Education, true, [], true));
    }
    onDecrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.Education, false, [], true));
    }
}

class ChildPrimaryDisciplineController implements IDisciplineController {

    readonly character: Character;

    constructor(character: Character) {
        this.character = character;
    }

    isShown(discipline: Skill) {
        return true;
    }
    isEditable(discipline: Skill)  {
        return true;
    }
    getValue(discipline: Skill) {
        return this.character.departments[discipline];
    }
    canIncrease(discipline: Skill) {
        return this.character.educationStep?.primaryDiscipline == null && (this.character.departments[discipline] < (Character.maxDiscipline(this.character) - 1));
    }
    canDecrease(discipline: Skill) {
        return this.character.educationStep?.primaryDiscipline === discipline;
    }
    onIncrease(discipline: Skill) {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.Education, true, [discipline]));
    }
    onDecrease(discipline: Skill) {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.Education, false, []));
    }
}

class ChildSecondaryDisciplineController implements IDisciplineController {

    readonly character: Character;

    constructor(character: Character) {
        this.character = character;
    }

    isShown(discipline: Skill) {
        return true;
    }
    isEditable(discipline: Skill)  {
        return true;
    }
    getValue(discipline: Skill) {
        return this.character.departments[discipline];
    }
    canIncrease(discipline: Skill) {
        if (this.getValue(discipline) === Character.maxDiscipline(this.character)) {
            return false;
        } else if (this.character.educationStep?.primaryDiscipline === discipline) {
            return false;
        } else if (this.getValue(discipline) === (Character.maxDiscipline(this.character) - 1) && this.character.hasMaxedSkill()) {
            return false;
        } else if (this.character.educationStep?.disciplines.length === 2) {
            return false;
        } else if (this.character.educationStep.disciplines.indexOf(discipline) >= 0) {
            return false;
        } else {
            return true;
        }
    }
    canDecrease(discipline: Skill) {
        return this.character.educationStep?.disciplines.indexOf(discipline) >= 0;
    }
    onIncrease(discipline: Skill) {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.Education, true));
    }
    onDecrease(discipline: Skill) {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.Education, false));
    }
}


const ChildEducationDetailsPage: React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();
    const decrementAttributeController = new ChildDecrementAttributeController(character);
    const incrementAttributeController = new ChildIncrementAttributeController(character);
    const decrementDisciplineController = new ChildDecrementDisciplineController(character);
    const primaryDisciplineController = new ChildPrimaryDisciplineController(character);
    const secondaryDisciplineController = new ChildSecondaryDisciplineController(character);

    const randomValue = () => {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        onValueChanged(value);
    }

    const onValueChanged = (value: string) => {
        store.dispatch(setCharacterValue(value, StepContext.Education));
    }

    const onNext = () => {
        if (character.educationStep.decrementAttributes?.length < decrementAttributeController.count) {
            Dialog.show("You must decrease " + (character.age.options.decreaseAttributes === 1 ? "one attribute" : (character.age.options.decreaseAttributes + " attributes")));
        } else if (character.educationStep.attributes?.length < 3) {
            Dialog.show("You must distribute all three attribute points.");
        } else if (character.educationStep?.decrementDisciplines?.length !== decrementDisciplineController.count) {
            Dialog.show("You must decrease " + (character.age.options.decreaseDisciplines === 1 ? "one discipline" : (character.age.options.decreaseDisciplines + " disciplines")));
        } else if (character.educationStep?.primaryDiscipline == null || character.educationStep?.disciplines?.length < 2) {
            Dialog.show("You must select one major and two minor disciplines.");
        } else if (character.age.options.numberOfFocuses === 1 && character.age.options.numberOfFocuses !== character.educationStep?.focuses?.filter(f => f).length) {
            Dialog.show("You must select a Focus");
        } else if (character.age.options.numberOfFocuses !== character.educationStep?.focuses?.filter(f => f).length) {
            Dialog.show("You must select " + character.age.options.numberOfFocuses + " Focuses.");
        } else {
            Navigation.navigateToPage(PageIdentity.ChildCareer);
        }
    }

    let focuses = character.age.options.numberOfFocuses === 1
        ? (<div className="col-lg-6 my-3">
            <Header level={2}>{t('Construct.other.focus')}</Header>
            <ReactMarkdown>{character.age.options.focusText}</ReactMarkdown>

            <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                value={character.educationStep?.focuses[0] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 0))} />
        </div>)
        : (<div className="col-lg-6 my-3">
            <Header level={2}>{t('Construct.other.focuses')}</Header>
            <ReactMarkdown>{character.age.options.focusText}</ReactMarkdown>

            <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                value={character.educationStep?.focuses[0] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 0))} />
            <InputFieldAndLabel id="focus2" labelName={t('Construct.other.focus2')}
                value={character.educationStep?.focuses[1] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 1))} />
        </div>);

    return (<div className="page container ms-0">
        <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.ChildEducationDetailsPage} />
        <Header>{character.age.name}</Header>
        <InstructionText text={character.age.description} />
        <div className="row">
            <div className="col-lg-6 my-3">
                <Header level={2}>{t('Construct.other.attributes')}</Header>
                <p className="my-2">
                    Decrease {decrementAttributeController.count === 1 ? " 1 attribute " : (" " + decrementAttributeController.count + " attributes ")}
                    to reflect the young age of the character:
                </p>
                <AttributeListComponent controller={decrementAttributeController} />

                <p className="mt-4 mb-2">Distribute 3 points among 2 or 3 attributes (either +2 in one and +1 in another, or +1 to three):</p>
                <AttributeListComponent controller={incrementAttributeController} />

            </div>
            <div className="col-lg-6 my-3">
                <Header level={2}>{t('Construct.other.disciplines')}</Header>
                <p className="my-2">
                    Decrease {decrementDisciplineController.count === 1 ? " 1 discipline " : (" " + decrementDisciplineController.count + " disciplines ")}
                    to reflect the young age of the character:
                </p>
                <DisciplineListComponent controller={decrementDisciplineController} />

                <p className="mb-2 mt-4">
                    Select 1 discipline to reflect the primary area of interest:
                </p>
                <DisciplineListComponent controller={primaryDisciplineController} />

                <p className="mb-2 mt-4">
                    Select 2 other discipline to reflect the other areas of interest:
                </p>
                <DisciplineListComponent controller={secondaryDisciplineController} />
            </div>
            {focuses}
            <div className="col-lg-6 my-3">
                <Header level={2}>{t('Construct.other.value')}</Header>
                <ValueInput value={character.educationStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value)}
                    onRandomClicked={() => randomValue()} textDescription={t('Value.childEducation.text')} />

            </div>
        </div>

        <div className="text-end">
            <Button className="btn btn-primary" onClick={() => onNext() }>{t('Common.button.next')}</Button>
        </div>
    </div>);
}

export default connect(characterMapStateToProperties)(ChildEducationDetailsPage);