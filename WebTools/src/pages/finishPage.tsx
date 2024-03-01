import React, { useEffect, useState } from 'react';
import {AlliedMilitaryDetails, Character} from '../common/character';
import {CharacterType} from '../common/characterType';
import {Button} from '../components/button';
import {CheckBox} from '../components/checkBox';
import {ANY_NAMES, SpeciesHelper} from '../helpers/species';
import {Rank, RankModel, RanksHelper} from '../helpers/ranks';
import {RolesHelper, RoleModel, Role} from '../helpers/roles';
import {CharacterSheetDialog} from '../components/characterSheetDialog'
import {CharacterSheetRegistry} from '../helpers/sheets';
import { AlliedMilitaryType } from '../helpers/alliedMilitary';
import replaceDiceWithArrowhead from '../common/arrowhead';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { marshaller } from '../helpers/marshaller';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { Header } from '../components/header';
import { useTranslation } from 'react-i18next';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import store from '../state/store';
import { setCharacterAdditionalTraits, setCharacterAssignedShip, setCharacterAssignment, setCharacterHouse, setCharacterLineage, setCharacterName, setCharacterPronouns, setCharacterRank } from '../state/characterActions';
import AllCharacterValues from '../components/allCharacterValues';
import { PageIdentity } from './pageIdentity';
import ReactMarkdown from 'react-markdown';

interface IFinishPageProperties {
    character: Character;
}

