import React from "react";
import { InjuryType, Weapon } from "../helpers/weapons";
import { useTranslation } from 'react-i18next';
import { makeKey } from "../common/translationKey";

interface IWeaponViewProperties {
    weapon?: Weapon;
    dice?: number;
    version: number;
}

const WeaponView: React.FC<IWeaponViewProperties> = ({weapon, dice, version}) => {

    const { t } = useTranslation();

    const renderInjuryAndDetails = () => {
        let result = weapon.injuryTypeEffectsAndQualities;
        return result?.length ? result : '\u00A0';
    }

    if (weapon) {
        dice = dice ?? weapon.dice;
        return (<div className="row mt-3">
                <div className="col-xl-9 mb-2">
                    <div className="pill-left">{t('Weapon.common.name') + ':'}</div>
                    <div className="pill-right">{weapon.description}</div>
                </div>
                <div className="col-xl-3 mb-2">
                    <div className="d-flex align-items-start">
                        <div className="pill-left pill-left-sm"><span className="delta">d</span></div>
                        <div className="pill-right pill-right-sm"><span>{dice}</span></div>
                    </div>
                </div>
                <div className="col-xl-12 mb-2">
                    <div className="pill-left">{t('Weapon.common.qualities') + ':'}</div>
                    <div className="pill-right">
                        {renderInjuryAndDetails()}
                    </div>
                </div>
            </div>)
    } else {
        return null;
    }
}

export default WeaponView;