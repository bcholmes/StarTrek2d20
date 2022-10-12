import { CharacterType } from "../common/characterType";
import { Department } from "../helpers/departments";
import { System } from "../helpers/systems";
import { TalentViewModel } from "../helpers/talents";
import { ShipBuildWorkflow } from "../starship/model/shipBuildWorkflow";

export const CREATE_NEW_STARSHIP = "CREATE_NEW_STARSHIP";
export const CHANGE_STARSHIP_SCALE = "CHANGE_STARSHIP_SCALE";
export const CHANGE_STARSHIP_SIMPLE_CLASS_NAME = "CHANGE_STARSHIP_SIMPLE_CLASS_NAME";
export const CHANGE_STARSHIP_SIMPLE_SYSTEM = "CHANGE_STARSHIP_SIMPLE_SYSTEM";
export const CHANGE_STARSHIP_SIMPLE_DEPARTMENT = "CHANGE_STARSHIP_SIMPLE_DEPARTMENT";
export const NEXT_STARSHIP_WORKFLOW_STEP = "NEXT_STARSHIP_WORKFLOW_STEP";
export const REWIND_TO_STARSHIP_WORKFLOW_STEP = "REWIND_TO_STARSHIP_WORKFLOW_STEP";
export const SET_STARSHIP_NAME = "SET_STARSHIP_NAME";
export const SET_STARSHIP_TRAITS = "SET_STARSHIP_TRAITS";
export const SET_ADDITIONAL_TALENTS = "SET_ADDITIONAL_TALENTS";

export function createNewStarship(type: CharacterType, serviceYear: number, simple: boolean, workflow?: ShipBuildWorkflow) {
    let payload = { type: type, serviceYear: serviceYear, simple: simple, workflow: workflow };
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

export function setStarshipName(name: string) {
    let payload = { name: name };
    return {
       type: SET_STARSHIP_NAME,
       payload: payload
    }
}

export function setStarshipTraits(traits: string) {
    let payload = { traits: traits };
    return {
       type: SET_STARSHIP_TRAITS,
       payload: payload
    }
}

export function setAdditionalTalents(talents: TalentViewModel[]) {
    let payload = { talents: talents };
    return {
       type: SET_ADDITIONAL_TALENTS,
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

export function nextStarshipWorkflowStep() {
    return {
       type: NEXT_STARSHIP_WORKFLOW_STEP,
       payload: {}
    }
}

export function rewindToStarshipWorkflowStep(step: number) {
    return {
       type: REWIND_TO_STARSHIP_WORKFLOW_STEP,
       payload: { index: step }
    }
}
