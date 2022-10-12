import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
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

class SimpleStarshipPage extends React.Component<ISimpleStarshipPageProperties, {}> {

    render() {
        return (<div className="page container ml-0">
            <ShipBuildingBreadcrumbs />
            <Header>Simplified Starship Creation</Header>

            <section className="my-5 row row-cols-1 row-cols-lg-2">
                <div className="col mb-3">
                    <Header level={2}>Scale</Header>

                    <p className="page-text">How large is this ship?</p>

                    <div className="stats-row pt-2">
                        <StatControl statName="Scale" value={this.props.starship.scale}
                            showIncrease={this.props.starship.scale < 6} showDecrease={this.props.starship.scale > 1}
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

                <div className="stats-row mt-4">
                    <StatControl statName="Comms" value={this.getSystem(System.Comms)}
                        showIncrease={this.getSystem(System.Comms) < 15} showDecrease={this.getSystem(System.Comms) > 0}
                        onIncrease={() => {this.setSystem(System.Comms, 1) }}
                        onDecrease={() => {this.setSystem(System.Comms, -1)}} />

                    <StatControl statName="Engines" value={this.getSystem(System.Engines)}
                        showIncrease={this.getSystem(System.Engines) < 15} showDecrease={this.getSystem(System.Engines) > 0}
                        onIncrease={() => { this.setSystem(System.Engines, 1) }}
                        onDecrease={() => {this.setSystem(System.Engines, -1)}} />

                    <StatControl statName="Structure" value={this.getSystem(System.Structure)}
                        showIncrease={this.getSystem(System.Structure) < 15} showDecrease={this.getSystem(System.Structure) > 0}
                        onIncrease={() => { this.setSystem(System.Structure, 1) }}
                        onDecrease={() => {this.setSystem(System.Structure, -1)}} />
                </div>

                <div className="stats-row">
                    <StatControl statName="Computers" value={this.getSystem(System.Computer)}
                        showIncrease={this.getSystem(System.Computer) < 15} showDecrease={this.getSystem(System.Computer) > 0}
                        onIncrease={() => { this.setSystem(System.Computer, 1) }}
                        onDecrease={() => {this.setSystem(System.Computer, -1)}} />

                    <StatControl statName="Sensors" value={this.getSystem(System.Sensors)}
                        showIncrease={this.getSystem(System.Sensors) < 15} showDecrease={this.getSystem(System.Sensors) > 0}
                        onIncrease={() => { this.setSystem(System.Sensors, 1) }}
                        onDecrease={() => {this.setSystem(System.Sensors, -1)}} />

                    <StatControl statName="Weapons" value={this.getSystem(System.Weapons)}
                        showIncrease={this.getSystem(System.Weapons) < 15} showDecrease={this.getSystem(System.Weapons) > 0}
                        onIncrease={() => { this.setSystem(System.Weapons, 1) }}
                        onDecrease={() => {this.setSystem(System.Weapons, -1)}} />
                </div>
            </section>

            <section className="my-5">
                <Header level={2}>Departments</Header>

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

    canIncreaseDepartment(department: Department) {
        return this.getDepartment(department) < 5;
    }

    canDecreaseDepartment(department: Department) {
        return this.getDepartment(department) > 0;
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

export default connect(mapStateToProps)(SimpleStarshipPage);