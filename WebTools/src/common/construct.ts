import { Weapon } from "../helpers/weapons";
import { CharacterType } from "./characterType";
import { IConstruct } from "./iconstruct";

export enum ConstructType {
    Character,
    Starship
}

export enum Stereotype {
    MainCharacter,
    SoloCharacter,
    SupportingCharacter,
    Npc,
    Starship
}

export abstract class Construct implements IConstruct {
    public stereotype: Stereotype;
    public name?: string;
    public type: CharacterType = CharacterType.Starfleet;

    constructor(stereotype: Stereotype) {
        this.stereotype = stereotype;
    }

    determineWeapons() : Weapon[] {
        return [];
    }

    hasTalent(talentName: string) {
        return false;
    }
}
