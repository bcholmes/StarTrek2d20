import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Header } from '../../components/header';
import { setStarSystemName } from '../../state/starActions';
import { store } from '../../state/store';
import type { StarSystem } from '../table/starSystem';
import { EditableHeader } from '../view/editableHeader';
import { NotablePhenomenonView } from '../view/notablePhenomenonView';
import { StarView } from '../view/starView';
import { SystemMapLowerView } from '../view/systemMapLowerView';
import { SystemMapUpperView } from '../view/systemMapUpperView';
import { WorldView } from '../view/worldView';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { LcarsFrame } from '../../components/lcarsFrame';
import { PageIdentity } from '../../pages/pageIdentity';
import { LoadingButton } from '../../common/loadingButton';
declare function download(
  bytes: Uint8Array | ArrayBuffer,
  fileName: string,
  contentType: string,
): void;

interface IStarSystemDetailsPageProperties {
  starSystem?: StarSystem;
}

const StarSystemDetailsPageBase: React.FC<IStarSystemDetailsPageProperties> = ({
  starSystem,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderWorlds = (title: string, from: number, to?: number) => {
    const worlds = starSystem.worldsAndSatelliteWorlds.filter(
      (w) => w.orbitalRadius >= from && (to == null || w.orbitalRadius < to),
    );
    if (worlds.length > 0) {
      const list = worlds.map((w, i) => (
        <WorldView world={w} system={starSystem} key={'world-' + w.orbitId} />
      ));
      return (
        <div>
          <div className="page-text my-3">{title}</div>
          <div>{list}</div>
        </div>
      );
    } else {
      return undefined;
    }
  };

  const [loadingExport, setLoadingExport] = useState(false);

  const exportPdf = () => {
    setLoadingExport(true);
    import(/* webpackChunkName: 'export' */ '../export/pdfExporter').then(
      async ({ PdfExporter }) => {
        setLoadingExport(false);

        const pdfDoc = await new PdfExporter().createStarSystemPdf(starSystem);

        const pdfBytes = await pdfDoc.save();
        download(
          pdfBytes,
          'System-' + starSystem.name + '.pdf',
          'application/pdf',
        );
      },
    );
  };

  if (!starSystem) {
    navigate('/tools/sector/generator');
  } else {
    return (
      <LcarsFrame activePage={PageIdentity.SectorDetails}>
        <div id="app">
          <div className="page container ms-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/index.html">{t('Page.title.home')}</a>
                </li>
                <li className="breadcrumb-item">
                  <Link to={'/tools'}>{t('Page.title.otherTools')}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/tools/sector/generator">
                    {t('Page.title.systemGeneration')}
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/tools/sector/details">
                    {t('Page.title.sectorDetails')}
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t('Page.title.starSystemDetails')}
                </li>
              </ol>
            </nav>

            <EditableHeader
              prefix="System"
              separator=" • "
              text={starSystem.name}
              onChange={(text) => store.dispatch(setStarSystemName(text))}
            />

            <div className="row my-4">
              <div className="col-md-2 view-field-label pb-2">
                {t('StarSystem.common.coordinates') + ':'}
              </div>
              <div className="col-md-4 text-white">
                <div className="view-border-bottom pb-2">
                  {starSystem ? starSystem.sectorCoordinates.description : ''}
                </div>
              </div>
            </div>

            <div className="my-4 d-none d-md-block">
              <SystemMapUpperView system={starSystem} />
              <SystemMapLowerView system={starSystem} />
            </div>

            <div>
              <div className="row row-cols-1 row-cols-md-2">
                <NotablePhenomenonView
                  phenomenon={starSystem ? starSystem.phenomenon : undefined}
                />
                <StarView
                  star={starSystem ? starSystem.star : undefined}
                  title={t('StarSystem.common.primaryStar')}
                />
                <StarView
                  star={starSystem ? starSystem.companionStar : undefined}
                  title={t('StarSystem.common.companionStar')}
                  companionType={starSystem.companionType}
                  orbitalRadius={starSystem.companionOrbitalRadius}
                />
              </div>
            </div>
            <div className="mt-5">
              <Header level={2} className="mb-4">
                {t('StarSystem.common.worlds')}
              </Header>
              <div>
                {renderWorlds(
                  t('StarSystem.common.innerZone'),
                  0,
                  starSystem.gardenZoneInnerRadius,
                )}
                {renderWorlds(
                  t('StarSystem.common.ecosphere'),
                  starSystem.gardenZoneInnerRadius,
                  starSystem.gardenZoneOuterRadius,
                )}
                {renderWorlds(
                  t('StarSystem.common.outerZone'),
                  starSystem.gardenZoneOuterRadius,
                )}
              </div>
            </div>

            <div>
              <Button
                size="sm"
                className="me-2"
                onClick={() => navigate('/tools/sector/details')}
              >
                Back to Sector
              </Button>
              <LoadingButton
                loading={loadingExport}
                size="sm"
                onClick={() => exportPdf()}
                className="me-2"
              >
                {t('Common.button.exportPdf')}
              </LoadingButton>
            </div>
          </div>
        </div>
      </LcarsFrame>
    );
  }
};

function mapStateToProps(state, ownProps) {
  return {
    starSystem: state.star.starSystem,
  };
}

export const StarSystemDetailsPage = connect(mapStateToProps)(
  StarSystemDetailsPageBase,
);
