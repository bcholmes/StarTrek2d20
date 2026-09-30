import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Header } from '../../components/header';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { LcarsFrame } from '../../components/lcarsFrame';
import { PageIdentity } from '../../pages/pageIdentity';
import { useNavigate } from 'react-router';
import { store } from '../../state/store';
import type { IStationPageProperties } from '../iStationPageProperties';
import { stationMapStateToProperties } from '../iStationPageProperties';
import { connect } from 'react-redux';
import { StatControl } from '../../starship/view/statControl';
import { makeKey } from '../../common/translationKey';
import { System } from '../../helpers/systems';
import { Department } from '../../helpers/department';
import { ScaleSelector } from '../view/scaleSelector';
import {
  changeStationCustomFrameDepartment,
  changeStationCustomFrameSystem,
  setStationCustomScale,
  setStationFrame,
  setStationFrameAppearance,
} from '../../state/stationActions';
import { CustomStationSpaceframeStep } from '../../common/station';
import { Dialog } from '../../components/dialog';
import { StationBreadcrumbs } from '../view/stationBreadcrumbs';
import { StationFrameModel } from '../../helpers/stationFrameModel';
import { StatView } from '../../components/StatView';
import { CheckBox } from '../../components/checkBox';
import Markdown from 'react-markdown';
import type { StationFrameAppearance } from '../../helpers/stationFrame';
import { StationFrame } from '../../helpers/stationFrame';
import {
  DropDownElement,
  DropDownSelect,
} from '../../components/dropDownInput';
import { StationFrameAppearanceModel } from '../../helpers/stationFrameAppearanceModel';
import { CharacterType } from '../../common/characterType';

enum SpaceframeTab {
  Custom,
  Standard,
}

