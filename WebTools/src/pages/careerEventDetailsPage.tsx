import React, { useState } from 'react';
import {CareerEventStep, Character, character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {Attribute, AttributesHelper} from '../helpers/attributes';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {AttributeView} from '../components/attribute';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { CharacterType } from '../common/characterType';
import { StepContext, setCharacterFinishingTouches, setCharacterFocus } from '../state/characterActions';
import DisciplineListComponent, { IDisciplineController } from '../components/disciplineListComponent';
import { Skill } from '../helpers/skills';
import { IAttributeController } from '../components/attributeController';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';
import AttributeListComponent from '../components/attributeListComponent';
import { makeKey } from '../common/translationKey';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import ReactMarkdown from 'react-markdown';
import store from '../state/store';
import { connect } from 'react-redux';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';

interface ICareerEventDetailsProperties extends ICharacterProperties{
    context: StepContext;
}


class CareerEventDisciplineController implements IDisciplineController {

    readonly character: Character;
    readonly careerEventStep: CareerEventStep;
    readonly context: StepContext;
    readonly disciplines: Skill[];
    readonly forceUpdate: () => void;

    constructor(character: Character, careerEventStep: CareerEventStep, context: StepContext, disciplines: Skill[], forceUpdate: () => void) {
        this.character = character;
        this.disciplines = disciplines;
        this.context = context;
        this.careerEventStep = careerEventStep;
        this.forceUpdate = forceUpdate;
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
        const max = Character.maxDiscipline(character);
        if (!character.hasMaxedSkill() || this.character.skills[discipline].expertise + 1 < max) {
            this.careerEventStep.discipline = discipline;
            character.skills[discipline].expertise++;
        }
        this.forceUpdate();
    }
    onDecrease(discipline: Skill): void {
        this.careerEventStep.discipline = undefined;
        character.skills[discipline].expertise--;
        this.forceUpdate();
    }
}

class CareerEventAttributeController implements IAttributeController {

    readonly character: Character;
    readonly careerEventStep: CareerEventStep;
    readonly context: StepContext;
    readonly attributes: Attribute[];
    readonly forceUpdate: () => void;

    constructor(character: Character, careerEventStep: CareerEventStep, context: StepContext, attributes: Attribute[], forceUpdate: () => void) {
        this.character = character;
        this.attributes = attributes;
        this.context = context;
        this.careerEventStep = careerEventStep;
        this.forceUpdate = forceUpdate;
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
        const max = Character.maxAttribute(character);
        if (!character.hasMaxedAttribute() || this.character.attributes[attribute].value + 1 < max) {
            this.careerEventStep.attribute = attribute;
            character.attributes[attribute].value++;
        }
        this.forceUpdate();
    }
    onDecrease(attribute: Attribute): void {
        this.careerEventStep.attribute = undefined;
        character.attributes[attribute].value--;
        this.forceUpdate();
    }
    get instructions() {
        return []
    }
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

const CareerEventDetailsPage: React.FC<ICareerEventDetailsProperties> = ({character, context}) => {
    const { t } = useTranslation();
    const forceUpdate = useForceUpdate();

    let [ trait, setTrait ] = useState("");
    const careerEventStep = context === StepContext.CareerEvent1
        ? character.careerEvents[0]
        : character.careerEvents[1];

    const careerEvent = CareerEventsHelper.getCareerEvent(careerEventStep?.id, character.type);

    const navigateToNextStep = () => {
        if (careerEventStep.attribute == null) {
            Dialog.show(t('CareerEventDetails.errorAttribute'));
        } else if (careerEventStep.discipline == null) {
            Dialog.show(t('CareerEventDetails.errorDiscipline'));
        } else if (!careerEventStep.focus) {
            Dialog.show(t('CareerEventDetails.errorFocus'));
        } else {
            if (context === StepContext.CareerEvent2 || character.type === CharacterType.Cadet) {
                store.dispatch(setCharacterFinishingTouches());
                Navigation.navigateToPage(PageIdentity.AttributesAndDisciplines);
            } else {
                Navigation.navigateToPage(PageIdentity.CareerEvent2);
            }
        }
    }

    const attributeController = new CareerEventAttributeController(character, careerEventStep, context, careerEvent.attributes, forceUpdate);
    const disciplineController = new CareerEventDisciplineController(character, careerEventStep, context, careerEvent.disciplines, forceUpdate);

    return (
        <div className="page container ml-0">
            <CharacterCreationBreadcrumbs />

            <Header>{careerEvent.localizedName}</Header>
                <ReactMarkdown children={careerEvent.localizedDescription} />
                <div className="row">
                    <div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.attribute')}</Header>
                        {careerEvent.attributes.length === 1
                            ? (<div>
                                    <AttributeView name={AttributesHelper.getAttributeName(careerEvent.attributes[0]) } points={1} value={character.attributes[careerEvent.attributes[0]].value}/>
                                </div>)
                            : (<AttributeListComponent controller={attributeController} />)}
                    </div>
                    <div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.discipline')}</Header>
                        {careerEvent.disciplines.length === 1
                        ? (<div>
                                <AttributeView name={t(makeKey('Construct.discipline.', Skill[careerEvent.disciplines[0]])) } points={1} value={character.skills[careerEvent.disciplines[0]].expertise}/>
                            </div>)
                        : (<DisciplineListComponent controller={disciplineController} />)}
                    </div>
                    <div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.focus')}</Header>
                        <InputFieldAndLabel id="focus" labelName={t('Construct.other.focus')}
                            value={careerEventStep?.focus || ""}
                            onChange={(f) => store.dispatch(setCharacterFocus(f, context))} />
                        <div className="mt-3 text-white"><b>{t('Common.text.suggestions')}:</b> {careerEvent.localizedFocusSuggestion}</div>
                    </div>
                    {careerEvent.traitDescription !== null
                        ? (
                            <div className="col-lg-6 my-3">
                                <Header level={2} className="mb-3">{t('Construct.other.trait')}</Header>
                                <InputFieldAndLabel id="trait" labelName={t('Construct.other.trait')}
                                    value={trait}
                                    onChange={(t) => setTrait(t)} />
                                <div className="text-white mt-3">{careerEvent.traitDescription}</div>
                            </div>
                        )
                        : undefined}

                    {careerEvent.special ? (<div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">Special</Header>
                        <p>{careerEvent.special}</p>
                      </div>) : undefined }

                </div>
                <div className='text-right mt-4'>
                    <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextStep() }/>
                </div>
        </div>);

}

export default connect(characterMapStateToProperties)(CareerEventDetailsPage);