import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { PageIdentity } from "../../pages/pageIdentity";
import { nextStarshipWorkflowStep, setStarshipSpaceframe } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import SpaceframeSelection from "../view/spaceframeSelection";

interface ISpaceframeSelectionPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class SpaceframeSelectionPage extends React.Component<ISpaceframeSelectionPageProperties, {}> {
    render() {
        return (<div className="page container ml-0">
            <ShipBuildingBreadcrumbs />
            <Header>Spaceframe</Header>
            <p>
                The Spaceframe is the ship’s basic structure and infrastructure, and the foundation
                upon which everything else will be laid. At this stage, the Players select a single
                class, which provides the basic Systems for the ship, as well as its Scale, and
                its weaponry. Different classes enter and leave service at different dates, so
                the campaign year determines availability.
            </p>
            <SpaceframeSelection
                initialSelection={this.props.starship.spaceframeModel}
                starship={this.props.starship}
                serviceYear={this.props.starship.serviceYear}
                type={this.props.starship.type}
                onSelection={(spaceframe) => store.dispatch(setStarshipSpaceframe(spaceframe))} />
            <div className="text-right">
                <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
            </div>
        </div>);
    }

    nextPage() {
        if (this.props.starship.spaceframeModel == null) {
            Dialog.show("Please select a spaceframe before proceeding.");
        } else if (this.props.starship.spaceframeModel.isMissionPodAvailable) {
            Navigation.navigateToPage(PageIdentity.MissionPodSelection);
        } else {
            let step = this.props.workflow.peekNextStep();
            store.dispatch(nextStarshipWorkflowStep());
            Navigation.navigateToPage(step.page);
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(SpaceframeSelectionPage);