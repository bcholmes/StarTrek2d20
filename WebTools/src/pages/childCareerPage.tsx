import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {Button} from '../components/button';
import {TalentDescription} from '../components/talentDescription';
import {ValueInput, Value} from '../components/valueInput';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import InstructionText from '../components/instructionText';
import { Header } from '../components/header';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';

export class ChildCareerPage extends React.Component<IPageProperties, {}> {

    talent: TalentViewModel;

    constructor(props) {
        super(props);
        this.talent = TalentsHelper.getTalentViewModel("Childhood Insight");
    }

    render() {
        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />
                <Header>Career</Header>
                <div className="panel">
                    <InstructionText text={character.workflow.currentStep().description} />
                </div>
                <div className="panel">
                    <div className="header-small">VALUE</div>
                    <ValueInput value={Value.ChildCareer}/>
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    <TalentDescription name={this.talent.name} description={this.talent.description} />
                </div>
                <Button text={character.workflow.peekNextStep().name} className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private onNext() {
        character.addTalent(this.talent);

        character.workflow.next();
        Navigation.navigateToPage(character.workflow.currentStep().page);
    }
}
