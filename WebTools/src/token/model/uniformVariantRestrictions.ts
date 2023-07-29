import { Rank } from "../../helpers/ranks";
import { Species } from "../../helpers/speciesEnum";
import { BodyType } from "./bodyTypeEnum";
import { DivisionColors } from "./divisionColors";
import { Token } from "./token";
import { UniformEra } from "./uniformEra";
import { UniformVariantType } from "./uniformVariantTypeEnum";

// While it's tempting to merge this functionality into the Uniform Pack for encapsulation
// purposes, it needs to be bundled with the main bundle (with the Redux stuff)
export default class UniformVariantRestrictions {

    static getAvailableVariants(uniformEra: UniformEra, bodyType: BodyType, species: Species, divisionColor: string, rank: Rank) {
        let result = [ UniformVariantType.Base ];

        if (uniformEra === UniformEra.MonsterMaroon) {
            if (bodyType === BodyType.AverageFemale && "Medical" === DivisionColors.getDivision(uniformEra, divisionColor)) {
                result.push(UniformVariantType.Variant1); // medical whites
            }
            return result;
        } else if (uniformEra === UniformEra.OriginalSeriesKlingon) {
            if (bodyType === BodyType.AverageMale && rank === Rank.Captain) {
                result.push(UniformVariantType.Variant1); // Klingon sash
            }
            return result;
        } else {
            return result;
        }
    }

    static isVariantOptionsAvailable(token: Token) {
        return this.getAvailableVariants(token.uniformEra, token.bodyType, token.species, token.divisionColor, token.rankIndicator).length > 1;
    }

}