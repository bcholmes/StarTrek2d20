import * as React from 'react';
import { withRouter, RouteComponentProps } from "react-router";
import { Navigation } from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import { Button } from '../components/button';
import LanguageNotice from '../components/languageNotice';
import { isEnglishDefault } from '../i18n/config';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header } from '../components/header';

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
                        <div className="mt-5">
                            <Header level={2}>Anniversary</Header>
                            <p>
                                This URL went live on August 14th, 2021, and has undergone
                                many, many updates over the last two years; I look forward to making many
                                more updates in the years to come. I hope you've been enjoying the
                                tool, and I hope that it's been useful for your game!
                            </p>
                            <p>
                                Don't forget to support <a href="https://www.modiphius.net/pages/star-trek-adventures" target="_blank" rel="noreferrer"><cite>Star
                                Trek Adventures</cite></a> by picking up a cool book or two, if that's viable for you. Also: check out
                                the cool, free stuff at <a href="https://continuingmissionsta.com/" target="_blank" rel="noreferrer">Continuing Missions</a>.
                                And of course, go boldly, and embrace the principles of Infinite Diversity in Infinite Combinations.
                            </p>
                            <p className='text-right'>- BC</p>
                        </div>
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