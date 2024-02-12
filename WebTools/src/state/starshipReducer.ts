import { SimpleStats, Starship } from "../common/starship";
import { ShipBuildWorkflow } from "../starship/model/shipBuildWorkflow";
import { ADD_STARSHIP_REFIT, ADD_STARSHIP_TALENT_SELECTION, ADD_STARSHIP_WEAPON, CHANGE_STARSHIP_SCALE, CHANGE_STARSHIP_SIMPLE_CLASS_NAME, CHANGE_STARSHIP_SIMPLE_DEPARTMENT, CHANGE_STARSHIP_SIMPLE_SYSTEM, CHANGE_STARSHIP_SPACEFRAME_CLASS_NAME, CHANGE_STARSHIP_SPACEFRAME_DEPARTMENT, CHANGE_STARSHIP_SPACEFRAME_SCALE, CHANGE_STARSHIP_SPACEFRAME_SERVICE_YEAR, CHANGE_STARSHIP_SPACEFRAME_SYSTEM, CREATE_NEW_STARSHIP, DELETE_STARSHIP_REFIT, DELETE_STARSHIP_WEAPON, NEXT_STARSHIP_WORKFLOW_STEP, REMOVE_ALL_STARSHIP_TALENT_SELECTION, REMOVE_STARSHIP_TALENT_SELECTION, REWIND_TO_STARSHIP_WORKFLOW_STEP, SET_ADDITIONAL_TALENTS, SET_STARSHIP_MISSION_POD, SET_STARSHIP_MISSION_PROFILE, SET_STARSHIP_MISSION_PROFILE_TALENT, SET_STARSHIP_NAME, SET_STARSHIP_REGISTRY, SET_STARSHIP_SPACEFRAME, SET_STARSHIP_TRAITS } from "./starshipActions";

interface StarshipState {
    starship?: Starship;
    workflow?: ShipBuildWorkflow;
}

