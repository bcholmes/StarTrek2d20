import * as React from 'react';
import {character, CharacterType, Gender} from '../common/character';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity, IPageProperties} from './pageFactory';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {RadioButton} from '../components/radioButton';
import {CheckBox} from '../components/checkBox';
import {DropDownInput} from '../components/dropDownInput';
import {ValueInput, Value} from '../components/valueInput';
import {_CharacterSheet} from '../components/characterSheet';
import {CharacterSerializer} from '../common/characterSerializer';
import {SpeciesHelper} from '../helpers/species';
import {RanksHelper} from '../helpers/ranks';
import {RolesHelper, RoleViewModel} from '../helpers/roles';

export class FinishPage extends React.Component<IPageProperties, {}> {
    private name: HTMLInputElement;
    private lineage: HTMLInputElement;
    private house: HTMLInputElement;
    private ranks: string[];
    private roles: RoleViewModel[];
    private role: string;
    private secondaryRole: string;
    private roleDescription: string;

    constructor(props: IPageProperties) {
        super(props);

        SetHeaderText(character.workflow.currentStep().name);

        character.addEquipment("Uniform");
        character.addEquipment("Communicator");
        character.addEquipment("Tricorder");

        this.roles = [];
        RolesHelper.getRoles().forEach(role => {
            this.roles.push(role);
        });

        character.role = this.roles[0].name;
        character.roleAbility = this.roles[0].ability;

        this.role = this.roles[0].name;
        this.roleDescription = `${this.roles[0].description} ${this.roles[0].ability}`;

        this.getRanks();
        character.rank = this.ranks[0];
    }

    render() {
        const characterData = CharacterSerializer.serialize(character);

        const data = characterData.map((d, i) => {
            return (<input type="hidden" name={d.name} value={d.value}/>)
        });

        const species = SpeciesHelper.getSpeciesByType(character.species);

        const nameDescription = species.nameDescription;

        const nameSuggestions = species.nameSuggestions;
        let names = [];

        nameSuggestions.forEach(n => {
            names.push(`${n.type}: ${n.suggestions}`);
        });

        const suggestions = names.map((n, i) => {
            return (<div>{`${n}${i < names.length - 1 ? "," : ""} `}</div>);
        });

        const values =
            <div>
                <div className="panel">
                    <div className="header-small">VALUES</div>
                    <div>
                        If you did not define your values during character creation,
                        or if you want to change any of them,
                        now is the time to think about the values your character goes by.
                    </div>
                    <ValueInput value={Value.Environment} text={character.environmentValue} onChange={() => { this.forceUpdate(); } } />
                    <ValueInput value={Value.Track} text={character.trackValue} onChange={() => { this.forceUpdate(); } }/>
                    <ValueInput value={Value.Career} text={character.careerValue} onChange={() => { this.forceUpdate(); } }/>
                    <ValueInput value={Value.Finish} text={character.finishValue} onChange={() => { this.forceUpdate(); } }/>
                </div>
                <br/>
            </div>;

        const assignments = this.roles.map((r, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header-small">{r.name}</td>
                    <td>{r.description}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={r.name}
                            isChecked={this.role === r.name || this.secondaryRole == r.name}
                            onChanged={(val) => {
                                this.onSelectRole(val);
                            } }/>
                    </td>
                </tr>
            )
        });

