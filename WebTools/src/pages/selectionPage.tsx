import * as React from 'react';
import { Navigation } from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import { Button } from '../components/button';
import LanguageNotice from '../components/languageNotice';
import { isEnglishDefault } from '../i18n/config';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

enum Tool {
    CharacterGenerator,
    TalentsOverview,
    TokenCreator
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
        }
    }

    return (
        <div className="page container ms-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.home')}</li>
                </ol>
            </nav>
            <div className="row">
                <main className="col-md-8">
                    <p className="mt-3">
                        {t('Home.selection')}
                    </p>
                    <div className="button-column">
                        <Button text={t('Home.characterButton')} buttonType={true} className="btn btn-primary mt-4" onClick={() => { selectTool(Tool.CharacterGenerator); }} />
                        <Button text={t('Home.talentsButton')} buttonType={true} className="btn btn-primary mt-4" onClick={() => { selectTool(Tool.TalentsOverview); }} />
                        <Button text={t('Home.tokenCreator')} buttonType={true} className="btn btn-primary mt-4" onClick={() => { selectTool(Tool.TokenCreator); }} />
                    </div>
                </main>
                <section className="col-md-4">
                    {isEnglishDefault() ? undefined : (<LanguageNotice />) }
                </section>
            </div>
        </div>
    );
}

export default SelectionPage;