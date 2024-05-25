import i18next from "i18next";
import { makeKey } from "../../common/translationKey";

export enum SafetyEvaluationType {
    AlwaysOk,
    YellowAlert,
    RedAlert
}

export class SafetyEvaluation {
    type: SafetyEvaluationType;

    constructor(type: SafetyEvaluationType) {
        this.type = type;
    }

    get localizedName() {
        return i18next.t(makeKey("SafetyEvaluationType.", SafetyEvaluationType[this.type]));
    }

    static get allTypes() {
        return [
            new SafetyEvaluation(SafetyEvaluationType.AlwaysOk),
            new SafetyEvaluation(SafetyEvaluationType.YellowAlert),
            new SafetyEvaluation(SafetyEvaluationType.RedAlert)
        ];
    }
}