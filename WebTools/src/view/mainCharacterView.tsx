import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Era } from "../helpers/eras";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { Button } from "../components/button";
import { CharacterSheetDialog } from "../components/characterSheetDialog";
import { Header } from "../components/header";
import { CharacterSerializer } from "../common/characterSerializer";
import { CharacterType } from "../common/characterType";
import { useTranslation } from 'react-i18next';
import { getNameAndShortRankOf } from "../helpers/ranks";
import { StatView } from "../components/StatView";
import store from "../state/store";
import { setCharacter } from "../state/characterActions";
import { Character } from "../common/character";
import CharacterStatBlock from "./characterStatBlock";
import ValuesBlockView from "./valuesBlockView";
import TalentsBlockView from "./talentsBlockView";
import StressOrShieldsView from "./stressOrShieldsView";
import FocusBlockView from "./focusBlockView";
import WeaponBlockView from "./weaponBlockView";
import { VttSelectionDialog } from "../vtt/view/VttSelectionDialog";

export interface ICharacterViewProperties {
    character: Character;
    showButtons?: boolean;
}

const MainCharacterView: React.FC<ICharacterViewProperties> = ({character, showButtons}) => {

    useEffect(() => {
        if (character.name) {
            if (character.rank) {
                document.title = character.rank?.localizedName + " " + character.name + " - STAR TREK ADVENTURES";
            } else {
                document.title = character.name + " - STAR TREK ADVENTURES";
            }
        }
    }, [character.rank, character.name]);

    const { t } = useTranslation();
    const navigate = useNavigate();

    function renderStats() {
        return (<>
            <CharacterStatBlock character={character} />
            <div className="row row-cols-1 row-cols-md-3 mt-3">
                <StatView name={t('Construct.other.resistance')} value={character.resistance} className="col mb-1" colourClass="pink" showZero={true}/>
                <StatView name={t('Construct.other.reputation')} value={character.reputation} className="col mb-1" colourClass="pink" showZero={true}/>
                <StatView name={t('Construct.other.reprimands')} value={character.reprimands} className="col mb-1" colourClass="red" showZero={true}/>
            </div>
        </>)
    }

    function navigateToModification() {
        store.dispatch(setCharacter(character));
        navigate("/modify");
    }

    function renderTopFields() {
        return (<>
            <Header className="mb-4">{(character.name ? getNameAndShortRankOf(character) : "Unnamed Character")}</Header>

            {renderKlingonFields()}

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.species')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.speciesName}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.rank')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.rank?.localizedName}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.upbringing')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.upbringingStep ? character.upbringingStep.description : ""}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.environment')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{CharacterSerializer.serializeEnvironment(character.environmentStep?.environment, character.environmentStep?.otherSpecies, character.type)}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.pronouns')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.pronouns ? character.pronouns  : undefined}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.assignment')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{renderAssignment()}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.traits')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{character.getAllTraits()}</div></div>
            </div>
        </>)

    }


    function renderKlingonFields() {
        if (character.type === CharacterType.KlingonWarrior) {
            return (<div className="row" style={{alignItems: "baseline"}}>
                    <div className="col-md-2 view-field-label pb-2">Lineage:</div>
                    <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.lineage}</div></div>

                    <div className="col-md-2 view-field-label pb-2">House:</div>
                    <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.house}</div></div>
                </div>);
        } else {
            return undefined;
        }
    }

    function renderAssignment() {
        return character.assignment;
    }

    function renderEquipment() {
        if (character.equipmentAndImplants) {
            return character.equipmentAndImplants.map((e, i) => (<div className="text-white view-border-bottom py-2" key={'equipment-' + i}>{e}</div>));
        } else {
            return undefined;
        }
    }

    function showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(character, Era.NextGeneration), "sta-character", character);
    }

    function showVttExportDialog() {
        VttSelectionDialog.instance.show(character);
    }

    return (<main>
        {renderTopFields()}

        <div className="row">
            <div className="col-xl-6 mt-4">
                {renderStats()}

                <ValuesBlockView character={character} />
                <TalentsBlockView character={character} />

            </div>


            <div className="col-xl-6">
                <div className="row">

                    <div className="col-xl-6 mt-4">
                        <Header level={2}>{t('Construct.other.stress')}</Header>
                        <StressOrShieldsView value={character.stress} />
                    </div>

                    <div className="col-xl-6 mt-4">
                        <Header level={2}>{t('Construct.other.focuses')}</Header>
                        <FocusBlockView character={character} />
                    </div>

                </div>

                <div>
                    <WeaponBlockView construct={character} />

                    <Header level={2} className="mt-4">{t('Construct.other.equipment')}</Header>
                    {renderEquipment()}
                </div>
            </div>
        </div>

        {(showButtons == null || showButtons === true)
            ? (<div className="d-flex justify-content-between">
                    <div className="mt-5 mb-3">
                        <Button className="button-small mr-3" onClick={() => showExportDialog() } buttonType={true}>{t('Common.button.exportPdf')}</Button>
                        <Button className="button-small mr-3" onClick={() => showVttExportDialog() } buttonType={true}>{t('Common.button.exportVtt')}</Button>
                    </div>
                    <div className="mt-5 mb-3">
                        <Button className="button-small" onClick={() => navigateToModification() } buttonType={true}>{t('Common.button.modify')}</Button>
                    </div>
                </div>)
            : null}
    </main>);
}

export default MainCharacterView;