const StationSpaceframePageBase: React.FC<IStationPageProperties> = ({
  station,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<SpaceframeTab>(
    station?.stationFrameStep?.type === StationFrame.Custom
      ? SpaceframeTab.Custom
      : SpaceframeTab.Standard,
  );

  const frames = StationFrameModel.getAllTypes().filter(
    (f) => f.type === station.type,
  );
  frames.sort((s1, s2) => {
    if (s1.localizedName === s2.localizedName) {
      return s2.id - s1.id;
    } else {
      return s1.localizedName.localeCompare(s2.localizedName);
    }
  });

  const onNext = () => {
    if (tab === SpaceframeTab.Custom) {
      if (
        station.sumDepartmentPoints < station.totalAvailableDepartmentPoints
      ) {
        Dialog.show(t('StationSpaceframePage.error.departments'));
      } else if (station.sumSystemPoints < station.totalAvailableSystemPoints) {
        Dialog.show(t('StationSpaceframePage.error.systems'));
      } else {
        navigate('/station/profile');
      }
    } else {
      if (
        station.stationFrameStep?.type === StationFrame.Custom ||
        station.stationFrameStep?.type == null
      ) {
        Dialog.show(t('StationSpaceframePage.error.standardFrame'));
      } else {
        navigate('/station/profile');
      }
    }
  };

  const getAppearanceItems = () => {
    const result = StationFrameAppearanceModel.getAllAppearanceModels().map(
      (m) => new DropDownElement(m.id, m.localizedName),
    );
    result.unshift(new DropDownElement('', t('Common.text.select')));
    return result;
  };

  const onSelectAppearance = (appearance?: StationFrameAppearance) => {
    store.dispatch(setStationFrameAppearance(appearance));
  };

  const onChangeTab = (newTab: SpaceframeTab) => {
    if (newTab === tab) {
      // no change
    } else if (newTab === SpaceframeTab.Custom) {
      store.dispatch(setStationFrame(StationFrame.Custom));
      setTab(newTab);
    } else {
      setTab(newTab);
    }
  };

  const onFrameSelection = (frame: StationFrameModel) => {
    store.dispatch(setStationFrame(frame.id));
  };

  const canIncreaseDepartment = (department: Department) => {
    return (
      getDepartment(department) < station.maxDepartmentValue &&
      station.sumDepartmentPoints < station.totalAvailableDepartmentPoints
    );
  };

  const canDecreaseDepartment = (department: Department) => {
    return getDepartment(department) > 0;
  };

  const canIncreaseSystem = (system: System) => {
    return (
      getSystem(system) < station.maxSystemValue &&
      station.sumSystemPoints < station.totalAvailableSystemPoints
    );
  };

  const canDecreaseSystem = (system: System) => {
    return getSystem(system) > 1;
  };

  const getSystem = (system: System) => {
    const result = station.systems[system];
    return result == null ? 0 : result;
  };

  const getDepartment = (department: Department) => {
    const result = station.departments[department];
    return result == null ? 0 : result;
  };

  const setSystem = (system: System, delta: number) => {
    store.dispatch(changeStationCustomFrameSystem(delta, system));
  };

  const setDepartment = (department: Department, delta: number) => {
    store.dispatch(changeStationCustomFrameDepartment(delta, department));
  };

  const renderSystemsText = () => {
    return (
      <Markdown>
        {t('StationSpaceframePage.systems.instruction', {
          points: station.totalAvailableSystemPoints,
        })}
      </Markdown>
    );
  };

  const renderDepartmentText = () => {
    return (
      <Markdown>
        {t('StationSpaceframePage.departments.instruction', {
          points: station.totalAvailableDepartmentPoints,
        })}
      </Markdown>
    );
  };

  const renderCustomStats = () => {
    return (
      <>
        <section className="my-5">
          <Header level={2}>{t('Construct.other.systems')}</Header>

          {renderSystemsText()}

          <div className="stats-row mt-4">
            <StatControl
              statName={t(makeKey('Construct.system.', System[System.Comms]))}
              value={getSystem(System.Comms)}
              showIncrease={canIncreaseSystem(System.Comms)}
              showDecrease={canDecreaseSystem(System.Comms)}
              onIncrease={() => {
                setSystem(System.Comms, 1);
              }}
              onDecrease={() => {
                setSystem(System.Comms, -1);
              }}
            />

            <StatControl
              statName={t(makeKey('Construct.system.', System[System.Engines]))}
              value={getSystem(System.Engines)}
              showIncrease={canIncreaseSystem(System.Engines)}
              showDecrease={canDecreaseSystem(System.Engines)}
              onIncrease={() => {
                setSystem(System.Engines, 1);
              }}
              onDecrease={() => {
                setSystem(System.Engines, -1);
              }}
            />

            <StatControl
              statName={t(
                makeKey('Construct.system.', System[System.Structure]),
              )}
              value={getSystem(System.Structure)}
              showIncrease={canIncreaseSystem(System.Structure)}
              showDecrease={canDecreaseSystem(System.Structure)}
              onIncrease={() => {
                setSystem(System.Structure, 1);
              }}
              onDecrease={() => {
                setSystem(System.Structure, -1);
              }}
            />
          </div>

          <div className="stats-row">
            <StatControl
              statName={t(
                makeKey('Construct.system.', System[System.Computer]),
              )}
              value={getSystem(System.Computer)}
              showIncrease={canIncreaseSystem(System.Computer)}
              showDecrease={canDecreaseSystem(System.Computer)}
              onIncrease={() => {
                setSystem(System.Computer, 1);
              }}
              onDecrease={() => {
                setSystem(System.Computer, -1);
              }}
            />

            <StatControl
              statName={t(makeKey('Construct.system.', System[System.Sensors]))}
              value={getSystem(System.Sensors)}
              showIncrease={canIncreaseSystem(System.Sensors)}
              showDecrease={canDecreaseSystem(System.Sensors)}
              onIncrease={() => {
                setSystem(System.Sensors, 1);
              }}
              onDecrease={() => {
                setSystem(System.Sensors, -1);
              }}
            />

            <StatControl
              statName={t(makeKey('Construct.system.', System[System.Weapons]))}
              value={getSystem(System.Weapons)}
              showIncrease={canIncreaseSystem(System.Weapons)}
              showDecrease={canDecreaseSystem(System.Weapons)}
              onIncrease={() => {
                setSystem(System.Weapons, 1);
              }}
              onDecrease={() => {
                setSystem(System.Weapons, -1);
              }}
            />
          </div>
        </section>

        <section className="my-5">
          <Header level={2}>{t('Construct.other.departments')}</Header>

          {renderDepartmentText()}

          <div className="stats-row mt-4">
            <StatControl
              statName={t(
                makeKey(
                  'Construct.department.',
                  Department[Department.Command],
                ),
              )}
              value={getDepartment(Department.Command)}
              showIncrease={canIncreaseDepartment(Department.Command)}
              showDecrease={canDecreaseDepartment(Department.Command)}
              onIncrease={() => {
                setDepartment(Department.Command, 1);
              }}
              onDecrease={() => {
                setDepartment(Department.Command, -1);
              }}
            />

            <StatControl
              statName={t(
                makeKey(
                  'Construct.department.',
                  Department[Department.Security],
                ),
              )}
              value={getDepartment(Department.Security)}
              showIncrease={canIncreaseDepartment(Department.Security)}
              showDecrease={canDecreaseDepartment(Department.Security)}
              onIncrease={() => {
                setDepartment(Department.Security, 1);
              }}
              onDecrease={() => {
                setDepartment(Department.Security, -1);
              }}
            />

            <StatControl
              statName={t(
                makeKey(
                  'Construct.department.',
                  Department[Department.Science],
                ),
              )}
              value={getDepartment(Department.Science)}
              showIncrease={canIncreaseDepartment(Department.Science)}
              showDecrease={canDecreaseDepartment(Department.Science)}
              onIncrease={() => {
                setDepartment(Department.Science, 1);
              }}
              onDecrease={() => {
                setDepartment(Department.Science, -1);
              }}
            />
          </div>

          <div className="stats-row">
            <StatControl
              statName={t(
                makeKey('Construct.department.', Department[Department.Conn]),
              )}
              value={getDepartment(Department.Conn)}
              showIncrease={canIncreaseDepartment(Department.Conn)}
              showDecrease={canDecreaseDepartment(Department.Conn)}
              onIncrease={() => {
                setDepartment(Department.Conn, 1);
              }}
              onDecrease={() => {
                setDepartment(Department.Conn, -1);
              }}
            />

            <StatControl
              statName={t(
                makeKey(
                  'Construct.department.',
                  Department[Department.Engineering],
                ),
              )}
              value={getDepartment(Department.Engineering)}
              showIncrease={canIncreaseDepartment(Department.Engineering)}
              showDecrease={canDecreaseDepartment(Department.Engineering)}
              onIncrease={() => {
                setDepartment(Department.Engineering, 1);
              }}
              onDecrease={() => {
                setDepartment(Department.Engineering, -1);
              }}
            />

            <StatControl
              statName={t(
                makeKey(
                  'Construct.department.',
                  Department[Department.Medicine],
                ),
              )}
              value={getDepartment(Department.Medicine)}
              showIncrease={canIncreaseDepartment(Department.Medicine)}
              showDecrease={canDecreaseDepartment(Department.Medicine)}
              onIncrease={() => {
                setDepartment(Department.Medicine, 1);
              }}
              onDecrease={() => {
                setDepartment(Department.Medicine, -1);
              }}
            />
          </div>
        </section>
      </>
    );
  };

  const renderStandardTab = () => {
    const frameRows = frames.map((f, i) => {
      const selectedFrame = station.stationFrameStep?.type;

      return (
        <tbody key={i}>
          <tr>
            <td>
              <div className="selection-header">{f.localizedName}</div>
            </td>
            <td
              className="d-none d-lg-table-cell"
              style={{ verticalAlign: 'top', textAlign: 'center' }}
            >
              {f.scale}
            </td>
            <td className="d-none d-lg-table-cell">
              <div
                className="row row-cols-1 row-cols-lg-3"
                style={{ maxWidth: '32rem' }}
              >
                <StatView
                  name={t('Construct.system.comms')}
                  value={f.systems[System.Comms]}
                  className="col mb-1"
                  showZero={true}
                />
                <StatView
                  name={t('Construct.system.computer')}
                  value={f.systems[System.Computer]}
                  className="col mb-1"
                  showZero={true}
                />
                <StatView
                  name={t('Construct.system.engines')}
                  value={f.systems[System.Engines]}
                  className="col mb-1"
                  showZero={true}
                />
                <StatView
                  name={t('Construct.system.sensors')}
                  value={f.systems[System.Sensors]}
                  className="col mb-1"
                  showZero={true}
                />
                <StatView
                  name={t('Construct.system.structure')}
                  value={f.systems[System.Structure]}
                  className="col mb-1"
                  showZero={true}
                />
                <StatView
                  name={t('Construct.system.weapons')}
                  value={f.systems[System.Weapons]}
                  className="col mb-1"
                  showZero={true}
                />
              </div>
              <div
                className="row row-cols-1 row-cols-lg-3 mt-2 mb-2"
                style={{ maxWidth: '32rem' }}
              >
                <StatView
                  name={t('Construct.department.command')}
                  value={f.departments[Department.Command]}
                  className="col mb-1"
                  showZero={false}
                />
                <StatView
                  name={t('Construct.department.security')}
                  value={f.departments[Department.Security]}
                  className="col mb-1"
                  showZero={false}
                />
                <StatView
                  name={t('Construct.department.science')}
                  value={f.departments[Department.Science]}
                  className="col mb-1"
                  showZero={false}
                />
                <StatView
                  name={t('Construct.department.conn')}
                  value={f.departments[Department.Conn]}
                  className="col mb-1"
                  showZero={false}
                />
                <StatView
                  name={t('Construct.department.engineering')}
                  value={f.departments[Department.Engineering]}
                  className="col mb-1"
                  showZero={false}
                />
                <StatView
                  name={t('Construct.department.medicine')}
                  value={f.departments[Department.Medicine]}
                  className="col mb-1"
                  showZero={false}
                />
              </div>
            </td>

            <td>
              <CheckBox
                isChecked={selectedFrame === f.id}
                text=""
                value={f.id}
                onChanged={(e) => onFrameSelection(f)}
              />
            </td>
          </tr>
        </tbody>
      );
    });

    return (
      <>
        <div className="row">
          <div className="col-12 mt-5">
            <Header level={2}>{t('Construct.other.spaceFrame')}</Header>

            {frames?.length ? (
              <>
                <Markdown>
                  {t('StationSpaceframePage.frame.instruction')}
                </Markdown>
                <table className="selection-list w-100">
                  <thead>
                    <tr>
                      <td></td>
                      <td className="d-none d-lg-table-cell text-center">
                        {t('Construct.other.scale')}
                      </td>
                      <td className="d-none d-lg-table-cell text-center">
                        {t('Construct.other.stats')}
                      </td>
                      <td></td>
                    </tr>
                  </thead>
                  {frameRows}
                </table>
              </>
            ) : (
              <Markdown>
                {t('StationSpaceframePage.noFrames.instruction')}
              </Markdown>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderCustomTab = () => {
    return (
      <>
        <div className="row">
          <div className="col-12 col-md-6 mt-5">
            <Header level={2}>{t('Construct.other.scale')}</Header>
            <ReactMarkdown>
              {t('StationSpaceframePage.scale.instruction')}
            </ReactMarkdown>

            <ScaleSelector
              scale={
                station.stationFrameStep?.scale ??
                CustomStationSpaceframeStep.MIN_SCALE
              }
              onChange={(v) => store.dispatch(setStationCustomScale(v))}
            />
          </div>

          {station?.type === CharacterType.Federation ? (
            <div className="col-12 col-md-6 mt-5">
              <Header level={2}>{t('Construct.other.appearance')}</Header>
              <ReactMarkdown>
                {t('StationSpaceframePage.appearance.instruction')}
              </ReactMarkdown>

              <DropDownSelect
                defaultValue={station?.stationFrameStep?.appearance ?? ''}
                items={getAppearanceItems()}
                onChange={(e) =>
                  e === ''
                    ? onSelectAppearance(undefined)
                    : onSelectAppearance(e as StationFrameAppearance)
                }
              />
            </div>
          ) : undefined}
        </div>

        {renderCustomStats()}
      </>
    );
  };

  return (
    <LcarsFrame activePage={PageIdentity.StationSpaceframe}>
      <div id="app">
        <div className="page container ms-0">
          <StationBreadcrumbs
            pageIdentity={PageIdentity.StationSpaceframe}
            station={station}
          />
          <main>
            <Header>{t('Page.title.stationSpaceframe')}</Header>

            <ReactMarkdown>
              {t('StationSpaceframePage.instruction')}
            </ReactMarkdown>

            <div
              className="btn-group w-100"
              role="group"
              aria-label={t('StationSpaceframePage.frameType')}
            >
              <button
                type="button"
                className={
                  'btn btn-info btn-sm p-2 text-center ' +
                  (tab === SpaceframeTab.Custom ? 'active' : '')
                }
                onClick={() => onChangeTab(SpaceframeTab.Custom)}
              >
                {t('StationSpaceframePage.custom')}
              </button>
              <button
                type="button"
                className={
                  'btn btn-info btn-sm p-2 text-center ' +
                  (tab === SpaceframeTab.Standard ? 'active' : '')
                }
                onClick={() => onChangeTab(SpaceframeTab.Standard)}
              >
                {t('StationSpaceframePage.standard')}
              </button>
            </div>

            {tab === SpaceframeTab.Custom
              ? renderCustomTab()
              : renderStandardTab()}

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

export const StationSpaceframePage = connect(stationMapStateToProperties)(
  StationSpaceframePageBase,
);
