import { Weapon } from "../helpers/weapons";
import { CharacterType } from "./characterType";
import { IConstruct } from "./iconstruct";

export abstract class Construct implements IConstruct {
    public name?: string;
    public type: CharacterType = CharacterType.Starfleet;

    determineWeapons() : Weapon[] {
        return [];
    }

    hasTalent(talentName: string) {
        return false;
    }
}
