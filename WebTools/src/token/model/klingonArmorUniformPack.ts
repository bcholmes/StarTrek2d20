import { BaseKlingonUniformPack } from "./baseKlingonUniformPack";
import { BodyType } from "./bodyTypeEnum";
import { Token } from "./token";


export class KlingonArmorUniformPack extends BaseKlingonUniformPack {

    getRankIndicator(token: Token) {
        let borderRank = this.getRankBorderIndicator(token);
        if (token.bodyType === BodyType.AverageMale) {
            return `<g transform="matrix(0.23133638,0.01820657,0,0.23134511,227.66287,170.48374)">`
                    + borderRank +
                `</g><g transform="matrix(0.09227919,-0.00604831,0,0.21724297,268.77182,176.95177)">`
                    + borderRank +
            `</g>`;
        } else {
            return `<g transform="matrix(0.27326447,0.02684523,-0.0370136,0.26993717,215.0807,151.83316)">`
                    + borderRank +
                `</g><g transform="matrix(0.10916856,-0.08025211,0.10512724,0.21861227,238.49637,180.18806)">`
                    + borderRank +
            `</g>`;
        }
    }
}