import React from 'react';
import {CharacterType} from '../common/characterType';
import {Navigation} from '../common/navigator';
import {TrackModel, TracksHelper} from '../helpers/tracks';
import {Skill} from '../helpers/skills';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import ValueInput from '../components/valueInputWithRandomOption';
import SkillView from '../components/skill';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import { Header } from '../components/header';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { Track } from '../helpers/trackEnum';
import { ValueRandomTable } from '../solo/table/valueRandomTable';
import { useTranslation } from 'react-i18next';
import InstructionText from '../components/instructionText';
import ReactMarkdown from 'react-markdown';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import store from '../state/store';
import { StepContext, addCharacterTalent, setCharacterFocus, setCharacterValue } from '../state/characterActions';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import { EducationAttributeController, EducationPrimaryDisciplineController, EducationSecondaryDisciplineController } from '../components/educationControllers';
import AttributeListComponent from '../components/attributeListComponent';
import DisciplineListComponent from '../components/disciplineListComponent';
import { PageIdentity } from './pageIdentity';
import { Stereotype } from '../common/construct';
import D20IconButton from '../solo/component/d20IconButton';
import { FocusRandomTableWithHints } from '../solo/table/focusRandomTable';
import { localizedFocus } from '../components/focusHelper';

const EducationDetailsPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const track = character.stereotype === Stereotype.SoloCharacter
        ? TracksHelper.instance.getSoloTrack(character.educationStep?.track)
        : TracksHelper.instance.getTrack(character.educationStep?.track, character.type);
    const attributeController = new EducationAttributeController(character, track);
    const primaryDisciplineController = new EducationPrimaryDisciplineController(character, track);
    const secondaryDisciplineController = new EducationSecondaryDisciplineController(character, track);

    const randomValue = () => {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        onValueChanged(value);
    }


    const selectRandomFocus = (index: number) => {
        let done = false;
        while (!done) {
            let focus = localizedFocus(FocusRandomTableWithHints(character.educationStep?.primaryDiscipline, track.focusSuggestions));
            if (character.focuses.indexOf(focus) < 0) {
                done = true;
                store.dispatch(setCharacterFocus(focus, StepContext.Education, index));
            }
        }
    }

    const onValueChanged = (value: string) => {
        store.dispatch(setCharacterValue(value, StepContext.Education));
    }

    const renderFocuses = (track: TrackModel) => {
        let training = "Select three focuses for your character, at least one reflecting the time at Starfleet Academy.";
        if (character.type === CharacterType.KlingonWarrior) {
            if (character.enlisted) {
                training = "Select three focuses for your character, at least one reflecting their time training.";
            } else {
                training = "Select three focuses for your character, at least one reflecting the time at KDF Academy.";
            }
        } else if (track.id === Track.EnlistedSecurityTraining) {
            training = "Select two focuses for your character. You have already gained the *Chain of Command* focus.";
        }

        return (<div className="col-lg-6 my-3">
            <Header level={2}>FOCUS</Header>
            <ReactMarkdown>{training}</ReactMarkdown>

            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                    value={character.educationStep?.focuses[0] || ""} className="mt-1"
                    onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 0))} />
                <div style={{ flexShrink: 0 }} className="mt-1">
                    <D20IconButton onClick={() => selectRandomFocus(0)}/>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <InputFieldAndLabel id="focus2" labelName={t('Construct.other.focus2')}
                    value={character.educationStep?.focuses[1] || ""} className="mt-1"
                    onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 1))} />
                <div style={{ flexShrink: 0 }} className="mt-1">
                    <D20IconButton onClick={() => selectRandomFocus(1)}/>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <InputFieldAndLabel id="focus3" labelName={t('Construct.other.focus3')}
                    value={character.educationStep?.focuses[2] || ""} className="mt-1"
                    onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 2))}
                    disabled={track.id === Track.EnlistedSecurityTraining} />
                {track.id === Track.EnlistedSecurityTraining
                    ? undefined :
                    (<div style={{ flexShrink: 0 }} className="mt-1">
                        <D20IconButton onClick={() => selectRandomFocus(2)}/>
                    </div>)}
            </div>

            <div className="text-white mt-2"><b>Suggestions: </b> {track.focusSuggestions.map(f => localizedFocus(f)).join(", ")}</div>
        </div>);
    }

    const renderAttributes = (track: TrackModel) => {
        return (<div className="col-lg-6 my-3">
                <Header level={2}>{t('Construct.other.attributes') + ' ' + t('SoloEducationDetailsPage.selectThree')}</Header>
                <AttributeListComponent controller={attributeController} />

                {track.attributesRule ? (<p>{track.attributesRule?.describe()}</p>) : undefined}
            </div>);
    }

    const renderDisciplines = (track: TrackModel) => {
        if (track.id === Track.EnlistedSecurityTraining) {
            return (<div className="col-lg-6 my-3">
                    <Header level={2}>{t('Construct.other.disciplines')}</Header>
                    <SkillView points={2} skill={Skill.Security} />
                    <SkillView points={1} skill={Skill.Conn} />
                    <SkillView points={1} skill={Skill.Engineering} />
                </div>);
        } else if (track.id === Track.ShipOperations) {
            return (<div className="col-lg-6 my-3">
                    <Header level={2}>{t('Construct.other.disciplines')}</Header>
                    <SkillView points={2} skill={Skill.Conn} />
                    <SkillView points={1} skill={Skill.Engineering} />
                    <SkillView points={1} skill={Skill.Science} />
                </div>);
        } else if (track.id === Track.UniversityAlumni) {
            return (<div className="col-lg-6 my-3">
                    <Header level={2}>{t('Construct.other.disciplines')}</Header>
                    <SkillView points={2} skill={Skill.Science} />
                    <SkillView points={1} skill={Skill.Engineering} />
                    <SkillView points={1} skill={Skill.Command} />
                </div>);
        } else if (track.id === Track.ResearchInternship) {
            return (<div className="col-lg-6 my-3">
                    <Header level={2}>{t('Construct.other.disciplines')}</Header>
                    <SkillView points={2} skill={Skill.Science} />
                    <SkillView points={1} skill={Skill.Engineering} />
                    <SkillView points={1} skill={Skill.Medicine} />
                </div>);
        } else {
            return (<div className="col-lg-6 my-3">
                <Header level={2}>{t('SoloEducationDetailsPage.primaryDiscipline')}</Header>
                <DisciplineListComponent controller={primaryDisciplineController} />

                <Header level={2} className="mt-3">{t('SoloEducationDetailsPage.secondaryDiscipline')}</Header>
                <DisciplineListComponent controller={secondaryDisciplineController} />

                {track.skillsRule ? (<p>{track.skillsRule?.describe()}</p>) : undefined}
            </div>);
        }
    }

    const renderTalents = () => {
        return (<div>
                <Header level={2}>{t('Construct.other.talent')}</Header>
                <SingleTalentSelectionList talents={filterTalentList()}
                    construct={character} onSelection={(talent) => { onTalentSelected(talent) } }/>
            </div>);
    }

    const filterTalentList = () => {
        return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
            t => !character.hasTalent(t.name) || (character.educationStep?.talent != null && t.name === character.educationStep?.talent?.talent) || t.rank > 1);
    }

    const onTalentSelected = (talent?: TalentViewModel) => {
        if (talent) {
            store.dispatch(addCharacterTalent(talent, StepContext.Education));
        } else {
            // ?????
            console.log("No talent? This is unpossible!?!")
        }
    }

    const navigateToNextPage = () => {
        if (character.educationStep?.attributes?.length < 3) {
            Dialog.show(t("SoloEducationDetailsPage.errorAttributes"));
        } else if (character.educationStep?.disciplines?.length < 2 || character.educationStep?.primaryDiscipline == null ||
            (character.educationStep?.decrementDisciplines.length > 0 && character.educationStep?.disciplines?.length < 3)) {
            Dialog.show(t("SoloEducationDetailsPage.errorDisciplines"));
        } else if (character.educationStep?.focuses?.filter(f => !!f).length < 3) {
            Dialog.show(t("SoloEducationDetailsPage.errorFocuses"));
        } else if (!character.educationStep?.value) {
            Dialog.show(t("SoloEducationDetailsPage.errorValue"));
        } else if (!character.educationStep?.talent == null) {
            Dialog.show(t("SoloEducationDetailsPage.errorTalent"));
        } else {
            if (character.age.isChild) {
                Navigation.navigateToPage(PageIdentity.ChildCareer);
            } else if (character.type === CharacterType.Cadet) {
                Navigation.navigateToPage(PageIdentity.CadetCareer);
            } else {
                Navigation.navigateToPage(PageIdentity.CareerLength);
            }
        }
    }

    return (
        <div className="page container ms-0">
            <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.EducationDetails} />
            <Header>{track.name}</Header>
            <InstructionText text={track.description} />
            <div className="row">
                {renderAttributes(track)}
                {renderDisciplines(track)}

                {renderFocuses(track)}

                <div className="col-lg-6 my-3">
                    <Header level={2}>VALUE</Header>
                    <ValueInput value={character.educationStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value)}
                            onRandomClicked={() => randomValue()} textDescription={t('Value.starfleetTraining.text')}
                        />

                </div>
            </div>
            {renderTalents()}
            <div className="mt-5 text-end">
                <Button buttonType={true} text={t('Common.button.next')} className="btn btn-primary btn" onClick={() => navigateToNextPage() }/>
            </div>
        </div>
    );


}

export default connect(characterMapStateToProperties)(EducationDetailsPage);