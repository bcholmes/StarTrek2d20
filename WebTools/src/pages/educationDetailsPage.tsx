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
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import { EducationAttributeController, EducationPrimaryDisciplineController, EducationSecondaryDisciplineController } from '../components/educationControllers';
import AttributeListComponent from '../components/attributeListComponent';
import DisciplineListComponent from '../components/disciplineListComponent';
import { PageIdentity } from './pageIdentity';

const EducationDetailsPage: React.FC<ISoloCharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const track = TracksHelper.instance.getSoloTrack(character.educationStep?.track);
    const attributeController = new EducationAttributeController(character, track);
    const primaryDisciplineController = new EducationPrimaryDisciplineController(character, track);
    const secondaryDisciplineController = new EducationSecondaryDisciplineController(character, track);

    const randomValue = () => {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        onValueChanged(value);
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

            <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                value={character.educationStep?.focuses[0] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 0))} />
            <InputFieldAndLabel id="focus2" labelName={t('Construct.other.focus2')}
                value={character.educationStep?.focuses[1] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 1))} />
            <InputFieldAndLabel id="focus3" labelName={t('Construct.other.focus3')}
                value={character.educationStep?.focuses[2] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 2))}
                disabled={track.id === Track.EnlistedSecurityTraining}/>

            <div className="text-white mt-2"><b>Suggestions: </b> {track.focusSuggestions.join(", ")}</div>
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
            (character.educationStep?.decrementDiscipline != null && character.educationStep?.disciplines?.length < 3)) {
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
                Navigation.navigateToPage(PageIdentity.Career);
            }
        }
    }

    return (
        <div className="page container ml-0">
            <CharacterCreationBreadcrumbs />
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
            <div className="mt-5 text-right">
                <Button buttonType={true} text={t('Common.button.next')} className="btn btn-primary btn" onClick={() => navigateToNextPage() }/>
            </div>
        </div>
    );


}

export default connect(soloCharacterMapStateToProperties)(EducationDetailsPage);