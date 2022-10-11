import { CharacterType } from "../common/characterType";
import { Department } from "../helpers/departments";
import { System } from "../helpers/systems";

export const CREATE_NEW_STARSHIP = "CREATE_NEW_STARSHIP";
export const CHANGE_STARSHIP_SCALE = "CHANGE_STARSHIP_SCALE";
export const CHANGE_STARSHIP_SIMPLE_CLASS_NAME = "CHANGE_STARSHIP_SIMPLE_CLASS_NAME";
export const CHANGE_STARSHIP_SIMPLE_SYSTEM = "CHANGE_STARSHIP_SIMPLE_SYSTEM";
export const CHANGE_STARSHIP_SIMPLE_DEPARTMENT = "CHANGE_STARSHIP_SIMPLE_DEPARTMENT";

export function createNewStarship(type: CharacterType, serviceYear: number, simple: boolean = false) {
    let payload = { type: type, serviceYear: serviceYear, simple: simple };
    return {
       type: CREATE_NEW_STARSHIP,
       payload: payload
    }
}

export function changeStarshipScale(delta: number) {
    let payload = { delta: delta };
    return {
       type: CHANGE_STARSHIP_SCALE,
       payload: payload
    }
}

export function changeStarshipSimpleClassName(className: string) {
    let payload = { className: className };
    return {
       type: CHANGE_STARSHIP_SIMPLE_CLASS_NAME,
       payload: payload
    }
}

export function changeStarshipSimpleSystem(delta: number, system: System) {
    let payload = { delta: delta, system: system };
    return {
       type: CHANGE_STARSHIP_SIMPLE_SYSTEM,
       payload: payload
    }
}

export function changeStarshipSimpleDepartment(delta: number, department: Department) {
    let payload = { delta: delta, department: department };
    return {
       type: CHANGE_STARSHIP_SIMPLE_DEPARTMENT,
       payload: payload
    }
}
