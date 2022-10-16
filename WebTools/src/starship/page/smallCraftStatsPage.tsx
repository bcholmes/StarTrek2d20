import { connect } from "react-redux";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { allDepartments, Department } from "../../helpers/departments";
import { allSystems, System } from "../../helpers/systems";
import { BuildPoints } from "../model/buildPoints";
import { BaseSimpleStarshipPage } from "./simpleStarshipPage";


class SmallCraftStatsPage extends BaseSimpleStarshipPage {

    constructor(props) {
        super(props);
    }

    renderHeader() {
        return (<Header>Small Craft Creation</Header>);
    }

    canIncreaseScale(): boolean {
        return false;
    }

    canDecreaseScale(): boolean {
        return false;
    }

    getDepartmentPoints() {
        return BuildPoints.departmentPointsForType(this.props.starship.buildType);
    }

    getSystemsPoints() {
        return BuildPoints.systemPointsForType(this.props.starship.buildType, this.props.starship.serviceYear, this.props.starship.type);
    }

    renderSystemsText() {
        return (<p>You have {this.getSystemsPoints()} System Points to distribute to the ship's systems.</p>);
    }

    renderDepartmentText() {
        return (<p>You have {this.getDepartmentPoints()} Department Points to distribute to the ship's departments.</p>);
    }

    sumTotalDepartments() {
        let total = 0;
        allDepartments().forEach(d => total += this.props.starship.departments[d]);
        return total;
    }

    canIncreaseDepartment(department: Department) {
        return this.sumTotalDepartments() < this.getDepartmentPoints() && super.canIncreaseDepartment(department);
    }

    sumTotalSystems() {
        let total = 0;
        allSystems().forEach(s => total += this.props.starship.getSystemValue(s));
        return total;
    }

    canIncreaseSystem(system: System) {
        return this.sumTotalSystems() < this.getSystemsPoints() && super.canIncreaseSystem(system);
    }

    nextPage(): void {
        if (this.sumTotalSystems() < this.getSystemsPoints()) {
            Dialog.show("You have not distributed all the Systems Points");
        } else if (this.sumTotalDepartments() < this.getDepartmentPoints()) {
            Dialog.show("You have not distributed all the Department Points");
        } else {
            return super.nextPage();
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(SmallCraftStatsPage);