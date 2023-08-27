
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConstructType } from '../../common/construct';
import { Era, EraModel, ErasHelper } from '../../helpers/eras';
import { Window } from '../../common/window';
import { Button } from '../../components/button';
import { navigateTo, Navigation } from '../../common/navigator';
import { PageIdentity } from '../../pages/pageIdentity';
import { setEra } from '../../state/contextActions';
import store from '../../state/store';
import { eraRandomTable } from '../eraRandomTable';

const SoloEraSelectionPage = ({type: ConstructType}) => {

    const { t } = useTranslation();
    const [randomEra, setRandomEra] = useState(null);

    const eraSelected = (era: Era)=> {
        store.dispatch(setEra(era));
        Navigation.navigateToPage(PageIdentity.ToolSelection);
    }

    const toTableRow = (e: EraModel, i: number) => {
        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) eraSelected(e.id); }}>
                <td className="selection-header">{e.localizedName}</td>
                <td className="text-right"><Button buttonType={true} className="button-small" text={t('Common.button.select')} onClick={() => { eraSelected(e.id) }} /></td>
            </tr>
        );
    }

    const eras = randomEra != null
        ? toTableRow(ErasHelper.getEra(randomEra), 0)
        : ErasHelper.getBasicEras().map((e, i) => toTableRow(e, i));

    return (
        <div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.era')}</li>
                </ol>
            </nav>
            <p className="mt-5">
                {t('SoloEraSelectionPage.instruction')}
            </p>
            <table className="selection-list">
                <tbody>
                    {eras}
                </tbody>
            </table>

            <div className="mt-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomEra( eraRandomTable()) }>{t('Common.button.random')}</Button>
                {randomEra != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomEra(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
        </div>
    );
}


export default SoloEraSelectionPage;