import { Rank } from "../../helpers/ranks";
import { isEnlistedRank } from "./rankHelper";
import { Token } from "./token";
import { UniformEra } from "./uniformEra";
import UniformPackCollection from "./uniformPackCollection";

class RankIndicatorCatalog {

    private static _instance: RankIndicatorCatalog;

    public static get instance() {
        if (RankIndicatorCatalog._instance == null) {
            RankIndicatorCatalog._instance = new RankIndicatorCatalog();
        }
        return RankIndicatorCatalog._instance;
    }

    getRankIndicator(token: Token) {
        return this.getUniformPack(token.uniformEra).getRankIndicator(token);
    }

    getBorderRankDefinitions(token: Token, bordered: boolean) {
        return this.getUniformPack(token.uniformEra).getRankBorderDefinitions(token, bordered);
    }

    getBorderRankIndicator(token: Token) {
        return this.getUniformPack(token.uniformEra).getRankBorderIndicator(token);
    }

    getUniformPack(era: UniformEra) {
        return UniformPackCollection.instance.getUniformPack(era);
    }

    getSwatches(token: Token) {
        return this.getUniformPack(token.uniformEra).getRankSwatches();
    }

    static decorateSwatch(svg: string, rankIndicator: Rank, token: Token, gradient: string = "") {
        if (token.uniformEra === UniformEra.Enterprise) {
            return `<svg viewBox="0 0 175 175" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g transform="translate(5, -260)">`
                    + svg
                    + `</g>
                </svg>`;
        } else {
            if (isEnlistedRank(rankIndicator)) {
                return `<svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g transform="translate(-212, -230)">`
                    + svg
                    + `</g>
                    </svg>`;
            } else {
                return `<svg viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g transform="translate(-180, -200)">`
                    + svg
                    + `</g>
                    </svg>`;
            }
        }
    }
}

export default RankIndicatorCatalog;