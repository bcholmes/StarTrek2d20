import Swatch from "./swatch";
import { Token } from "./token";

export interface IUniformPack {

    getUniformSwatches(): Swatch[];
    getUniformAndVariantBody(token: Token): string;
    getUniformVariantSwatches(token: Token): Swatch[];

    getRankSwatches(): Swatch[];
    getRankIndicator(token: Token): string;
    getBorderColor(token: Token): string;
    getRankBorderDefinitions(token: Token, bordered: boolean): string;
    getRankBorderIndicator(token: Token): string;

    getBorderLogo(token: Token): string;
}