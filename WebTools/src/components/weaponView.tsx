import React from "react";
import { Weapon } from "../helpers/weapons";
import { WithTranslation, withTranslation } from 'react-i18next';

interface IWeaponViewProperties extends WithTranslation {
    weapon?: Weapon;
    dice?: number;
}

class WeaponView extends React.Component<IWeaponViewProperties, {}> {

    render() {
        const { t } = this.props;

        if (this.props.weapon) {
            let dice = this.props.weapon.dice;
            if (this.props.dice) {
                dice = this.props.dice;
            }
            return (<div className="row mt-3">
                    <div className="col-xl-9 mb-2">
                        <div className="pill-left">{t('Weapon.common.name') + ':'}</div>
                        <div className="pill-right">{this.props.weapon.description}</div>
                    </div>
                    <div className="col-xl-3 mb-2">
                        <div className="d-flex align-items-start">
                            <div className="pill-left pill-left-sm"><span className="delta">d</span></div>
                            <div className="pill-right pill-right-sm"><span>{dice}</span></div>
                        </div>
                    </div>
                    <div className="col-xl-12 mb-2">
                        <div className="pill-left">{t('Weapon.common.qualities') + ':'}</div>
                        <div className="pill-right">{this.props.weapon.qualities ? this.props.weapon.qualities : '\u00A0'}</div>
                    </div>
                </div>)
        } else {
            return null;
        }
    }
}

export default withTranslation()(WeaponView);