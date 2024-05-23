import React from "react";
import { Navigation, navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import InstructionText from "../../components/instructionText";
import { Button } from "../../components/button";
import store from "../../state/store";
import { setCharacter } from "../../state/characterActions";
import { Character } from "../../common/character";
import { Starship } from "../../common/starship";
import { createStarship } from "../../state/starshipActions";

const SoloConstructTypePage = () => {

    const createCharacter = () => {
        store.dispatch(setCharacter(Character.createSoloCharacter(store.getState().context.era)));
        goToPage(PageIdentity.SoloCharacterEra);
    }

    const createSoloStarship = () => {
        store.dispatch(createStarship(Starship.createSoloStarship(store.getState().context.era)));
        goToPage(PageIdentity.SoloStarshipEra);
    }

    const goToPage = (page: PageIdentity) => {
        Navigation.navigateToPage(page);
    }

    const { t } = useTranslation();
    return (
        <div className="page">
            <div className="container ms-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloConstructType')}</li>
                    </ol>
                </nav>

                <InstructionText text={t('SoloConstructTypePage.instruction')} />

                <div className="button-column">
                    <Button className="btn btn-primary mt-4" onClick={() => createCharacter() } >{t('SoloConstructTypePage.character')}</Button>
                    <Button className="btn btn-primary mt-4" onClick={() => createSoloStarship() } >{t('SoloConstructTypePage.starship')}</Button>
                </div>
            </div>
        </div>
    );

}

export default SoloConstructTypePage;