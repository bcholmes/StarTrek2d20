import React, { useState } from 'react';
import {PageIdentity} from './pageIdentity';
import MixedSpeciesSelection from '../components/mixedSpeciesSelection';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { characterMapStateToProperties, ICharacterProperties } from '../solo/page/soloCharacterProperties';
import { Header } from '../components/header';
import InstructionText from '../components/instructionText';
import SpeciesSelection from '../components/speciesSelection';
import { Species } from '../helpers/speciesEnum';
import { SpeciesHelper } from '../helpers/species';
import { setCharacterSpecies } from '../state/characterActions';
import store from '../state/store';
import { Navigation } from '../common/navigator';
import { Button } from '../components/button';

enum SpeciesTab {
    Standard,
    Custom,
    Mixed
}

const SpeciesPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();

    const chooseInitialTab = () => {
        if (character?.speciesStep?.species === Species.Custom) {
            return SpeciesTab.Custom;
        } else if (character?.speciesStep?.mixedSpecies != null) {
            return SpeciesTab.Mixed;
        } else {
            return SpeciesTab.Standard;
        }
    }

    const [tab, setTab] = useState(chooseInitialTab());

    const renderTab = () => {
        if (tab === SpeciesTab.Standard) {
            return (<SpeciesSelection
                onSelection={(species) => selectStandardSpecies(species) } />)
        } else if (tab === SpeciesTab.Mixed) {
            return (<MixedSpeciesSelection />);
        } else {
            return selectCustomSpecies();
        }
    }

    const showCustomSpecies = () => {
        store.dispatch(setCharacterSpecies(Species.Custom));
        Navigation.navigateToPage(PageIdentity.CustomSpeciesDetails);
    }

    const selectCustomSpecies = () => {

        return (<div className="text-end mt-4">
            <table className="selection-list">
                <tbody>
                    <tr>
                        <td className="selection-header">Custom Species</td>
                        <td className="text-end">
                            <Button className="btn btn-primary btn-sm" onClick={() => showCustomSpecies() }>{t('Common.text.select')}</Button>
                        </td>
                    </tr>
                </tbody>
                </table>
        </div>);
    }

    const selectStandardSpecies = (species: Species) => {
        let speciesModel = SpeciesHelper.getSpeciesByType(species);
        if (speciesModel.isAttributeSelectionRequired) {
            store.dispatch(setCharacterSpecies(speciesModel.id));
        } else {
            store.dispatch(setCharacterSpecies(speciesModel.id, speciesModel.attributes, undefined, undefined, undefined, speciesModel.decrementAttributes));
        }

        if (species === Species.Kobali) {
            Navigation.navigateToPage(PageIdentity.KobaliExtraSpeciesDetails);
        } else if (species === Species.Borg) {
            Navigation.navigateToPage(PageIdentity.BorgSpeciesExtraDetails);
        } else if (species === Species.LiberatedBorg) {
            Navigation.navigateToPage(PageIdentity.LiberatedBorgSpeciesExtraDetails);
        } else if (species === Species.CyberneticallyEnhanced) {
            Navigation.navigateToPage(PageIdentity.CyberneticallyEnhancedSpeciesExtraDetails);
        } else {
            Navigation.navigateToPage(PageIdentity.SpeciesDetails);
        }
    }

    return (
        <div className="page">
            <div className="container ms-0">
                <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.Species} />
                <main>
                    <Header>{t('Page.title.species')}</Header>

                    <InstructionText text={t('SpeciesPage.text')} />

                    <div className="btn-group w-100 mt-4" role="group" aria-label={t('Page.title.species')}>
                        <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === SpeciesTab.Standard ? "active" : "")}
                            onClick={() => setTab(SpeciesTab.Standard)}>{t('SpeciesPage.standardSpecies')}</button>
                        <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === SpeciesTab.Mixed ? "active" : "")}
                            onClick={() => setTab(SpeciesTab.Mixed)}>{t('SpeciesPage.mixedSpecies')}</button>
                        <button type="button" className={'btn btn-info btn-sm p-2 text-center ' + (tab === SpeciesTab.Custom ? "active" : "")}
                            onClick={() => setTab(SpeciesTab.Custom)}>{t('SpeciesPage.customSpecies')}</button>
                    </div>

                    {renderTab()}
                </main>
            </div>
        </div>
    );
}

export default connect(characterMapStateToProperties)(SpeciesPage);