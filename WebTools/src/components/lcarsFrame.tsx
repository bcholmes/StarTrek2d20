import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageIdentity } from '../pages/pageIdentity';
import { AppVersion } from './appVersion';
import { CharacterProfile } from './characterProfile';
import { History, HistoryType } from './history';
import { News } from './news';
import { PageHeader } from './pageHeader';
import { RandomLcarsReadout } from './randomLcarsReadout';
import { useTranslation } from 'react-i18next';
import { StarshipProfile } from './starshipProfile';
import { LanguageSelector } from './languageSelector';
import { StationProfileView } from '../station/view/stationProfileView';

interface ILcarsFrameProperties {
  activePage: PageIdentity;
  children: React.ReactNode;
}

export const LcarsFrame: React.FC<ILcarsFrameProperties> = ({
  activePage,
  children,
}) => {
  document.title = 'STAR TREK ADVENTURES';

  const [showNews, setShowNews] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isSoloStarshipPage = () => {
    return (
      activePage === PageIdentity.SoloStarshipEra ||
      activePage === PageIdentity.SoloStarshipSpaceframe ||
      activePage === PageIdentity.SoloStarshipTalents ||
      activePage === PageIdentity.SoloStarshipFinish
    );
  };

  const isStationPage = () => {
    return (
      activePage === PageIdentity.StationIndex ||
      activePage === PageIdentity.StationMissionProfile ||
      activePage === PageIdentity.StationSpaceframe ||
      activePage === PageIdentity.StationTalents ||
      activePage === PageIdentity.StationWeapons ||
      activePage === PageIdentity.StationFinal
    );
  };

  const isStarshipPage = () => {
    if (
      activePage === PageIdentity.SmallCraftStats ||
      activePage === PageIdentity.ExtraStarshipTalentChoice ||
      activePage === PageIdentity.MissionPodSelection ||
      activePage === PageIdentity.MissionProfileSelection ||
      activePage === PageIdentity.MissionProfileTalentSelection ||
      activePage === PageIdentity.SpaceframeSelection ||
      activePage === PageIdentity.StarshipRefits ||
      activePage === PageIdentity.StarshipServiceRecord ||
      activePage === PageIdentity.StarshipToolSelection ||
      activePage === PageIdentity.StarshipTypeSelection ||
      activePage === PageIdentity.StarshipWeaponsSelection ||
      activePage === PageIdentity.StarshipTalentSelection ||
      activePage === PageIdentity.FinalStarshipDetails ||
      activePage === PageIdentity.SimpleStarship ||
      activePage === PageIdentity.ModifyStarship ||
      isSoloStarshipPage()
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isModifyPage = () => {
    if (
      activePage === PageIdentity.ModifyStarship ||
      activePage === PageIdentity.ModifyMainCharacter ||
      activePage === PageIdentity.ModifySupportingCharacter
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isSoloPage = () => {
    return (
      activePage === PageIdentity.SoloCharacterEra ||
      activePage === PageIdentity.SoloConstructType ||
      activePage === PageIdentity.SoloSpecies ||
      activePage === PageIdentity.SoloSpeciesDetails ||
      activePage === PageIdentity.SoloCustomSpeciesDetails ||
      activePage === PageIdentity.SoloEarlyOutlook ||
      activePage === PageIdentity.SoloEarlyOutlookDetails ||
      activePage === PageIdentity.SoloEducationType ||
      activePage === PageIdentity.SoloEducationPage ||
      activePage === PageIdentity.SoloEducationDetailsPage ||
      activePage === PageIdentity.SoloCareerLengthDetails ||
      activePage === PageIdentity.SoloCareerEvent1 ||
      activePage === PageIdentity.SoloCareerEventDetails1 ||
      activePage === PageIdentity.SoloCareerEvent2 ||
      activePage === PageIdentity.SoloCareerEventDetails2 ||
      activePage === PageIdentity.SoloFinishingTouches ||
      activePage === PageIdentity.SoloFinal
    );
  };

  const isProfileSupportedForPage = () => {
    if (
      activePage === PageIdentity.ViewSheet ||
      activePage === PageIdentity.StationIndex ||
      activePage === PageIdentity.NpcBuilder ||
      activePage === PageIdentity.NpcConfiguration ||
      activePage === PageIdentity.GamemasterTrackerPage ||
      activePage === PageIdentity.TalentsOverview ||
      activePage === PageIdentity.SystemGeneration ||
      activePage === PageIdentity.SectorDetails ||
      activePage === PageIdentity.StarSystemDetails
    ) {
      return false;
    } else {
      return true;
    }
  };

  const showFeedbackPage = () => {
    window.open(
      'https://github.com/bcholmes/StarTrek2d20/discussions',
      '_blank',
    );
  };

  const toggleHistory = () => {
    setShowNews(false);
    setShowProfile(false);
    setShowHistory(!showHistory);
  };

  const toggleProfile = () => {
    setShowNews(false);
    setShowProfile(!showProfile);
    setShowHistory(false);
  };

  const showNewsPanel = () => {
    setShowNews(true);
    setShowProfile(false);
    setShowHistory(false);
  };

  const hideNewsPanel = () => {
    setShowNews(false);
  };

  const goToCredits = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate('/credits');
  };

  const historyType = () => {
    if (isStarshipPage()) {
      return HistoryType.Starship;
    } else if (isSoloPage()) {
      return HistoryType.SoloCharacter;
    } else if (!isProfileSupportedForPage() || isModifyPage()) {
      return HistoryType.None;
    } else {
      return HistoryType.Character;
    }
  };

  const profileView = () => {
    if (isStarshipPage()) {
      return (
        <StarshipProfile
          showProfile={showProfile}
          close={() => setShowProfile(false)}
        />
      );
    } else if (isStationPage()) {
      return (
        <StationProfileView
          showProfile={showProfile}
          close={() => setShowProfile(false)}
        />
      );
    } else {
      return (
        <CharacterProfile
          showProfile={showProfile}
          close={() => setShowProfile(false)}
          storeBased={true}
        />
      );
    }
  };

  return (
    <>
      <div className="lcar-container" key="main-container">
        <div className="lcar-header">
          <div className="lcar-header-start">
            <a href="/index.html">
              <img
                src="/static/img/logo.png"
                className="logo"
                alt="Star Trek Adventures Logo"
              />
            </a>
          </div>
          <div></div>
          <div className="lcar-header-middle"></div>
          <PageHeader page={activePage} />
          <div className="lcar-header-end"></div>
        </div>
        <div className="lcar-content">
          <div className="lcar-content-start">
            <div className="lcar-content-start-top"></div>
            <div className="lcar-content-action" role="button" tabIndex={0}>
              <div
                id="history-button"
                className="lcar-content-history"
                onClick={() => toggleHistory()}
              >
                {t('Lcars.history')}
              </div>
              <div id="history-container" className="history-container-hidden">
                <History
                  showHistory={showHistory}
                  type={historyType()}
                  close={() => toggleHistory()}
                />
              </div>
            </div>
            <div className="lcar-content-action" role="button" tabIndex={0}>
              <div
                id="profile-button"
                className={
                  'lcar-content-profile ' +
                  (isProfileSupportedForPage() ? '' : 'd-none')
                }
                onClick={() => toggleProfile()}
              >
                {t('Lcars.profile')}
              </div>
              {profileView()}
            </div>
            <div
              className="lcar-content-feedback"
              role="button"
              tabIndex={0}
              onClick={() => showFeedbackPage()}
            >
              {t('Lcars.feedback')}
            </div>
            <div
              className="lcar-content-news"
              role="button"
              tabIndex={0}
              onClick={() => showNewsPanel()}
            >
              <div id="news-button" className="lcar-news">
                {t('Lcars.news')}
              </div>
            </div>
            <div
              className="lcar-content-left-button lcar-content-credits"
              role="button"
              tabIndex={0}
              onClick={() => goToCredits()}
            >
              {t('Lcars.credits')}
            </div>
            <div className=" d-flex justify-content-end pe-4">
              <a
                href="https://bsky.app/profile/bcholmes.org"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/static/img/bluesky_logo.svg"
                  className="my-2 mx-1 social-media"
                  alt="Bluesky Logo"
                  title="Bluesky"
                />
              </a>
              <a
                href="https://www.patreon.com/bcholmes"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/static/img/patreon_logo.svg"
                  className="my-2 mx-1 social-media"
                  alt="Patreon Logo"
                  title="Patreon"
                />
              </a>
            </div>
          </div>
          <div className="lcar-content-round"></div>
          {children}
        </div>
        <div className="lcar-footer">
          <div className="lcar-footer-start d-flex justify-content-end">
            <RandomLcarsReadout page={activePage} />
          </div>
          <div className="lcar-footer-end d-flex justify-content-between align-items-center">
            <LanguageSelector />
            <AppVersion key="app-version" />
          </div>
        </div>
        <footer className="text-primary text-center copyright">
          TM &amp; &copy; 2026 CBS Studios Inc. {t('Lcars.copyright')}
        </footer>
      </div>
      ,<div id="dialog" key="modal-dialog"></div>,
      <News
        showModal={showNews}
        onClose={() => {
          hideNewsPanel();
        }}
        key="news"
      />
    </>
  );
};
