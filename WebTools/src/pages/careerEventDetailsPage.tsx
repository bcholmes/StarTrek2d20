import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity, IPageProperties} from './pageFactory';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {AttributesHelper} from '../helpers/attributes';
import {SkillsHelper} from '../helpers/skills';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {AttributeView} from '../components/attribute';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovement';
import {SkillView} from '../components/skill';
import {ElectiveSkillList} from '../components/electiveSkillList';

export class CareerEventDetailsPage extends React.Component<IPageProperties, {}> {
    private _focus: HTMLInputElement;
    private _trait: HTMLInputElement;
    private _attributeDone: boolean;
    private _skillDone: boolean;

    constructor(props: IPageProperties) {
        super(props);
    }

    render() {
        const event = CareerEventsHelper.getCareerEvent(character.careerEvents[character.careerEvents.length-1]);

        const attributes = event.attributes.length === 1
            ? (<AttributeView name={AttributesHelper.getAttributeName(event.attributes[0]) } points={1} value={character.attributes[event.attributes[0]].value}/>)
            : (<AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Increase} points={1} onDone={(done) => { this._attributeDone = done; } } />);

        const disciplines = event.disciplines.length === 1
            ? (<SkillView skill={event.disciplines[0]} points={1}/>)
            : (<ElectiveSkillList points={1} skills={event.disciplines} onUpdated={(skills) => { this._skillDone = skills.length === 1; } }/>);

        const trait = event.traitDescription !== null
            ? (
                <div className="panel">
                    <div className="header-small">TRAIT</div>
                    <div>
                        <div className="textinput-label">TRAIT</div>
                        <input type="text" ref={(input) => { this._trait = input; } }/>
                    </div>
                    <div>{event.traitDescription}</div>
                </div>
              )
            : undefined;

        const special = event.special ? (<div className="panel">
              <div className="header-small">SPECIAL</div>
              {event.special}
          </div>) : undefined;

        const next = character.careerEvents.length === 2 ? "FINISHING TOUCHES" : "CAREER EVENT";

        return (
            <div className="page">
                <div className="header-text"><div>{event.name}</div></div>
                <div className="panel">
                    <div className="desc-text">{event.description}</div>
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES</div>
                    {attributes}
                </div>
                <div className="panel">
                    <div className="header-small">DISCIPLINES</div>
                    {disciplines}
                </div>
                <div className="panel">
                    <div className="header-small">FOCUS</div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus = input; } }/>
                    </div>
                    <div><b>Suggestions: </b> {event.focusSuggestions}</div>
                </div>
                {trait}
                {special}
                <Button text={next} className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private onNext() {
        const event = CareerEventsHelper.getCareerEvent(character.careerEvents[character.careerEvents.length - 1]);
        if (event.attributes.length > 1) {
            if (!this._attributeDone) {
                Dialog.show("You have not distributed your Attribute point.");
                return;
            }
        }

        if (event.disciplines.length > 1) {
            if (!this._skillDone) {
                Dialog.show("You have not distributed your Discipline point.");
                return;
            }
        }

        var focus = this._focus.value;
        if (!focus || focus.length === 0) {
            Dialog.show("You need to type in a Focus. Choose from the suggestions if you cannot come up with your own.");
            return;
        }

        character.addFocus(focus);

        if (this._trait && this._trait.value) {
            character.addTrait(this._trait.value);
        }

        if (character.careerEvents.length === 2) {
            character.workflow.next();
            Navigation.navigateToPage(PageIdentity.AttributesAndDisciplines);
        }
        else {
            Navigation.navigateToPage(PageIdentity.CareerEvent2);
        }
    }
}
