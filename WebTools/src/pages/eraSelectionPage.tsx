import * as React from 'react';
import {Era, ErasHelper} from '../helpers/eras';
import {navigateTo, Navigation} from '../common/navigator';
import {Window} from '../common/window';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import store from '../state/store';
import { setEra } from '../state/contextActions';
import { withTranslation, WithTranslation } from 'react-i18next';

class EraSelectionPage extends React.Component<WithTranslation, {}> {

    render() {
        const { t } = this.props;

        const eras = ErasHelper.getBasicEras().map((e, i) => {
            return (
                <tr key={i} onClick={() => { if (Window.isCompact()) this.eraSelected(e.id); }}>
                    <td className="selection-header">{e.localizedName}</td>
                    <td className="text-right"><Button buttonType={true} className="button-small" text={t('Common.button.select')} onClick={() => { this.eraSelected(e.id) }} /></td>
                </tr>
            );
        });

        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.era')}</li>
                    </ol>
                </nav>
                <p className="mt-5">
                    {t('EraSelectionPage.eraInstruction')}
                </p>
                <table className="selection-list">
                    <tbody>
                        {eras}
                    </tbody>
                </table>
            </div>
        );
    }

    private eraSelected(era: Era) {
        store.dispatch(setEra(era));
        Navigation.navigateToPage(PageIdentity.ToolSelection);
    }
}

export default withTranslation()(EraSelectionPage);