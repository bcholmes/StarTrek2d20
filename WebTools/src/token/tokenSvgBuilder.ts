import EarCatalog from "./model/earCatalog";
import ExtrasCatalog from "./model/extrasCatalog";
import { ExtraCategory } from "./model/extrasTypeEnum";
import EyeBrowCatalog from "./model/eyeBrowCatalog";
import EyeCatalog from "./model/eyeCatalog";
import FacialHairCatalog, { FacialHairPlacement } from "./model/facialHairCatalog";
import HairCatalog, { HairElement } from "./model/hairCatalog";
import HeadCatalog from "./model/headCatalog";
import MouthCatalog from "./model/mouthCatalog";
import NasoLabialFoldCatalog from "./model/nasoLabialFoldCatalog";
import NoseCatalog from "./model/noseCatalog";
import ProstheticCatalog, { ProstheticPlacement } from "./model/prostheticCatalog";
import RankIndicatorCatalog from "./model/rankIndicatorCatalog";
import { Token } from "./model/token";
import UniformCatalog from "./model/uniformCatalog";
import { UniformEra } from "./model/uniformEra";
import UniformPackCollection from "./model/uniformPackCollection";

const EnterpriseEraStarfleetLogoGradient = `<radialGradient xmlns="http://www.w3.org/2000/svg" id="blueSpaceBackground" cx="314.99219" cy="293.60739" r="229.5562" fx="314.99219" fy="293.60739" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.18219681,0,0,0.18219681,278.71109,288.43675)">
    <stop offset="0" style="stop-color:#4279b3;stop-opacity:1;" id="stop1320"/>
    <stop offset="1" style="stop-color:#0a4671;stop-opacity:1;" id="stop1322"/>
</radialGradient>`;

export class TokenSvgBuilder {

    static createSvg(token: Token, rounded: boolean = false, fancyBorder: boolean = false) {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <svg viewBox="0 0 400 400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>Token</title>
                <defs>`
                + (token.uniformEra === UniformEra.Enterprise ? EnterpriseEraStarfleetLogoGradient : "")
                +   `<clipPath id="roundClipPath">
                        <circle cx="200px" cy="200px" r="200px" fill="#ffffff" />
                    </clipPath>`
                + RankIndicatorCatalog.instance.getBorderRankDefinitions(token, fancyBorder)
                + HairCatalog.instance.getDefinitions(token.hairType, token)
                + `</defs>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">`

                + "<g id=\"background\"" + (rounded ? " clip-path=\"url(#roundClipPath)\"" : "") + " >" +
                    `<rect width="400px" height="400px" x="0" y="0" fill="white"/>` +
                    "<g"  + (rounded ? " transform=\"translate(-40,0)\"" : "") + ">" +
                        "<g transform=\"translate(-20,0)\">" +
                            HairCatalog.instance.getHair(token, HairElement.BehindHead) +
                            EarCatalog.instance.getHiddenEar(token) +
                        "</g>" +
                        ProstheticCatalog.instance.getProsthetic(token, ProstheticPlacement.VeryBack) +
                        UniformCatalog.instance.getBody(token) +
                        RankIndicatorCatalog.instance.getRankIndicator(token) +
                        "<g transform=\"translate(-20,0)\">" +
                            ProstheticCatalog.instance.getProsthetic(token, ProstheticPlacement.BehindHead) +
                            HeadCatalog.instance.getHead(token) +
                            ProstheticCatalog.instance.getProsthetic(token, ProstheticPlacement.BaseHead) +
                            NasoLabialFoldCatalog.instance.getNasoLabialFold(token) +
                            FacialHairCatalog.instance.getFacialHair(token, FacialHairPlacement.Chin) +
                            MouthCatalog.instance.getMouth(token) +
                            FacialHairCatalog.instance.getFacialHair(token, FacialHairPlacement.UpperLip) +
                            EyeCatalog.instance.getEyes(token) +
                            NoseCatalog.instance.getNose(token) +
                            EyeBrowCatalog.instance.getEyeBrows(token) +
                            ExtrasCatalog.instance.getExtras(token, ExtraCategory.Forehead) +
                            HairCatalog.instance.getHair(token, HairElement.BehindEars) +
                            ExtrasCatalog.instance.getExtras(token, ExtraCategory.Headwear, true) +
                            EarCatalog.instance.getEar(token) +
                            ExtrasCatalog.instance.getExtras(token, ExtraCategory.Face) +
                            ExtrasCatalog.instance.getExtras(token, ExtraCategory.Ear) +
                            HairCatalog.instance.getHair(token, HairElement.CoveringEars) +
                            ExtrasCatalog.instance.getExtras(token, ExtraCategory.Headwear) +
                            ProstheticCatalog.instance.getProsthetic(token, ProstheticPlacement.VeryFront) +
                        "</g>" +
                    "</g>" +
                "</g>"

                + (fancyBorder ? TokenSvgBuilder.createBorder(token) : "")

            + `</g>
        </svg>`;
    }

    private static createBorder(token: Token) {
        const colour = this.getBorderColor(token);
        return "<circle cx=\"200px\" cy=\"200px\" r=\"190px\" stroke=\"" + colour + "\" stroke-width=\"20px\" />"
            + "<circle cx=\"200px\" cy=\"200px\" r=\"180px\" stroke=\"black\" stroke-width=\"6px\" />"
            + RankIndicatorCatalog.instance.getBorderRankIndicator(token)
            + this.getDelta(token);
    }

    private static getBorderColor(token: Token) {
        return UniformPackCollection.instance.getUniformPack(token.uniformEra).getBorderColor(token);
    }

    private static getDelta(token: Token) {
        return UniformPackCollection.instance.getUniformPack(token.uniformEra).getBorderLogo(token);
    }
}