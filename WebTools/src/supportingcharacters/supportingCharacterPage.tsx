import React, { useEffect, useState } from 'react';
import {Character } from '../common/character';
import {CharacterType, CharacterTypeModel } from '../common/characterType';
import {SpeciesHelper} from '../helpers/species';
import {DropDownElement, DropDownSelect} from '../components/dropDownInput';
import SupportingCharacterAttributes from './supportingCharacterAttributes';
import SupportingCharacterDisciplines from './supportingCharacterDisciplines';
import {Rank, RanksHelper} from '../helpers/ranks';
import {Button} from '../components/button';
import {CharacterSheetDialog} from '../components/characterSheetDialog'
import {CharacterSheetRegistry} from '../helpers/sheets';
import AgeHelper from '../helpers/age';
import { Source } from '../helpers/sources';
import { marshaller } from '../helpers/marshaller';
import { Species } from '../helpers/speciesEnum';
import store from '../state/store';
import { hasSource } from '../state/contextFunctions';
import { Header } from '../components/header';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { useTranslation } from 'react-i18next';
import { ICharacterPageProperties } from '../common/iCharacterPageProperties';
import { connect } from 'react-redux';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { StepContext, setCharacter, setCharacterAge, setCharacterAssignment, setCharacterFocus, setCharacterName, setCharacterPronouns, setCharacterRank, setCharacterSpecies, setCharacterType, setCharacterValue, setSupportingCharacterSupervisorty } from '../state/characterActions';
import { localizedFocus } from '../components/focusHelper';
import { FocusRandomTableWithHints } from '../solo/table/focusRandomTable';
import D20IconButton from '../solo/component/d20IconButton';
import { CheckBox } from '../components/checkBox';
import ReactMarkdown from 'react-markdown';
import { ValueRandomTable } from '../solo/table/valueRandomTable';


