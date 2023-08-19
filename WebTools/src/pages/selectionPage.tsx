import * as React from 'react';
import { withRouter, RouteComponentProps } from "react-router";
import { Navigation } from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import { Button } from '../components/button';
import LanguageNotice from '../components/languageNotice';
import { isEnglishDefault } from '../i18n/config';
import { withTranslation, WithTranslation } from 'react-i18next';

enum Tool {
    CharacterGenerator,
    TalentsOverview,
    TokenCreator
}

interface ISelectionPageProperties extends WithTranslation {
    history: RouteComponentProps["history"];
}

class SelectionPage extends React.Component<ISelectionPageProperties, {}> {

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
                        <div className="button-column">
                            <Button text={t('Home.characterButton')} buttonType={true} className="button" onClick={() => { this.selectTool(Tool.CharacterGenerator); }} />
                            <Button text={t('Home.talentsButton')} buttonType={true} className="button" onClick={() => { this.selectTool(Tool.TalentsOverview); }} />
                            <Button text={t('Home.tokenCreator')} buttonType={true} className="button" onClick={() => { this.selectTool(Tool.TokenCreator); }} />
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
            case Tool.TalentsOverview: {
                const { history } = this.props;
                history.push("/talents");
                break;
            }
            case Tool.TokenCreator: {
                const { history } = this.props;
                history.push("/token");
                break;
            }
        }
    }
}

export default withTranslation()(withRouter(SelectionPage));