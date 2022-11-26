import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { nextStarshipWorkflowStep, setStarshipMissionPod } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import MissionPodSelection from "../view/missionPodSelection";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";

interface IMissionPodSelectionPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class MissionPodSelectionPage extends React.Component<IMissionPodSelectionPageProperties, {}> {
    render() {
        return (<div className="page container ml-0">
            <ShipBuildingBreadcrumbs />
            <Header>Mission Pod</Header>
            <p>Certain spaceframes have the ability to be fitted with a since mission pod, chosen
                from the list below. The talents provided by the pod may not be swapped out normally,
                but the entire mission pod (and all its benefits) may be swapped out as if it were
                a single talent.
            </p>
            <MissionPodSelection
                initialSelection={this.props.starship.missionPodModel}
                starship={this.props.starship}
                onSelection={(missionPod) => store.dispatch(setStarshipMissionPod(missionPod))} />
            <div className="text-right">
                <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
            </div>
        </div>);
    }

    nextPage() {
        if (this.props.starship.missionPodModel == null) {
            Dialog.show("Please select a mission pod before proceeding.");
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

export default connect(mapStateToProps)(MissionPodSelectionPage);