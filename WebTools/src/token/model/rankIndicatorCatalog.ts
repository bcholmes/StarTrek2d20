import { Rank } from "../../helpers/ranks";
import { DominionWarUniformPack } from "./dominionWarUniformPack";
import { EnterpriseUniformPack } from "./enterpriseUniformPack";
import { KlingonArmorUniformPack } from "./klingonArmorUniformPack";
import { MonsterMaroonUniformPack } from "./monsterMaroonUniformPack";
import { isEnlistedRank } from "./rankHelper";
import { Token } from "./token";
import { TosKlingonUniformPack } from "./tosKlingonUniformPack";
import { TosUniformPack } from "./tosUniformPack";
import { DefaultRed } from "./uniformCatalog";
import { UniformEra } from "./uniformEra";

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
        if (era === UniformEra.MonsterMaroon) {
            return new MonsterMaroonUniformPack();
        } else if (era === UniformEra.Enterprise) {
            return new EnterpriseUniformPack();
        } else if (era === UniformEra.Klingon) {
            return new KlingonArmorUniformPack();
        } else if (era === UniformEra.OriginalSeriesKlingon) {
            return new TosKlingonUniformPack();
        } else if (era === UniformEra.OriginalSeries) {
            return new TosUniformPack();
        } else if (era === UniformEra.DominionWar) {
            return new DominionWarUniformPack();
        } else {
            return null;
        }
    }

    getSwatches(token: Token) {
        return this.getUniformPack(token.uniformEra).getRankSwatches();
    }

    static decorateSwatch(svg: string, rankIndicator: Rank, token: Token, gradient: string = "") {
        if (token.uniformEra === UniformEra.OriginalSeries) {
            return `<svg viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <clipPath id="rankClipPath` + rankIndicator + `">
                        <circle cx="40" cy="40" r="40" fill="#ffffff" />
                    </clipPath>
                </defs>
                <g clip-path="url(#rankClipPath` + rankIndicator + `">
                    <g transform="translate(-65, -318)">`
            + svg.replace(DefaultRed, token.divisionColor)
            + `</g>
            + </g>
            </svg>`;
        } else if (token.uniformEra === UniformEra.Enterprise) {
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