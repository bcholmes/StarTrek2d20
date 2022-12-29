import { Character } from "../../common/character";
import { v4 as uuidv4 } from 'uuid';

export class CharacterWithTracking {
    id: string;
    character: Character;
    currentStress: number;
    notes: string;

    constructor(character: Character) {
        this.id = uuidv4()
        this.character = character;
        this.currentStress = 0;
        this.notes = "";
    }
}