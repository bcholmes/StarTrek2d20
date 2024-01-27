import { connect } from "react-redux";
import { ICharacterProperties, characterMapStateToProperties } from "../page/soloCharacterProperties";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { navigateTo } from "../../common/navigator";
import store from "../../state/store";
import { setCharacterFinishingTouches } from "../../state/characterActions";

interface ISoloCharacterBreadcrumbProperties extends ICharacterProperties{
    pageIdentity: PageIdentity;
}

const SoloCharacterBreadcrumbs: React.FC<ISoloCharacterBreadcrumbProperties> = ({character, pageIdentity}) => {

    const { t } = useTranslation();

    const renderSpecies = () => {
        if ((character?.environmentStep && pageIdentity === PageIdentity.SoloSpeciesDetails) || pageIdentity === PageIdentity.SoloSpecies) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.species')}</li>);
        } else if (character?.speciesStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloSpecies)}>{t('Page.title.species')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderEnvironment = () => {
        if ((character?.upbringingStep && pageIdentity === PageIdentity.EnvironmentDetails) || pageIdentity === PageIdentity.Environment) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.environment')}</li>);
        } else if (character?.environmentStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Environment)}>{t('Page.title.environment')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderEarlyOutlook = () => {
        if ((character?.educationStep && pageIdentity === PageIdentity.SoloEarlyOutlookDetails) || pageIdentity === PageIdentity.SoloEarlyOutlook) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloEarlyOutlook')}</li>);
        } else if (character?.upbringingStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEarlyOutlook)}>{t('Page.title.soloEarlyOutlook')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderEducation = () => {
        if ((character?.careerStep != null && pageIdentity === PageIdentity.SoloEducationDetailsPage) || pageIdentity === PageIdentity.SoloEducationType || pageIdentity === PageIdentity.SoloEducationPage) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloEducation')}</li>);
        } else if (character?.educationStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloEducationType)}>{t('Page.title.soloEducation')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderCareerLength = () => {
        if ((character?.careerEvents?.length && pageIdentity === PageIdentity.SoloCareerLengthDetails) || pageIdentity === PageIdentity.CareerLength) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloCareerLength')}</li>);
        } else if (character?.careerStep != null) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.CareerLength)}>{t('Page.title.soloCareerLength')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderCareerEvent1 = () => {
        if ((character?.careerEvents?.length > 1 && pageIdentity === PageIdentity.SoloCareerEventDetails1) || pageIdentity === PageIdentity.SoloCareerEvent1) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.careerEvent1')}</li>);
        } else if (character?.careerEvents?.length) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCareerEvent1)}>{t('Page.title.careerEvent1')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderCareerEvent2 = () => {
        if ((character?.finishingStep && pageIdentity === PageIdentity.SoloCareerEventDetails2) || pageIdentity === PageIdentity.SoloCareerEvent2) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.careerEvent2')}</li>);
        } else if (character?.finishingStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCareerEvent2)}>{t('Page.title.careerEvent2')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderFinal = () => {
        if (pageIdentity === PageIdentity.SoloFinishingTouches) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloFinal')}</li>);
        } else if (character?.finishingStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => {
                store.dispatch(setCharacterFinishingTouches());
                navigateTo(e, PageIdentity.SoloFinishingTouches);
            }}>{t('Page.title.soloFinal')}</a></li>);
        } else {
            return undefined;
        }
    }

    return (<nav aria-label="breadcrumb">
        <ol className="breadcrumb">
        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCharacterEra)}>{t('Page.title.era')}</a></li>
            {renderSpecies()}
            {renderEnvironment()}
            {renderEarlyOutlook()}
            {renderEducation()}
            {renderCareerLength()}
            {renderCareerEvent1()}
            {renderCareerEvent2()}
            {renderFinal()}
        </ol>
    </nav>);
}

export default connect(characterMapStateToProperties)(SoloCharacterBreadcrumbs);