import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from '@dr.pogodin/react-helmet';
import { LcarsFrame } from '../components/lcarsFrame';
import { PageIdentity } from '../pages/pageIdentity';
import { Header } from '../components/header';
import Button from 'react-bootstrap/Button';
import { TokenHelper } from '../exportpdf/tokenHelper';
import { UniformSelectionView } from './view/uniformSelectionView';
import { SpeciesSelectionView } from './view/speciesSelectionView';
import { TokenSvgBuilder } from './tokenSvgBuilder';
import { connect } from 'react-redux';
import { CheckBox } from '../components/checkBox';
import { NoseSelectionView } from './view/noseSelectionView';
import { MouthSelectionView } from './view/mouthSelectionView';
import { HairSelectionView } from './view/hairSelectionView';
import { HeadSelectionView } from './view/headSelectionView';
import { EyeSelectionView } from './view/eyeSelectionView';
import { DivisionColors } from './model/divisionColors';
import { SpeciesHelper } from '../helpers/species';
import { ExtraSelectionView as ExtrasSelectionView } from './view/extrasSelectionView';
import { Rank } from '../helpers/ranks';
import { UniformEra } from './model/uniformEra';
import { UniformPackCollection } from './model/uniformPackCollection';
import { HeadCatalog } from './model/headCatalog';
import { UniformVariantRestrictions } from './model/uniformVariantRestrictions';
import { TokenModel } from './model/tokenModel';
import { ExtrasCatalog } from './model/extrasCatalog';
import { Spinner } from 'react-bootstrap';
import { marshaller } from '../helpers/marshaller';
import { saveCharacterToLocalStorage } from '../state/savedConstructActions';
import { TokenConfig } from '../common/character';
import { store } from '../state/store';
import { useNavigate } from 'react-router';
import { SpeciesRestrictions } from './model/speciesRestrictions';
import { setTokenBordered, setTokenRounded } from '../state/tokenActions';

declare function download(
  bytes: Uint8Array | ArrayBuffer,
  fileName: string,
  contentType: string,
): void;

enum Tab {
  Species,
  Body,
  Head,
  Mouth,
  Nose,
  Eyes,
  Hair,
  Extras,
}

interface ITokenCreationPageProperties {
  token: TokenModel;
  marshalledCharacter?: string;
  characterName?: string;
  replacementHash?: number;
  rounded?: boolean;
  bordered?: boolean;
}

