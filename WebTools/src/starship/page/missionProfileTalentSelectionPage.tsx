import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import SingleTalentSelectionList from "../../components/singleTalentSelectionList";
import { TalentsHelper, TalentViewModel, ToViewModel } from "../../helpers/talents";
import { nextStarshipWorkflowStep, setStarshipMissionProfileTalent } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";

interface IMissionProfileTalentSelectionPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class MissionProfileTalentSelectionPage extends React.Component<IMissionProfileTalentSelectionPageProperties, {}> {
    render() {
        return (<div className="page container ml-0">
            <ShipBuildingBreadcrumbs />
            <Header>Mission Profile Talent</Header>
            <p>
                Choose 1 talent from the list of talents associated with the mission profile.
            </p>
            <SingleTalentSelectionList
                talents={this.getTalents()}
                initialSelection={this.props.starship.profileTalent}
                construct={this.props.starship}
                onSelection={(talent) => this.saveTalent(talent)} />
            <div className="text-right">
                <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
            </div>
        </div>);
    }

    saveTalent(talent: TalentViewModel) {
        if (talent) {
            let talentModel = TalentsHelper.getTalent(talent.name);
            store.dispatch(setStarshipMissionProfileTalent(talentModel));
        } else {
            store.dispatch(setStarshipMissionProfileTalent(undefined));
        }
    }

    getTalents() {
        let talents: TalentViewModel[] = [];
        this.props.starship?.missionProfileModel?.talents?.forEach(t => {
            if (!t.isSourcePrerequisiteFulfilled(this.props.starship)) {
                // skip it
            } else if (!this.props.starship.spaceframeModel?.hasTalent(t.name)) {
                talents.push(ToViewModel(t));
            } else if (t.maxRank > 1) {
                talents.push(ToViewModel(t, 2));
            }
        });
        return talents;
    }

    nextPage() {
        if (this.props.starship.profileTalent == null) {
            Dialog.show("Please select a talent before proceeding.");
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

export default connect(mapStateToProps)(MissionProfileTalentSelectionPage);