import React, { useEffect, useState } from "react";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { useTranslation } from 'react-i18next';
import { getNameAndShortRankOf } from "../helpers/ranks";
import CharacterStatBlock from "./characterStatBlock";
import { ICharacterPageProperties } from "../common/iCharacterPageProperties";
import ValuesBlockView from "./valuesBlockView";
import StressOrShieldsView from "./stressOrShieldsView";
import FocusBlockView from "./focusBlockView";
import WeaponBlockView from "./weaponBlockView";
import { VttSelectionDialog } from "../vtt/view/VttSelectionDialog";
import SpeciesAbilityBlockView from "./speciesAbilityBlockView";
import { LoadingButton } from "../common/loadingButton";
import store from "../state/store";
import { setCharacter } from "../state/characterActions";
import { useNavigate } from "react-router";

const SupportingCharacterView: React.FC<ICharacterPageProperties> = ({character}) => {

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
    const [loadingExport, setLoadingExport] = useState(false);
    const navigate = useNavigate();

    function renderTopFields() {
        return (<>
            <Header>{(character.name ? getNameAndShortRankOf(character) : "Unnamed Character")}</Header>
            <div className="row mt-4" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.pronouns')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.pronouns ? character.pronouns  : undefined}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.purpose')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.role == null ? character.jobAssignment : character.role}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.rank')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.rank?.localizedName}</div></div>

                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.species')}:</div>
                <div className="col-md-4 text-white"><div className="view-border-bottom pb-2">{character.localizedSpeciesName}</div></div>
            </div>

            <div className="row" style={{alignItems: "baseline"}}>
                <div className="col-md-2 view-field-label pb-2">{t('Construct.other.traits')}:</div>
                <div className="col-md-10 text-white"><div className="view-border-bottom pb-2">{character.getAllTraits()}</div></div>
            </div>
        </>)
    }

    function showExportDialog() {
        setLoadingExport(true);
        import(/* webpackChunkName: 'export' */ '../components/characterSheetDialog').then(({CharacterSheetDialog}) => {
            import(/* webpackChunkName: 'export' */ '../helpers/sheets').then(({CharacterSheetRegistry}) => {
                setLoadingExport(false);
                CharacterSheetDialog.show(CharacterSheetRegistry.getSupportingCharacterSheet(character), "sta-character", character);
            });
        });
    }

    const navigateToModification = () => {
        store.dispatch(setCharacter(character));
        navigate("/modify/supporting");
    }

    function showVttExportDialog() {
        VttSelectionDialog.instance.show(character);
    }

    return (<main>
        {renderTopFields()}
        <div className="row">
            <div className="col-xl-6 mt-4">
                <CharacterStatBlock character={character} />

                <SpeciesAbilityBlockView character={character} />
            </div>
            <div className="col-xl-6">
                <div className="row">

                    {character.isStressTrackPresent
                    ?
                    (<>
                    <div className="col-xl-6 mt-4">
                        <Header level={2}>{t('Construct.other.stress')}</Header>
                        <StressOrShieldsView value={character.stress} />
                    </div>

                    <div className="col-xl-6 mt-4">
                        <Header level={2}>{t('Construct.other.focuses')}</Header>
                        <FocusBlockView character={character} />
                    </div>
                    </>)
                    : (<div className="col-12 mt-4">
                        <Header level={2}>{t('Construct.other.focuses')}</Header>
                        <FocusBlockView character={character} />
                    </div>
)}

                </div>

                <ValuesBlockView character={character} />
                <WeaponBlockView construct={character} />
            </div>
        </div>

        <div className="button-container d-flex justify-content-between">
            <div className="mt-5 mb-3">
                <LoadingButton loading={loadingExport} className="button-small me-3" onClick={() => showExportDialog() }>{t('Common.button.exportPdf')}</LoadingButton>
                <Button className="button-small me-3" onClick={() => showVttExportDialog() }>{t('Common.button.exportVtt')}</Button>
            </div>

            {character.version === 1
                ? undefined
                : (<div className="mt-5 mb-3">
                    <Button className="button-small" onClick={() => navigateToModification() }>{t('Common.button.modify')}</Button>
                </div>)}

        </div>
    </main>);
}

export default SupportingCharacterView;