import React, { useState } from 'react';

import { Header } from '../components/header';
import { LcarsFrame } from '../components/lcarsFrame';
import { PageIdentity } from '../pages/pageIdentity';
import { ModalControl } from '../components/modal';
import { AddCharacterView } from './addCharacterView';
import { connect } from 'react-redux';
import { GMCharacterView as GmCharacterView } from './gmCharacterView';
import type { CharacterWithTracking } from './model/characterWithTracking';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../components/iconButton';
import { LoadingButton } from '../common/loadingButton';
import { Link } from 'react-router';

interface IGMTrackerPageProperties {
  characters: CharacterWithTracking[];
}

const GMTrackerPageBase: React.FC<IGMTrackerPageProperties> = ({
  characters,
}) => {
  const { t } = useTranslation();
  const [loadingExport, setLoadingExport] = useState<boolean>(false);

  const showAddModal = () => {
    ModalControl.show(
      'lg',
      () => closeModal(),
      <AddCharacterView onDone={() => closeModal()} />,
      t('GMTracker.addCharacterModalTitle'),
    );
  };

  const closeModal = () => {
    ModalControl.hide();
  };

  function exportPdf() {
    setLoadingExport(true);
    import(/* webpackChunkName: 'export' */ '../exportpdf/gmTrackerSheet').then(
      async ({ GmTrackerPdfSheet }) => {
        setLoadingExport(false);
        await new GmTrackerPdfSheet().export(
          characters.map((c) => c.character),
        );
      },
    );
  }

  return (
    <LcarsFrame activePage={PageIdentity.GamemasterTrackerPage}>
      <div id="app">
        <div className="container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/index.html">{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/tools">{t('Page.title.otherTools')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('Page.title.gamemasterTrackerPage')}
              </li>
            </ol>
          </nav>
          <main>
            <Header>{t('GMTracker.title')}</Header>
            <p>{t('GMTracker.instruction')}</p>

            <div className="text-end">
              <IconButton onClick={() => showAddModal()} icon="plus-circle" />
            </div>

            {characters.map((c, i) => (
              <GmCharacterView tracking={c} key={'character-' + c.id} />
            ))}

            <div className="mt-5">
              <LoadingButton
                loading={loadingExport}
                size="sm"
                onClick={exportPdf}
              >
                {t('Common.button.exportPdf')}
              </LoadingButton>
            </div>
          </main>
        </div>
      </div>
    </LcarsFrame>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    characters: state.gmTracker.characters,
  };
}

export const GMTrackerPage = connect(mapStateToProps)(GMTrackerPageBase);
