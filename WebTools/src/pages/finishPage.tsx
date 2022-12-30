import * as React from 'react';
import {AlliedMilitaryDetails, character} from '../common/character';
import {CharacterType} from '../common/characterType';
import {IPageProperties} from './iPageProperties';
import {Button} from '../components/button';
import {CheckBox} from '../components/checkBox';
import {ValueInput, Value} from '../components/valueInput';
import {SpeciesHelper} from '../helpers/species';
import {RanksHelper} from '../helpers/ranks';
import {RolesHelper, RoleModel} from '../helpers/roles';
import {CharacterSheetDialog} from '../components/characterSheetDialog'
import {CharacterSheetRegistry} from '../helpers/sheets';
import { AlliedMilitaryType } from '../helpers/alliedMilitary';
import replaceDiceWithArrowhead from '../common/arrowhead';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { marshaller } from '../helpers/marshaller';
import { SmallHeader } from '../components/smallHeader';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';


interface IFinishPageState {
    roleSelectionAllowed: boolean|null;
    jobAssignment?: string;
    assignedShip?: string;
}

export class FinishPage extends React.Component<IPageProperties, IFinishPageState> {
    private name: HTMLInputElement;
    private pronouns: HTMLInputElement;
    private traits: HTMLInputElement;
    private lineage: HTMLInputElement;
    private house: HTMLInputElement;
    private ranks: string[];
    private roles: RoleModel[];
    private role: string;
    private secondaryRole: string;

    constructor(props: IPageProperties) {
        super(props);

        this.roles = [];
        RolesHelper.getRoles().forEach(role => {
            this.roles.push(role);
        });

        if (character.type !== CharacterType.Cadet) {
            character.role = this.roles[0].name;
            this.role = this.roles[0].name;
            this.state = {
                roleSelectionAllowed: null
            };
        } else {
            this.state = {
                roleSelectionAllowed: false
            };
        }

        this.getRanks();
        if (!character.isCivilian()) {
            character.rank = this.ranks[0];
        } else {
            character.rank = '';
        }
    }

    renderValues() {
        if (character.age.isChild() || character.type === CharacterType.Cadet) {
            return (<div>
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
                </div>
                <br/>
            </div>);
        } else {
            return (<div>
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
            </div>);
        }
    }

