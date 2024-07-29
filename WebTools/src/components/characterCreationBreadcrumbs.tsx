import React from "react";
import { useTranslation } from 'react-i18next';
import { PageIdentity } from "../pages/pageIdentity";
import { characterMapStateToProperties, ICharacterProperties } from "../solo/page/soloCharacterProperties";
import { connect } from "react-redux";
import { navigateTo } from "../common/navigator";
import { CharacterType } from "../common/characterType";
import { setCharacterFinishingTouches } from "../state/characterActions";
import store from "../state/store";

interface ICharacterBreadcrumbProperties extends ICharacterProperties {
    pageIdentity?: PageIdentity;
}

const CharacterCreationBreadcrumbs : React.FC<ICharacterBreadcrumbProperties> = ({character, pageIdentity}) => {

    const { t } = useTranslation();

    const renderSpecies = () => {
        if ((character?.environmentStep && pageIdentity === PageIdentity.SpeciesDetails) || pageIdentity === PageIdentity.Species) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.species')}</li>);
        } else if (character?.speciesStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Species)}>{t('Page.title.species')}</a></li>);
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
        if ((character?.educationStep && pageIdentity === PageIdentity.UpbringingDetails) || pageIdentity === PageIdentity.Upbringing) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloEarlyOutlook')}</li>);
        } else if (character?.upbringingStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Upbringing)}>{t('Page.title.soloEarlyOutlook')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderEducation = () => {
        if ((character?.careerStep != null && (pageIdentity === PageIdentity.CareerDetails || pageIdentity === PageIdentity.ChildEducationDetailsPage))
            || pageIdentity === PageIdentity.Career || pageIdentity === PageIdentity.ChildEducationPage) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.career')}</li>);
        } else if (character?.educationStep) {
            const page = (character.type === CharacterType.Child) ? PageIdentity.ChildEducationPage : PageIdentity.Career;
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, page)}>{t('Page.title.career')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderCareerLength = () => {
        if ((character?.careerEvents?.length && pageIdentity === PageIdentity.CareerLengthDetails) || pageIdentity === PageIdentity.CareerLength
            || pageIdentity === PageIdentity.ChildCareer || pageIdentity === PageIdentity.CadetCareer) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloCareerLength')}</li>);
        } else if (character?.careerStep != null) {
            let page = PageIdentity.CareerLength;
            if (character.type === CharacterType.Cadet) {
                page = PageIdentity.CadetCareer;
            } else if (character.type === CharacterType.Child) {
                page = PageIdentity.ChildCareer;
            }
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, page)}>{t('Page.title.soloCareerLength')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderCareerEvent1 = () => {
        if ((character?.careerEvents?.length > 1 && pageIdentity === PageIdentity.CareerEvent1Details) || pageIdentity === PageIdentity.CareerEvent1) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.careerEvent1')}</li>);
        } else if (character?.careerEvents?.length || character?.finishingStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.CareerEvent1)}>{t('Page.title.careerEvent1')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderCareerEvent2 = () => {
        if ((character?.finishingStep && pageIdentity === PageIdentity.CareerEvent2Details) || pageIdentity === PageIdentity.CareerEvent2) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.careerEvent2')}</li>);
        } else if (character?.finishingStep) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.CareerEvent2)}>{t('Page.title.careerEvent2')}</a></li>);
        } else {
            return undefined;
        }
    }

    const renderFinal = () => {
        if (pageIdentity === PageIdentity.AttributesAndDisciplines) {
            return (<li className="breadcrumb-item active" aria-current="page">{t('Page.title.soloFinal')}</li>);
        } else if (character?.finishingStep || pageIdentity === PageIdentity.Finish) {
            return (<li className="breadcrumb-item"><a href="/index.html" onClick={(e) => {
                store.dispatch(setCharacterFinishingTouches());
                navigateTo(e, PageIdentity.AttributesAndDisciplines);
            }}>{t('Page.title.soloFinal')}</a></li>);
        } else {
            return undefined;
        }
    }

    return (<nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.Era)}>{t('Page.title.era')}</a></li>
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

export default connect(characterMapStateToProperties)(CharacterCreationBreadcrumbs)