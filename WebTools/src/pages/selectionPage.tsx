import * as React from 'react';
import { Navigation } from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import { Button } from '../components/button';
import LanguageNotice from '../components/languageNotice';
import { isEnglishDefault } from '../i18n/config';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Header } from '../components/header';

enum Tool {
    CharacterGenerator,
    TalentsOverview,
    TokenCreator,
    OtherTools
}

const SelectionPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const selectTool = (tool: Tool) => {
        switch (tool) {
            case Tool.CharacterGenerator:
                Navigation.navigateToPage(PageIdentity.SourceSelection);
                break;
            case Tool.TalentsOverview: {
                navigate("/talents");
                break;
            }
            case Tool.TokenCreator: {
                navigate("/token");
                break;
            }
            case Tool.OtherTools: {
                navigate("/tools");
                break;
            }
        }
    }

    return (
        <div className="page container ms-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.home')}</li>
                </ol>
            </nav>
            <main className="row">
                <div className="col-12">
                    <Header>{t('Home.title')}</Header>
                </div>
                <div className="col-md-8">
                    <p className="mt-3">
                        {t('Home.selection')}
                    </p>
                    <div className="button-column">
                        <Button className="mt-4" onClick={() => { selectTool(Tool.CharacterGenerator); }} >{t('Home.characterButton')}</Button>
                        <Button className="mt-4" onClick={() => { selectTool(Tool.TalentsOverview); }}>{t('Home.talentsButton')}</Button>
                        <Button className="mt-4" onClick={() => { selectTool(Tool.TokenCreator); }}>{t('Home.tokenCreator')}</Button>
                        <Button className="mt-4" onClick={() => { selectTool(Tool.OtherTools); }}>{t('Home.otherTools')}</Button>
                    </div>
                </div>
                <section className="col-md-4">
                    {isEnglishDefault() ? undefined : (<LanguageNotice />) }
                </section>
            </main>
        </div>
    );
}

export default SelectionPage;