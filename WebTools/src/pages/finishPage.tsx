import * as React from 'react';
import {AlliedMilitaryDetails, CharacterRank, character} from '../common/character';
import {CharacterType} from '../common/characterType';
import {Button} from '../components/button';
import {CheckBox} from '../components/checkBox';
import ValueInput, {Value} from '../components/valueInput';
import {ANY_NAMES, SpeciesHelper} from '../helpers/species';
import {RankModel, RanksHelper} from '../helpers/ranks';
import {RolesHelper, RoleModel} from '../helpers/roles';
import {CharacterSheetDialog} from '../components/characterSheetDialog'
import {CharacterSheetRegistry} from '../helpers/sheets';
import { AlliedMilitaryType } from '../helpers/alliedMilitary';
import replaceDiceWithArrowhead from '../common/arrowhead';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { marshaller } from '../helpers/marshaller';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { Header } from '../components/header';
import { withTranslation, WithTranslation } from 'react-i18next';


interface IFinishPageState {
    roleSelectionAllowed: boolean|null;
    jobAssignment?: string;
    assignedShip?: string;
    name?: string;
    pronouns?: string;
    traits?: string;
    lineage?: string;
    house?: string;
}

class FinishPage extends React.Component<WithTranslation, IFinishPageState> {
    private ranks: RankModel[];
    private roles: RoleModel[];
    private role: string;
    private secondaryRole: string;

