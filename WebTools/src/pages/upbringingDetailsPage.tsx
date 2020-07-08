import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Upbringing, UpbringingsHelper} from '../helpers/upbringings';
import {AttributesHelper} from '../helpers/attributes';
import {Skill, SkillsHelper} from '../helpers/skills';
import {PageHeader} from '../components/pageHeader';
import {AttributeView} from '../components/attribute';
import {ElectiveSkillList} from '../components/electiveSkillList';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {CheckBox} from '../components/checkBox';
import {TalentList} from '../components/talentList';

export class UpbringingDetailsPage extends React.Component<IPageProperties, {}> {
    private _electiveSkills: Skill[];
    private _talent: string;
    private _accepted: boolean;
    private _focus: HTMLInputElement;

    constructor(props: IPageProperties) {
        super(props);

        this._electiveSkills = [];
        this._accepted = true;
    }

    render() {
        var upbringing = UpbringingsHelper.getUpbringing(character.upbringing);

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
            <div className="page">
                <div className="header-text"><div>{upbringing.name}</div></div>
                <div className="panel">
                    <div className="desc-text">{upbringing.description}</div>
                </div>
                <div className="panel">
                    <div>Do you <b>Accept</b> or <b>Rebel</b> against your upbringing?</div>
                    <CheckBox isChecked={this._accepted} text="Accept" value={1} onChanged={() => this.onAccepted(true)}/>
                    <CheckBox isChecked={!this._accepted} text="Rebel" value={0} onChanged={() => this.onAccepted(false)}/>
                </div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES</div>
                    {attributes}
                </div>
                <div className="panel">
                    <div className="header-small">DISCIPLINES (Select one)</div>
                    <ElectiveSkillList points={1} skills={upbringing.disciplines} onUpdated={skills => this.onElectiveSkillsSelected(skills) }/>
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    <TalentList skills={[...SkillsHelper.getSkills(), Skill.None]} onSelection={(talent) => { this.onTalentSelected(talent) } }/>
                </div>
                <div className="panel">
                    <div className="header-small">FOCUS</div>
                    <div>{upbringing.focusDescription}</div>
                    <div>
                        <div className="textinput-label">FOCUS</div>
                        <input type="text" ref={(input) => { this._focus = input; } } />
                    </div>
                    <div><b>Suggestions:</b> {upbringing.focusSuggestions.join(", ")}</div>
                </div>
                <Button text="STARFLEET ACADEMY" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private onAccepted(accepted: boolean) {
        this._accepted = accepted;
        this.forceUpdate();
    }

    private onElectiveSkillsSelected(skills: Skill[]) {
        this._electiveSkills = skills;
        this.forceUpdate();
    }

    private onTalentSelected(talent: string) {
        this._talent = talent;
        this.forceUpdate();
    }

    private onNext() {
        if (this._electiveSkills.length !== 1) {
            Dialog.show("You must select 1 Discipline to improve before proceeding.");
            return;
        }

        if (!this._talent || this._talent === "Select talent") {
            Dialog.show("You must select a talent before proceeding.");
            return;
        }

        var focus = this._focus.value;
        if (!focus || focus.length === 0) {
            Dialog.show("You need to type in a Focus. Choose from the suggestions if you cannot come up with your own.");
            return;
        }

        character.addFocus(focus);
        character.addTalent(this._talent);
        character.acceptedUpbringing = this._accepted;

        UpbringingsHelper.applyUpbringing(character.upbringing, this._accepted);
        Navigation.navigateToPage(PageIdentity.StarfleetAcademy);
    }
}