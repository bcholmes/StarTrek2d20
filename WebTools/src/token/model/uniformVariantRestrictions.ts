import { Species } from "../../helpers/speciesEnum";
import { BodyType } from "./bodyTypeEnum";
import { DivisionColors } from "./divisionColors";
import { Token } from "./token";
import { UniformEra } from "./uniformEra";
import { UniformVariantType } from "./uniformVariantTypeEnum";

export default class UniformVariantRestrictions {

    static getAvailableVariants(uniformEra: UniformEra, bodyType: BodyType, species: Species, divisionColor: string) {

        if (uniformEra === UniformEra.MonsterMaroon) {
            if (bodyType === BodyType.AverageFemale && "Medical" === DivisionColors.getDivision(uniformEra, divisionColor)) {
                return [ UniformVariantType.Base, UniformVariantType.Variant1 ]; // medical whites
            } else {
                return [ UniformVariantType.Base ];
            }
        } else {
            return [ UniformVariantType.Base ];
        }
    }

    static isVariantOptionsAvailable(token: Token) {
        return this.getAvailableVariants(token.uniformEra, token.bodyType, token.species, token.divisionColor).length > 1;
    }

}