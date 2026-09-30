import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Header } from '../../components/header';
import { setSectorName, setStar } from '../../state/starActions';
import { store } from '../../state/store';
import { EditableHeader } from '../view/editableHeader';
import { LcarsDecorationLeftView } from '../view/lcarsDecorationLeft';
import { LcarsDecorationRightView } from '../view/lcarsDecorationRight';
import { SectorMapView } from '../view/sectorMapView';
import { SystemView } from '../view/systemView';
import type { Sector } from '../table/sector';
import type { StarSystem } from '../table/starSystem';
import { PDFDocument } from '@cantoo/pdf-lib';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { LoadingButton } from '../../common/loadingButton';
import { LcarsFrame } from '../../components/lcarsFrame';
import { PageIdentity } from '../../pages/pageIdentity';
declare function download(
  bytes: Uint8Array | ArrayBuffer,
  fileName: string,
  contentType: string,
): void;

interface ISectorDetailsPageProperties {
  sector: Sector;
}

const SectorDetailsPageBase: React.FC<ISectorDetailsPageProperties> = ({
  sector,
}) => {
  const [loadingExport, setLoadingExport] = useState(false);
  const navigate = useNavigate();

  const exportPdf = () => {
    setLoadingExport(true);
    import(/* webpackChunkName: 'export' */ '../export/pdfExporter').then(
      async ({ PdfExporter }) => {
        const existingPdfBytes = await fetch(
          '/static/pdf/TNG_Sector_Map.pdf',
        ).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        await new PdfExporter().populate(pdfDoc, sector);

        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, 'Sector-' + sector.name + '.pdf', 'application/pdf');
        setLoadingExport(false);
      },
    );
  };

  const showSystem = (system: StarSystem) => {
    store.dispatch(setStar(system));
    navigate('/tools/sector/starSystem');
  };

  const setSectorNameHandler = (text: string) => {
    store.dispatch(setSectorName(text));
  };

  const { t } = useTranslation();
  return sector ? (
    <LcarsFrame activePage={PageIdentity.SectorDetails}>
      <div id="app">
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={'/tools'}>{t('Page.title.otherTools')}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/tools/sector/generator">
                  {t('Page.title.systemGeneration')}
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('Page.title.sectorDetails')}
              </li>
            </ol>
          </nav>

          <EditableHeader
            prefix="Sector"
            separator=" • "
            text={sector.name}
            onChange={setSectorNameHandler}
          />
          <div className="d-flex justify-content-center">
            <div className="d-md-block d-none">
              <LcarsDecorationLeftView />
            </div>
            <SectorMapView sector={sector} onClick={(s) => showSystem(s)} />
            <div className="d-md-block d-none">
              <LcarsDecorationRightView />
            </div>
          </div>
          <Header level={2} className="mb-5 mt-4">
            Notable Systems
          </Header>
          <div>
            <table className="selection-list">
              <thead>
                <tr>
                  <td>System Identifier</td>
                  <td>{t('StarSystem.common.primaryStar')}</td>
                  <td className="text-center">
                    {t('StarSystem.common.worlds')}
                  </td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {sector.systems.map((s, i) => (
                  <SystemView
                    system={s}
                    key={'system-' + i}
                    onClick={() => showSystem(s)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
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
  ) : null;
};

function mapStateToProps(state, ownProps) {
  return {
    sector: state.star.sector,
  };
}

export const SectorDetailsPage = connect(mapStateToProps)(
  SectorDetailsPageBase,
);
