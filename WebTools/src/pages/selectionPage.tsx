import * as React from 'react';
import { Navigation } from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import { Button } from '../components/button';
import LanguageNotice from '../components/languageNotice';
import { isEnglishDefault } from '../i18n/config';
import { withTranslation, WithTranslation } from 'react-i18next';

enum Tool {
    CharacterGenerator,
    TalentsOverview,
}

class SelectionPage extends React.Component<WithTranslation, {}> {

    render() {
        const { t } = this.props;

        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.home')}</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md-8">
                        <p className="mt-3">
                            {t('Home.selection')}
                        </p>
                        <div className="button-container">
                            <Button text={t('Home.characterButton')} className="button" onClick={() => { this.selectTool(Tool.CharacterGenerator); }} />
                            <Button text={t('Home.talentsButton')} className="button" onClick={() => { this.selectTool(Tool.TalentsOverview); }} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        {isEnglishDefault() ? undefined : (<LanguageNotice />) }
                    </div>
                </div>
            </div>
        );
    }

    private selectTool(tool: Tool) {
        switch (tool) {
            case Tool.CharacterGenerator:
                Navigation.navigateToPage(PageIdentity.Era);
                break;
            case Tool.TalentsOverview:
                Navigation.navigateToPage(PageIdentity.TalentsOverview);
                break;
        }
    }
}

export default withTranslation()(SelectionPage);