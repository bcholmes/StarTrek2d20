import React, { useEffect, useState } from 'react';
import {Character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import { TALENT_NAME_BORG_IMPLANTS, TALENT_NAME_EXPANDED_PROGRAM, TALENT_NAME_VISIT_EVERY_STAR, TalentsHelper } from '../helpers/talents';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import ValueInput from '../components/valueInputWithRandomOption';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { CharacterType } from '../common/characterType';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { ValueRandomTable } from '../solo/table/valueRandomTable';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';
import InstructionText from '../components/instructionText';
import { FinishingTouchesAttributeController, FinishingTouchesDisciplineController } from '../components/finishingTouchesControllers';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import AttributeListComponent from '../components/attributeListComponent';
import DisciplineListComponent from '../components/disciplineListComponent';
import store from '../state/store';
import { addCharacterTalent, setCharacterFinishingTouches, setCharacterValue, StepContext } from '../state/characterActions';

const AttributesAndDisciplinesPage: React.FC<ICharacterProperties> = ({character})  => {

    const [talentSelected, setTalentSelected] = useState(undefined);

    const randomValue = () => {
        let done = false;
        while (!done) {
            let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
            if (character.values.indexOf(value) < 0) {
                done = true;
                store.dispatch(setCharacterValue(value, StepContext.FinishingTouches));
            }
        }
    }

    const filterTalentList = () => {
        return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
            t => !character.hasTalent(t.name) || (talentSelected != null && t.name === talentSelected) || t.rank > 1);
    }

    const navigateToNextPage = () => {
        if (character.finishingStep?.attributes.length !== attributeCount) {
            Dialog.show(t('SoloFinishingTouchesPage.errorAttributes', { count: attributeCount}));
        } else if (character.finishingStep?.disciplines.length !== disciplineCount) {
            Dialog.show(t('SoloFinishingTouchesPage.errorDisciplines', { count: disciplineCount}));
        } else if (!character.finishingStep?.value == null) {
            Dialog.show(t('SoloFinishingTouchesPage.errorValue'));
        } else if (character.type === CharacterType.KlingonWarrior && talentSelected == null) {
            Dialog.show(t('SoloFinishingTouchesPage.errorTalent'));
        } else if (character.hasTalent(TALENT_NAME_BORG_IMPLANTS) ||
            character.hasTalent(TALENT_NAME_EXPANDED_PROGRAM) ||
            character.hasTalent(TALENT_NAME_VISIT_EVERY_STAR)) {
            Navigation.navigateToPage(PageIdentity.ExtraTalentDetails);
        } else {
            Navigation.navigateToPage(PageIdentity.Finish);
        }
    }

    const { t } = useTranslation();

    let attributeTotal = 0;
    character.attributes.forEach(a => attributeTotal += a.value);
    attributeTotal -= (character.finishingStep?.attributes?.length ?? 0);
    const attributeCount = Character.totalAttributeSum(character) - attributeTotal;

    let disciplineTotal = 0;
    character.skills.forEach(a => disciplineTotal += a.expertise);
    disciplineTotal -= (character.finishingStep?.disciplines?.length ?? 0);

    const disciplineCount = Character.totalDisciplineSum(character) - disciplineTotal;

    const attributeController = new FinishingTouchesAttributeController(character, attributeCount);
    const disciplineController = new FinishingTouchesDisciplineController(character, disciplineCount);

    const description = "At this stage, your character is almost complete, and needs only a few final elements and adjustments. This serves as a last chance to customize the character before play.";

    let talents = filterTalentList();

    const talentSelection = character.type === CharacterType.KlingonWarrior
        ? (<div className="my-4">
            <Header level={2}>TALENTS</Header>
            <SingleTalentSelectionList talents={talents} construct={character}
                onSelection={talent => {
                    store.dispatch(addCharacterTalent(talent, StepContext.FinishingTouches));
                    setTalentSelected(talent);
                } } />
        </div>)
        : undefined;


    const excessAttrPoints = attributeCount - 2;
    const attributeText = excessAttrPoints > 0 ? (
        <p>
            The point total includes {excessAttrPoints} excess {excessAttrPoints > 1 ? ' Points ' : ' Point '} that could not
            be automatically added to your attributes without exceeding maximum values.
        </p>
    ) : undefined;

    const excessSkillPoints = disciplineCount - 2;
    const disciplinesText = excessSkillPoints > 0 ? (
        <p>
            The point total includes {excessSkillPoints} excess {excessSkillPoints > 1 ? ' Points ' : ' Point '} that could not
            be automatically added to your dsciplines without exceeding maximum values.
        </p>
    ) : undefined;

    useEffect(() => {
        if (character.finishingStep == null) {
            store.dispatch(setCharacterFinishingTouches());
        }
    }, []);


    let value = (character.type !== CharacterType.Child && character.type !== CharacterType.Cadet)
        ? (<div className="col-lg-6 mt-4">
                <Header level={2}>{t('Construct.other.value')}</Header>
                <ValueInput value={character.finishingStep?.value ?? ""} onValueChanged={(value) => store.dispatch(setCharacterValue(value, StepContext.FinishingTouches))}
                        onRandomClicked={() => randomValue()} textDescription={t('Value.final.text')} />
            </div>)
        : undefined;


    return (
        <div className="page container ml-0">
            <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.AttributesAndDisciplines} />
            <Header>{t('Page.title.finish')}</Header>
            <InstructionText text={description} />
            <div className="row">
                <div className="col-lg-6 my-3">
                    <Header level={2} className="mb-3"><>{t('Construct.other.attribute')} {t('SoloFinishingTouchesPage.select', {count: attributeCount})}</></Header>
                    {attributeText}
                    <AttributeListComponent controller={attributeController} />
                </div>
                <div className="col-lg-6 my-3">
                    <Header level={2} className="mb-3"><>{t('Construct.other.discipline')}  {t('SoloFinishingTouchesPage.select', {count: disciplineCount})}</></Header>
                    {disciplinesText}
                    <DisciplineListComponent controller={disciplineController} />
                </div>
                {value}
            </div>

            {talentSelection}
            <div className="text-right mt-4">
                <Button buttonType={true} text="FINISH" className="btn btn-primary" onClick={() => navigateToNextPage() }/>
            </div>
        </div>
    );
}

export default connect(characterMapStateToProperties)(AttributesAndDisciplinesPage);