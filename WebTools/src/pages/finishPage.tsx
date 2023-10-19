import React from 'react';
import {AlliedMilitaryDetails, Character} from '../common/character';
import {CharacterType} from '../common/characterType';
import {Button} from '../components/button';
import {CheckBox} from '../components/checkBox';
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
import { soloCharacterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import store from '../state/store';
import { setCharacterAdditionalTraits, setCharacterAssignedShip, setCharacterAssignment, setCharacterHouse, setCharacterLineage, setCharacterName, setCharacterPronouns, setCharacterRank } from '../state/characterActions';
import AllCharacterValues from '../components/allCharacterValues';

interface IFinishPageState {
    roleSelectionAllowed: boolean|null;
}

interface IFinishPageProperties extends WithTranslation {
    character: Character;
}

class FinishPage extends React.Component<IFinishPageProperties, IFinishPageState> {
    private ranks: RankModel[];
    private roles: RoleModel[];

    constructor(props: IFinishPageProperties) {
        super(props);
        this.ranks = [];
        this.roles = [];
        this.state = {
            roleSelectionAllowed: null
        };
    }

    componentDidMount(): void {
        console.log("componentDidMount");
        this.getRanks();

        RolesHelper.instance.getRoles(this.props.character).forEach(role => {
            this.roles.push(role);
        });

        if (this.props.character.type !== CharacterType.Cadet) {
            const role = this.roles[0];
            store.dispatch(setCharacterAssignment(role.id));
            this.setState((state) => ({ ...state,
                roleSelectionAllowed: null
            }));
        } else {
            this.setState((state) => ({ ...state,
                roleSelectionAllowed: false
            }));
        }

    }


    render() {
        const { t, character } = this.props;

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

        let extra = null;
        if (character.isKlingon()) {
            extra = (<div className="my-4">
                <Header level={2}>LINEAGE and House</Header>
                <div className="row">
                    <div className="col-lg-6 mb-3">
                        <InputFieldAndLabel labelName="Lineage" id="lineage" onChange={(value) => this.onLineageChanged(value)} value={this.props.character.lineage ?? ""} />
                        <div className="text-white mt-1"><small><b>Example: </b> <i>Daughter of Martok</i> or <i>Child of Koloth</i></small></div>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <InputFieldAndLabel labelName="House" id="house" onChange={(value) => this.onHouseChanged(value)} value={this.props.character.house ?? ""} />
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
                    <InputFieldAndLabel labelName={t('Construct.other.name')} id="name" onChange={(value) => this.onNameChanged(value)} value={this.props.character.name ?? ""} />
                    <div className="text-white mt-1"><small><b>Suggestions: </b> <i>{suggestions}</i></small></div>

                    <div className="mt-3">
                        <InputFieldAndLabel labelName={t('Construct.other.pronouns')} id="pronouns" onChange={(value) => this.onPronounsChanged(value)} value={this.props.character.pronouns ?? ""} />
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
                        <InputFieldAndLabel labelName={t('Construct.other.traits')} id="traits" value={this.props.character?.additionalTraits ?? ""} onChange={(value) => this.onTraitsChanged(value)} />

                    </div>
                </div>
                {this.renderAssignment()}
                <AllCharacterValues />
                <div className="button-container mb-5">
                    <Button text={t('Common.button.exportPdf')} className="button-small mr-2" onClick={() => this.showDialog() }  buttonType={true} />
                    <Button text={t('Common.button.view')} className="button-small mr-2" onClick={() => this.showViewPage() } buttonType={true} />
                </div>
            </div>
        );
    }

    showViewPage() {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            const value = marshaller.encodeMainCharacter(c);
            window.open('/view?s=' + value, "_blank");
        });
    }

    renderAssignment() {
        const { t, character } = this.props;

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
                            isChecked={character.role === r.id || character.secondaryRole === r.id}
                            onChanged={(val) => {
                                this.onSelectRole(r);
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
                    <input type="text" onChange={(e) => this.onJobChanged(e.target.value) } value={this.props.character.jobAssignment || ""} />
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
                <InputFieldAndLabel id='ship-id' labelName='Ship' onChange={(value) => this.onShipChanged(value)} value={this.props.character.assignedShip || ""} />
            </div>

            {roleSelection}
            {multiDiscipline}
            {roles}
            {job}

        </div>);
    }

    renderRank() {
        const { t, character } = this.props;

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
        const { character } = this.props;
        if (allowed) {
            if (this.roles && this.roles.length > 0 && character.role == null) {
                store.dispatch(setCharacterAssignment(this.roles[0].name, this.roles[0].id));
            }
            this.setState((state) => ({
                ...state,
                roleSelectionAllowed: allowed
            }));
        } else {
            store.dispatch(setCharacterAssignment(undefined));
            this.setState((state) => ({
                ...state,
                roleSelectionAllowed: allowed
            }));
        }
    }

    private onShipChanged(ship: string) {
        store.dispatch(setCharacterAssignedShip(ship));
    }

    private onJobChanged(job: string) {
        store.dispatch(setCharacterAssignment(job));
    }


    private showDialog() {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(c), "sta-character", c);
        });
    }


    private onNameChanged(value: string) {
        store.dispatch(setCharacterName(value));
    }

    private onPronounsChanged(value: string) {
        store.dispatch(setCharacterPronouns(value));
    }

    private onTraitsChanged(value: string) {
        store.dispatch(setCharacterAdditionalTraits(value));
    }

    private onLineageChanged(value: string) {
        store.dispatch(setCharacterLineage(value));
    }

    private onHouseChanged(value: string) {
        store.dispatch(setCharacterHouse(value));
    }

    private onSelectRank(rank: RankModel|string) {
        if (typeof rank === "string") {
            store.dispatch(setCharacterRank(rank as string));
        } else {
            let r = rank as RankModel;
            store.dispatch(setCharacterRank(r.name, r.id));
        }
    }

    private onSelectRole(role: RoleModel) {
        const { character } = this.props;
        if (character.hasTalent("Multi-Discipline")) {
            if (character.role === null || character.role === role.id) {
                store.dispatch(setCharacterAssignment(role.id, character.secondaryRole));
            } else if (character.secondaryRole == null || character.secondaryRole === role.id) {
                store.dispatch(setCharacterAssignment(character.role, role.id));
            } else {
                store.dispatch(setCharacterAssignment(character.secondaryRole, role.id));
            }
        } else {
            store.dispatch(setCharacterAssignment(role.id));
        }
        this.getRanks();
    }

    private getRanks() {
        const { character } = this.props;
        this.ranks = RanksHelper.instance().getRanks(character, false);

        if (character.isCivilian || character.age.isChild()) {
            if (character.rank != null) {
                store.dispatch(setCharacterRank(undefined));
            }
        } else if (this.ranks.length > 0 && (character.rank == null || this.ranks.filter(r => r.id === character.rank.id).length === 0)) {
            let rank = this.ranks[0];
            store.dispatch(setCharacterRank(rank.name, rank.id));
        }
    }
}

export default withTranslation()(connect(soloCharacterMapStateToProperties)(FinishPage));