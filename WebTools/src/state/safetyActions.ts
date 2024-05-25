import { SafetyEvaluationType } from "../safety/model/safetyEvaluation";

export const SET_SAFETY_EVALUATION = "SET_SAFETY_EVALUATION";

export function setSafetyEvaluation(category: string, evaluation: SafetyEvaluationType) {
    let payload = { category: category, evaluation: evaluation };
    return {
       type: SET_SAFETY_EVALUATION,
       payload: payload
    }
}
