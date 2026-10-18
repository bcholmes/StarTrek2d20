import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigation } from '../../common/navigator';
import type { Starship } from '../../common/starship';
import Button from 'react-bootstrap/Button';
import { Dialog } from '../../components/dialog';
import { Header } from '../../components/header';
import { PageIdentity } from '../../pages/pageIdentity';
import {
  nextStarshipWorkflowStep,
  setStarshipSpaceframe,
} from '../../state/starshipActions';
import { store } from '../../state/store';
import type { ShipBuildWorkflow } from '../model/shipBuildWorkflow';
import { ShipBuildingBreadcrumbs } from '../view/shipBuildingBreadcrumbs';
import { SpaceframeSelection } from '../view/spaceframeSelection';
import { useTranslation } from 'react-i18next';
import { InstructionText } from '../../components/instructionText';
import {
  TALENT_NAME_DEDICATED_PERSONNEL,
  TALENT_NAME_REDUNDANT_SYSTEMS,
} from '../../helpers/talents';
import { CustomSpaceframeView } from '../view/customSpaceframeView';
import { PointAllocator } from '../../helpers/pointAllocator';
import { BuildPoints } from '../model/buildPoints';
import { SpaceframeModel } from '../../helpers/spaceframeModel';
import { ShipBuildType } from '../../common/shipBuildType';
import { PageHistoryBasedPreviousButton } from '../../components/pageHistoryBasedPreviousButton';
import { SpaceframeHelper } from '../../helpers/spaceframes';

enum SpaceframeTab {
  Custom,
  Standard,
}

interface ISpaceframeSelectionPageProperties {
  starship: Starship;
  workflow: ShipBuildWorkflow;
}

const SpaceframeSelectionPageBase: React.FC<
  ISpaceframeSelectionPageProperties
> = ({ starship, workflow }) => {
  const spaceframes = SpaceframeHelper.instance().getSpaceframes(
    starship,
    false,
  );

  const { t } = useTranslation();
  const noFrames = spaceframes?.length ? false : true;
  const [tab, setTab] = useState<SpaceframeTab>(
    noFrames || starship?.spaceframeStep?.model?.isCustom
      ? SpaceframeTab.Custom
      : SpaceframeTab.Standard,
  );

  useEffect(() => {
    if (tab === SpaceframeTab.Custom) {
      createCustomSpaceframe();
    }
  }, [tab]);

  const createCustomSpaceframe = () => {
    if (!starship.spaceframeModel?.isCustom) {
      const scale = 3;
      const systems = PointAllocator.allocatePointsEvenly(
        BuildPoints.systemPointsForType(
          ShipBuildType.Starship,
          starship.serviceYear,
          starship.type,
          scale,
          starship.version,
        ),
      );
      const departments = PointAllocator.allocatePointsEvenly(
        BuildPoints.departmentPointsForType(ShipBuildType.Starship),
      );
      const spaceframe = SpaceframeModel.createCustomSpaceframe(
        starship?.type,
        starship?.serviceYear,
        systems,
        departments,
        scale,
      );
      store.dispatch(setStarshipSpaceframe(spaceframe));
    }
  };

  const onChangeTab = (newTab: SpaceframeTab) => {
    if (newTab === tab) {
      // no change
    } else {
      setTab(newTab);
    }
  };

  const requiresDedicatedPersonnelSelection = () => {
    const talents = starship.spaceframeModel.talents.filter(
      (t) => t.name === TALENT_NAME_DEDICATED_PERSONNEL && t.department == null,
    );
    return talents?.length;
  };

  const requiresRedundantSystemsSelection = () => {
    const talents = starship.spaceframeModel.talents.filter(
      (t) =>
        t.name === TALENT_NAME_REDUNDANT_SYSTEMS &&
        t.system == null &&
        t.selection == null,
    );
    return talents?.length;
  };

  const nextPage = () => {
    if (tab === SpaceframeTab.Standard) {
      if (
        starship.spaceframeModel == null ||
        starship.spaceframeModel.isCustom
      ) {
        Dialog.show('Please select a spaceframe before proceeding.');
      } else if (
        requiresDedicatedPersonnelSelection() ||
        requiresRedundantSystemsSelection()
      ) {
        Navigation.navigateToPage(PageIdentity.ExtraStarshipTalentChoice);
      } else {
        const step = workflow.peekNextStep();
        store.dispatch(nextStarshipWorkflowStep());
        Navigation.navigateToPage(step.page);
      }
    } else {
      if (!starship.className) {
        Dialog.show('Please provide a name for this class of ship.');
      } else if (
        starship.spaceframeModel.sumSystemPoints <
        starship.totalAvailableSystemPoints
      ) {
        Dialog.show('You have not distributed all the Systems Points');
      } else if (
        starship.spaceframeModel.sumDepartmentPoints <
        starship.totalAvailableDepartmentPoints
      ) {
        Dialog.show('You have not distributed all the Department Points');
      } else {
        Navigation.navigateToPage(PageIdentity.StarshipWeaponsSelection);
      }
    }
  };

  return (
    <div className="page container ms-0">
      <ShipBuildingBreadcrumbs />
      <Header>{t('Page.title.spaceframeSelection')}</Header>
      <InstructionText text={t('SpaceframeSelectionPage.text')} />

      <div
        className="btn-group w-100 mb-4"
        role="group"
        aria-label={t('StationSpaceframePage.frameType')}
      >
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
      </div>

      {tab === SpaceframeTab.Standard ? (
        <SpaceframeSelection
          initialSelection={starship.spaceframeModel}
          starship={starship}
          serviceYear={starship.serviceYear}
          type={starship.type}
          onSelection={(spaceframe, variant) =>
            store.dispatch(setStarshipSpaceframe(spaceframe, variant))
          }
        />
      ) : (
        <CustomSpaceframeView starship={starship} />
      )}
      <div className="mt-4 d-flex justify-content-end">
        <PageHistoryBasedPreviousButton />
        <Button onClick={() => nextPage()}>{t('Common.button.next')}</Button>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    starship: state.starship.starship,
    workflow: state.starship.workflow,
  };
}

export const SpaceframeSelectionPage = connect(mapStateToProps)(
  SpaceframeSelectionPageBase,
);
