import React from "react";
import { connect } from "react-redux";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";

interface IShipBuildingBreadcrumbsProperies {
    workflow: ShipBuildWorkflow;
}

class ShipBuildingBreadcrumbs extends React.Component<IShipBuildingBreadcrumbsProperies, {}> {

    render() {
        return (<nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Selection)}>Home</a></li>
                <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.StarshipTypeSelection)}>Starship Type</a></li>
                {this.renderLinks()}
            </ol>
        </nav>);
    }

    renderLinks() {
        return this.props.workflow.steps.map((s, i) => {
            if (i < this.props.workflow.currentStepIndex) {
                return (<li className="breadcrumb-item" key={i}><a href="index.html" onClick={(e) => navigateTo(e, s.page)}>{s.name}</a></li>);
            } else if (i === this.props.workflow.currentStepIndex) {
                return (<li className="breadcrumb-item active" key={i}>{s.name}</li>);
            } else {
                return undefined;
            }
        });
    }
}

function mapStateToProps(state, ownProps) {
    return {
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(ShipBuildingBreadcrumbs);