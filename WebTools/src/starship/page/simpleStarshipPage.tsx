import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { Department } from "../../helpers/departments";
import { System } from "../../helpers/systems";
import { changeStarshipScale, changeStarshipSimpleClassName, changeStarshipSimpleDepartment, changeStarshipSimpleSystem, nextStarshipWorkflowStep } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { StatControl } from "../view/statControl";

interface ISimpleStarshipPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

export class BaseSimpleStarshipPage extends React.Component<ISimpleStarshipPageProperties, {}> {

    render() {
        return (<div className="page container ml-0">
            <ShipBuildingBreadcrumbs />
            {this.renderHeader()}

            <section className="my-5 row row-cols-1 row-cols-lg-2">
                <div className="col mb-3">
                    <Header level={2}>Scale</Header>

                    <p className="page-text">How large is this ship?</p>

                    <div className="stats-row pt-2">
                        <StatControl statName="Scale" value={this.props.starship.scale}
                            showIncrease={this.canIncreaseScale()} showDecrease={this.canDecreaseScale()}
                            onIncrease={() => { this.setScale(1) }} onDecrease={() => {this.setScale(-1)}} />
                    </div>
                </div>

                <div className="col mb-3">
                    <Header level={2}>Class</Header>

                    <p className="page-text mw-100">What's the name of the ship's class?</p>

                    <div className="d-sm-flex align-items-stretch">
                        <label htmlFor="shipClassName" className="textinput-label">NAME</label>
                        <input
                            id="shipClassName"
                            type="text"
                            onChange={(ev) => this.setClassName(ev.target.value) }
                            value={this.props.starship.className} />
                        </div>
                    </div>
            </section>

            <section className="my-5">
                <Header level={2}>Systems</Header>

                {this.renderSystemsText()}

                <div className="stats-row mt-4">
                    <StatControl statName="Comms" value={this.getSystem(System.Comms)}
                        showIncrease={this.canIncreaseSystem(System.Comms)} showDecrease={this.canDecreaseSystem(System.Comms)}
                        onIncrease={() => {this.setSystem(System.Comms, 1) }}
                        onDecrease={() => {this.setSystem(System.Comms, -1)}} />

                    <StatControl statName="Engines" value={this.getSystem(System.Engines)}
                        showIncrease={this.canIncreaseSystem(System.Engines)} showDecrease={this.canDecreaseSystem(System.Engines)}
                        onIncrease={() => { this.setSystem(System.Engines, 1) }}
                        onDecrease={() => {this.setSystem(System.Engines, -1)}} />

                    <StatControl statName="Structure" value={this.getSystem(System.Structure)}
                        showIncrease={this.canIncreaseSystem(System.Structure)} showDecrease={this.canDecreaseSystem(System.Structure)}
                        onIncrease={() => { this.setSystem(System.Structure, 1) }}
                        onDecrease={() => {this.setSystem(System.Structure, -1)}} />
                </div>

                <div className="stats-row">
                    <StatControl statName="Computers" value={this.getSystem(System.Computer)}
                        showIncrease={this.canIncreaseSystem(System.Computer)} showDecrease={this.canDecreaseSystem(System.Computer)}
                        onIncrease={() => { this.setSystem(System.Computer, 1) }}
                        onDecrease={() => {this.setSystem(System.Computer, -1)}} />

                    <StatControl statName="Sensors" value={this.getSystem(System.Sensors)}
                        showIncrease={this.canIncreaseSystem(System.Sensors)} showDecrease={this.canDecreaseSystem(System.Sensors)}
                        onIncrease={() => { this.setSystem(System.Sensors, 1) }}
                        onDecrease={() => {this.setSystem(System.Sensors, -1)}} />

                    <StatControl statName="Weapons" value={this.getSystem(System.Weapons)}
                        showIncrease={this.canIncreaseSystem(System.Weapons)} showDecrease={this.canDecreaseSystem(System.Weapons)}
                        onIncrease={() => { this.setSystem(System.Weapons, 1) }}
                        onDecrease={() => {this.setSystem(System.Weapons, -1)}} />
                </div>
            </section>

            <section className="my-5">
                <Header level={2}>Departments</Header>

                {this.renderDepartmentText()}

                <div className="stats-row mt-4">
                    <StatControl statName="Command" value={this.getDepartment(Department.Command)}
                        showIncrease={this.canIncreaseDepartment(Department.Command)} showDecrease={this.canDecreaseDepartment(Department.Command)}
                        onIncrease={() => {this.setDepartment(Department.Command, 1) }}
                        onDecrease={() => {this.setDepartment(Department.Command, -1)}} />

                    <StatControl statName="Security" value={this.getDepartment(Department.Security)}
                        showIncrease={this.canIncreaseDepartment(Department.Security)} showDecrease={this.canDecreaseDepartment(Department.Security)}
                        onIncrease={() => { this.setDepartment(Department.Security, 1) }}
                        onDecrease={() => {this.setDepartment(Department.Security, -1)}} />

                    <StatControl statName="Science" value={this.getDepartment(Department.Science)}
                        showIncrease={this.canIncreaseDepartment(Department.Science)} showDecrease={this.canDecreaseDepartment(Department.Science)}
                        onIncrease={() => { this.setDepartment(Department.Science, 1) }}
                        onDecrease={() => {this.setDepartment(Department.Science, -1)}} />
                </div>

                <div className="stats-row">
                    <StatControl statName="Conn" value={this.getDepartment(Department.Conn)}
                        showIncrease={this.canIncreaseDepartment(Department.Conn)} showDecrease={this.canDecreaseDepartment(Department.Conn)}
                        onIncrease={() => { this.setDepartment(Department.Conn, 1) }}
                        onDecrease={() => {this.setDepartment(Department.Conn, -1)}} />

                    <StatControl statName="Engineering" value={this.getDepartment(Department.Engineering)}
                        showIncrease={this.canIncreaseDepartment(Department.Engineering)} showDecrease={this.canDecreaseDepartment(Department.Engineering)}
                        onIncrease={() => { this.setDepartment(Department.Engineering, 1) }}
                        onDecrease={() => {this.setDepartment(Department.Engineering, -1)}} />

                    <StatControl statName="Medicine" value={this.getDepartment(Department.Medicine)}
                        showIncrease={this.canIncreaseDepartment(Department.Medicine)} showDecrease={this.canDecreaseDepartment(Department.Medicine)}
                        onIncrease={() => { this.setDepartment(Department.Medicine, 1) }}
                        onDecrease={() => {this.setDepartment(Department.Medicine, -1)}} />
                </div>
            </section>

            <section className="text-right">
                <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
            </section>
        </div>);
    }