        const ranks = this.ranks.map((r, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header-small">{r}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={r}
                            isChecked={character.rank === r}
                            onChanged={(val) => {
                                this.onSelectRank(val);
                            } }/>
                    </td>
                </tr>
            )
        });
        let extra = (<div></div>);
        if (character.type == CharacterType.KlingonWarrior) {
            extra = (<div><div className="panel">
                <div className="header-small">LINEAGE</div>
                <div>{nameDescription}</div>
                <div className="textinput-label">Lineage</div>
                <input type="text" onChange={() => this.onLineageChanged() } ref={(input) => this.lineage = input}/>
                <div><small><b>Example: </b> <i>Daughter of Martok</i> or <i>Child of Koloth</i></small></div>
            </div><div className="panel">
                <div className="header-small">HOUSE</div>
                <div>{nameDescription}</div>
                <div className="textinput-label">House</div>
                <input type="text" onChange={() => this.onHouseChanged() } ref={(input) => this.house = input}/>
                <div><small><b>Example: </b> <i>House Duras</i> or <i>House Kor</i></small></div>
            </div></div>);
        }

        let multiDiscipline = character.hasTalent("Multi-Discipline") ? <div>Because your character has the <b>Multi-Discipline talent</b>, you may choose <b>two roles</b>. 
            Some options (e.g. Commanding Officer, Admiral) are excluded from the available roles.</div> : undefined;

        return (
            <div className="page">
                <div className="page-text">
                    Your character is finished. You can either use this reference to fill in a character sheet by hand, or use the button at the bottom
                    to export your character to PDF.
                </div>
                <div>
                    <b>* PDF exporting is not working on iOS 11. Use this page as a reference to fill in your character manually.</b>
                </div>
                <div className="panel">
                    <div className="header-small">NAME</div>
                    <div>{nameDescription}</div>
                    <div className="textinput-label">NAME</div>
                    <input type="text" onChange={() => this.onNameChanged() } ref={(input) => this.name = input}/>
                    <div><small><b>Suggestions: </b> <i>{suggestions}</i></small></div>
                </div>
                {extra}
                <br/>
                <div className="panel">
                    <div className="header-small">ASSIGNMENT</div>
                    <div>
                        Select the role your character has on the starship they service.
                        This choice will be based on your highest discipline(s).
                        The most suitable choice will appear on top, while the other options will be available as well in case you want to create a different character.
                    </div>
                    {multiDiscipline}
                    <table className="selection-list">
                        <tbody>
                            {assignments}
                        </tbody>
                    </table>
                </div>
                <br/>
                <div className="panel">
                    <div className="header-small">RANK</div>
                    <div>Select your character's rank.</div>
                    <table className="selection-list">
                        <tbody>
                            {ranks}
                        </tbody>
                    </table>
                </div>
                <br/>
                {values}
                <div className="panel">
                </div>
                <br/>
                <div className="button-container">
                    <form action="http://pdf.modiphiusapps.hostinguk.org/api/sheet" method="post" encType="application/x-www-form-urlencoded" target="_blank">
                        {data}
                        <input type="submit" value="Export to PDF" className="button-small" />
                    </form>
                    <br/>
                </div>
            </div>
        );
    }

    private onNameChanged() {
        character.name = this.name.value;
        this.forceUpdate();
    }

    private onLineageChanged() {
        character.lineage = this.lineage.value;
        this.forceUpdate();
    }

    private onHouseChanged() {
        character.house = this.house.value;
        this.forceUpdate();
    }

    private onSelectRank(rank: string) {
        character.rank = rank;
        this.forceUpdate();
    }

    private onSelectRole(role: string) {
        if (character.hasTalent("Multi-Discipline")) {
            if (!character.role || character.role === role) {
                character.role = role;
            } else if (!character.secondaryRole || character.secondaryRole === role) {
                character.secondaryRole = role;
            } else {
                character.role = character.secondaryRole;
                character.secondaryRole = role;
            }

            this.role = character.role;
            this.secondaryRole = character.secondaryRole;
        } else {
            character.role = role;
            character.secondaryRole = undefined;
            this.role = role;
            this.secondaryRole = undefined;
        }
        this.getRanks();
        this.forceUpdate();
    }

    private getRanks() {
        this.ranks = [];

        RanksHelper.getRanks(false).forEach(rank => {
            if (rank.tiers > 1) {
                for (var i = 0; i < rank.tiers; i++) {
                    const tier = i + 1;
                    this.ranks.push(`${rank.name} ${tier}${tier === 1 ? "st" : tier === 2 ? "nd" : "rd"} class`);
                }
            }
            else {
                this.ranks.push(rank.name);
            }
        });

        character.rank = this.ranks[0];
    }
}
