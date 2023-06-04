import { Species } from "../../helpers/speciesEnum";
import { BolianEar } from "./earCatalog";
import { BolianSeam, BolianStripes, ReferenceHead } from "./headCatalog";
import { SpeciesOption } from "./speciesOptionEnum";
import SpeciesRestrictions from "./speciesRestrictions";
import Swatch from "./swatch";
import { Token } from "./token";

class SpeciesOptionCatalog {

    private static _instance: SpeciesOptionCatalog;

    public static get instance() {
        if (SpeciesOptionCatalog._instance == null) {
            SpeciesOptionCatalog._instance = new SpeciesOptionCatalog();
        }
        return SpeciesOptionCatalog._instance;
    }

    getSwatches(token: Token) {
        if (token.species === Species.Bolian) {
            return [
                new Swatch(SpeciesOption.Option1, "Ridge", (token) => SpeciesOptionCatalog.instance.decorateSwatch(SpeciesOption.Option1, token)),
                new Swatch(SpeciesOption.Option2, "Ridge and Stripes", (token) => SpeciesOptionCatalog.instance.decorateSwatch(SpeciesOption.Option2, token))
            ];
        } else {
            return [];
        }
    }

    private decorateSwatch(option: SpeciesOption, token: Token) {
        if (token.species === Species.Bolian) {

            return `<svg viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <clipPath id="speciesOptionPath` + option + `">
                    <circle cx="100" cy="100" r="100" fill="#ffffff" />
                </clipPath>
            </defs>
            <g clip-path="url(#speciesOptionPath` + option + `">
                <g transform="translate(-170, 20)">`
                    + ReferenceHead.replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, token.skinColor)
                    + BolianSeam.replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, token.skinColor)
                    + (option !== SpeciesOption.Option1 ? BolianStripes : "")
                    + BolianEar.replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, token.skinColor)
            +  `</g>
            </g>
        </svg>`;

        } else {
            return "";
        }
    }
}

export default SpeciesOptionCatalog;