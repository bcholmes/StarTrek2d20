import i18next from "i18next";
import { InjuryType, Weapon, WeaponType, WeaponTypeModel } from "../helpers/weapons";
import { makeKey } from "../common/translationKey";
import { CHALLENGE_DICE_NOTATION } from "../common/challengeDiceNotation";
import { IWeaponDiceProvider } from "../common/iWeaponDiceProvider";

export class WeaponDescriber {

    readonly version: number;
    readonly personal: boolean;

    constructor(version: number, personal: boolean) {
        this.version = version;
        this.personal = personal;
    }

    describeFully(weapon: Weapon, diceProvider: IWeaponDiceProvider) {
        let type = WeaponTypeModel.TYPES[weapon.type].description;
        if (this.personal) {
            type = weapon.type === WeaponType.MELEE ? i18next.t("Weapon.common.melee") : i18next.t("Weapon.common.ranged");
        }
        let injuryType = "";
        if (this.version > 1 && weapon.injuryType != null) {
            injuryType = i18next.t(makeKey("InjuryType.", InjuryType[weapon.injuryType])) + " ";
        }

        let qualities = weapon.weaponQualities.map(q => q.localizedDescription).join(", ");
        if (qualities?.length) {
            qualities = ", " + qualities;
        } else {
            qualities = "";
        }
        const dice = diceProvider.getDiceForWeapon(weapon);

        let text = type + ", " + injuryType + dice
            + (this.version === 1 ? CHALLENGE_DICE_NOTATION : "") + qualities
            + (weapon.hands != null ? ", " + i18next.t("Weapon.common.size", { hands: weapon.hands }) : "");
        return text;
    }

    describe(weapon: Weapon) {
        return this.version > 1 ? weapon.injuryTypeEffectsAndQualities : weapon.effectsAndQualities;
    }
}