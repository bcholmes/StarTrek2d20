import EarCatalog from "./model/earCatalog";
import EyeCatalog from "./model/eyeCatalog";
import HairCatalog from "./model/hairCatalog";
import HeadCatalog from "./model/headCatalog";
import MouthCatalog from "./model/mouthCatalog";
import NoseCatalog from "./model/noseCatalog";
import RankIndicatorCatalog from "./model/rankIndicatorCatalog";
import { Token } from "./model/token";
import UniformCatalog from "./model/uniformCatalog";


export class TokenSvgBuilder {

    static createSvg(token: Token, rounded: boolean = false, fancyBorder: boolean = false) {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <svg viewBox="0 0 400 400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>Token</title>
                <defs>
                    <clipPath id="clipPath">
                        <circle cx="200px" cy="200px" r="200px" fill="#ffffff" />
                    </clipPath>
                </defs>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">`

        + "<g id=\"background\"" + (rounded ? " clip-path=\"url(#clipPath)\"" : "") + " >" +
            `<rect width="400px" height="400px" x="0" y="0" fill="white"/>` +
            "<g"  + (rounded ? " transform=\"translate(-60,0)\"" : "") + ">" +
            UniformCatalog.instance.getBody(token) +
            HeadCatalog.instance.getHead(token) +
            RankIndicatorCatalog.instance.getRankIndicator(token) +
            MouthCatalog.instance.getMouth(token) +
            NoseCatalog.instance.getNose(token) +
            HairCatalog.instance.getHair(token) +
            EarCatalog.instance.getEar(token) +
            EyeCatalog.instance.getEyes(token) +
            "</g>" +
        "</g>"

        + (fancyBorder ? "<circle cx=\"200px\" cy=\"200px\" r=\"190px\" stroke=\"" + token.divisionColor + "\" stroke-width=\"20px\" />" : "")

        + `</g>
        </svg>`;
    }
}