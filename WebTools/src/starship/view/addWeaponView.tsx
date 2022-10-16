import React from "react";
import { Button } from "../../components/button";
import { DropDownInput } from "../../components/dropDownInput";
import { CaptureTypeModel, DeliverySystemModel, EnergyLoadTypeModel, TorpedoLoadTypeModel, Weapon, WeaponType, WeaponTypeModel } from "../../helpers/weapons";
import { addStarshipWeapon } from "../../state/starshipActions";
import store from "../../state/store";

interface IAddWeaponViewProperties {
    serviceYear?: number;
    onClose: () => void;
}
interface IAddWeaponViewState {
    weaponType: WeaponTypeModel;
    loadType: EnergyLoadTypeModel|CaptureTypeModel|TorpedoLoadTypeModel;
    deliverySystem: DeliverySystemModel;
}

class AddWeaponView extends React.Component<IAddWeaponViewProperties, IAddWeaponViewState> {

    constructor(props) {
        super(props);

        this.state = {
            weaponType: WeaponTypeModel.allStarshipTypes()[0],
            loadType: this.getEnergyLoadTypes()[0],
            deliverySystem: this.getDeliverySystems()[0]
        }
    }

    selectWeaponType(type: WeaponTypeModel) {
        let load = this.state.loadType;
        if (type.type === WeaponType.ENERGY && !(load instanceof EnergyLoadTypeModel)) {
            load = this.getEnergyLoadTypes()[0];
        } else if (type.type === WeaponType.TORPEDO && !(load instanceof TorpedoLoadTypeModel)) {
            load = this.getTorpedoLoadTypes()[0];
        } else if (type.type === WeaponType.CAPTURE && !(load instanceof CaptureTypeModel)) {
            load = this.getCaptureTypes()[0];
        }

        this.setState((state) => ({...state, weaponType: type, loadType: load }));
    }

    selectLoadType(type: EnergyLoadTypeModel|CaptureTypeModel|TorpedoLoadTypeModel) {
        this.setState((state) => ({...state, loadType: type }));
    }

    selectDeliverySystem(system: DeliverySystemModel) {
        this.setState((state) => ({...state, deliverySystem: system }));
    }

    getEnergyLoadTypes() {
        if (this.props.serviceYear) {
            return EnergyLoadTypeModel.allTypesByYear(this.props.serviceYear);
        } else {
            return EnergyLoadTypeModel.allTypes();
        }
    }

    getTorpedoLoadTypes() {
        if (this.props.serviceYear) {
            return TorpedoLoadTypeModel.allTypesByYear(this.props.serviceYear);
        } else {
            return TorpedoLoadTypeModel.allTypes();
        }
    }

    getCaptureTypes() {
        return CaptureTypeModel.allTypes();
    }

    getDeliverySystems() {
        if (this.props.serviceYear) {
            return DeliverySystemModel.allTypesByYear(this.props.serviceYear);
        } else {
            return DeliverySystemModel.allTypes();
        }
    }

    addWeapon() {
        if (this.state.weaponType.type === WeaponType.ENERGY) {
            let weapon = Weapon.createStarshipWeapon('', this.state.weaponType.type, this.state.loadType, this.state.deliverySystem);
            store.dispatch(addStarshipWeapon(weapon));
        } else {
            let weapon = Weapon.createStarshipWeapon('', this.state.weaponType.type, this.state.loadType);
            store.dispatch(addStarshipWeapon(weapon));
        }
        this.props.onClose();
    }

    render() {
        let load = undefined;
        if (this.state.weaponType != null && this.state.weaponType.type === WeaponType.ENERGY) {
            load = (<div className="mt-4">
                <p>What kind of energy does the beam weapon discharge?</p>
                <DropDownInput
                    items={ this.getEnergyLoadTypes().map(t => t.description) }
                    defaultValue={ this.state.loadType.description }
                    onChange={(index) => this.selectLoadType(this.getEnergyLoadTypes()[index] ) }/>
            </div>);
        } else if (this.state.weaponType != null && this.state.weaponType.type === WeaponType.TORPEDO) {
            load = (<div className="mt-4">
                <p>What type of charge does the torpedo carry?</p>
                <DropDownInput
                    items={ this.getTorpedoLoadTypes().map(t => t.description) }
                    defaultValue={ this.state.loadType.description }
                    onChange={(index) => this.selectLoadType(this.getTorpedoLoadTypes()[index] ) }/>
            </div>);
        } else if (this.state.weaponType != null && this.state.weaponType.type === WeaponType.CAPTURE) {
            load = (<div className="mt-4">
                <p>What type of technology is used to capture/ensnare other vessels?</p>
                <DropDownInput
                    items={ this.getCaptureTypes().map(t => t.description) }
                    defaultValue={ this.state.loadType.description }
                    onChange={(index) => this.selectLoadType(this.getCaptureTypes()[index] ) }/>
            </div>);
        }

        let deliveryType = undefined;
        if (this.state.weaponType != null && this.state.weaponType.type === WeaponType.ENERGY) {
            deliveryType = (<div className="mt-4">
                <p>What kind of delivery system is used for this energy weapon?</p>
                <DropDownInput
                    items={ this.getDeliverySystems().map(t => t.description) }
                    defaultValue={ this.state.deliverySystem.description }
                    onChange={(index) => this.selectDeliverySystem(this.getDeliverySystems()[index] ) }/>
            </div>);
        }

        return (<div>
            <p>What kind of weapon is this?</p>
            <DropDownInput
                items={ WeaponTypeModel.allStarshipTypes().map((t, i) => t.description) }
                defaultValue={ this.state.weaponType.description }
                onChange={(index) => this.selectWeaponType(WeaponTypeModel.allStarshipTypes()[index] ) }/>
            {load}
            {deliveryType}
            <div className="text-center">
                <Button buttonType={true} onClick={() => this.addWeapon()}>Add</Button>
            </div>
        </div>);
    }
}

export default AddWeaponView;