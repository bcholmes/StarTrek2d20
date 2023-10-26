import React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovementCollection';
import {SkillImprovementCollection} from '../components/skillImprovementCollection';
import {ElectiveSkillList} from '../components/electiveSkillList';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import ValueInput from '../components/valueInputWithRandomOption';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { CharacterType } from '../common/characterType';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { extraCharacterStepsNext } from './extraCharacterSteps';
import { ValueRandomTable } from '../solo/table/valueRandomTable';
import { WithTranslation, withTranslation } from 'react-i18next';
import store from '../state/store';
import { setCharacter } from '../state/characterActions';
import { Header } from '../components/header';
import InstructionText from '../components/instructionText';

interface IPageState {
    showExcessAttrDistribution: boolean;
    showExcessSkillDistribution: boolean;
}

class AttributesAndDisciplinesPage extends React.Component<WithTranslation, IPageState> {
    private _selectedTalent: TalentViewModel;
    private _attrPoints: number;
    private _excessAttrPoints: number;
    private _skillPoints: number;
    private _excessSkillPoints: number;
    private _attributesDone: boolean;
    private _skillsDone: boolean;

    constructor(props) {
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

    randomValue() {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        this.onValueChanged(value);
    }

    onValueChanged(value: string) {
        character.finishValue = value;
        this.forceUpdate();
    }

    render() {
        const { t } = this.props;
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
            ? (<div className="my-4">
                <Header level={2}>TALENTS</Header>
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
            ? (<div className="col-lg-6 mt-4">
                    <Header level={2}>{t('Construct.other.value')}</Header>
                    <ValueInput value={character.finishValue} onValueChanged={(value) => this.onValueChanged(value)}
                            onRandomClicked={() => this.randomValue()} textDescription={t('Value.final.text')} />
                </div>)
            : undefined;


        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                <Header>{t('Page.title.finish')}</Header>
                <InstructionText text={description} />
                <div className="row">
                    <div className="col-lg-6 mt-4">
                        <Header level={2}>{`ATTRIBUTES (POINTS: ${this._excessAttrPoints + this._attrPoints})`}</Header>
                        {attributeText}
                        {attributes}
                    </div>
                    <div className="col-lg-6 mt-4">
                        <Header level={2}>{`DISCIPLINES (POINTS: ${this._excessSkillPoints + this._skillPoints})`}</Header>
                        {disciplinesText}
                        {disciplines}
                    </div>
                    {value}
                </div>
                {talentSelection}
                <div className="text-right mt-4">
                    <Button buttonType={true} text="FINISH" className="btn btn-primary" onClick={() => this.onNext() }/>
                </div>
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
            store.dispatch(setCharacter(character));
            Navigation.navigateToPage(PageIdentity.Finish);
        }
    }
}

export default withTranslation()(AttributesAndDisciplinesPage);