    render() {
        const species = SpeciesHelper.getSpeciesByType(character.species);

        const nameDescription = species.nameDescription;

        const nameSuggestions = species.nameSuggestions;
        let names = [];

        nameSuggestions.forEach(n => {
            names.push(`${n.type}: ${n.suggestions}`);
        });

        const suggestions = names.map((n, i) => {
            return (<div key={'name-' + i}>{`${n}${i < names.length - 1 ? "," : ""} `}</div>);
        });

        const values = this.renderValues();

        let extra = (<div></div>);
        if (character.isKlingon()) {
            extra = (<div><div className="panel">
                <SmallHeader>LINEAGE and House</SmallHeader>
                <div className="textinput-label">Lineage</div>
                <input type="text" onChange={() => this.onLineageChanged() } ref={(input) => this.lineage = input}/>
                <div><small><b>Example: </b> <i>Daughter of Martok</i> or <i>Child of Koloth</i></small></div>
                <div className="textinput-label">House</div>
                <input type="text" onChange={() => this.onHouseChanged() } ref={(input) => this.house = input}/>
                <div><small><b>Example: </b> <i>House Duras</i> or <i>House Kor</i></small></div>
            </div></div>);
        }

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                <div className="page-text">
                    Your character is finished. Export your character to PDF, or use the "Profile" option in the left-hand bar to see the chosen options and
                    transcribe them manually on to a character sheet.
                </div>
                <div className="panel">
                    <div className="header-small">NAME</div>
                    <div>{nameDescription}</div>
                    <div className="textinput-label">NAME</div>
                    <input type="text" onChange={() => this.onNameChanged() } ref={(input) => this.name = input}/>
                    <div><small><b>Suggestions: </b> <i>{suggestions}</i></small></div>
                </div>
                {extra}
                <div className="panel">
                    <div className="header-small">PRONOUNS</div>
                    <div className="textinput-label">Pronouns</div>
                    <input type="text" onChange={() => this.onPronounsChanged() } ref={(input) => this.pronouns = input}/>
                    <div><small><b>Suggestions: </b> <i>she/her, they/them, etc.</i></small></div>
                </div>
                <div className="panel">
                    <div className="header-small">ADDITIONAL TRAITS</div>
                    <div>Your character automatically has the following {character.baseTraits.length === 1 ? 'trait' : 'traits'}:</div>
                    <ul>
                        {character.baseTraits.map((e,i) => { return (<li key={'trait-' + i}>{e}</li>); })}
                    </ul>

                    <div>You can specify additional traits, here.</div>
                    <div className="textinput-label">Traits</div>
                    <input type="text" onChange={() => this.onTraitsChanged() } ref={(input) => this.traits = input}/>
                </div>
                {this.renderAssignment()}
                {this.renderRank()}
                <br/>
                {values}
                <div className="panel">
                </div>
                <br/>
                <div className="button-container mb-5">
                    <Button text="Export to PDF" className="button-small mr-2" onClick={() => this.showDialog() }  buttonType={true} />
                    <Button text="View" className="button-small mr-2" onClick={() => this.showViewPage() } buttonType={true} />
                </div>
            </div>
        );
    }

    showViewPage() {
        const value = marshaller.encodeMainCharacter(character);
        window.open('/view?s=' + value, "_blank");
    }

    renderAssignment() {

        const multiDiscipline = character.hasTalent("Multi-Discipline")
            ? <div className="text-white">Because your character has the <b>Multi-Discipline talent</b>, you may choose <b>two roles</b>.
                Some options (e.g. Commanding Officer, Admiral) are excluded from the available roles.</div>
            : undefined;

        const roleList = this.roles.map((r, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header-small">{r.name}</td>
                    <td>{replaceDiceWithArrowhead(r.description)}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={r.name}
                            isChecked={this.role === r.name || this.secondaryRole === r.name}
                            onChanged={(val) => {
                                this.onSelectRole(val);
                            } }/>
                    </td>
                </tr>
            )
        });

        const roles = this.state.roleSelectionAllowed === true || this.state.roleSelectionAllowed == null || character.hasTalent("Multi-Discipline")
            ? (<table className="selection-list">
                    <tbody>
                        {roleList}
                    </tbody>
                </table>)
            : undefined;

        const roleSelection = (this.state.roleSelectionAllowed != null && !character.hasTalent("Multi-Discipline"))
            ? (<CheckBox
                text="Allow character to have a role (GM's decision)"
                value={this.state.roleSelectionAllowed}
                isChecked={this.state.roleSelectionAllowed}
                onChanged={(val) => this.onRoleSelectionAllowedChange(!this.state.roleSelectionAllowed) }
                />)
            : undefined;

        const job = (roles == null)
            ? (<div>
                    <div className="textinput-label">Job</div>
                    <input type="text" onChange={(e) => this.onJobChanged(e.target.value) } value={this.state.jobAssignment || ""} />
                </div>)
            : undefined;

        const cadetNote = (roles == null && character.type === CharacterType.Cadet)
            ? (<div className="text-white">Cadets do not normally have a key role and instead have a simple job assignment. Cadets might be given a role in special circumstances.</div>)
            : null;

        const roleDescription = (roles != null)
        ? (<div className="text-white">
                Select the role your character has on the starship they service.
                This choice will be based on your highest discipline(s).
                The most suitable choice will appear on top, while the other options will be available as well in case you want to create a different character.
            </div>)
        : undefined;

        return (
        <div className="mt-3">
            <SmallHeader>ASSIGNMENT</SmallHeader>
            {cadetNote}
            {roleDescription}
            {roleSelection}
            {multiDiscipline}
            {roles}
            {job}

            <div>
                <InputFieldAndLabel id='ship-id' labelName='Ship' onChange={(value) => this.onShipChanged(value)} value={this.state.assignedShip || ""} />
            </div>
        </div>);
    }

    renderRank() {
        if (character.isCivilian() || character.age.isChild()) {
            return null;
        } else if (character.type === CharacterType.AlliedMilitary && character.typeDetails
            && (character.typeDetails as AlliedMilitaryDetails).alliedMilitary.type === AlliedMilitaryType.OTHER) {

                return (<div className="panel">
                        <div className="header-small">RANK</div>
                        <div>What is your character's rank?</div>
                        <input type="text" onChange={(e) => this.onSelectRank(e.target.value) } />
                    </div>
           );
        } else {
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

            return (<div className="panel">
                        <div className="header-small">RANK</div>
                        <div>Select your character's rank.</div>
                        <table className="selection-list">
                            <tbody>
                                {ranks}
                            </tbody>
                        </table>
                    </div>
                );
        }
    }

    private onRoleSelectionAllowedChange(allowed: boolean) {
        if (allowed) {
            if (this.roles && this.roles.length > 0 && character.role == null) {
                character.role = this.roles[0].name;
                character.jobAssignment = "";
                this.role = this.roles[0].name;
            }
            this.setState((state) => ({
                ...state,
                roleSelectionAllowed: allowed,
                jobAssignment: ""
            }));
        } else {
            character.role = undefined;
            this.role = undefined;
            this.setState((state) => ({
                ...state,
                roleSelectionAllowed: allowed
            }));
        }
    }

    private onShipChanged(ship: string) {
        character.assignedShip = ship;
        this.setState((state) => ({
            ...state,
            assignedShip: ship
        }))
    }

    private onJobChanged(job: string) {
        character.jobAssignment = job;
        this.setState((state) => ({
            ...state,
            jobAssignment: job
        }))
    }


    private showDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(character), "sta-character");
    }


    private onNameChanged() {
        character.name = this.name.value;
        this.forceUpdate();
    }

    private onPronounsChanged() {
        character.pronouns = this.pronouns.value;
        this.forceUpdate();
    }

    private onTraitsChanged() {
        character.additionalTraits = this.traits.value;
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

        RanksHelper.instance().getRanks(false).forEach(rank => {
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

        if (!character.isCivilian() || character.age.isChild()) {
            character.rank = this.ranks[0];
        } else {
            character.rank = '';
        }
    }
}
