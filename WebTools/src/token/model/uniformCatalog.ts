import SpeciesRestrictions from "./speciesRestrictions";
import { Token } from "./token";
import { UniformEra } from "./uniformEra";
import UniformPackCollection from "./uniformPackCollection";

export const DefaultRed = /#d30000/g;

class UniformCatalog {

    private static _instance: UniformCatalog;

    public static get instance() {
        if (UniformCatalog._instance == null) {
            UniformCatalog._instance = new UniformCatalog();
        }
        return UniformCatalog._instance;
    }

    getBody(token: Token) {
        return this.getUniformPack(token.uniformEra).getUniformAndVariantBody(token);
    }

    getSwatches(uniformEra: UniformEra) {
        return this.getUniformPack(uniformEra).getUniformSwatches();
    }

    getUniformVariantSwatches(token: Token) {
        let uniformPack = this.getUniformPack(token.uniformEra);
        if (uniformPack != null) {
            return uniformPack.getUniformVariantSwatches(token);
        } else {
            return [];
        }
    }

    getUniformPack(era: UniformEra) {
        return UniformPackCollection.instance.getUniformPack(era);
    }

    static decorateSwatch(svg: string, clipPathId: number, token: Token) {
        let result = `<svg viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <clipPath id="clipPath` + clipPathId + `">
                        <circle cx="150" cy="150" r="150" fill="#ffffff" />
                    </clipPath>
                </defs>
                <g clip-path="url(#clipPath` + clipPathId + `">
                    <g transform="translate(-70, -130)">`
                    + svg.replace(DefaultRed, token.divisionColor).replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, token.skinColor)
                + `</g>
                </g>
            </svg>`;
        return result;
    }
}

export default UniformCatalog;