const starshipReducer = (state: StarshipState = { starship: undefined, workflow: undefined }, action) => {
    switch (action.type) {
        case CREATE_NEW_STARSHIP: {
            let s = action.payload.starship;
            return {
                ...state,
                starship: s
            }
        }
        case CREATE_NEW_STARSHIP: {
            let s = new Starship();
            s.type = action.payload.type;
            s.serviceYear = action.payload.serviceYear;
            if (action.payload.buildType != null) {
                s.buildType = action.payload.buildType;
            }
            if (action.payload.simple) {
                s.simpleStats = new SimpleStats();
                s.simpleStats.scale = action.payload.simple.scale;
                s.simpleStats.systems = [...action.payload.simple.systems];
                s.simpleStats.departments = [...action.payload.simple.departments];
                s.simpleStats.className = action.payload.simple.className;
            }
            return {
                ...state,
                starship: s,
                workflow: action.payload.workflow
            }
        }
        case CHANGE_STARSHIP_SCALE: {
            let s = state.starship.copy();
            if (s.simpleStats == null) {
                s.simpleStats = new SimpleStats();
            }
            s.simpleStats.scale += action.payload.delta;
            s.pruneExcessTalents();
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SPACEFRAME_SCALE: {
            let s = state.starship.copy();
            if (s?.spaceframeModel?.isCustom) {
                let spaceframe = s.spaceframeModel.copy();
                spaceframe.scale += action.payload.delta;
                s.spaceframeModel = spaceframe;
            }
            s.pruneExcessTalents();
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SPACEFRAME_SERVICE_YEAR: {
            let s = state.starship.copy();
            if (s?.spaceframeModel?.isCustom) {
                let spaceframe = s.spaceframeModel.copy();
                spaceframe.serviceYear = action.payload.serviceYear;
                s.spaceframeModel = spaceframe;
            }
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SPACEFRAME_CLASS_NAME: {
            let s = state.starship.copy();
            if (s?.spaceframeModel?.isCustom) {
                let spaceframe = s.spaceframeModel.copy();
                spaceframe.name = action.payload.className;
                s.spaceframeModel = spaceframe;
            }
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SIMPLE_CLASS_NAME: {
            let s = state.starship.copy();
            if (s.simpleStats == null) {
                s.simpleStats = new SimpleStats();
            }
            s.simpleStats.className = action.payload.className;
            return {
                ...state,
                starship: s
            }
        }
        case SET_STARSHIP_NAME: {
            let s = state.starship.copy();
            s.name = action.payload.name;
            return {
                ...state,
                starship: s
            }
        }
        case SET_STARSHIP_SPACEFRAME: {
            let s = state.starship.copy();
            s.spaceframeModel = action.payload.spaceframe;
            return {
                ...state,
                starship: s
            }
        }
        case SET_STARSHIP_MISSION_PROFILE: {
            let s = state.starship.copy();
            s.missionProfileModel = action.payload.missionProfile;
            s.profileTalent = undefined;
            return {
                ...state,
                starship: s
            }
        }
        case SET_STARSHIP_MISSION_PROFILE_TALENT: {
            let s = state.starship.copy();
            s.profileTalent = action.payload.talent;
            return {
                ...state,
                starship: s
            }
        }
        case SET_STARSHIP_MISSION_POD: {
            let s = state.starship.copy();
            s.missionPodModel = action.payload.missionPod;
            return {
                ...state,
                starship: s
            }
        }
        case ADD_STARSHIP_REFIT: {
            let s = state.starship.copy();
            let refits = [...s.refits, action.payload.refit];
            while (refits.length > s.numberOfRefits) {
                refits.splice(0, 1);
            }
            s.refits = refits;
            return {
                ...state,
                starship: s
            }
        }
        case DELETE_STARSHIP_REFIT: {
            let s = state.starship.copy();
            let refits = [...s.refits];
            let index = refits.indexOf(action.payload.refit);
            if (index >= 0) {
                refits.splice(index, 1);
            }
            s.refits = refits;
            return {
                ...state,
                starship: s
            }
        }
        case SET_STARSHIP_REGISTRY: {
            let s = state.starship.copy();
            s.registry = action.payload.registry;
            return {
                ...state,
                starship: s
            }
        }
        case SET_STARSHIP_TRAITS: {
            let s = state.starship.copy();
            s.traits = action.payload.traits;
            return {
                ...state,
                starship: s
            }
        }
        case SET_ADDITIONAL_TALENTS: {
            let s = state.starship.copy();
            s.additionalTalents = [...action.payload.talents];
            return {
                ...state,
                starship: s
            }
        }
        case ADD_STARSHIP_WEAPON: {
            let s = state.starship.copy();
            s.additionalWeapons.push(action.payload.weapon);
            return {
                ...state,
                starship: s
            }
        }
        case ADD_STARSHIP_TALENT_SELECTION: {
            let s = state.starship.copy();
            s.talentDetailSelections.push(action.payload.selection);
            return {
                ...state,
                starship: s
            }
        }
        case REMOVE_STARSHIP_TALENT_SELECTION: {
            let s = state.starship.copy();
            let index = s.talentDetailSelections.indexOf(action.payload.selection);
            if (index >= 0) {
                s.talentDetailSelections.splice(index, 1);
            }
            return {
                ...state,
                starship: s
            }
        }
        case REMOVE_ALL_STARSHIP_TALENT_SELECTION: {
            let s = state.starship.copy();
            s.talentDetailSelections = [];
            return {
                ...state,
                starship: s
            }
        }
        case DELETE_STARSHIP_WEAPON: {
            let s = state.starship.copy();
            if (s.additionalWeapons.indexOf(action.payload.weapon) >= 0) {
                s.additionalWeapons.splice(s.additionalWeapons.indexOf(action.payload.weapon), 1);
            }
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SIMPLE_SYSTEM: {
            let s = state.starship.copy();
            if (s.simpleStats == null) {
                s.simpleStats = new SimpleStats();
            }
            s.simpleStats.systems[action.payload.system] += action.payload.delta;
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SPACEFRAME_SYSTEM: {
            let s = state.starship.copy();
            if (s?.spaceframeModel?.isCustom) {
                let spaceframe = s.spaceframeModel.copy();
                spaceframe.systems[action.payload.system] += action.payload.delta;
                s.spaceframeModel = spaceframe;
            }
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SIMPLE_DEPARTMENT: {
            let s = state.starship.copy();
            if (s.simpleStats == null) {
                s.simpleStats = new SimpleStats();
            }
            s.simpleStats.departments[action.payload.department] += action.payload.delta;
            return {
                ...state,
                starship: s
            }
        }
        case CHANGE_STARSHIP_SPACEFRAME_DEPARTMENT: {
            let s = state.starship.copy();
            if (s?.spaceframeModel?.isCustom) {
                let spaceframe = s.spaceframeModel.copy();
                spaceframe.departments[action.payload.department] += action.payload.delta;
                s.spaceframeModel = spaceframe;
            }
            return {
                ...state,
                starship: s
            }
        }
        case NEXT_STARSHIP_WORKFLOW_STEP: {
            if (state.workflow) {
                let w = new ShipBuildWorkflow(state.workflow.steps);
                w.currentStepIndex = state.workflow.currentStepIndex + 1;
                return {
                    ...state,
                    workflow: w
                }
            } else {
                return
            }
        }
        case REWIND_TO_STARSHIP_WORKFLOW_STEP: {
            if (state.workflow) {
                let w = new ShipBuildWorkflow(state.workflow.steps);
                w.currentStepIndex = action.payload.index;
                return {
                    ...state,
                    workflow: w
                }
            } else {
                return
            }
        }
        default:
            return state;
    }
};

export default starshipReducer;