import { Weapon } from "../helpers/weapons";
import { CharacterType } from "./characterType";

export abstract class Construct {
    public name?: string;
    public type: CharacterType = CharacterType.Starfleet;
    
    determineWeapons() : Weapon[] {
        return [];
    }
}
