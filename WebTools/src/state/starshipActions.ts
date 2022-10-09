import { CharacterType } from "../common/characterType";

export const CREATE_NEW_STARSHIP = "CREATE_NEW_STARSHIP";

export function createNewStarship(type: CharacterType, serviceYear: number) {
    let payload = { type: type, serviceYear: serviceYear };
    return {
       type: CREATE_NEW_STARSHIP,
       payload: payload
    }
}
