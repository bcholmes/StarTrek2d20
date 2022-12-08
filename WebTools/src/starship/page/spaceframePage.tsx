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

interface ISpaceframePageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

export class SpaceframePage extends React.Component<ISpaceframePageProperties, {}> {

    render() {
        return (
            <div className="page container ml-0">
                <ShipBuildingBreadcrumbs />
                <Header>Spaceframe Selection</Header>

                <p>Do you want a standard spaceframe, or a custom spaceframe?</p>

                <div>
                    <Button className="button" onClick={() => this.navigateToSpaceframeSelection() } buttonType={true}>Standard Spaceframe</Button>
                </div>

                <div>
                    <Button className="button" onClick={() => this.navigateToCustomSpaceframe() } buttonType={true}>Custom Spaceframe</Button>
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

export default connect(mapStateToProps)(SpaceframePage);