    renderHeader() {
        return (<Header>Simplified Starship Creation</Header>);
    }

    renderSystemsText() {
        return undefined;
    }

    renderDepartmentText() {
        return undefined;
    }

    canIncreaseDepartment(department: Department) {
        return this.getDepartment(department) < 5;
    }

    canDecreaseDepartment(department: Department) {
        return this.getDepartment(department) > 0;
    }

    canIncreaseSystem(system: System) {
        return this.getSystem(system) < 15;
    }

    canDecreaseSystem(system: System) {
        return this.getSystem(system) > 1;
    }

    canIncreaseScale() {
        return this.props.starship.scale < 7;
    }

    canDecreaseScale() {
        return this.props.starship.scale > 1;
    }

    getSystem(system: System) {
        let result = this.props.starship.getSystemValue(system);
        return result == null ? 0 : result;
    }

    getDepartment(department: Department) {
        let result = this.props.starship.departments[department];
        return result == null ? 0 : result;
    }

    setSystem(system: System, delta: number) {
        store.dispatch(changeStarshipSimpleSystem(delta, system));
    }

    setDepartment(department: Department, delta: number) {
        store.dispatch(changeStarshipSimpleDepartment(delta, department));
    }

    setScale(delta: number) {
        store.dispatch(changeStarshipScale(delta));
    }

    setClassName(className: string) {
        store.dispatch(changeStarshipSimpleClassName(className));
    }

    nextPage() {
        if (!(this.props.starship.className)) {
            Dialog.show("Please provide a name for this class of ship.");
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

class SimpleStarshipPage extends BaseSimpleStarshipPage {

}

export default connect(mapStateToProps)(SimpleStarshipPage);