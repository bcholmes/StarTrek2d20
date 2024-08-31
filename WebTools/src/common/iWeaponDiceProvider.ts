import { Weapon } from "../helpers/weapons";

export interface IWeaponDiceProvider {
    getDiceForWeapon(weapon: Weapon): number;
}