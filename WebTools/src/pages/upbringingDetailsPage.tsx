import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {UpbringingsHelper} from '../helpers/upbringings';
import {AttributesHelper} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {AttributeView} from '../components/attribute';
import {ElectiveSkillList} from '../components/electiveSkillList';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {CheckBox} from '../components/checkBox';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import InstructionText from '../components/instructionText';
import { Header } from '../components/header';
import { withTranslation, WithTranslation } from 'react-i18next';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';

interface IUpbringingDetailsPageState {
    focus: string;
}

class UpbringingDetailsPage extends React.Component<WithTranslation, IUpbringingDetailsPageState> {
    private _electiveSkills: Skill[];
    private _talent: TalentViewModel;
    private _accepted: boolean;

    constructor(props: WithTranslation) {
        super(props);

        this._electiveSkills = [];
        this._accepted = true;

        this.state = {
            focus: ''
        };
    }

    render() {
        const { t } = this.props;
        let upbringing = character.upbringingStep?.upbringing;

        let talents = this.filterTalentList()

        const attributes = this._accepted
            ? <div>
                <AttributeView name={AttributesHelper.getAttributeName(upbringing.attributeAcceptPlus2) } points={2} value={character.attributes[upbringing.attributeAcceptPlus2].value + 2}/>
                <AttributeView name={AttributesHelper.getAttributeName(upbringing.attributeAcceptPlus1) } points={1} value={character.attributes[upbringing.attributeAcceptPlus1].value + 1}/>
              </div>
            : <div>
                <AttributeView name={AttributesHelper.getAttributeName(upbringing.attributeRebelPlus2) } points={2} value={character.attributes[upbringing.attributeRebelPlus2].value + 2}/>
                <AttributeView name={AttributesHelper.getAttributeName(upbringing.attributeRebelPlus1) } points={1} value={character.attributes[upbringing.attributeRebelPlus1].value + 1}/>
              </div>

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                <Header>{upbringing.localizedName}</Header>
                <InstructionText text={upbringing.description} />
                <div className="row">
                    <div className="col-md-6 my-3">
                        <p>{t('UpbringingDetailPage.text')}</p>
                        <CheckBox isChecked={this._accepted} text={t('UpbringingDetailPage.text.accept')} value={1} onChanged={() => this.onAccepted(true)}/>
                        <CheckBox isChecked={!this._accepted} text={t('UpbringingDetailPage.text.reject')} value={0} onChanged={() => this.onAccepted(false)}/>
                    </div>
                    <div className="col-md-6 my-3">
                        <Header level={2}>{t('Construct.other.attributes')}</Header>
                        {attributes}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 my-3">
                        <Header level={2}>{t('Construct.other.disciplines')} ({t('Common.text.selectOne')})</Header>
                        <ElectiveSkillList points={1} skills={upbringing.disciplines} onUpdated={skills => this.onElectiveSkillsSelected(skills) }/>
                    </div>
                    <div className="my-3 col-md-6">
                        <Header level={2}>{t('Construct.other.focus')}</Header>
                        <p>{upbringing.focusDescription}</p>
                        <InputFieldAndLabel id="focus" labelName={t('Construct.other.focus')}
                            value={this.state.focus}
                            onChange={(v) => this.setState((state) => ({...state, focus: v}))} />
                        <div className="mt-3 text-white"><b>{t('Common.text.suggestions')}:</b> {upbringing.focusSuggestions.join(", ")}</div>
                    </div>
                </div>
                <div>
                    <Header level={2}>{t('Construct.other.talent')}</Header>
                    <SingleTalentSelectionList talents={talents} onSelection={(talent) => { this.onTalentSelected(talent) } } construct={character}/>
                </div>
                <div className="text-right">
                    <Button buttonType={true} className="button-next" onClick={() => this.onNext() }>{t('Common.button.next')}</Button>
                </div>
            </div>
        );
    }

    filterTalentList() {
        return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
            t => !character.hasTalent(t.name) || (this._talent != null && t.name === this._talent.name) || t.rank > 1);
    }

    private onAccepted(accepted: boolean) {
        this._accepted = accepted;
        this.forceUpdate();
    }

    private onElectiveSkillsSelected(skills: Skill[]) {
        this._electiveSkills = skills;
        this.forceUpdate();
    }

    private onTalentSelected(talent: TalentViewModel) {
        this._talent = talent;
        this.forceUpdate();
    }

    private onNext() {
        const { t } = this.props;
        if (this._electiveSkills.length !== 1) {
            Dialog.show(t('UpbringingDetailPage.error.discipline'));
            return;
        }

        if (!this._talent) {
            Dialog.show(t('UpbringingDetailPage.error.talent'));
            return;
        }

        var focus = this.state.focus;
        if (!focus || focus.length === 0) {
            Dialog.show(t('UpbringingDetailPage.error.focus'));
            return;
        }

        character.addFocus(focus);
        character.addTalent(this._talent);
        character.upbringingStep.acceptedUpbringing = this._accepted;
        let upbringing = character.upbringingStep?.upbringing;
        if (this._accepted) {
            character.upbringingStep.attributes = [upbringing.attributeAcceptPlus2, upbringing.attributeAcceptPlus2, upbringing.attributeAcceptPlus1];
        } else {
            character.upbringingStep.attributes = [upbringing.attributeRebelPlus2, upbringing.attributeRebelPlus2, upbringing.attributeRebelPlus1];
        }
        character.upbringingStep.disciplines = [...this._electiveSkills]

        UpbringingsHelper.applyUpbringing(character.upbringingStep.upbringing, this._accepted);
        character.workflow.next();
        Navigation.navigateToPage(character.workflow.currentStep().page);
    }
}

export default withTranslation()(UpbringingDetailsPage)