const TokenCreationPageBase: React.FC<ITokenCreationPageProperties> = ({
  token,
  characterName,
  marshalledCharacter,
  replacementHash,
  rounded,
  bordered,
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>(Tab.Species);
  const [loadingUniform, setLoadingUniform] = useState<boolean>(false);
  const [loadingRubberHead, setLoadingRubberHead] = useState<boolean>(false);
  const [loadingExtras, setLoadingExtras] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (SpeciesRestrictions.isRubberHeaded(token.species)) {
      loadHeadExtension();
    }
    if (UniformPackCollection.instance.isLoaded(token.uniformEra)) {
      loadUniformPack(token.uniformEra);
    }
    if (token.extras?.length) {
      loadExtrasExtension();
    }
  }, [token.extras?.length, token.species, token.uniformEra]);

  const selectTab = (tab: Tab) => {
    setTab(tab);
  };

  const loadUniformPack = (uniformEra: UniformEra) => {
    setLoadingUniform(true);
    UniformPackCollection.instance.loadUniformPack(uniformEra, () =>
      setLoadingUniform(false),
    );
  };

  const loadHeadExtension = () => {
    setLoadingRubberHead(true);
    HeadCatalog.instance.loadRubberHeadExtension(() =>
      setLoadingRubberHead(false),
    );
  };

  const loadExtrasExtension = async () => {
    setLoadingExtras(true);
    ExtrasCatalog.instance.loadLibraryExtension(() => setLoadingExtras(false));
  };

  const renderTab = () => {
    switch (tab) {
      case Tab.Species:
        return (
          <SpeciesSelectionView
            isLoading={loadingRubberHead}
            loadExtension={() => loadHeadExtension()}
            token={token}
          />
        );
      case Tab.Body:
        return (
          <UniformSelectionView
            isLoading={loadingUniform}
            loadPack={(uniformEra) => loadUniformPack(uniformEra)}
            token={token}
          />
        );
      case Tab.Head:
        return <HeadSelectionView isLoading={loadingExtras} token={token} />;
      case Tab.Mouth:
        return <MouthSelectionView token={token} />;
      case Tab.Nose:
        return <NoseSelectionView token={token} />;
      case Tab.Eyes:
        return <EyeSelectionView token={token} />;
      case Tab.Hair:
        return <HairSelectionView token={token} />;
      case Tab.Extras:
        if (ExtrasCatalog.instance.isLibraryLoaded) {
          return <ExtrasSelectionView token={token} />;
        } else {
          if (!loadingExtras) {
            loadExtrasExtension();
          }
          return (
            <div className="mt-4 text-center">
              <Spinner animation="border" className="text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          );
        }
      default:
        return (
          <div className="mt-4">
            <p>Not yet available.</p>
          </div>
        );
    }
  };

  const exportPng = async () => {
    TokenHelper.renderSvg(
      TokenSvgBuilder.createSvg(token, rounded, bordered && rounded),
      400,
      400,
    ).then((png) => {
      const division = DivisionColors.getDivision(
        token.uniformEra,
        token.divisionColor,
      );
      const species = SpeciesHelper.getSpeciesByType(token.species);
      const speciesName = species.name.replace(/[ ()’']/g, '');
      const name =
        'token-' +
        speciesName +
        '-' +
        (division != null ? division + '-' : '') +
        UniformEra[token.uniformEra] +
        (UniformVariantRestrictions.isRankSupported(
          token.rankIndicator,
          token.uniformEra,
        ) && token.rankIndicator !== Rank.None
          ? '-' + Rank[token.rankIndicator] + '.png'
          : '');
      download(png, name, 'image/png');
    });
  };

  const returnToViewPage = () => {
    const json = marshaller.decode(marshalledCharacter);
    const c = marshaller.decodeCharacter(json);
    c.token = new TokenConfig(token, rounded, bordered);
    store.dispatch(saveCharacterToLocalStorage(c, replacementHash));
    const value = marshaller.encodeCharacter(c);
    navigate('/view?s=' + value);
  };

  const showCharacterDetails = () => {
    return (
      <div className="d-flex mb-5 justify-content-between">
        <p>Token for {characterName}</p>
        <Button size="sm" onClick={returnToViewPage}>
          {t('Common.button.view')}
        </Button>
      </div>
    );
  };

  const svg =
    loadingExtras || loadingRubberHead || loadingUniform ? (
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    ) : (
      TokenSvgBuilder.createSvg(token, rounded, bordered && rounded)
    );

  return (
    <>
      <Helmet>
        <title>Star Trek Adventures Token Generator</title>
        <meta
          property="og:title"
          content="Star Trek Adventures Token Generator"
        />
        <meta
          property="og:description"
          content="A free application that you can use to create downloadable character tokens for Modiphius' Star Trek Adventures Role Playing Game."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/static/img/bannerImageToken.png" />
        <meta property="og:url" content="https://sta.bcholmes.org/token" />
      </Helmet>
      <LcarsFrame activePage={PageIdentity.TokenCreationPage}>
        <div id="app">
          <div className="page container ms-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/index.html">{t('Page.title.home')}</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t('Page.title.tokenCreationPage')}
                </li>
              </ol>
            </nav>

            <main>
              <Header>{t('Page.title.tokenCreationPage')}</Header>

              <div className="row">
                <div className="col-lg-4 mt-4">
                  <div
                    className="mw-100"
                    style={{ width: '400px', aspectRatio: '1' }}
                    dangerouslySetInnerHTML={{ __html: svg as string }}
                  ></div>

                  <div className="row">
                    <div className="col-6">
                      <div className="mt-3">
                        <CheckBox
                          value="rounded"
                          isChecked={rounded}
                          onChanged={(val) =>
                            store.dispatch(setTokenRounded(!rounded))
                          }
                          text={t('TokenCreator.option.rounded')}
                        />
                      </div>
                      <div>
                        <CheckBox
                          value="fancy"
                          isChecked={bordered && rounded}
                          onChanged={(val) =>
                            store.dispatch(setTokenBordered(!bordered))
                          }
                          text={t('TokenCreator.option.bordered')}
                          disabled={!rounded}
                        />
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="mt-4 text-end">
                        <Button
                          className="btn-xs mw-100"
                          onClick={() => exportPng()}
                        >
                          {t('Common.button.export')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 mt-4">
                  {characterName?.length ? showCharacterDetails() : undefined}

                  <div
                    className="btn-group w-100"
                    role="group"
                    aria-label="Avatar part types"
                  >
                    <button
                      type="button"
                      className={
                        'btn btn-info btn-sm p-2 text-center ' +
                        (tab === Tab.Species ? 'active' : '')
                      }
                      onClick={() => selectTab(Tab.Species)}
                    >
                      {t('TokenCreator.section.species')}
                    </button>
                    <button
                      type="button"
                      className={
                        'btn btn-info btn-sm p-2 text-center ' +
                        (tab === Tab.Body ? 'active' : '')
                      }
                      onClick={() => selectTab(Tab.Body)}
                    >
                      {t('TokenCreator.section.body')}
                    </button>
                    <button
                      type="button"
                      className={
                        'btn btn-info btn-sm p-2 text-center ' +
                        (tab === Tab.Head ? 'active' : '')
                      }
                      onClick={() => selectTab(Tab.Head)}
                    >
                      {t('TokenCreator.section.head')}
                    </button>
                    <button
                      type="button"
                      className={
                        'btn btn-info btn-sm p-2 text-center ' +
                        (tab === Tab.Hair ? 'active' : '')
                      }
                      onClick={() => selectTab(Tab.Hair)}
                    >
                      {t('TokenCreator.section.hair')}
                    </button>
                    <button
                      type="button"
                      className={
                        'btn btn-info btn-sm p-2 text-center ' +
                        (tab === Tab.Mouth ? 'active' : '')
                      }
                      onClick={() => selectTab(Tab.Mouth)}
                    >
                      {t('TokenCreator.section.mouth')}
                    </button>
                    <button
                      type="button"
                      className={
                        'btn btn-info btn-sm p-2 text-center ' +
                        (tab === Tab.Nose ? 'active' : '')
                      }
                      onClick={() => selectTab(Tab.Nose)}
                    >
                      {t('TokenCreator.section.nose')}
                    </button>
                    <button
                      type="button"
                      className={
                        'btn btn-info btn-sm p-2 text-center ' +
                        (tab === Tab.Eyes ? 'active' : '')
                      }
                      onClick={() => selectTab(Tab.Eyes)}
                    >
                      {t('TokenCreator.section.eyes')}
                    </button>
                    <button
                      type="button"
                      className={
                        'btn btn-info btn-sm p-2 text-center ' +
                        (tab === Tab.Extras ? 'active' : '')
                      }
                      onClick={() => selectTab(Tab.Extras)}
                    >
                      {t('TokenCreator.section.extras')}
                    </button>
                  </div>
                  {renderTab()}
                </div>
              </div>
            </main>
          </div>
        </div>
      </LcarsFrame>
    </>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    token: TokenModel.from(state.token.token),
    marshalledCharacter: state.token.marshalledCharacter,
    characterName: state.token.characterName,
    replacementHash: state.token.replacementHash,
    rounded: state.token.rounded,
    bordered: state.token.bordered,
  };
}

export const TokenCreationPage = connect(mapStateToProps)(
  TokenCreationPageBase,
);