const FinishPage: React.FC<IFinishPageProperties> = ({character}) => {
    const { t } = useTranslation();
    const [ roleSelectionAllowed, setRoleSelectionAllowed] = useState(null);
    const [ roleOther, setRoleOther] = useState(character.jobAssignment);

    const currentRole = character.role;

    let roleList = RolesHelper.instance.getRoles(character);
    let rankList = RanksHelper.instance().getSortedRanks(character, false);

    useEffect(() => {
        if (character.role == null && (!character.jobAssignment)) {
            if (character.type !== CharacterType.Cadet) {
                const role = roleList[0];
                store.dispatch(setCharacterAssignment(role.id));
                setRoleSelectionAllowed(null);
            } else {
                setRoleSelectionAllowed(false);
            }
        } else if (!character.isCivilian() && rankList?.length > 0) {
            let existingRank = rankList.filter(r => r.id === character.rank?.id);
            if (character.rank == null || existingRank.length === 0) {
                const rank = rankList[rankList.length - 1];
                store.dispatch(setCharacterRank(rank.name, rank.id));
            }
        }
    }, [currentRole]);

    const showViewPage = () => {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            const value = marshaller.encodeMainCharacter(c);
            window.open('/view?s=' + value, "_blank");
        }, 200);
    }

    const renderAssignment = (roleList: RoleModel[]) => {

        const multiDiscipline = character.hasTalent("Multi-Discipline")
            ? <p>Because your character has the <b>Multi-Discipline talent</b>, you may choose <b>two roles</b>.
                Some options (e.g. Commanding Officer, Admiral) are excluded from the available roles.</p>
            : undefined;

        const roleRows = roleList.map((r, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header-small">{r.localizedName}</td>
                    <td>{replaceDiceWithArrowhead(r.localizedDescription)}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={r.name}
                            isChecked={character.role === r.id || character.secondaryRole === r.id}
                            onChanged={(val) => {
                                onSelectRole(r);
                            } }/>
                    </td>
                </tr>
            )
        });

        const roles = (<table className="selection-list">
                <tbody>
                    {roleSelectionAllowed === true || roleSelectionAllowed == null || character.hasTalent("Multi-Discipline") ? roleRows : undefined}
                    {character.hasTalent("Multi-Discipline")
                        ? undefined
                        : (<tr>
                            <td className="selection-header-small">{t('Common.text.other')}</td>
                            <td>
                                <InputFieldAndLabel id='roleOther'
                                    labelName={t('Construct.other.job')}
                                    onChange={(value) => {
                                        if (!value) {
                                            value = t('Common.text.other');
                                        }
                                        setRoleOther(value);
                                        onSelectRole(undefined, value);
                                    }}
                                    placeholder={t('FinishPage.job.example')}
                                    value={roleOther} />
                            </td>
                            <td>
                                <CheckBox
                                    text=""
                                    value={t('Common.text.other')}
                                    isChecked={character.role == null && character.jobAssignment === roleOther}
                                    onChanged={(val) => {
                                        let job = roleOther;
                                        if (!job) {
                                            job = t('Common.text.other');
                                            setRoleOther(job);
                                        }
                                        onSelectRole(undefined, job);
                                    } }/>
                            </td>
                        </tr>)}
                </tbody>
            </table>);

        const roleSelection = (roleSelectionAllowed != null && !character.hasTalent("Multi-Discipline"))
            ? (<CheckBox
                text="Allow character to have a role (GM's decision)"
                value={roleSelectionAllowed}
                isChecked={roleSelectionAllowed}
                onChanged={(val) => onRoleSelectionAllowedChange(!roleSelectionAllowed) }
                />)
            : undefined;

        const cadetNote = (roles == null && character.type === CharacterType.Cadet)
            ? (<p>Cadets do not normally have a key role and instead have a simple job assignment. Cadets might be given a role in special circumstances.</p>)
            : null;

        const roleDescription = (roleSelectionAllowed === true || roleSelectionAllowed == null || character.hasTalent("Multi-Discipline"))
            ? (<ReactMarkdown>{t('FinishPage.role.instruction')}</ReactMarkdown>)
            : undefined;

        return (
        <div className="mt-3">
            <Header level={2}>{t('Construct.other.assignment')}</Header>

            {cadetNote}
            {roleDescription}

            <div className="mb-3">
                <InputFieldAndLabel id='ship-id' labelName='Ship' onChange={(value) => onShipChanged(value)} value={character.assignedShip || ""} />
            </div>

            {roleSelection}
            {multiDiscipline}
            {roles}

        </div>);
    }


    const renderRank = () => {

        if (character.isCivilian() || character.age.isChild) {
            return null;
        } else if (character.type === CharacterType.AlliedMilitary && character.typeDetails
            && (character.typeDetails as AlliedMilitaryDetails).alliedMilitary.type === AlliedMilitaryType.Other) {

                return (<div className="col-lg-6 my-5">
                        <Header level={2}>{t('Construct.other.rank')}</Header>
                        <div>What is your character's rank?</div>
                        <InputFieldAndLabel labelName={t('Construct.other.rank')} id="rank" value={character?.rank?.name}
                            onChange={(value) => onSelectRank(value) } />
                    </div>
           );
        } else {
            const ranks = rankList.map((r, i) => {
                return (
                    <tr key={i}>
                        <td className="selection-header-small">{r.localizedName}</td>
                        <td>
                            <CheckBox
                                text=""
                                value={r.id}
                                isChecked={character.rank?.id === r.id}
                                onChanged={(val) => {
                                    onSelectRank(r);
                                } }/>
                        </td>
                    </tr>
                )
            });

            return (<div className="col-lg-6 my-5">
                        <Header level={2}>{t('Construct.other.rank')}</Header>
                        <ReactMarkdown>{t('FinishPage.rank.instruction')}</ReactMarkdown>
                        <table className="selection-list">
                            <tbody>
                                {ranks}
                            </tbody>
                        </table>
                    </div>
                );
        }
    }

    const onRoleSelectionAllowedChange = (allowed: boolean) => {
        if (allowed) {
            if (roleList && roleList.length > 0 && character.role == null) {
                store.dispatch(setCharacterAssignment(roleList[0].name, roleList[0].id));
            }
            setRoleSelectionAllowed(allowed);
        } else {
            store.dispatch(setCharacterAssignment(undefined));
            setRoleSelectionAllowed(allowed);
        }
    }

    const onShipChanged = (ship: string) => {
        store.dispatch(setCharacterAssignedShip(ship));
    }

    const showDialog = () => {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(c), "sta-character", c);
        }, 200);
    }

    const onNameChanged = (value: string) => {
        store.dispatch(setCharacterName(value));
    }

    const onPronounsChanged = (value: string) => {
        store.dispatch(setCharacterPronouns(value));
    }

    const onTraitsChanged = (value: string) => {
        store.dispatch(setCharacterAdditionalTraits(value));
    }

    const onLineageChanged = (value: string) => {
        store.dispatch(setCharacterLineage(value));
    }

    const onHouseChanged = (value: string) => {
        store.dispatch(setCharacterHouse(value));
    }

    const onSelectRank = (rank: RankModel|string) => {
        if (typeof rank === "string") {
            store.dispatch(setCharacterRank(rank as string));
        } else {
            let r = rank as RankModel;
            store.dispatch(setCharacterRank(r.name, r.id));
        }
    }

    const onSelectRole = (role?: RoleModel, assignment?: string) => {
        /*
        if (character.rank?.id === Rank.Ensign && role != null
            && [Role.ChiefMedicalOfficer, Role.ChiefEngineer, Role.ChiefOfSecurity, Role.ExecutiveOfficer].indexOf(role.id) >= 0) {

            let validRanks = rankList.filter(r => r.id !== Rank.Ensign);
            if (validRanks.length) {
                store.dispatch(setCharacterRank(validRanks[0].localizedName, validRanks[0].id));
            }
        }
        */

        if (role == null && assignment) {
            store.dispatch(setCharacterAssignment(assignment));
        } else if (character.hasTalent("Multi-Discipline")) {
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
    }

    const species = SpeciesHelper.getSpeciesByType(character.speciesStep?.species);

    const nameDescription = species == null ? "Custom species might have any naming protocol." : species.localizedNameDescription;

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
                    <InputFieldAndLabel labelName="Lineage" id="lineage" onChange={(value) => onLineageChanged(value)} value={character.lineage ?? ""} />
                    <div className="text-white mt-1"><small><b>Example: </b> <i>Daughter of Martok</i> or <i>Child of Koloth</i></small></div>
                </div>
                <div className="col-lg-6 mb-3">
                    <InputFieldAndLabel labelName="House" id="house" onChange={(value) => onHouseChanged(value)} value={character.house ?? ""} />
                    <div className="text-white mt-1"><small><b>Example: </b> <i>House Duras</i> or <i>House Kor</i></small></div>
                </div>
            </div>
        </div>);
    }

    return (
        <div className="page container ms-0">
            <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.Finish} />
            <main>
                <Header>{t('Page.title.finish')}</Header>
                <ReactMarkdown>{t('FinishPage.instruction')}</ReactMarkdown>
                <div className="my-4">
                    <Header level={2}>{t('Construct.other.name')}</Header>
                    <p>{nameDescription}</p>
                    <InputFieldAndLabel labelName={t('Construct.other.name')} id="name" onChange={(value) => onNameChanged(value)} value={character.name ?? ""} />
                    <div className="text-white mt-1"><small><b>{t('Common.text.suggestions')}: </b> <i>{suggestions}</i></small></div>

                    <div className="mt-3">
                        <InputFieldAndLabel labelName={t('Construct.other.pronouns')} id="pronouns" onChange={(value) => onPronounsChanged(value)} value={character.pronouns ?? ""} />
                        <div className="text-white mt-1"><small><b>{t('Common.text.suggestions')}: </b> <i>she/her, they/them, etc.</i></small></div>
                    </div>
                </div>
                {extra}

                <div className="row">

                    {renderRank()}
                    <div className="col-lg-6 my-5">
                        <Header level={2}>{t('Construct.other.additionalTraits')}</Header>
                        <ReactMarkdown>{t(character.baseTraits.length === 1 ? 'FinishPage.trait.preamble_one' : 'FinishPage.trait.preamble_other')}</ReactMarkdown>
                        <ul>
                            {character.baseTraits.map((e,i) => { return (<li key={'trait-' + i}>{e}</li>); })}
                        </ul>

                        <ReactMarkdown>{t('FinishPage.trait.instruction')}</ReactMarkdown>
                        <InputFieldAndLabel labelName={t('Construct.other.traits')} id="traits" value={character?.additionalTraits ?? ""} onChange={(value) => onTraitsChanged(value)} />

                    </div>
                </div>
                {renderAssignment(roleList)}
                <AllCharacterValues />
                <div className="button-container mb-5">
                    <Button className="button-small me-2" onClick={() => showDialog() } >{t('Common.button.exportPdf')}</Button>
                    <Button className="button-small me-2" onClick={() => showViewPage() }>{t('Common.button.view')}</Button>
                </div>
            </main>
        </div>
    );
}

export default connect(characterMapStateToProperties)(FinishPage);