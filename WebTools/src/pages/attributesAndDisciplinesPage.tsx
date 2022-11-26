import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovement';
import {SkillImprovementCollection} from '../components/skillImprovement';
import {ElectiveSkillList} from '../components/electiveSkillList';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {ValueInput, Value} from '../components/valueInput';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { CharacterType } from '../common/characterType';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';
import { extraCharacterStepsNext } from './extraCharacterSteps';

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

        this._excessAttrPoints = character.age.attributeSum - this._attrPoints - attrSum;
        this._excessSkillPoints = character.age.disciplineSum - this._skillPoints - discSum;

        if (character.type === CharacterType.Cadet) {
            let reduction = 2;
            if (character.careerEvents.length != null) {
                reduction -= character.careerEvents.length;
            }
            this._excessAttrPoints -= reduction;
            this._excessSkillPoints -= reduction;
        }

        this.state = {
            showExcessAttrDistribution: this._excessAttrPoints > 0,
            showExcessSkillDistribution: this._excessSkillPoints > 0
        };
    }

    render() {
        const attributes =
                (<AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Customization}
                    points={this._excessAttrPoints + this._attrPoints} onDone={(done) => { this.attributesDone(done); } } />)

        const disciplines = !this.state.showExcessSkillDistribution
            ? <ElectiveSkillList points={this._skillPoints} skills={character.skills.map(s => { return s.skill; }) }
                onUpdated={(skills) => { this._skillsDone = skills.length === this._skillPoints; } } />
            : <SkillImprovementCollection points={this._excessSkillPoints + this._skillPoints}
                skills={character.skills.map(s => s.skill) } onDone={(done) => { this._skillsDone = done; }} />;

        const description = "At this stage, your character is almost complete, and needs only a few final elements and adjustments. This serves as a last chance to customize the character before play.";

        let talents = this.filterTalentList();

        const talentSelection = character.workflow.currentStep().options.talentSelection
            ? (<div className="panel">
                <div className="header-small">TALENTS</div>
                <SingleTalentSelectionList talents={talents} construct={character}
                    onSelection={talent => this._selectedTalent = talent } />
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


        let value = (character.workflow.currentStep().options.valueSelection)
            ? (<div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.Finish}/>
                </div>)
            : undefined;


        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />
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

    filterTalentList() {
        return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
            t => !character.hasTalent(t.name) || (this._selectedTalent != null && t.name === this._selectedTalent.name) || t.rank > 1);
    }

    private attributesDone(done: boolean) {
        this._attributesDone = done;
    }

    private onNext() {
        if (!this._attributesDone) {
            Dialog.show("You have not distributed all Attribute points.");
            return;
        }

        if (!this._skillsDone) {
            Dialog.show("You have not distributed all Discipline points.");
            return;
        }

        if (character.workflow.currentStep().options.talentSelection) {
            if (!this._selectedTalent) {
                Dialog.show("You have not selected a talent.");
                return;
            }

            character.addTalent(this._selectedTalent);
        }

        let optionalPage = extraCharacterStepsNext(character);
        if (optionalPage != null) {
            Navigation.navigateToPage(optionalPage);
        } else {
            Navigation.navigateToPage(PageIdentity.Finish);
        }
    }
}
