
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Era, EraModel, ErasHelper, eraDefaultYear } from '../../helpers/eras';
import { Window } from '../../common/window';
import { Button } from '../../components/button';
import { navigateTo, Navigation } from '../../common/navigator';
import { PageIdentity } from '../../pages/pageIdentity';
import { setEra } from '../../state/contextActions';
import store from '../../state/store';
import { eraRandomTable, eraRandomTableForStarships } from '../table/eraRandomTable';
import { Stereotype } from '../../common/construct';
import { createStarship, setStarshipServiceYear } from '../../state/starshipActions';
import { Starship } from '../../common/starship';
import { Header } from '../../components/header';

interface ISoloEraSelectionPage {
    stereotype: Stereotype;
}

const SoloEraSelectionPage: React.FC<ISoloEraSelectionPage> = ({stereotype}) => {

    const { t } = useTranslation();
    const [randomEra, setRandomEra] = useState(null);

    const eraSelected = (era: Era)=> {
        store.dispatch(setEra(era));
        if (stereotype === Stereotype.SoloStarship) {
            let starship = store.getState().starship?.starship;
            let serviceYear = eraDefaultYear(era);
            if (starship?.serviceYear != null && starship?.serviceYear != serviceYear) {
                let newStarship = Starship.createSoloStarship();
                newStarship.serviceYear = serviceYear;
                store.dispatch(createStarship(newStarship));
            } else {
                store.dispatch(setStarshipServiceYear(eraDefaultYear(era)));
            }
            Navigation.navigateToPage(PageIdentity.SoloStarshipSpaceframe);
        } else {
            Navigation.navigateToPage(PageIdentity.SoloSpecies);
        }
    }

    const toTableRow = (e: EraModel, i: number) => {
        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) eraSelected(e.id); }}>
                <td className="selection-header">{e.localizedName}</td>
                <td className="text-end"><Button buttonType={true} className="button-small"
                     onClick={() => { eraSelected(e.id) }} >{t('Common.button.select')}</Button></td>
            </tr>
        );
    }

    const eras = randomEra != null
        ? toTableRow(ErasHelper.getEra(randomEra), 0)
        : (stereotype === Stereotype.SoloStarship
            ? ErasHelper.getEras().map((e, i) => toTableRow(e, i))
            : ErasHelper.getBasicEras().map((e, i) => toTableRow(e, i)));

    return (
        <div className="page container ms-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.era')}</li>
                </ol>
            </nav>

            <Header>{t('Page.title.era')}</Header>
            <p className="mt-3">
                {t('SoloEraSelectionPage.instruction')}
            </p>
            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm me-3" onClick={() =>
                    setRandomEra( stereotype === Stereotype.SoloStarship ? eraRandomTableForStarships() : eraRandomTable()) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                </Button>
                {randomEra != null ? (<Button buttonType={true} className="btn btn-primary btn-sm me-3" onClick={() => setRandomEra(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
            <table className="selection-list">
                <tbody>
                    {eras}
                </tbody>
            </table>

        </div>
    );
}


export default SoloEraSelectionPage;