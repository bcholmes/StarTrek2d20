import React from 'react';
import {character} from '../common/character';
import {CharacterType} from '../common/characterType';
import {Navigation} from '../common/navigator';
import {TrackModel, TracksHelper} from '../helpers/tracks';
import {Skill} from '../helpers/skills';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovementCollection';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import ValueInput from '../components/valueInputWithRandomOption';
import {MajorsList} from '../components/majorsList';
import SkillView from '../components/skill';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import { Header } from '../components/header';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { Track } from '../helpers/trackEnum';
import { ValueRandomTable } from '../solo/table/valueRandomTable';
import { WithTranslation, withTranslation } from 'react-i18next';
import InstructionText from '../components/instructionText';
import ReactMarkdown from 'react-markdown';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';

class StarfleetAcademyDetailsPage extends React.Component<WithTranslation, {}> {
    private _talent: TalentViewModel;
    private _trait: HTMLInputElement;
    private _attributesDone: boolean;
    private _skillsDone: boolean;

    randomValue() {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        this.onValueChanged(value);
    }

    onValueChanged(value: string) {
        character.trackValue = value;
        this.forceUpdate();
    }

    renderFocuses(track: TrackModel) {
        const { t } = this.props;
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
                onChange={(value) => {character.educationStep.focuses[0] = value; this.forceUpdate()}} />
            <InputFieldAndLabel id="focus2" labelName={t('Construct.other.focus2')}
                value={character.educationStep?.focuses[1] ?? ""}
                onChange={(value) => {character.educationStep.focuses[1] = value; this.forceUpdate()}} />
            <InputFieldAndLabel id="focus3" labelName={t('Construct.other.focus3')}
                value={character.educationStep?.focuses[2] ?? ""}
                onChange={(value) => {character.educationStep.focuses[2] = value; this.forceUpdate()}}
                disabled={track.id === Track.EnlistedSecurityTraining}/>

            <div className="text-white mt-2"><b>Suggestions: </b> {track.focusSuggestions.join(", ")}</div>
        </div>);
    }

    renderAttributes(track: TrackModel) {
        return (<div className="col-lg-6 my-6">
                <Header level={2}>ATTRIBUTES (Select up to three)</Header>
                <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Academy} points={3} onDone={(done) => { this._attributesDone = done; } } rule={track.attributesRule}/>
            </div>);
    }

    renderDisciplines(track: TrackModel) {
        const { t } = this.props;
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
                    <MajorsList skills={track.majorDisciplines} onDone={(done) => {this._skillsDone = done; this.forceUpdate() }} rule={track.skillsRule}/>
                </div>);
        }
    }

    renderTalents() {
        const { t } = this.props;
        return (<div>
                <Header level={2}>{t('Construct.other.talent')}</Header>
                <SingleTalentSelectionList talents={this.filterTalentList()}
                    construct={character} onSelection={(talent) => { this.onTalentSelected(talent) } }/>
            </div>);
    }

    render() {
        const { t } = this.props;
        const track = TracksHelper.instance.getTrack(character.educationStep?.track, character.type);

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                <Header>{track.name}</Header>
                <InstructionText text={track.description} />
                <div className="row">
                    {this.renderAttributes(track)}
                    {this.renderDisciplines(track)}

                    {this.renderFocuses(track)}

                    <div className="col-lg-6 my-3">
                        <Header level={2}>VALUE</Header>
                        <ValueInput value={character.trackValue} onValueChanged={(value) => this.onValueChanged(value)}
                                onRandomClicked={() => this.randomValue()} textDescription={t('Value.starfleetTraining.text')}
                            />

                    </div>
                </div>
                {this.renderTalents()}
                <div className="mt-5 text-right">
                    <Button buttonType={true} text={t('Common.button.next')} className="btn btn-primary btn" onClick={() => this.onNext() }/>
                </div>
            </div>
        );
    }

    filterTalentList() {
        return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
            t => !character.hasTalent(t.name) || (this._talent != null && t.name === this._talent.name) || t.rank > 1);
    }

    private onTalentSelected(talent?: TalentViewModel) {
        this._talent = talent;
        this.forceUpdate();
    }

    private onNext() {
        const ignoresDisciplineRequirements =
            character.educationStep?.track === Track.EnlistedSecurityTraining ||
            character.educationStep?.track === Track.ShipOperations ||
            character.educationStep?.track === Track.ResearchInternship ||
            character.educationStep?.track === Track.UniversityAlumni;

        if (!this._attributesDone) {
            Dialog.show("You have not distributed all Attribute points.");
            return;
        }

        if (!this._skillsDone && !ignoresDisciplineRequirements) {
            Dialog.show("You must select one major and two other disciplines before proceeding.");
            return;
        }
        if (!this._talent) {
            Dialog.show("You must select a talent before proceeding.");
            return;
        }

        let focuses = character.educationStep?.focuses?.filter(f => f?.trim().length > 0);
        if (focuses.length !== 3) {
            Dialog.show("You need to type in three Focuses. Choose from the suggestions if you cannot come up with your own.");
            return;
        }

        var trait = this._trait ? this._trait.value : null;
        if (trait && trait.length > 0) {
            character.addTrait(trait);
        }

        character.addTalent(this._talent);

        character.workflow.next();
        Navigation.navigateToPage(character.workflow.currentStep().page);
    }
}

export default withTranslation()(StarfleetAcademyDetailsPage);