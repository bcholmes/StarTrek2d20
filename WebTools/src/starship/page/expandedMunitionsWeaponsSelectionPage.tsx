import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { ShipTalentDetailSelection, Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { ModalControl } from "../../components/modal";
import { Weapon } from "../../helpers/weapons";
import { addStarshipTalentDetailSelection, nextStarshipWorkflowStep, removeStarshipTalentDetailSelection } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import AddWeaponView from "../view/addWeaponView";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { Dialog } from "../../components/dialog";

interface IExpandedMunitionsWeaponsSelectionPage {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class ExpandedMunitionsWeaponsSelectionPage extends React.Component<IExpandedMunitionsWeaponsSelectionPage, {}> {

    render() {
        return (<div className="page container ml-0">
                <ShipBuildingBreadcrumbs />
                <Header>Expanded Munitions</Header>

                <div className="d-flex mb-3 mt-4">
                    <p className="mr-auto mb-0">
                        {this.numberOfWeapons() > 1
                            ? "Your ship has the talent \"Expanded Munitions\" (multiple times). You may select " + this.numberOfWeapons() + " additional starship weapons:"
                            : "Your ship has the talent \"Expanded Munitions\". You may select an additional starship weapon:"}
                        </p>
                    <div className="text-right">
                        <Button buttonType={true} className="btn btn-link mt-0" onClick={() => this.showModal()}><i className="bi bi-plus-circle"></i></Button>
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

    numberOfWeapons() {
        return this.props.starship.getTalentSelectionList().filter(t => t.talent.name === "Expanded Munitions").length;
    }

    renderWeapons() {
        if (this.props.starship.weapons.length === 0) {
            return (<tbody>
                    <tr><td colSpan={4}>None</td></tr>
                </tbody>);
        } else {
            return (<tbody>
                {this.props.starship.talentDetailSelections.filter(s => s.weapon).map((s, i) => (<tr key={'weapon-' + i}>
                    <td className="selection-header">{s.weapon.description}</td>
                    <td><p className="m-0">{s.weapon.dice}</p></td>
                    <td><p className="m-0">{s.weapon.effectsAndQualities}</p></td>
                    <td className="text-right"><Button buttonType={true} className="btn btn-link text-danger" onClick={() => { this.confirmRemove(s) }} ><i className="bi bi-trash"></i></Button></td>
                </tr>))}
            </tbody>);
        }
    }

    nextPage() {
        if (this.props.starship.talentDetailSelections.length < this.numberOfWeapons()) {
            Dialog.show("You have not specified all of the additional weapons");
        } else {
            let step = this.props.workflow.peekNextStep();
            store.dispatch(nextStarshipWorkflowStep());
            Navigation.navigateToPage(step.page);
        }
    }

    closeModal() {
        ModalControl.hide();
        this.forceUpdate();
    }

    addWeapon() {
        this.closeModal();
    }

    confirmRemove(selection: ShipTalentDetailSelection) {
        ModalControl.show("", () => this.closeModal(), this.confirmationContents(selection), "Delete Weapon");
    }

    showModal() {
        if (this.props.starship.talentDetailSelections.length >= this.numberOfWeapons()) {
            Dialog.show("You have selected the maximum number of additional weapons");
        } else {
            ModalControl.show("lg", () => this.closeModal(), this.modalContents(), "Add Weapon");
        }
    }

    modalContents() {
        return (<AddWeaponView onClose={() => this.closeModal()} serviceYear={this.props.starship.serviceYear}
            addWeapon={(weapon) => store.dispatch(addStarshipTalentDetailSelection(new ShipTalentDetailSelection(weapon)))} />)
    }

    confirmationContents(selection: ShipTalentDetailSelection) {
        return (<div>Are you sure you want to delete this weapon?
            <div className="mt-4 text-center">
                <Button buttonType={true}  className="button-small mr-3" onClick={() => { this.closeModal() }} >Cancel</Button>
                <Button buttonType={true}  className="button-small" onClick={() => { this.deleteWeapon(selection) }} >Delete</Button>
            </div>
        </div>);
    }

    deleteWeapon(selection: ShipTalentDetailSelection) {
        store.dispatch(removeStarshipTalentDetailSelection(selection));
        this.closeModal();
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(ExpandedMunitionsWeaponsSelectionPage);