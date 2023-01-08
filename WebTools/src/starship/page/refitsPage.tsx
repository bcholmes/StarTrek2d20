import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { refitCalculator, Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import Refits from "../../components/refits";
import { System } from "../../helpers/systems";
import { addStarshipRefit, deleteStarshipRefit, nextStarshipWorkflowStep } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";

interface IRefitPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
    refitCount: number;
}

class RefitPage extends React.Component<IRefitPageProperties, {}> {
    render() {
        return (<div className="page container ml-0">
            <ShipBuildingBreadcrumbs />
            <Header>Refits</Header>
            <p>
                Ships are improved over time. Every ten years from the date of launch, a ship receives a refit, which
                improves the ship's systems.
            </p>

            <p>You have {(this.props.refitCount === 1) ? " one point " : (" " + this.props.refitCount + " points ")} to allocate.</p>

            <Refits refits={this.props.starship.refits} points={this.props.refitCount} starship={this.props.starship}
                        onIncrease={(s) => { this.addRefit(s)} } onDecrease={(s) => { this.removeRefit(s); } }/>

            <div className="text-right">
                <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
            </div>
        </div>);
    }

    addRefit(system: System) {
        store.dispatch(addStarshipRefit(system));
    }

    removeRefit(system: System) {
        store.dispatch(deleteStarshipRefit(system));
    }

    nextPage() {
        if (this.props.starship.refits.length !== this.props.starship.numberOfRefits) {
            Dialog.show("Please choose all refits.");
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
        refitCount: refitCalculator(state.starship.starship),
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(RefitPage);