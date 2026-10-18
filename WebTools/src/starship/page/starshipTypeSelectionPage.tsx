import React from 'react';
import { connect } from 'react-redux';
import { CharacterTypeModel } from '../../common/characterType';
import { navigateTo, Navigation } from '../../common/navigator';
import { ShipBuildTypeModel, SimpleStats } from '../../common/starship';
import Button from 'react-bootstrap/Button';
import {
  DropDownElement,
  DropDownSelect,
} from '../../components/dropDownInput';
import { Header } from '../../components/header';
import { eraDefaultYear } from '../../helpers/eras';
import type { Era } from '../../helpers/erasEnum';
import { Source } from '../../helpers/sources';
import { PageIdentity } from '../../pages/pageIdentity';
import { hasSource, isSecondEdition } from '../../state/contextFunctions';
import { createNewStarship } from '../../state/starshipActions';
import { store } from '../../state/store';
import { BuildPoints } from '../model/buildPoints';
import { ShipBuildWorkflow } from '../model/shipBuildWorkflow';
import type { WithTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { InstructionText } from '../../components/instructionText';
import { ServiceYearSelector } from '../view/serviceYearView';
import { PointAllocator } from '../../helpers/pointAllocator';
import { ShipBuildType } from '../../common/shipBuildType';
import { PageHistoryBasedPreviousButton } from '../../components/pageHistoryBasedPreviousButton';

interface StarshipTypeSelectionPageProperties extends WithTranslation {
  era: Era;
}
interface StarshipTypeSelectionPageState {
  type?: CharacterTypeModel;
  campaignYear: number;
  buildType: ShipBuildTypeModel;
}

class StarshipTypeSelectionPageBase extends React.Component<
  StarshipTypeSelectionPageProperties,
  StarshipTypeSelectionPageState
> {
  constructor(props) {
    super(props);
    this.state = {
      type: CharacterTypeModel.getStarshipTypes(isSecondEdition() ? 2 : 1)[0],
      campaignYear: eraDefaultYear(this.props.era),
      buildType: ShipBuildTypeModel.allTypes()[ShipBuildType.Starship],
    };
  }

  render() {
    const { t } = this.props;
    const typeSelection = (
      <div className="col-lg-6">
        <div className="my-3">
          <Header level={2}>{t('StarshipTypeSelection.shipPolity')}</Header>
          <p>{t('StarshipTypeSelection.whatShipPolity')}</p>
          <div>
            <DropDownSelect
              items={CharacterTypeModel.getStarshipTypes(
                isSecondEdition() ? 2 : 1,
              ).map((t, i) => new DropDownElement(t.type, t.localizedName))}
              defaultValue={this.state.type.type}
              onChange={(index) =>
                this.selectType(CharacterTypeModel.getByType(index as number))
              }
            />
          </div>
        </div>
      </div>
    );

    const buildTypeSelection = (
      <div className="my-3">
        <Header level={2}>{t('StarshipTypeSelection.shipBuildType')}</Header>
        <p>{t('StarshipTypeSelection.whatShipBuildType')}</p>
        <div>
          <DropDownSelect
            items={ShipBuildTypeModel.allTypes().map(
              (t, i) => new DropDownElement(t.type, t.localizedName),
            )}
            defaultValue={this.state.buildType.type}
            onChange={(type) =>
              this.selectBuildType(ShipBuildTypeModel.getByType(type as number))
            }
          />
        </div>
      </div>
    );

    return (
      <div className="page container ms-0">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href="/index.html"
                onClick={(e) => navigateTo(e, PageIdentity.Home)}
              >
                {t('Page.title.home')}
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t('Page.breadcrumb.starshipCreation')}
            </li>
          </ol>
        </nav>

        <Header>{t('Page.title.starshipTypeSelection')}</Header>
        <div>
          {this.renderServiceYear()}
          <div className="row">
            {typeSelection}
            <div className="col-lg-6">{buildTypeSelection}</div>
          </div>
          <div className="mt-4 d-flex justify-content-end">
            <PageHistoryBasedPreviousButton />
            <Button onClick={() => this.startWorkflow()}>
              {t('Common.button.create')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  selectType(typeModel: CharacterTypeModel) {
    this.setState((state) => ({ ...state, type: typeModel }));
  }

  selectBuildType(buildType: ShipBuildTypeModel) {
    this.setState((state) => ({ ...state, buildType: buildType }));
  }

  startWorkflow() {
    if (
      this.state.buildType != null &&
      this.state.buildType.type !== ShipBuildType.Starship
    ) {
      const workflow = ShipBuildWorkflow.createSmallCraftBuildWorkflow(
        this.state.buildType.type,
      );
      const stats = new SimpleStats();
      stats.scale =
        this.state.buildType.type === ShipBuildType.Runabout ? 2 : 1;
      stats.systems = PointAllocator.allocatePointsEvenly(
        BuildPoints.systemPointsForType(
          this.state.buildType.type,
          this.state.campaignYear,
          this.state.type.type,
          stats.scale,
          isSecondEdition() ? 2 : 1,
        ),
      );
      stats.departments = PointAllocator.allocatePointsEvenly(
        BuildPoints.departmentPointsForType(this.state.buildType.type),
      );
      store.dispatch(
        createNewStarship(
          this.state.type.type,
          this.props.era,
          this.state.campaignYear,
          stats,
          workflow,
          this.state.buildType.type,
          isSecondEdition() ? 2 : 1,
        ),
      );
      Navigation.navigateToPage(PageIdentity.SmallCraftStats);
    } else if (this.state.type != null) {
      const workflow = ShipBuildWorkflow.createStarshipBuildWorkflow(
        isSecondEdition() ? 2 : 1,
      );
      store.dispatch(
        createNewStarship(
          this.state.type.type,
          this.props.era,
          this.state.campaignYear,
          undefined,
          workflow,
          ShipBuildType.Starship,
          isSecondEdition() ? 2 : 1,
        ),
      );

      Navigation.navigateToPage(workflow.currentStep().page);
    }
  }

  renderServiceYear() {
    const { t } = this.props;
    return (
      <div className="my-5">
        <Header level={2}>{t('StarshipTypeSelection.campaignYear')}</Header>
        <div>
          <InstructionText text={t('StarshipTypeSelection.instruction')} />
        </div>
        <ServiceYearSelector
          campaignYear={this.state.campaignYear}
          onChange={(year) =>
            this.setState((state) => ({ ...state, campaignYear: year }))
          }
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    era: state.context.era,
  };
}

export const StarshipTypeSelectionPage = withTranslation()(
  connect(mapStateToProps)(StarshipTypeSelectionPageBase),
);
