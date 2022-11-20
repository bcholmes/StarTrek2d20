import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { PageIdentity } from "../../pages/pageIdentity";
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
                    <Button className="button" onClick={() => { Navigation.navigateToPage(PageIdentity.Starship); } } buttonType={true}>Standard Spaceframe</Button>
                </div>

                <div>
                    <Button className="button" onClick={() => { Navigation.navigateToPage(PageIdentity.CustomSpaceframe); } } buttonType={true}>Custom Spaceframe</Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(SpaceframePage);