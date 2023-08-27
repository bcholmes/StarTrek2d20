import React from "react";
import { Navigation, navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import InstructionText from "../../components/instructionText";
import { Button } from "../../components/button";
import { LoadingButton } from "../../common/loadingButton";

const SoloConstructTypePage = () => {

    const goToPage = (page: PageIdentity) => {
        Navigation.navigateToPage(page);
    }

    const { t } = useTranslation();
    return (
        <div className="page">
            <div className="container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloConstructType')}</li>
                    </ol>
                </nav>

                <InstructionText text={t('SoloConstructTypePage.instruction')} />

                <div className="button-column">
                    <Button buttonType={true} className="btn btn-primary mt-4" onClick={() => goToPage(PageIdentity.SoloCharacterEra) } >{t('SoloConstructTypePage.character')}</Button>
                    <Button buttonType={true} className="btn btn-primary mt-4" enabled={false} onClick={() => {  } } >{t('SoloConstructTypePage.starship')}</Button>
                </div>
            </div>
        </div>
    );


}

export default SoloConstructTypePage;