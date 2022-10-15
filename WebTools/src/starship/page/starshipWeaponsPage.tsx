import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { nextStarshipWorkflowStep } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";

interface IStarshipWeaponsPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class StarshipWeaponsPageProperties extends React.Component<IStarshipWeaponsPageProperties, {}> {
    render() {
        return (<div className="page container ml-0">
                <ShipBuildingBreadcrumbs />
                <Header>Ship Weapons</Header>

                <div className="text-right">
                    <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
                </div>
            </div>);
    }

    nextPage() {
        let step = this.props.workflow.peekNextStep();
        store.dispatch(nextStarshipWorkflowStep());
        Navigation.navigateToPage(step.page);
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(StarshipWeaponsPageProperties);