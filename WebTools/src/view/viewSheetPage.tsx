import React, { lazy } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { StarshipView } from './starshipView';
import { SupportingCharacterView } from './supportingCharacterView';
import { marshaller } from '../helpers/marshaller';
import { MainCharacterView } from './mainCharacterView';
import { LcarsFrame } from '../components/lcarsFrame';
import { PageIdentity } from '../pages/pageIdentity';
import type { Construct } from '../common/construct';
import { Character } from '../common/character';
import { NpcView } from './npcView';
import { SoloCharacterView } from './soloCharacterView';
import type { Asset } from '../asset/asset';
import { originalEncodedSheet } from './originalEncodedSheet';
import { StationView } from './stationView';
const AssetView = lazy(() =>
  import(/* webpackChunkName: 'asset' */ '../asset/view/assetView').then(
    (m) => ({ default: m.AssetView }),
  ),
);
const CreatureView = lazy(() =>
  import(
    /* webpackChunkName: 'creature' */ '../creature/view/creatureView'
  ).then((m) => ({ default: m.CreatureView })),
);

export const ViewSheetPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const modifyTitle = (construct: Construct) => {
    if (construct.name) {
      if (construct instanceof Character && (construct as Character).rank) {
        document.title =
          (construct as Character).rank?.localizedName +
          ' ' +
          construct.name +
          ' - STAR TREK ADVENTURES';
      } else {
        document.title = construct.name + ' - STAR TREK ADVENTURES';
      }
    }
  };

  const modifyTitleForAsset = (asset: Asset) => {
    if (asset.name) {
      document.title = asset.name + ' - STAR TREK ADVENTURES';
    }
  };

  const renderContents = () => {
    const encodedSheet = originalEncodedSheet();
    const json = marshaller.decode(encodedSheet);

    if (!json) {
      return (
        <div className="page text-white">{t('ViewPage.errorMessage')}</div>
      );
    } else if (json.stereotype === 'asset') {
      const asset = marshaller.decodeAsset(encodedSheet);
      modifyTitleForAsset(asset);
      return (
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/index.html" onClick={(e) => goToHome(e)}>
                  {t('Page.title.home')}
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('ViewPage.viewAsset')}
              </li>
            </ol>
          </nav>
          <AssetView asset={asset} />
        </div>
      );
    } else if (json.stereotype === 'creature') {
      const creature = marshaller.decodeCreature(json);
      modifyTitle(creature);
      return (
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/index.html" onClick={(e) => goToHome(e)}>
                  {t('Page.title.home')}
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('ViewPage.viewCreature')}
              </li>
            </ol>
          </nav>
          <CreatureView creature={creature} />
        </div>
      );
    } else if (json.stereotype === 'starship' || json.stereotype === 'simple') {
      const starship = marshaller.decodeStarship(encodedSheet);
      modifyTitle(starship);
      return (
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/index.html" onClick={(e) => goToHome(e)}>
                  {t('Page.title.home')}
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('ViewPage.viewStarship')}
              </li>
            </ol>
          </nav>
          <StarshipView starship={starship} />
        </div>
      );
    } else if (json.stereotype === 'supportingCharacter') {
      const character = marshaller.decodeCharacter(json);
      modifyTitle(character);
      return (
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/index.html" onClick={(e) => goToHome(e)}>
                  {t('Page.title.home')}
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('ViewPage.viewSupportingCharacter')}
              </li>
            </ol>
          </nav>
          <SupportingCharacterView character={character} />
        </div>
      );
    } else if (json.stereotype === 'npc') {
      const character = marshaller.decodeCharacter(json);
      modifyTitle(character);
      return (
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('ViewPage.viewNpc')}
              </li>
            </ol>
          </nav>
          <NpcView character={character} />
        </div>
      );
    } else if (json.stereotype === 'mainCharacter') {
      const character = marshaller.decodeCharacter(json);
      modifyTitle(character);
      return (
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('ViewPage.viewMainCharacter')}
              </li>
            </ol>
          </nav>
          <MainCharacterView character={character} />
        </div>
      );
    } else if (json.stereotype === 'station') {
      const station = marshaller.decodeStation(json);
      modifyTitle(station);
      return (
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('ViewPage.viewStation')}
              </li>
            </ol>
          </nav>
          <StationView station={station} />
        </div>
      );
    } else if (json.stereotype === 'soloCharacter') {
      const character = marshaller.decodeCharacter(json);
      modifyTitle(character);
      return (
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('ViewPage.viewSoloCharacter')}
              </li>
            </ol>
          </nav>
          <SoloCharacterView character={character} />
        </div>
      );
    }
  };

  const goToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();

    navigate('/');
  };

  return (
    <LcarsFrame activePage={PageIdentity.ViewSheet}>
      <div id="app">{renderContents()}</div>
    </LcarsFrame>
  );
};
