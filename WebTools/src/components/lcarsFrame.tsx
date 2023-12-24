import React, { useState } from "react";
import { useNavigate } from "react-router";
import { PageIdentity } from "../pages/pageIdentity";
import AppVersion from "./appVersion";
import CharacterSheet from "./characterSheet";
import History, { HistoryType } from "./history";
import News from "./news";
import PageHeader from "./pageHeader";
import { RandomLcarsReadout } from "./randomLcarsReadout";
import { useTranslation } from 'react-i18next';

interface ILcarsFrameProperties {
    activePage: PageIdentity;
    children: React.ReactNode;
}

const LcarsFrame: React.FC<ILcarsFrameProperties>  = ({activePage, children}) => {

    document.title = "STAR TREK ADVENTURES";

    const [showNews, setShowNews] = useState(false);
    const [ showHistory, setShowHistory] = useState(false);
    const [ showProfile, setShowProfile] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();


    const isStarshipPage = () => {
        if (activePage === PageIdentity.SmallCraftStats ||
            activePage === PageIdentity.MissionPodSelection ||
            activePage === PageIdentity.MissionProfileSelection ||
            activePage === PageIdentity.MissionProfileTalentSelection ||
            activePage === PageIdentity.SpaceframeOption ||
            activePage === PageIdentity.SpaceframeSelection ||
            activePage === PageIdentity.StarshipRefits ||
            activePage === PageIdentity.StarshipToolSelection ||
            activePage === PageIdentity.StarshipTypeSelection ||
            activePage === PageIdentity.StarshipWeaponsSelection ||
            activePage === PageIdentity.StarshipTalentSelection ||
            activePage === PageIdentity.FinalStarshipDetails ||
            activePage === PageIdentity.SimpleStarship) {
            return true;
        } else {
            return false;
        }
    }

    const isSoloPage = () => {
        return activePage === PageIdentity.SoloCharacterEra ||
            activePage === PageIdentity.SoloConstructType ||
            activePage === PageIdentity.SoloSpecies ||
            activePage === PageIdentity.SoloSpeciesDetails ||
            activePage === PageIdentity.SoloEnvironment ||
            activePage === PageIdentity.SoloEnvironmentDetails ||
            activePage === PageIdentity.SoloEarlyOutlook ||
            activePage === PageIdentity.SoloEarlyOutlookDetails ||
            activePage === PageIdentity.SoloEducationType ||
            activePage === PageIdentity.SoloEducationPage ||
            activePage === PageIdentity.SoloEducationDetailsPage ||
            activePage === PageIdentity.SoloCareerLength ||
            activePage === PageIdentity.SoloCareerLengthDetails ||
            activePage === PageIdentity.SoloCareerEvent1 ||
            activePage === PageIdentity.SoloCareerEventDetails1 ||
            activePage === PageIdentity.SoloCareerEvent2 ||
            activePage === PageIdentity.SoloCareerEventDetails2 ||
            activePage === PageIdentity.SoloFinishingTouches ||
            activePage === PageIdentity.SoloFinal;
    }

    const isProfileSupportedForPage = () => {
        if (activePage === PageIdentity.ViewSheet ||
            activePage === PageIdentity.GamemasterTrackerPage ||
            activePage === PageIdentity.TalentsOverview ||
            activePage === PageIdentity.SystemGeneration ||
            activePage === PageIdentity.SectorDetails ||
            activePage === PageIdentity.StarSystemDetails ||
            isStarshipPage()) {
            return false;
        } else {
            return true;
        }
    }

    const showFeedbackPage = () => {
        window.open("https://github.com/bcholmes/StarTrek2d20/discussions", "_blank");
    }

    const toggleHistory = () => {
        setShowNews(false);
        setShowProfile(false);
        setShowHistory(!showHistory);
    }

    const toggleProfile = () => {
        setShowNews(false);
        setShowProfile(!showProfile);
        setShowHistory(false);
    }

    const showNewsPanel = () => {
        setShowNews(true);
        setShowProfile(false);
        setShowHistory(false);
    }

    const hideNewsPanel = () => {
        setShowNews(false);
    }

    const goToCredits = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();

        navigate("/credits");
    }


    return (<>
        <div className="lcar-container" key="main-container">
            <div className="lcar-header">
                <div className="lcar-header-start"><a href="index.html"><img src="./static/img/logo.png" className="logo" alt="Star Trek Adventures Logo"/></a></div>
                <div></div>
                <div className="lcar-header-middle"></div>
                <PageHeader page={activePage} />
                <div className="lcar-header-end"></div>
            </div>
            <div className="lcar-content">
                <div className="lcar-content-start">
                    <div className="lcar-content-start-top"></div>
                    <div className="lcar-content-action">
                        <div id="history-button" className="lcar-content-history" onClick={ () => toggleHistory() }>{t('Lcars.history')}</div>
                        <div id="history-container" className="history-container-hidden">
                            <History showHistory={showHistory}
                                type={isStarshipPage() ? HistoryType.Starship : (isSoloPage() ? HistoryType.SoloCharacter : HistoryType.Character)}
                                close={() => setShowHistory(false)} />
                        </div>
                    </div>
                    <div className="lcar-content-action">
                        <div id="profile-button" className={'lcar-content-profile ' + (isProfileSupportedForPage() ? '' : 'd-none')} onClick={ () => toggleProfile() }>{t('Lcars.profile')}</div>
                        <CharacterSheet showProfile={showProfile} close={() => setShowProfile(false)}
                            storeBased={true}/>
                    </div>
                    <div className="lcar-content-feedback" onClick={ () => showFeedbackPage() }>{t('Lcars.feedback')}</div>
                    <div className="lcar-content-news" onClick={() => showNewsPanel()}>
                        <div id="news-button" className="lcar-news">{t('Lcars.news')}</div>
                    </div>
                    <div></div>
                </div>
                <div className="lcar-content-round"></div>
                {children}
            </div>
            <div className="lcar-footer">
                <div className="lcar-footer-start"></div>
                <div className="lcar-footer-end"><RandomLcarsReadout page={activePage} /></div>
            </div>
            <div className="row">
                <div className="col-md-8 offset-md-2 text-primary text-center">
                    TM &amp; &copy; 2023 CBS Studios Inc. {t('Lcars.copyright')}
                </div>
                <div className="col-md-2 text-right pr-4">
                    <a href="./index.html" className="text-primary" onClick={(e) => goToCredits(e)}>{t('Lcars.credits')}</a>
                </div>
            </div>
        </div>,
        <AppVersion key="app-version"/>,
        <div id="dialog" key="modal-dialog"></div>,
        <News showModal={showNews} onClose={() => {hideNewsPanel()}} key="news"/>
    </>);

}

export default LcarsFrame;