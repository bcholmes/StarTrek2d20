import React, { useEffect } from "react";
import { Era } from "../helpers/eras";
import { CharacterSheetRegistry } from "../helpers/sheets";
import { Button } from "../components/button";
import { CharacterSheetDialog } from "../components/characterSheetDialog";
import { Header } from "../components/header";
import { useTranslation } from 'react-i18next';
import { getNameAndShortRankOf } from "../helpers/ranks";
import StressOrShieldsView from "./stressOrShieldsView";
import CharacterStatBlock from "./characterStatBlock";
import { ICharacterPageProperties } from "../common/iCharacterPageProperties";
import { VttSelectionDialog } from "../vtt/view/VttSelectionDialog";
import WeaponBlockView from "./weaponBlockView";
import FocusBlockView from "./focusBlockView";
import ValuesBlockView from "./valuesBlockView";
import TalentsBlockView from "./talentsBlockView";

const NpcView: React.FC<ICharacterPageProperties> = ({character}) => {

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

    function renderTopFields() {
        return (<>
            <Header>{(character.name ? getNameAndShortRankOf(character) : "Unnamed Character")}</Header>
            <div className="row mt-4" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.pronouns')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.pronouns ? character.pronouns  : undefined}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('NpcConfigurationPage.specialization')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.role == null ? character.jobAssignment : character.role}</div></div>

                {character.rank ? (<>
                    <div className="col-md-2 view-field-label pb-2">{t('Construct.other.rank')}:</div>
                    <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.rank?.localizedName}</div></div>
                </>) : undefined}

                <div className="col-md-2 view-field-label pb-2">Species:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.speciesName}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.traits')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{character.getAllTraits()}</div></div>
            </div>
        </>)
    }

    function showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getCharacterSheets(character, Era.NextGeneration), "sta-npc", character);
    }

    function showVttExportDialog() {
        VttSelectionDialog.instance.show(character);
    }

    return (<main>
        {renderTopFields()}
        <div className="row">
            <div className="col-xl-6 mt-4">
                <CharacterStatBlock character={character} />

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

                <WeaponBlockView construct={character} />
            </div>
        </div>

        <div className="button-container mt-5 mb-3">
            <Button className="button-small mr-3" onClick={() => showExportDialog() } buttonType={true}>{t('Common.button.exportPdf')}</Button>
            <Button className="button-small mr-3" onClick={() => showVttExportDialog() } buttonType={true}>{t('Common.button.exportVtt')}</Button>
        </div>
    </main>);


}

export default NpcView;