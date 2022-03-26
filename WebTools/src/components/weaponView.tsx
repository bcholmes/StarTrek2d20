import React from "react";
import { Weapon } from "../helpers/weapons";

interface IWeaponViewProperties {
    weapon?: Weapon;
    dice?: number;
}

export class WeaponView extends React.Component<IWeaponViewProperties, {}> {
    
    render() {
        if (this.props.weapon) {
            let dice = this.props.weapon.dice;
            if (this.props.dice) {
                dice = this.props.dice;
            }
            return (<div className="row mt-3">
                    <div className="col-xl-9 mb-2"><div className="pill-left">Name/Type:</div><div className="pill-right">{this.props.weapon.name}</div></div>
                    <div className="col-xl-3 mb-2"><div className="d-flex align-items-start"><div className="pill-left pill-left-sm"><span className="delta">d</span></div><div className="pill-right pill-right-sm"><span>{dice}</span></div></div></div>
                    <div className="col-xl-12 mb-2"><div className="pill-left">Qualities:</div><div className="pill-right">{this.props.weapon.qualities ? this.props.weapon.qualities : '\u00A0'}</div></div>
                </div>)
        } else {
            return null;
        }
    }
}