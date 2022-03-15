import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import { Button } from '../components/button';
import { ChildAttributeImprovementCollection } from '../components/childAttributeImprovement';
import { Dialog } from '../components/dialog';
import { Header } from '../components/header';
import { TalentSelection } from '../components/talentSelection';
import { Value, ValueInput } from '../components/valueInput';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import { IPageProperties } from './iPageProperties';

interface IEducationDetailsState {
    talent: TalentViewModel;
    attributesChosen: boolean;
    attributesDecreased: boolean;
}

export class ChildEducationDetailsPage extends React.Component<IPageProperties, IEducationDetailsState> {

    render() {
        return (<div className="page">
            <Header text={character.age.name} />
            <div className="panel">
                <div className="desc-text">{character.age.description}</div>
            </div>
            <div className="panel">
                <div className="header-small">ATTRIBUTES</div>
                <ChildAttributeImprovementCollection decreasePoints={character.age.decreasePoints} onChange={(dec, inc) => this.onAttributesChanged(dec, inc)} />
            </div>
            <div className="panel">
                <div className="header-small">TALENT</div>
                <TalentSelection talents={TalentsHelper.getAllTalents()} onSelection={(talents) => { this.onTalentSelected(talents) } }/>
            </div>
            <div className="panel">
                <div className="header-small">VALUE</div>
                <ValueInput value={Value.Track}/>
            </div>
            <Button text="CAREER" className="button-next" onClick={() => this.onNext() }/>
        </div>);
    }

    onAttributesChanged(dec: boolean, inc: boolean) {
        this.setState((state) => ({...state, attributesChosen: inc, attributesDecreased: dec}));
    }

    private onTalentSelected(talents: TalentViewModel[]) {
        let talentModel = talents.length > 0 ? talents[0] : undefined;
        this.setState((state) => ({ ...state, talent: talentModel }));
    }

    private onNext() {
        if (!this.state.attributesDecreased) {
            Dialog.show("You must decrease " + (character.age.decreasePoints === 1 ? "one attribute" : (character.age.decreasePoints + " attributes")));
        } else if (!this.state.attributesChosen) {
            Dialog.show("You must distribute all three attribute points.");
        } else {

            character.addTalent(this.state.talent);

            character.workflow.next();
            Navigation.navigateToPage(character.workflow.currentStep().page);
        }
    }
}