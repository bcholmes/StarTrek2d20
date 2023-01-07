import { connect } from "react-redux";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import { Navigation } from "../../common/navigator";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { allDepartments, Department } from "../../helpers/departments";
import { allSystems, System } from "../../helpers/systems";
import { PageIdentity } from "../../pages/pageIdentity";
import { changeStarshipSpaceframeClassName, changeStarshipSpaceframeDepartment, changeStarshipSpaceframeScale, changeStarshipSpaceframeServiceYear, changeStarshipSpaceframeSystem } from "../../state/starshipActions";
import store from "../../state/store";
import { BuildPoints } from "../model/buildPoints";
import { BaseSimpleStarshipPage } from "./simpleStarshipPage";
import { withTranslation } from 'react-i18next';

class SystemValue {
    system: System;
    value: number;

    constructor(system: System, value: number) {
        this.system = system;
        this.value = value;
    }
}

class CustomSpaceframePage extends BaseSimpleStarshipPage {

    renderExtraSections() {
        const { t } = this.props;
        return (<section className="my-5 row row-cols-1 row-cols-lg-2">
                <div className="col mb-3">
                    <Header level={2}>{t('Construct.other.serviceDate')}</Header>
                    <p>{t('StarshipPage.whatYear')}</p>
                    <InputFieldAndLabel type="number" value={this.props.starship?.spaceframeModel?.serviceYear?.toString() || ""}
                        onChange={(value) => this.setServiceYear(value)}
                        max={this.props.starship.serviceYear}
                        id="serviceYear" labelName={t('Construct.other.serviceDate')} />
                </div>
            </section>)
    }

    getCurrentSystemValuesSortedMaxToMin() {
        let result = [];
        allSystems().forEach(s => result.push(new SystemValue(s, this.props.starship.systems[s])));
        return result.sort((v1: SystemValue, v2: SystemValue) => {
            if (v1.value === v2.value) {
                return v1.system - v2.system;
            } else {
                return v2.value - v1.value;
            }
        });
    }

    setServiceYear(serviceYear: string) {
        let year = parseInt(serviceYear);
        let systems = this.getCurrentSystemValuesSortedMaxToMin();
        let newTotalPoints = BuildPoints.systemPointsForType(this.props.starship.buildType, year,
            this.props.starship.type, this.props.starship.scale);
        let systemDelta = newTotalPoints - BuildPoints.systemPointsForType(this.props.starship.buildType, this.props.starship.spaceframeModel.serviceYear,
                this.props.starship.type, this.props.starship.scale);

        store.dispatch(changeStarshipSpaceframeServiceYear(year));

        if (systemDelta !== 0) {
            let deltas = [0, 0, 0, 0, 0, 0];
            let sumOfDeltas = 0;
            for (let i = 0; i < 5; i++) {
                deltas[i] = systems[5].value - systems[i].value;
                sumOfDeltas += deltas[i];
            }

            if (systemDelta !== sumOfDeltas) {
                let distribution = BuildPoints.allocatePointsEvenly(systemDelta - sumOfDeltas);
                for (let i = 0; i < distribution.length; i++) {
                    deltas[i] += distribution[i];
                }
            }

            for (let i = 0; i < deltas.length; i++) {
                let system = systems[i].system;
                store.dispatch(changeStarshipSpaceframeSystem(deltas[i], system));
            }
        }
    }

    renderHeader() {
        const { t } = this.props;
        return (<Header>{t('Page.title.customSpaceframe')}</Header>);
    }

    canDecreaseScale() {
        return this.props.starship.scale > 2;
    }

    getDepartmentPoints() {
        return BuildPoints.departmentPointsForType(this.props.starship.buildType);
    }

    getSystemsPoints() {
        return BuildPoints.systemPointsForType(this.props.starship.buildType, this.props.starship.spaceframeModel.serviceYear, this.props.starship.type, this.props.starship.scale);
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
        return this.sumTotalSystems() < this.getSystemsPoints();
    }

    setClassName(name: string) {
        store.dispatch(changeStarshipSpaceframeClassName(name));
    }

    setScale(delta: number) {
        let newScale = this.props.starship.scale + delta;
        let systems = [...this.props.starship.systems];
        let sum = this.sumTotalSystems();
        let newTotalPoints = BuildPoints.systemPointsForType(this.props.starship.buildType, this.props.starship.spaceframeModel.serviceYear,
            this.props.starship.type, newScale);
        let systemDelta = newTotalPoints - BuildPoints.systemPointsForType(this.props.starship.buildType, this.props.starship.spaceframeModel.serviceYear,
                this.props.starship.type, this.props.starship.scale);
        store.dispatch(changeStarshipSpaceframeScale(delta));
        if (delta < 0 && sum > newTotalPoints) {
            let max = 0;
            let system = allSystems()[0];
            allSystems().forEach(s => { if (systems[s] >= max) {max = systems[s]; system = s; }});

            store.dispatch(changeStarshipSpaceframeSystem(systemDelta, system));
        }
    }

    setSystem(system: System, delta: number) {
        store.dispatch(changeStarshipSpaceframeSystem(delta, system));
    }

    setDepartment(department: Department, delta: number) {
        store.dispatch(changeStarshipSpaceframeDepartment(delta, department));
    }

    nextPage(): void {
        if (!(this.props.starship.className)) {
            Dialog.show("Please provide a name for this class of ship.");
        } else if (this.sumTotalSystems() < this.getSystemsPoints()) {
            Dialog.show("You have not distributed all the Systems Points");
        } else if (this.sumTotalDepartments() < this.getDepartmentPoints()) {
            Dialog.show("You have not distributed all the Department Points");
        } else {
            Navigation.navigateToPage(PageIdentity.StarshipWeaponsSelection);
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default withTranslation()(connect(mapStateToProps)(CustomSpaceframePage));