import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { ModalControl } from "../../components/modal";
import { Weapon } from "../../helpers/weapons";
import { deleteStarshipWeapon, nextStarshipWorkflowStep } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import AddWeaponView from "../view/addWeaponView";
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

                <div className="d-flex mb-3 mt-4">
                    <p className="mr-auto mb-0">This ship has the following weapons:</p>
                    <div className="text-right">
                        <Button buttonType={true} className="button button-small mt-0" onClick={() => this.showModal()}>Add Weapon</Button>
                    </div>
                </div>

                <table className="selection-list">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Dice</th>
                            <th>Qualities</th>
                        </tr>
                    </thead>
                    {this.renderWeapons()}
                </table>

                <div className="text-right">
                    <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
                </div>
            </div>);
    }

    renderWeapons() {
        if (this.props.starship.weapons.length === 0) {
            return (<tbody>
                    <tr><td colSpan={4}>None</td></tr>
                </tbody>);
        } else {
            return (<tbody>
                {this.props.starship.weapons.map((w, i) => (<tr key={'weapon-' + i}>
                    <td className="selection-header">{w.description}</td>
                    <td><p className="m-0">{w.dice}</p></td>
                    <td><p className="m-0">{w.qualities}</p></td>
                    <td className="text-right"><Button buttonType={true} className="button-small" onClick={() => { this.confirmRemove(w) }} >Delete</Button></td>
                </tr>))}
            </tbody>);
        }
    }

    nextPage() {
        let step = this.props.workflow.peekNextStep();
        store.dispatch(nextStarshipWorkflowStep());
        Navigation.navigateToPage(step.page);
    }

    closeModal() {
        ModalControl.hide();
        this.forceUpdate();
    }

    addWeapon() {
        this.closeModal();
    }

    confirmRemove(w: Weapon) {
        ModalControl.show("", () => this.closeModal(), this.confirmationContents(w), "Delete Weapon");
    }

    showModal() {
        ModalControl.show("lg", () => this.closeModal(), this.modalContents(), "Add Weapon");
    }

    modalContents() {
        return (<AddWeaponView onClose={() => this.closeModal()}/>)
    }

    confirmationContents(w: Weapon) {
        return (<div>Are you sure you want to delete this weapon?
            <div className="mt-4 text-center">
                <Button buttonType={true}  className="button-small mr-3" onClick={() => { this.closeModal() }} >Cancel</Button>
                <Button buttonType={true}  className="button-small" onClick={() => { this.deleteWeapon(w) }} >Delete</Button>
            </div>
        </div>);
    }

    deleteWeapon(weapon: Weapon) {
        store.dispatch(deleteStarshipWeapon(weapon));
        this.closeModal();
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(StarshipWeaponsPageProperties);