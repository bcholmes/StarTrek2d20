import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { PageIdentity } from "../../pages/pageIdentity";
import { setStarshipMissionProfile } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import MissionProfileSelection from "../view/missionProfileSelection";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";

interface IMissionProfileSelectionPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class MissionProfileSelectionPage extends React.Component<IMissionProfileSelectionPageProperties, {}> {
    render() {
        return (<div className="page container ml-0">
            <ShipBuildingBreadcrumbs />
            <Header>Mission Profile</Header>
            <p>A mission profile is what makes one starship different from another in her same class. It determines the
                specialized equipment that is installed before venturing into the unknown, the priority in personnel that
                Starfleet gives the vessel, and its overall mission goal. All spaceframes have a mission profile.
            </p>
            <MissionProfileSelection
                initialSelection={this.props.starship.missionProfileModel}
                starship={this.props.starship}
                type={this.props.starship.type}
                onSelection={(profile) => store.dispatch(setStarshipMissionProfile(profile))} />
            <div className="text-right">
                <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
            </div>
        </div>);
    }

    nextPage() {
        if (this.props.starship.missionProfileModel == null) {
            Dialog.show("Please select a mission profile before proceeding.");
        } else {
            Navigation.navigateToPage(PageIdentity.MissionProfileTalentSelection);
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(MissionProfileSelectionPage);