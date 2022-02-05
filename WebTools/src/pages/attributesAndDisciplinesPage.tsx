import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Skill} from '../helpers/skills';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovement';
import {SkillImprovementCollection} from '../components/skillImprovement';
import {ElectiveSkillList} from '../components/electiveSkillList';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {ValueInput, Value} from '../components/valueInput';
import { TalentSelection } from '../components/talentSelection';

interface IPageState {
    showExcessAttrDistribution: boolean;
    showExcessSkillDistribution: boolean;
}

export class AttributesAndDisciplinesPage extends React.Component<IPageProperties, IPageState> {
    private _selectedTalent: TalentViewModel;
    private _attrPoints: number;
    private _excessAttrPoints: number;
    private _skillPoints: number;
    private _excessSkillPoints: number;
    private _attributesDone: boolean;
    private _skillsDone: boolean;

    constructor(props: IPageProperties) {
        super(props);

        this._attrPoints = 2;
        this._skillPoints = 2;

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
        const attributes = 
                (<AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Customization} points={this._excessAttrPoints + this._attrPoints} onDone={(done) => { this.attributesDone(done); } } />)

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
                <TalentSelection talents={talents} onSelection={talents => { this._selectedTalent = talents.length > 0 ? talents[0] : undefined; }} />
            </div>)
            : undefined;


        const attributeText = this._excessAttrPoints > 0 ? (
            <div className="page-text">
                The point total includes {this._excessAttrPoints} excess {this._excessAttrPoints > 1 ? ' Points ' : ' Point '} that could not 
                be automatically added to your attributes without exceeding maximum values.
            </div>
        ) : undefined;

        const disciplinesText = this._excessSkillPoints > 0 ? (
            <div className="page-text">
                The point total includes {this._excessSkillPoints} excess {this._excessSkillPoints > 1 ? ' Points ' : ' Point '} that could not 
                be automatically added to your dsciplines without exceeding maximum values.
            </div>
        ) : undefined;


        return (
            <div className="page">
                <div className="page-text">
                    {description}
                </div>
                <div className="panel">
                    <div className="header-small">{`ATTRIBUTES (POINTS: ${this._excessAttrPoints + this._attrPoints})`}</div>
                    {attributeText}
                    {attributes}
                </div>
                <div className="panel">
                    <div className="header-small">{`DISCIPLINES (POINTS: ${this._excessSkillPoints + this._skillPoints})`}</div>
                    {disciplinesText}
                    {disciplines}
                </div>
                {value}
                {talentSelection}
                <Button text="FINISH" className="button-next" onClick={() => this.onNext() }/>
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
                if (!this._selectedTalent) {
                    Dialog.show("You have not selected a talent.");
                    return;
                }

                character.addTalent(this._selectedTalent);

                if (this._selectedTalent.name === "The Ushaan") {
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
