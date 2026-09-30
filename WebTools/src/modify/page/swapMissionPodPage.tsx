import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import { LcarsFrame } from '../../components/lcarsFrame';
import { Header } from '../../components/header';
import { Dialog } from '../../components/dialog';
import { PageIdentity } from '../../pages/pageIdentity';
import { starshipMapStateToProperties } from '../../solo/page/soloCharacterProperties';
import type { IStarshipProperties } from '../../starship/iStarshipProperties';
import { MissionPodSelection } from '../../starship/view/missionPodSelection';
import { MissionPodReplacementSelection } from '../../starship/view/missionPodReplacementSelection';
import { setStarshipMissionPod } from '../../state/starshipActions';
import { store } from '../../state/store';
import { saveStarshipToLocalStorage } from '../../state/savedConstructActions';
import { marshaller } from '../../helpers/marshaller';

const SwapMissionPodPageBase: React.FC<IStarshipProperties> = ({
  starship,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (starship == null || !starship.spaceframeModel?.isMissionPodAvailable) {
      navigate('/');
    }
  }, [starship, navigate]);

  const viewStarship = () => {
    setTimeout(() => {
      const c = store.getState().starship.starship;
      const hash = store.getState().starship.hash;
      store.dispatch(saveStarshipToLocalStorage(c, hash));
      const value = marshaller.encodeStarship(c);
      navigate('/view?s=' + value);
    }, 200);
  };

  const finish = () => {
    if (starship.missionPodModel == null) {
      Dialog.show(t('SwapMissionPodPage.errorNoSelection'));
    } else if (starship.hasUnreplacedMissionPodOverlaps()) {
      Dialog.show(t('MissionPodReplacement.errorMissing'));
    } else {
      viewStarship();
    }
  };

  return (
    <LcarsFrame activePage={PageIdentity.ModifyStarship}>
      <div id="app">
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/index.html">{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('Page.title.swapMissionPod')}
              </li>
            </ol>
          </nav>

          <Header>{t('Page.title.swapMissionPod')}</Header>
          <p>{t('SwapMissionPodPage.instruction')}</p>

          {starship == null ? undefined : (
            <>
              <MissionPodSelection
                initialSelection={starship.missionPodModel}
                starship={starship}
                onSelection={(missionPod) =>
                  store.dispatch(setStarshipMissionPod(missionPod))
                }
              />
              <MissionPodReplacementSelection starship={starship} />
            </>
          )}

          <div className="mt-5 text-end">
            <Button size="sm" onClick={() => finish()}>
              {t('Common.button.view')}
            </Button>
          </div>
        </div>
      </div>
    </LcarsFrame>
  );
};

export const SwapMissionPodPage = connect(starshipMapStateToProperties)(
  SwapMissionPodPageBase,
);
