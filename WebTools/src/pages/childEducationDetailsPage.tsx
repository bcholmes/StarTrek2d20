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
    attributesChosen: boolean;
    attributesDecreased: boolean;
    focus1?: string;
    focus2?: string;
}

export class ChildEducationDetailsPage extends React.Component<IPageProperties, IEducationDetailsState> {

    constructor(props) {
        super(props);
        this.state = {
            attributesChosen: false,
            attributesDecreased: false
        };
    }

    render() {

        let focuses = character.age.options.numberOfFocuses === 1 
            ? (<div className="panel">
                <div className="header-small">FOCUS</div>
                <div>{character.age.options.focusText}</div>
                <div>
                    <div className="textinput-label">FOCUS</div>
                    <input type="text" onChange={(input) => { this.setFocus(0, input.target.value); } } />
                </div>
            </div>)
            : (<div className="panel">
                <div className="header-small">FOCUS</div>
                <div>{character.age.options.focusText}</div>
                <div>
                    <div className="textinput-label">FOCUS</div>
                    <input type="text" onChange={(input) => { this.setFocus(0, input.target.value) } } />
                </div>
                <div>
                    <div className="textinput-label">FOCUS</div>
                    <input type="text" onChange={(input) => { this.setFocus(1, input.target.value) } } />
                </div>
            </div>);

        return (<div className="page">
            <Header text={character.age.name} />
            <div className="panel">
                <div className="desc-text">{character.age.description}</div>
            </div>
            <div className="panel">
                <div className="header-small">ATTRIBUTES</div>
                <ChildAttributeImprovementCollection decreasePoints={character.age.options.decreasePoints} onChange={(dec, inc) => this.onAttributesChanged(dec, inc)} />
            </div>
            {focuses}
            <div className="panel">
                <div className="header-small">VALUE</div>
                <ValueInput value={Value.Track}/>
            </div>
            <Button text="CAREER" className="button-next" onClick={() => this.onNext() }/>
        </div>);
    }

    setFocus(index: number, focus: string) {
        if (index === 0) {
            this.setState((state) => ({
                ...state,
                focus1: focus
            }));
        } else {
            this.setState((state) => ({
                ...state,
                focus2: focus
            }));
        }
    }

    onAttributesChanged(dec: boolean, inc: boolean) {
        this.setState((state) => ({...state, attributesChosen: inc, attributesDecreased: dec}));
    }

    private onNext() {
        if (!this.state.attributesDecreased) {
            Dialog.show("You must decrease " + (character.age.options.decreasePoints === 1 ? "one attribute" : (character.age.options.decreasePoints + " attributes")));
        } else if (!this.state.attributesChosen) {
            Dialog.show("You must distribute all three attribute points.");
        } else if (character.age.options.numberOfFocuses === 1 && !this.state.focus1) {
            Dialog.show("You must select a Focus");
        } else if (character.age.options.numberOfFocuses > 1 && (!this.state.focus1 || !this.state.focus2)) {
            Dialog.show("You must select " + character.age.options.numberOfFocuses + " Focuses.");
        } else {
            character.workflow.next();
            Navigation.navigateToPage(character.workflow.currentStep().page);
        }
    }
}