    constructor(props: WithTranslation) {
        super(props);

        this.roles = [];
        RolesHelper.getRoles(character).forEach(role => {
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
            character.rank = undefined;
        }
    }

    renderValues() {
        const { t } = this.props;
        if (character.age.isChild() || character.type === CharacterType.Cadet) {
            return (<div className="my-5">
                    <Header level={2}>{t('Construct.other.values')}</Header>
                    <p>
                        If you did not define your values during character creation,
                        or if you want to change any of them,
                        now is the time to think about the values your character goes by.
                    </p>
                    <div className="row">
                        <div className="col-lg-6 py-2">
                            <ValueInput value={Value.Environment} text={character.environmentValue} onChange={() => { this.forceUpdate(); } } />
                        </div>
                        <div className="col-lg-6 py-2">
                            <ValueInput value={Value.Track} text={character.trackValue} onChange={() => { this.forceUpdate(); } }/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 py-2">
                            <ValueInput value={Value.Career} text={character.careerValue} onChange={() => { this.forceUpdate(); } }/>
                        </div>
                    </div>
            </div>);
        } else {
            return (<div className="my-5">
                    <Header level={2}>{t('Construct.other.values')}</Header>
                    <p>
                        If you did not define your values during character creation,
                        or if you want to change any of them,
                        now is the time to think about the values your character goes by.
                    </p>
                    <div className="row">
                        <div className="col-lg-6 py-2">
                            <ValueInput value={Value.Environment} text={character.environmentValue} onChange={() => { this.forceUpdate(); } } />
                        </div>
                        <div className="col-lg-6 py-2">
                            <ValueInput value={Value.Track} text={character.trackValue} onChange={() => { this.forceUpdate(); } }/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 py-2">
                            <ValueInput value={Value.Career} text={character.careerValue} onChange={() => { this.forceUpdate(); } }/>
                        </div>
                        <div className="col-lg-6 py-2">
                            <ValueInput value={Value.Finish} text={character.finishValue} onChange={() => { this.forceUpdate(); } }/>
                        </div>
                    </div>
            </div>);
        }
    }

    render() {
        const { t } = this.props;

        const species = SpeciesHelper.getSpeciesByType(character.speciesStep?.species);

        const nameDescription = species == null ? "Custom species might have any naming protocol." : species.nameDescription;

        const nameSuggestions = species?.nameSuggestions ?? ANY_NAMES;
        let names = [];

        nameSuggestions?.forEach(n => {
            names.push(`${n.type}: ${n.suggestions}`);
        });

        const suggestions = names.map((n, i) => {
            return (<div key={'name-' + i}>{`${n}${i < names.length - 1 ? "," : ""} `}</div>);
        });

        const values = this.renderValues();

        let extra = null;
        if (character.isKlingon()) {
            extra = (<div className="my-4">
                <Header level={2}>LINEAGE and House</Header>
                <div className="row">
                    <div className="col-lg-6 mb-3">
                        <InputFieldAndLabel labelName="Lineage" id="lineage" onChange={(value) => this.onLineageChanged(value)} value={this.state.lineage ?? ""} />
                        <div className="text-white mt-1"><small><b>Example: </b> <i>Daughter of Martok</i> or <i>Child of Koloth</i></small></div>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <InputFieldAndLabel labelName="House" id="house" onChange={(value) => this.onHouseChanged(value)} value={this.state.house ?? ""} />
                        <div className="text-white mt-1"><small><b>Example: </b> <i>House Duras</i> or <i>House Kor</i></small></div>
                    </div>
                </div>
            </div>);
        }

        return (
            <div className="page container ml-0">
                <CharacterCreationBreadcrumbs />
                <Header>{t('Page.title.finish')}</Header>
                <p>
                    Your character is finished. Export your character to PDF, or use the "Profile" option in the left-hand bar to see the chosen options and
                    transcribe them manually on to a character sheet.
                </p>
                <div className="my-4">
                    <Header level={2}>{t('Construct.other.name')}</Header>
                    <p>{nameDescription}</p>
                    <InputFieldAndLabel labelName={t('Construct.other.name')} id="name" onChange={(value) => this.onNameChanged(value)} value={this.state.name ?? ""} />
                    <div className="text-white mt-1"><small><b>Suggestions: </b> <i>{suggestions}</i></small></div>

                    <div className="mt-3">
                        <InputFieldAndLabel labelName={t('Construct.other.pronouns')} id="pronouns" onChange={(value) => this.onPronounsChanged(value)} value={this.state.pronouns ?? ""} />
                        <div className="text-white mt-1"><small><b>Suggestions: </b> <i>she/her, they/them, etc.</i></small></div>
                    </div>
                </div>
                {extra}

                <div className="row">
                    <div className="col-lg-6 my-5">
                        {this.renderRank()}
                    </div>
                    <div className="col-lg-6 my-5">
                        <Header level={2}>ADDITIONAL TRAITS</Header>
                        <p>Your character automatically has the following {character.baseTraits.length === 1 ? 'trait' : 'traits'}:</p>
                        <ul>
                            {character.baseTraits.map((e,i) => { return (<li key={'trait-' + i}>{e}</li>); })}
                        </ul>

                        <p>You can specify additional traits, here.</p>
                        <InputFieldAndLabel labelName={t('Construct.other.traits')} id="traits" value={this.state.traits ?? ""} onChange={(value) => this.onTraitsChanged(value)} />

                    </div>
                </div>
                {this.renderAssignment()}
                {values}
                <div className="button-container mb-5">
                    <Button text={t('Common.button.exportPdf')} className="button-small mr-2" onClick={() => this.showDialog() }  buttonType={true} />
                    <Button text={t('Common.button.view')} className="button-small mr-2" onClick={() => this.showViewPage() } buttonType={true} />
                </div>
            </div>
        );
    }

    showViewPage() {
        const value = marshaller.encodeMainCharacter(character);
        window.open('/view?s=' + value, "_blank");
    }

    renderAssignment() {
        const { t } = this.props;

        const multiDiscipline = character.hasTalent("Multi-Discipline")
            ? <p>Because your character has the <b>Multi-Discipline talent</b>, you may choose <b>two roles</b>.
                Some options (e.g. Commanding Officer, Admiral) are excluded from the available roles.</p>
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
            ? (<p>Cadets do not normally have a key role and instead have a simple job assignment. Cadets might be given a role in special circumstances.</p>)
            : null;

        const roleDescription = (roles != null)
        ? (<p>
                Select character's role and the ship on which they serve.
                This choice will be based on your highest discipline(s).
                The most suitable choice will appear on top, while the other options will be available as well in case you want to create a different character.
            </p>)
        : undefined;

        return (
        <div className="mt-3">
            <Header level={2}>{t('Construct.other.assignment')}</Header>

            {cadetNote}
            {roleDescription}

            <div className="mb-3">
                <InputFieldAndLabel id='ship-id' labelName='Ship' onChange={(value) => this.onShipChanged(value)} value={this.state.assignedShip || ""} />
            </div>

            {roleSelection}
            {multiDiscipline}
            {roles}
            {job}

        </div>);
    }

    renderRank() {
        const { t } = this.props;

        if (character.isCivilian() || character.age.isChild()) {
            return null;
        } else if (character.type === CharacterType.AlliedMilitary && character.typeDetails
            && (character.typeDetails as AlliedMilitaryDetails).alliedMilitary.type === AlliedMilitaryType.Other) {

                return (<div>
                        <Header level={2}>{t('Construct.other.rank')}</Header>
                        <div>What is your character's rank?</div>
                        <InputFieldAndLabel labelName={t('Construct.other.rank')} id="rank" value={character?.rank?.name}
                            onChange={(value) => this.onSelectRank(value) } />
                    </div>
           );
        } else {
            const ranks = this.ranks.map((r, i) => {
                return (
                    <tr key={i}>
                        <td className="selection-header-small">{r.localizedName}</td>
                        <td>
                            <CheckBox
                                text=""
                                value={r.id}
                                isChecked={character.rank?.id === r.id}
                                onChanged={(val) => {
                                    this.onSelectRank(r);
                                } }/>
                        </td>
                    </tr>
                )
            });

            return (<div>
                        <Header level={2}>{t('Construct.other.rank')}</Header>
                        <p>Select your character's rank.</p>
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


    private onNameChanged(value: string) {
        character.name = value;
        this.setState((state) => ({...state, name: value}));
    }

    private onPronounsChanged(value: string) {
        character.pronouns = value;
        this.setState((state) => ({...state, pronouns: value}));
    }

    private onTraitsChanged(value: string) {
        character.additionalTraits = value;
        this.setState((state) => ({...state, traits: value}));
    }

    private onLineageChanged(value: string) {
        character.lineage = value;
        this.setState((state) => ({...state, lineage: value}));
    }

    private onHouseChanged(value: string) {
        character.house = value;
        this.setState((state) => ({...state, house: value}));
    }

    private onSelectRank(rank: RankModel|string) {
        if (typeof rank === "string") {
            character.rank = new CharacterRank(rank as string);
        } else {
            character.rank = new CharacterRank(rank.name, rank.id);
            this.forceUpdate();
        }
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
        this.ranks = RanksHelper.instance().getRanks(character, false);

        if (!character.isCivilian() || character.age.isChild()) {
            character.rank = new CharacterRank(this.ranks[0].name, this.ranks[0].id);
        } else {
            character.rank = undefined;
        }
    }
}

export default withTranslation()(FinishPage);