const SupportingCharacterPage : React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();
    const [ showRank, setShowRank ] = useState(true);

    const showViewPage = () => {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            const value = marshaller.encodeSupportingCharacter(c);
            window.open('/view?s=' + value, "_blank");
        }, 200);
    }

    const getAges = () => {
        return AgeHelper.getAllChildAges().map((a, i) => new DropDownElement(i, a.name));
    }

    const selectAge = (index: number) => {
        store.dispatch(setCharacterAge(AgeHelper.getAllChildAges()[index]));
    }

    const showDialog = () => {
        setTimeout(() => {
            let c = store.getState().character.currentCharacter;
            CharacterSheetDialog.show(CharacterSheetRegistry.getSupportingCharacterSheet(c), "supporting-character", c);
        }, 200)
    }

    const selectSpecies = (selection: Species) => {
        if (selection !== Species.Custom) {
            let speciesModel = SpeciesHelper.getSpeciesByType(selection);
            if (speciesModel.attributes?.length <= 3) {
                store.dispatch(setCharacterSpecies(selection, speciesModel.attributes));
            } else {
                store.dispatch(setCharacterSpecies(selection));
            }
        } else {
            store.dispatch(setCharacterSpecies(selection));
        }
    }

    const getTypes = () => {
        return CharacterTypeModel.getAllTypes().map((t, i) => new DropDownElement(t.type, t.localizedName));
    }
    const getRanks = () => {
        var result = [];

        const ranks = RanksHelper.instance().getRanks(character, true)
            .filter(r => r.id !== Rank.Captain &&
                         r.id !== Rank.Commander &&
                         r.id !== Rank.LtCommander);

        ranks.forEach(r => {
            result.push(new DropDownElement(r.id, r.localizedName));
        });

        return result;
    }

    const selectRank = (rank: Rank) => {
        const ranks = RanksHelper.instance().getRanks(character, true).filter(r => r.id === rank);
        if (ranks.length) {
            store.dispatch(setCharacterRank(ranks[0].name, ranks[0].id));
        }
    }

    const selectType = (characterType: CharacterType) => {
        store.dispatch(setCharacterType(characterType as CharacterType));

        if (characterType === CharacterType.Child
            || characterType === CharacterType.AmbassadorDiplomat
            || characterType === CharacterType.Civilian
            || characterType === CharacterType.Tribble) {

            store.dispatch(setCharacterRank(undefined));
            setShowRank(false);
        } else if (character.type === CharacterType.Cadet) {
            let rank = RanksHelper.instance().getRank(Rank.CadetFourthClass);
            store.dispatch(setCharacterRank(rank.name, rank.id));
            setShowRank(true);
        } else {
            if (character.rank === null) {
                let rank = RanksHelper.instance().getRank(Rank.Lieutenant);
                store.dispatch(setCharacterRank(rank.name, rank.id));
                setShowRank(true);
            }
        }
    }

    const selectRandomFocus = (index: number) => {
        let done = false;
        while (!done) {
            let focus = localizedFocus(FocusRandomTableWithHints(character.supportingStep?.disciplines[0]));
            if (character.focuses.indexOf(focus) < 0) {
                done = true;
                store.dispatch(setCharacterFocus(focus, StepContext.FinishingTouches, index));
            }
        }
    }

    const selectRandomValue = () => {
        let done = false;
        while (!done) {
            let value = ValueRandomTable(character.speciesStep?.species, character.supportingStep?.disciplines[0]);
            if (character.values.indexOf(value) < 0) {
                done = true;
                store.dispatch(setCharacterValue(value, StepContext.FinishingTouches));
            }
        }
    }

    useEffect(() => {
        let character = Character.createSupportingCharacter(store.getState().context.era, hasSource(Source.Core2ndEdition) ? 2 : 1);
        store.dispatch(setCharacter(character));
    }, [])

    const getSpeciesList = () => {
        let speciesList = SpeciesHelper.getSpecies(CharacterType.Starfleet).map(s => { return new DropDownElement(s.id, s.localizedName) });
        speciesList.push(new DropDownElement(Species.Custom, t('Species.other.name')));

        return speciesList;
    }

    const characterAgeAsIndex = () => {
        let age = character.age;
        let result = -1;
        AgeHelper.getAllChildAges().forEach((a,i) => {
            if (a.name === age.name) {
                result = i
            }
        });
        return result;
    }

    const onSupervisoryChange = (value: boolean) => {
        store.dispatch(setSupportingCharacterSupervisorty(value));
    }

    const renderValues = () => {
        if (character?.supportingStep?.supervisory) {
            return (<div className="mt-4">
                <Header level={2}>{t("Construct.other.value")}</Header>
                <ReactMarkdown>{t("SupportingCharacter.valueInstruction")}</ReactMarkdown>
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                    <InputFieldAndLabel labelName={t('Construct.other.value')} value={character.supportingStep.value ?? ""}
                        id="value" onChange={(value) => {
                            store.dispatch(setCharacterValue(value, StepContext.FinishingTouches));
                        }} />
                    <div style={{ flexShrink: 0 }} className="mt-1">
                        <D20IconButton onClick={() => selectRandomValue()}/>
                    </div>
                </div>
            </div>)
        } else {
            return undefined;
        }
    }

    let ageDiv = hasSource(Source.PlayersGuide) && character?.age?.isChild
        ? (<div className="mt-4">
                <div className="page-text-aligned">
                    {t('SupportingCharacter.howOld')}
                </div>
                <div>
                    <DropDownSelect
                        items={getAges() }
                        defaultValue={characterAgeAsIndex()}
                        onChange={(index) => selectAge(index as number) }/>
                </div>
            </div>)
        : null;


    let supervisoryDiv = character && character?.type !== CharacterType.Child
        ? (<div className="mt-4">
                <div>
                    <CheckBox text={t('Construct.other.supervisory')}
                        isChecked={character?.supportingStep?.supervisory ?? false}
                        value={"supervisor"}
                        onChanged={v => onSupervisoryChange(v)}
                    />
                </div>
                <ReactMarkdown className="markdown-sm">{t('SupportingCharacter.supervisoryNote')}</ReactMarkdown>
            </div>)
        : null;

    return character ? (
        <div className="page container ms-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/index.html">{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.breadcrumb.supportingCharacterCreation')}</li>
                </ol>
            </nav>

            <div>
                <Header>{t('Page.title.supportingCharacter')}</Header>

                <div className="row">
                    <div className="col-12 col-lg-6 my-4">
                        <Header level={2}>{t('Construct.other.characterType')}</Header>
                        <p>{t('SupportingCharacter.whatType')}</p>
                        <div>
                            <DropDownSelect
                                items={getTypes() }
                                defaultValue={character.type}
                                onChange={(index) => selectType(index as CharacterType) }/>
                        </div>

                        {ageDiv}
                        {supervisoryDiv}
                    </div>
                    <div className="col-12 col-lg-6 my-4">
                        <Header level={2}>{t('SupportingCharacter.purposeOrDepartment')}</Header>
                        <p>
                            {t('SupportingCharacter.whatPurpose')}
                        </p>
                        <InputFieldAndLabel labelName={t('Construct.other.purpose')} value={character.jobAssignment ?? ""} onChange={(value) => {
                            store.dispatch(setCharacterAssignment(value));
                        }} id="purpose" />
                    </div>
                </div>
                <div className="mt-3">
                    <Header level={2}>{t('SupportingCharacter.speciesAndAttributes')}</Header>
                    <p>
                        {t('SupportingCharacter.speciesAndAttributesInstruction')}
                    </p>
                    <div className="mb-2">
                        <DropDownSelect
                            items={getSpeciesList()}
                            defaultValue={character?.speciesStep?.species}
                            onChange={(index) => selectSpecies(index as Species) }/>
                    </div>
                    {character.speciesStep?.species === Species.Custom
                    ? (<div className="mb-2">
                            <InputFieldAndLabel labelName={t('Construct.other.species')} value={character.speciesStep?.customSpeciesName ?? ''}
                            id="speciesName" onChange={(value) => {
                                store.dispatch(setCharacterSpecies(character.speciesStep.species, undefined, undefined, undefined, value));
                            }} />
                    </div>)
                    : null}
                    <div className="my-3">
                        <SupportingCharacterAttributes age={character.age}
                            species={character?.speciesStep?.species}
                            onUpdate={() => {  }}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-lg-6 my-3">

                    <div className="mt-2 mb-5">
                        <Header level={2}>{t('Construct.other.disciplines')}</Header>
                        <p>
                            {t('SupportingCharacter.disciplineInstruction')}
                        </p>
                        <SupportingCharacterDisciplines />
                    </div>

                    {renderValues()}
                </div>
                <div className="col-12 col-lg-6 mt-4 mb-5">
                    <Header level={2}>{t('Construct.other.focuses')}</Header>
                    <p>
                        {t('SupportingCharacter.focusInstruction')}
                    </p>
                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                        <InputFieldAndLabel labelName={t('Construct.other.focus1')} value={character.supportingStep.focuses[0] ?? ""}
                            id="focus1" onChange={(value) => {
                                store.dispatch(setCharacterFocus(value, StepContext.FinishingTouches, 0));
                            }} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomFocus(0)}/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                        <InputFieldAndLabel labelName={t('Construct.other.focus2')} value={character.supportingStep.focuses[1] ?? ""}
                            id="focus2" onChange={(value) => {
                                store.dispatch(setCharacterFocus(value, StepContext.FinishingTouches, 1));
                            }} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomFocus(1)}/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                        <InputFieldAndLabel labelName={t('Construct.other.focus3')} value={character.supportingStep.focuses[2] ?? ""}
                            id="focus3" onChange={(value) => {
                                store.dispatch(setCharacterFocus(value, StepContext.FinishingTouches, 2));
                            }} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomFocus(2)}/>
                        </div>
                    </div>

                    {character?.supportingStep?.supervisory
                        ? (<div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                            <InputFieldAndLabel labelName={t('Construct.other.focus4')} value={character.supportingStep.focuses[3] ?? ""}
                                id="focus4" onChange={(value) => {
                                    store.dispatch(setCharacterFocus(value, StepContext.FinishingTouches, 3));
                                }} />
                            <div style={{ flexShrink: 0 }} className="mt-1">
                                <D20IconButton onClick={() => selectRandomFocus(3)}/>
                            </div>
                        </div>)
                        : undefined}
                    <Header level={2} className="mt-5">{t('SupportingCharacter.nameAndRank')}</Header>
                    <p>
                        {t('SupportingCharacter.nameAndRankInstruction')}
                    </p>
                    {showRank
                        ?
                            (<div style={{borderBottom:"1px solid rgba(128, 128, 128, 0.4)", marginBottom:"10px",paddingBottom:"18px"}}>
                                <DropDownSelect
                                    items={getRanks() }
                                    defaultValue={character.rank?.id}
                                    onChange={(rank) => selectRank(rank as Rank) }/>
                            </div>)
                        : null}
                    <div className="mb-2">
                        <InputFieldAndLabel labelName={t('Construct.other.name')} value={character.name ?? ""}
                            id="name" onChange={(value) => {
                                store.dispatch(setCharacterName(value));
                            }} />
                    </div>
                    <div className="mb-2">
                        <InputFieldAndLabel labelName={t('Construct.other.pronouns')} value={character.pronouns ?? ""}
                            id="pronouns" onChange={(value) => {
                                store.dispatch(setCharacterPronouns(value));
                            }} />
                    </div>
                </div>
            </div>
            <div className="button-container mt-4">
                <Button className="button-small me-2 mb-2" onClick={() => showDialog() } >{t('Common.button.exportPdf')}</Button>
                <Button className="button-small me-2 mb-2" onClick={() => showViewPage() }>{t('Common.button.view')}</Button>
            </div>
        </div>
    ) : undefined;

}

export default connect(characterMapStateToProperties)(SupportingCharacterPage);