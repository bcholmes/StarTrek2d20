import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import { Button } from '../components/button';
import { ChildAttributeImprovementCollection } from '../components/childAttributeImprovement';
import { ChildSkillList } from '../components/childSkillList';
import { Dialog } from '../components/dialog';
import { Header } from '../components/header';
import ValueInput, { Value } from '../components/valueInput';
import { IPageProperties } from './iPageProperties';

interface IEducationDetailsState {
    attributesChosen: boolean;
    attributesDecreased: boolean;
    disciplinesChosen: boolean;
    disciplinesDecreased: boolean;
    focus1?: string;
    focus2?: string;
}

export class ChildEducationDetailsPage extends React.Component<IPageProperties, IEducationDetailsState> {

    constructor(props) {
        super(props);
        this.state = {
            attributesChosen: false,
            attributesDecreased: false,
            disciplinesChosen: false,
            disciplinesDecreased: false
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
            <Header>{character.age.name}</Header>
            <div className="panel">
                <div className="desc-text">{character.age.description}</div>
            </div>
            <div className="panel">
                <div className="header-small">ATTRIBUTES</div>
                <ChildAttributeImprovementCollection decreasePoints={character.age.options.decreaseAttributes} onChange={(dec, inc) => this.onAttributesChanged(dec, inc)} />
            </div>
            <div className="panel">
                <div className="header-small">DISCIPLINES</div>
                <ChildSkillList decreasePoints={character.age.options.decreaseDisciplines} onChanged={(dec, inc) => { this.onDisciplinesChanged(dec, inc) } } />
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

    onDisciplinesChanged(dec: boolean, inc: boolean) {
        this.setState((state) => ({...state, disciplinesChosen: inc, disciplinesDecreased: dec}));
    }

    private onNext() {
        if (!this.state.attributesDecreased) {
            Dialog.show("You must decrease " + (character.age.options.decreaseAttributes === 1 ? "one attribute" : (character.age.options.decreaseAttributes + " attributes")));
        } else if (!this.state.attributesChosen) {
            Dialog.show("You must distribute all three attribute points.");
        } else if (!this.state.attributesDecreased) {
            Dialog.show("You must decrease " + (character.age.options.decreaseDisciplines === 1 ? "one discipline" : (character.age.options.decreaseDisciplines + " disciplines")));
        } else if (!this.state.disciplinesChosen) {
            Dialog.show("You must select one major and two minor disciplines.");
        } else if (character.age.options.numberOfFocuses === 1 && !this.state.focus1) {
            Dialog.show("You must select a Focus");
        } else if (character.age.options.numberOfFocuses > 1 && (!this.state.focus1 || !this.state.focus2)) {
            Dialog.show("You must select " + character.age.options.numberOfFocuses + " Focuses.");
        } else {
            character.addFocus(this.state.focus1);
            if (character.age.options.numberOfFocuses > 1) {
                character.addFocus(this.state.focus2);
            }

            character.workflow.next();
            Navigation.navigateToPage(character.workflow.currentStep().page);
        }
    }
}