import { SafetyEvaluationType } from "../safety/model/safetyEvaluation";
import { SET_SAFETY_EVALUATION } from "./safetyActions"

const initialState: {[key: string]: SafetyEvaluationType } = {
}

const safety = (state: any = initialState, action) => {
    switch (action.type) {
    case SET_SAFETY_EVALUATION: {
        const category = action.payload.category;
        const evaluation = action.payload.evaluation;

        let temp = {...state};
        temp[category] = evaluation;

        return temp;
    }
    default:
        return state;
    }
}

export default safety;