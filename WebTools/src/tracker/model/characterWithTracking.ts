import { Character } from "../../common/character";
import { v4 as uuidv4 } from 'uuid';

export class CharacterWithTracking {
    id: string;
    character: Character;

    constructor(character: Character) {
        this.id = uuidv4()
        this.character = character;
    }
}