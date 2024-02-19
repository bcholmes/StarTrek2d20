import React from 'react';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {AttributesHelper} from '../helpers/attributes';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {AttributeView} from '../components/attribute';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { CharacterType } from '../common/characterType';
import { StepContext, setCharacterCareerEventTrait, setCharacterFinishingTouches, setCharacterFocus } from '../state/characterActions';
import DisciplineListComponent from '../components/disciplineListComponent';
import { Skill } from '../helpers/skills';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';
import AttributeListComponent from '../components/attributeListComponent';
import { makeKey } from '../common/translationKey';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import ReactMarkdown from 'react-markdown';
import store from '../state/store';
import { connect } from 'react-redux';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { CareerEventAttributeController, CareerEventDisciplineController } from '../components/careerEventDetailsControllers';
import { FocusRandomTableWithHints } from '../solo/table/focusRandomTable';
import D20IconButton from '../solo/component/d20IconButton';
import { localizedFocus } from '../components/focusHelper';

interface ICareerEventDetailsProperties extends ICharacterProperties{
    context: StepContext;
}

const CareerEventDetailsPage: React.FC<ICareerEventDetailsProperties> = ({character, context}) => {
    const { t } = useTranslation();

    const careerEventStep = context === StepContext.CareerEvent1
        ? character.careerEvents[0]
        : character.careerEvents[1];

    const careerEvent = CareerEventsHelper.getCareerEvent(careerEventStep?.id, character.type);

    const selectRandomFocus = () => {
        let done = false;
        while (!done) {
            let focus = localizedFocus(FocusRandomTableWithHints(careerEventStep.discipline, careerEvent.focuses));
            if (character.focuses.indexOf(focus) < 0) {
                done = true;
                store.dispatch(setCharacterFocus(focus, context));
            }
        }
    }

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

    const attributeController = new CareerEventAttributeController(character, careerEventStep, context, careerEvent.attributes);
    const disciplineController = new CareerEventDisciplineController(character, careerEventStep, context, careerEvent.disciplines);

    return (
        <div className="page container ms-0">
            <CharacterCreationBreadcrumbs />

            <Header>{careerEvent.localizedName}</Header>
                <ReactMarkdown children={careerEvent.localizedDescription} />
                <div className="row">
                    <div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.attribute')}</Header>
                        {careerEvent.attributes.length === 1
                            ? (<div>
                                    <AttributeView name={t(makeKey('Construct.attribute.', AttributesHelper.getAttributeName(careerEvent.attributes[0])))}
                                        points={1} value={character.attributes[careerEvent.attributes[0]].value}/>
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
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <InputFieldAndLabel id="focus" labelName={t('Construct.other.focus')}
                                value={careerEventStep?.focus || ""} className="mt-1"
                                onChange={(v) => store.dispatch(setCharacterFocus(v, context))} />
                            <div style={{ flexShrink: 0 }} className="mt-1">
                                <D20IconButton onClick={() => selectRandomFocus()}/>
                            </div>
                        </div>
                        <div className="mt-3 text-white"><b>{t('Common.text.suggestions')}:</b> {careerEvent.localizedFocusSuggestion}</div>
                    </div>
                    {careerEvent.traitDescription !== null
                        ? (
                            <div className="col-lg-6 my-3">
                                <Header level={2} className="mb-3">{t('Construct.other.trait')}</Header>
                                <InputFieldAndLabel id="trait" labelName={t('Construct.other.trait')}
                                    value={careerEventStep.trait ?? ""}
                                    onChange={(t) => store.dispatch(setCharacterCareerEventTrait(t, context))} />
                                <div className="text-white mt-3">{careerEvent.traitDescription}</div>
                            </div>
                        )
                        : undefined}

                    {careerEvent.special ? (<div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">Special</Header>
                        <p>{careerEvent.special}</p>
                      </div>) : undefined }

                </div>
                <div className='text-end mt-4'>
                    <Button className="btn btn-primary" onClick={() => navigateToNextStep() }>{t('Common.button.next')}</Button>
                </div>
        </div>);

}

export default connect(characterMapStateToProperties)(CareerEventDetailsPage);