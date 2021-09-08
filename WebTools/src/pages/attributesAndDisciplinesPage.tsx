import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity, IPageProperties} from './pageFactory';
import {AttributesHelper} from '../helpers/attributes';
import {Skill, SkillsHelper} from '../helpers/skills';
import {PageHeader} from '../components/pageHeader';
import {AttributeView} from '../components/attribute';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovement';
import {SkillImprovementCollection} from '../components/skillImprovement';
import {ElectiveSkillList} from '../components/electiveSkillList';
import { TalentsHelper, ToViewModel } from '../helpers/talents';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import { TalentSelectionList } from '../components/talentSelectionList';
import {ValueInput, Value} from '../components/valueInput';

interface IPageState {
    showExcessAttrDistribution: boolean;
    showExcessSkillDistribution: boolean;
}

export class AttributesAndDisciplinesPage extends React.Component<IPageProperties, IPageState> {
    private _selectedTalent: string;
    private _attrPoints: number;
    private _excessAttrPoints: number;
    private _skillPoints: number;
    private _excessSkillPoints: number;
    private _skills: Skill[];
    private _attributesDone: boolean;
    private _skillsDone: boolean;

    constructor(props: IPageProperties) {
        super(props);

        SetHeaderText(character.workflow.currentStep().name);

        this._attrPoints = 2;
        this._skillPoints = 2;
        this._skills = [];

        let attrSum = 0;
        let discSum = 0;

        character.attributes.forEach(a => {
            attrSum += a.value;
        });

        character.skills.forEach(s => {
            discSum += s.expertise;
        });

        this._excessAttrPoints = 54 - attrSum;
        this._excessSkillPoints = 14 - discSum;

        this.state = {
            showExcessAttrDistribution: this._excessAttrPoints > 0,
            showExcessSkillDistribution: this._excessSkillPoints > 0
        };
    }

    render() {
        const hasExcess = this.state.showExcessAttrDistribution || this.state.showExcessSkillDistribution;
        const attributes = hasExcess
                ? (this.state.showExcessAttrDistribution 
                    ? <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Increase} points={this._excessAttrPoints} onDone={(done) => { this.attributesDone(done); } } />
                    : <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.ReadOnly} points={this._excessAttrPoints} onDone={(done) => { this.attributesDone(done); } } />)
                : <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Customization} points={this._attrPoints} onDone={(done) => { this.attributesDone(done); } } />

        const disciplines = !this.state.showExcessSkillDistribution
            ? <ElectiveSkillList points={this._skillPoints} skills={character.skills.map(s => { return s.skill; }) } onUpdated={(skills) => { this._skillsDone = skills.length === this._skillPoints; } } />
            : <SkillImprovementCollection points={this._excessSkillPoints} skills={character.skills.map(s => s.skill) } onDone={(done) => { this._skillsDone = done; }} />;

        const description = !hasExcess
            ? "At this stage, your character is almost complete, and needs only a few final elements and adjustments. This serves as a last chance to customize the character before play."
            : "You will now get a chance to spend any excess Attribute and/or Discipline points accumulated during your lifepath.";

        const value = !hasExcess
            ? <div className="panel">
                <div className="header-small">VALUE</div>
                <ValueInput value={Value.Finish}/>
              </div>
            : undefined;

        let talents = [];
        talents.push(...TalentsHelper.getTalentsForSkills(character.skills.map(s => { return s.skill; })), ...TalentsHelper.getTalentsForSkills([Skill.None]));

        const talentSelection = !hasExcess && character.workflow.currentStep().talentPrompt
            ? (<div className="panel">
                <div className="header-small">TALENTS</div>
                <TalentSelectionList talents={talents} onSelection={talent => { this._selectedTalent = talent; }} />
            </div>)
            : undefined;


        const buttonText = !hasExcess ? "FINISH" : "PROCEED";

        return (
            <div className="page">
                <div className="page-text">
                    {description}
                </div>
                <div className="panel">
                    <div className="header-small">{`ATTRIBUTES (POINTS: ${hasExcess ? this._excessAttrPoints : this._attrPoints})`}</div>
                    {attributes}
                </div>
                <div className="panel">
                    <div className="header-small">{`DISCIPLINES (POINTS: ${hasExcess ? this._excessSkillPoints : this._skillPoints})`}</div>
                    {disciplines}
                </div>
                {value}
                {talentSelection}
                <Button text={buttonText} className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private attributesDone(done: boolean) {
        this._attributesDone = done;
    }

    private onNext() {
        if (this.state.showExcessAttrDistribution || this.state.showExcessSkillDistribution) {
            if (!this._attributesDone && this._excessAttrPoints > 0) {
                Dialog.show("You have not distributed all Attribute points.");
                return;
            }

            if (!this._skillsDone && this._excessSkillPoints > 0) {
                Dialog.show("You have not distributed all Discipline points.");
                return;
            }

            this.setState({ showExcessAttrDistribution: false, showExcessSkillDistribution: false });
        }
        else {
            if (!this._attributesDone) {
                Dialog.show("You have not distributed all Attribute points.");
                return;
            }

            if (!this._skillsDone) {
                Dialog.show("You have not distributed all Discipline points.");
                return;
            }

            if (character.workflow.currentStep().talentPrompt) {
                if (!this._selectedTalent || this._selectedTalent === "Select talent") {
                    Dialog.show("You have not selected a talent.");
                    return;
                }

                character.addTalent(this._selectedTalent);

                if (this._selectedTalent === "The Ushaan") {
                    character.addEquipment("Ushaan-tor ice pick");
                }
            }

            if (character.hasTalent("Borg Implants")) {
                Navigation.navigateToPage(PageIdentity.BorgImplants);
            }
            else {
                Navigation.navigateToPage(PageIdentity.Finish);
            }
        }
    }
}
