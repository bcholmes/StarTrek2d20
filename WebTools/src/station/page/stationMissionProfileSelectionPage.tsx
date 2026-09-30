import React from 'react';
import Button from 'react-bootstrap/Button';
import { Header } from '../../components/header';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { LcarsFrame } from '../../components/lcarsFrame';
import { PageIdentity } from '../../pages/pageIdentity';
import { Link, useNavigate } from 'react-router';
import type { MissionProfileModel } from '../../helpers/missionProfiles';
import { MissionProfiles } from '../../helpers/missionProfiles';
import { CheckBox } from '../../components/checkBox';
import { connect } from 'react-redux';
import type { IStationPageProperties } from '../iStationPageProperties';
import { stationMapStateToProperties } from '../iStationPageProperties';
import { store } from '../../state/store';
import {
  setStationMissionProfile,
  setStationMissionProfileTalent,
} from '../../state/stationActions';
import { Dialog } from '../../components/dialog';
import { SelectedTalent } from '../../common/selectedTalent';
import { RankedTalent } from '../../helpers/rankedTalent';
import type { TalentModel } from '../../helpers/talentModel';
import { SingleTalentSelectionList } from '../../components/singleTalentSelectionList';
import { StandardStationSpaceframeStep } from '../../common/station';
import { StationFrame } from '../../helpers/stationFrame';

const StationMissionProfileSelectionPageBase: React.FC<
  IStationPageProperties
> = ({ station }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const selectedProfile =
    station.missionProfileStep?.type != null
      ? MissionProfiles.instance.getStationMissionProfileByType(
          station.missionProfileStep.type,
        )
      : undefined;

  let availableProfiles = MissionProfiles.instance.getStationMissionProfiles();
  if (station?.stationFrameStep instanceof StandardStationSpaceframeStep) {
    const model = (station.stationFrameStep as StandardStationSpaceframeStep)
      .model;
    if (model.missionProfiles?.length) {
      const temp = model.missionProfiles.map((p) => p.profile);
      availableProfiles = availableProfiles.filter((p) => temp.includes(p.id));
    }
  }

  const onSelection = (missionProfile: MissionProfileModel) => {
    store.dispatch(setStationMissionProfile(missionProfile.id));
  };

  const onNext = () => {
    if (station.missionProfileStep?.type == null) {
      Dialog.show(t('StationMissionProfile.error.selectProfile'));
    } else if (
      station.stationFrameStep?.type === StationFrame.Custom &&
      station.missionProfileStep?.talent == null
    ) {
      Dialog.show(t('StationMissionProfile.error.selectTalent'));
    } else {
      navigate('/station/talents');
    }
  };

  const saveTalent = (talent: SelectedTalent) => {
    if (talent) {
      store.dispatch(setStationMissionProfileTalent(talent));
    } else {
      store.dispatch(setStationMissionProfileTalent(undefined));
    }
  };

  const getTalents = () => {
    const talents: RankedTalent[] = [];

    selectedProfile?.talents?.forEach((t) => {
      const talent =
        t instanceof SelectedTalent
          ? (t as SelectedTalent).talentModel
          : (t as TalentModel);
      if (!talent.isSourcePrerequisiteFulfilled(station)) {
        // skip it
      } else if (
        station.stationFrameStep?.type === StationFrame.Custom ||
        !(
          station.stationFrameStep as StandardStationSpaceframeStep
        ).model.talents
          .map((ft) => ft.name)
          .includes(t.name)
      ) {
        talents.push(
          new RankedTalent(talent, talent.maxRank > 1 ? 1 : undefined),
        );
      } else if (talent.maxRank > 1) {
        talents.push(
          new RankedTalent(talent, station.getRankForTalent(talent.name) + 1),
        );
      }
    });
    return talents;
  };

  const missionProfiles = availableProfiles.map((m, i) => {
    return (
      <tbody key={i}>
        <tr>
          <td className="text-end">
            <CheckBox
              isChecked={station?.missionProfileStep?.type === m.id}
              text=""
              value={m.id}
              onChanged={() => {
                onSelection(m);
              }}
            />
          </td>
          <td className="">
            <div className="selection-header">{m.localizedName}</div>
          </td>
        </tr>
      </tbody>
    );
  });

  return (
    <LcarsFrame activePage={PageIdentity.StationMissionProfile}>
      <div id="app">
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={'/'}>{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={'/station'}>{t('Page.title.stationIndex')}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={'/station/frame'}>
                  {t('Page.title.stationSpaceframe')}
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('Page.title.stationMissionProfile')}
              </li>
            </ol>
          </nav>
          <main>
            <Header>{t('Page.title.stationMissionProfile')}</Header>

            <ReactMarkdown>
              {t('StationMissionProfile.instruction')}
            </ReactMarkdown>

            <section className="row">
              <div className="col-12 col-md-6 mt-4">
                <table className="selection-list w-100">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  {missionProfiles}
                </table>
              </div>

              {selectedProfile != null ? (
                <div className="col-12 col-md-6 mt-4">
                  <Header level={2}>{selectedProfile.localizedName}</Header>
                  <div>
                    <ReactMarkdown className="markdown-sm">
                      {selectedProfile.localizedDescription}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : undefined}

              {selectedProfile != null &&
              station.stationFrameStep?.type === StationFrame.Custom ? (
                <div className="col-12 mt-4">
                  <Header level={2} className="mt-4">
                    {t('Construct.other.talent')}
                  </Header>
                  <SingleTalentSelectionList
                    talents={getTalents()}
                    initialSelection={
                      station.missionProfileStep?.talent?.talentModel
                    }
                    construct={station}
                    onSelection={(talent) => saveTalent(talent)}
                  />
                </div>
              ) : undefined}
            </section>

            <div className="text-end mt-5">
              <Button onClick={() => onNext()}>
                {t('Common.button.next')}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </LcarsFrame>
  );
};

export const StationMissionProfileSelectionPage = connect(
  stationMapStateToProperties,
)(StationMissionProfileSelectionPageBase);
