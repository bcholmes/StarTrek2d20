import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { ShipBuildType, Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { SpaceframeModel } from "../../helpers/spaceframeModel";
import { PageIdentity } from "../../pages/pageIdentity";
import { setStarshipSpaceframe } from "../../state/starshipActions";
import store from "../../state/store";
import { BuildPoints } from "../model/buildPoints";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { withTranslation, WithTranslation } from 'react-i18next';

interface ISpaceframePageProperties extends WithTranslation {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class SpaceframePage extends React.Component<ISpaceframePageProperties, {}> {

    render() {
        const { t } = this.props;
        return (
            <div className="page container ms-0">
                <ShipBuildingBreadcrumbs />
                <Header>{t('Page.title.spaceframeOption')}</Header>

                <p>{t('SpaceframeOptionPage.text')}</p>

                <div className="button-column">
                    <Button className="button" onClick={() => this.navigateToSpaceframeSelection() } buttonType={true}>{t('SpaceframeOptionPage.button.standardSpaceframe')}</Button>
                    <Button className="button" onClick={() => this.navigateToCustomSpaceframe() } buttonType={true}>{t('SpaceframeOptionPage.button.customSpaceframe')}</Button>
                </div>
            </div>
        );
    }

    navigateToSpaceframeSelection() {
        store.dispatch(setStarshipSpaceframe(null));
        Navigation.navigateToPage(PageIdentity.SpaceframeSelection);
    }

    navigateToCustomSpaceframe() {
        let scale = 3;
        let systems = BuildPoints.allocatePointsEvenly(BuildPoints.systemPointsForType(
            ShipBuildType.Starship, this.props.starship.serviceYear, this.props.starship.type, scale));
        let departments = BuildPoints.allocatePointsEvenly(BuildPoints.departmentPointsForType(
            ShipBuildType.Starship))
        let spaceframe = SpaceframeModel.createCustomSpaceframe(this.props.starship?.type, this.props.starship?.serviceYear, systems, departments, scale);
        store.dispatch(setStarshipSpaceframe(spaceframe));
        Navigation.navigateToPage(PageIdentity.CustomSpaceframe);
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default withTranslation()(connect(mapStateToProps)(SpaceframePage));