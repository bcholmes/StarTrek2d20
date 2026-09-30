import { useTranslation } from 'react-i18next';
import type { Station } from '../../common/station';
import { PageIdentity } from '../../pages/pageIdentity';
import { Link } from 'react-router';
import { StationFrame } from '../../helpers/stationFrame';

interface IStationBreadcrumbProperties {
  pageIdentity: PageIdentity;
  station?: Station;
}

export const StationBreadcrumbs: React.FC<IStationBreadcrumbProperties> = ({
  station,
  pageIdentity,
}) => {
  const { t } = useTranslation();

  const renderSpaceframe = () => {
    if (station == null) {
      return undefined;
    } else if (pageIdentity === PageIdentity.StationSpaceframe) {
      return (
        <li className="breadcrumb-item active">
          {t('Page.title.stationSpaceframe')}
        </li>
      );
    } else {
      return (
        <li className="breadcrumb-item">
          <Link to={'/station/frame'}>{t('Page.title.stationSpaceframe')}</Link>
        </li>
      );
    }
  };

  const renderMissionProfile = () => {
    if (station == null || station?.missionProfileStep == null) {
      return undefined;
    } else if (pageIdentity === PageIdentity.StationMissionProfile) {
      return (
        <li className="breadcrumb-item active" aria-current="page">
          {t('Page.title.stationMissionProfile')}
        </li>
      );
    } else {
      return (
        <li className="breadcrumb-item">
          <Link to={'/station/profile'}>
            {t('Page.title.stationMissionProfile')}
          </Link>
        </li>
      );
    }
  };

  const renderWeapons = () => {
    if (
      station == null ||
      station.stationFrameStep?.type !== StationFrame.Custom
    ) {
      return undefined;
    } else if (pageIdentity === PageIdentity.StationWeapons) {
      return (
        <li className="breadcrumb-item active" aria-current="page">
          {t('Page.title.stationWeapons')}
        </li>
      );
    } else if (pageIdentity === PageIdentity.StationFinal) {
      return (
        <li className="breadcrumb-item">
          <Link to={'/station/profile'}>{t('Page.title.stationWeapons')}</Link>
        </li>
      );
    } else {
      return undefined;
    }
  };

  const renderTalents = () => {
    if (station == null) {
      return undefined;
    } else if (pageIdentity === PageIdentity.StationTalents) {
      return (
        <li className="breadcrumb-item active" aria-current="page">
          {t('Page.title.stationTalents')}
        </li>
      );
    } else if (
      pageIdentity === PageIdentity.StationFinal ||
      pageIdentity === PageIdentity.StationWeapons ||
      station.additionalTalents?.length
    ) {
      return (
        <li className="breadcrumb-item">
          <Link to={'/station/talents'}>{t('Page.title.stationTalents')}</Link>
        </li>
      );
    } else {
      return undefined;
    }
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to={'/'}>{t('Page.title.home')}</Link>
        </li>

        {pageIdentity === PageIdentity.StationIndex ? (
          <li className="breadcrumb-item active">
            {t('Page.title.stationIndex')}
          </li>
        ) : (
          <li className="breadcrumb-item">
            <Link to={'/station'}>{t('Page.title.stationIndex')}</Link>
          </li>
        )}

        {renderSpaceframe()}
        {renderMissionProfile()}
        {renderTalents()}
        {renderWeapons()}
      </ol>
    </nav>
  );
};
