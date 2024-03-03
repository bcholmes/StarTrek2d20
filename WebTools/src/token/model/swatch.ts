import i18next from "i18next";
import { Token } from "./token";

class Swatch {
    id: number;
    name: string;
    svg: string|((token: Token) => string);
    private readonly localizationKey: string;

    constructor(id: number, name: string, svg: string|((token: Token) => string), localizationKey?: string) {
        this.id = id;
        this.name = name;
        this.svg = svg;
        this.localizationKey = localizationKey;
    }

    get localizedName() {
        if (this.localizationKey == null) {
            return this.name;
        } else {
            let result = i18next.t(this.localizationKey);
            return result === this.localizationKey ? this.name : i18next.t(this.localizationKey);
        }
    }
}

export default Swatch;
