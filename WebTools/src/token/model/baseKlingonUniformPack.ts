import { Rank } from "../../helpers/ranks";
import Swatch from "./swatch";
import { Token } from "./token";

const KlingonRanks = {
    Border: {
        Captain: `<g>
                <path style="opacity:1;fill:#c7b791;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 79.424528,305.81758 -2.482449,14.76869 -6.932502,-7.00811 0.761477,9.07293 -11.285341,-5.8254 6.568865,10.89471 -9.287139,-0.22322 7.503158,5.99099 -14.783094,3.80019 14.768692,2.48246 -7.008108,6.9325 9.072918,-0.76148 -5.82539,11.28534 10.894701,-6.56886 -0.223221,9.28714 5.991005,-7.50317 3.800185,14.78309 2.48245,-14.76868 6.932501,7.00811 -0.761478,-9.07293 11.285342,5.82539 -6.568864,-10.8947 9.287144,0.22322 -7.503164,-5.99099 14.783094,-3.80019 -14.768692,-2.48246 7.008112,-6.9325 -9.072921,0.76148 5.825395,-11.28534 -10.894708,6.56886 0.223223,-9.28714 -5.991006,7.50317 z" id="path235636"/>
                <path style="opacity:1;fill:#c7b791;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:3.0;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 80.191406,290.52148 a 46,46 0 0 0 -46,46 46,46 0 0 0 46,46 46,46 0 0 0 46.000004,-46 46,46 0 0 0 -46.000004,-46 z m 0,9.69727 a 36.301369,36.301369 0 0 1 36.300784,36.30273 36.301369,36.301369 0 0 1 -36.300784,36.30079 36.301369,36.301369 0 0 1 -36.300781,-36.30079 36.301369,36.301369 0 0 1 36.300781,-36.30273 z" id="path230388"/>
            </g>`,
        Commander: `<g>
                <path style="opacity:1;fill:#c7b791;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:3.0;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 80.191406,290.52148 a 46,46 0 0 0 -46,46 46,46 0 0 0 46,46 46,46 0 0 0 46.000004,-46 46,46 0 0 0 -46.000004,-46 z m 0,9.69727 a 36.301369,36.301369 0 0 1 36.300784,36.30273 36.301369,36.301369 0 0 1 -36.300784,36.30079 36.301369,36.301369 0 0 1 -36.300781,-36.30079 36.301369,36.301369 0 0 1 36.300781,-36.30273 z" id="path236391"/>
                <path style="fill:#c7b791;fill-opacity:1;stroke:#000000;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 71.780822,321.64384 c 0,0 12.111581,-9.57549 17.534246,-6.0274 5.422665,3.54809 3.813178,13.32055 1.643836,20.27397 -2.169342,6.95342 -6.770627,16.80776 -14.79452,18.08219 -8.023893,1.27443 -14.826789,-5.00563 -19.82004,-11.56762 -4.993251,-6.56199 -7.886448,-23.51464 -7.886448,-23.51464 -1.746912,2.73905 -2.740398,5.68359 -3.596899,9.45004 0,0 5.256755,19.6089 9.673319,26.53438 4.416564,6.92548 6.930212,11.40329 13.604617,14.50679 6.674405,3.1035 26.107642,-0.0665 26.107642,-0.0665 l 17.501005,-51.01968 c 0,0 -3.74995,-8.79204 -17.240799,-14.88853 -13.490853,-6.09649 -24.984216,-1.55566 -24.984216,-1.55566 z" id="path236395" sodipodi:nodetypes="czzzzcczzcczcc" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"/>
            </g>`,
        LtCommander: `<g>
                <path style="opacity:1;fill:#c7b791;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:3.0;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 80.191406,290.52148 a 46,46 0 0 0 -46,46 46,46 0 0 0 46,46 46,46 0 0 0 46.000004,-46 46,46 0 0 0 -46.000004,-46 z m 0,9.69727 a 36.301369,36.301369 0 0 1 36.300784,36.30273 36.301369,36.301369 0 0 1 -36.300784,36.30079 36.301369,36.301369 0 0 1 -36.300781,-36.30079 36.301369,36.301369 0 0 1 36.300781,-36.30273 z" id="path242411"/>
                <path style="fill:#c7b791;fill-opacity:1;stroke:#000000;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 44.899694,345.15705 27.155101,-22.96527 c 0.273973,11.59817 -1.09589,23.74429 -4.109589,35.61644 l 57.808214,-29.0411 c -1.36986,-6.57534 -3.28767,-11.50685 -6.57534,-17.26027 l -34.246573,20 5.462833,-25.10862 c 1.724555,-1.08576 4.408252,-2.37537 5.415826,-2.62766 -4.658967,-2.3833 -10.145841,-3.87696 -18.970586,-3.65708 -8.824745,0.21988 -17.508319,6.69011 -20.159064,9.00928 5.921714,-1.21638 10.260123,-2.77574 15.100306,-1.99948 l -27.138481,21.54697 c -1.607909,5.29403 -1.191411,10.96721 0.257353,16.48679 z" id="path242417" sodipodi:nodetypes="cccccccczcccc" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"/>
            </g>`,

        Lieutenant: `<g>
                <path style="opacity:1;fill:#c7b791;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:3.0;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 80.191406,290.52148 a 46,46 0 0 0 -46,46 46,46 0 0 0 46,46 46,46 0 0 0 46.000004,-46 46,46 0 0 0 -46.000004,-46 z m 0,9.69727 a 36.301369,36.301369 0 0 1 36.300784,36.30273 36.301369,36.301369 0 0 1 -36.300784,36.30079 36.301369,36.301369 0 0 1 -36.300781,-36.30079 36.301369,36.301369 0 0 1 36.300781,-36.30273 z" id="path243145"/>
                <path style="fill:#c7b791;fill-opacity:1;stroke:#000000;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 45.616438,325.20548 33.287672,16.02739 20.958904,26.0274 c 3.150686,-2.19178 5.890416,-4.79452 8.493156,-7.9452 L 87.808219,334.52055 115.75343,307.26028 c -4.15526,-4.52055 -7.48859,-7.39726 -12.19179,-10.41096 L 76.575343,328.49315 50.410959,315.61644 c -2.328767,3.379 -3.424658,5.6621 -4.794521,9.58904 z" id="path243151" sodipodi:nodetypes="cccccccccc" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"/>
            </g>`,

        LieutenantJG: `<g>
                <path style="opacity:1;fill:#c7b791;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:3.0;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 80.191406,290.52148 a 46,46 0 0 0 -46,46 46,46 0 0 0 46,46 46,46 0 0 0 46.000004,-46 46,46 0 0 0 -46.000004,-46 z m 0,9.69727 a 36.301369,36.301369 0 0 1 36.300784,36.30273 36.301369,36.301369 0 0 1 -36.300784,36.30079 36.301369,36.301369 0 0 1 -36.300781,-36.30079 36.301369,36.301369 0 0 1 36.300781,-36.30273 z" id="path243896"/>
                <path style="fill:#c7b791;fill-opacity:1;stroke:#000000;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 34.650651,330.21723 80.417839,-23.91586 c 3.70837,3.98503 5.67318,8.35751 8.21918,13.69863 l -21.91781,6.57534 -18.630134,46.09102 c -4.524743,0.14118 -6.91848,-0.20196 -11.249496,-1.12628 L 81.643836,346.30137 46.575342,367.12329 C 43.60865,364.49151 41.610597,361.56913 40,358.35616 l 40.547945,-25.20548 -45.446213,11.86107 c -1.054424,-5.90014 -0.849617,-9.47556 -0.451081,-14.79452 z" id="path243902" sodipodi:nodetypes="cccccccccccc" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"/>
            </g>`,

        Ensign: `<g>
                <path style="opacity:1;fill:#c7b791;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:3.0;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 80.191406,290.52148 a 46,46 0 0 0 -46,46 46,46 0 0 0 46,46 46,46 0 0 0 46.000004,-46 46,46 0 0 0 -46.000004,-46 z m 0,9.69727 a 36.301369,36.301369 0 0 1 36.300784,36.30273 36.301369,36.301369 0 0 1 -36.300784,36.30079 36.301369,36.301369 0 0 1 -36.300781,-36.30079 36.301369,36.301369 0 0 1 36.300781,-36.30273 z" id="path243924"/>
                <path style="fill:#c7b791;fill-opacity:1;stroke:#000000;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 44.557414,343.867 64.123926,-43.39505 c 4.50465,3.24637 6.42033,5.16988 9.61589,10.01308 0,0 -2.35662,-0.0955 -10.93875,6.91176 -8.582124,7.00724 -33.257564,64.73147 -33.257564,64.73147 -6.909628,-0.5166 -11.300794,-2.29245 -16.660598,-5.9087 l 19.275925,-39.5205 -27.703088,18.21043 c -2.453886,-3.4871 -3.35795,-6.58675 -4.455741,-11.04249 z" id="path243930" sodipodi:nodetypes="ccczccccc" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"/>
            </g>`
    },
}

export abstract class BaseKlingonUniformPack {

    getRankSwatches() {
        return [
            new Swatch(Rank.None, "None", (token) => BaseKlingonUniformPack.decorateSwatch("", Rank.None, token), "Rank.none.name"),
            new Swatch(Rank.Ensign, "Ensign", (token) => BaseKlingonUniformPack.decorateSwatch(KlingonRanks.Border.Ensign, Rank.Ensign, token), "Rank.ensign.name"),
            new Swatch(Rank.LieutenantJG, "Lieutenant J.G.", (token) => BaseKlingonUniformPack.decorateSwatch(KlingonRanks.Border.LieutenantJG, Rank.LieutenantJG, token), "Rank.lieutenantJG.name"),
            new Swatch(Rank.Lieutenant, "Lieutenant", (token) => BaseKlingonUniformPack.decorateSwatch(KlingonRanks.Border.Lieutenant, Rank.Lieutenant, token), "Rank.lieutenant.name"),
            new Swatch(Rank.LtCommander, "Lt. Commander", (token) => BaseKlingonUniformPack.decorateSwatch(KlingonRanks.Border.LtCommander, Rank.LtCommander, token), "Rank.ltCommander.name"),
            new Swatch(Rank.Commander, "Commander", (token) => BaseKlingonUniformPack.decorateSwatch(KlingonRanks.Border.Commander, Rank.Commander, token), "Rank.commander.name"),
            new Swatch(Rank.Captain, "Captain (HoD)", (token) => BaseKlingonUniformPack.decorateSwatch(KlingonRanks.Border.Captain, Rank.Captain, token), "Rank.captain.name")
        ];
    }

    getRankBorderIndicator(token: Token) {
        switch (token.rankIndicator) {
            case Rank.Captain:
                return KlingonRanks.Border.Captain;
            case Rank.Commander:
                return KlingonRanks.Border.Commander;
            case Rank.LtCommander:
                return KlingonRanks.Border.LtCommander;
            case Rank.Lieutenant:
                return KlingonRanks.Border.Lieutenant;
            case Rank.LieutenantJG:
                return KlingonRanks.Border.LieutenantJG;
            case Rank.Ensign:
                return KlingonRanks.Border.Ensign;
            default:
                return "";
        }
    }

    static decorateSwatch(svg: string, rankIndicator: Rank, token: Token) {
        return `<svg viewBox="0 0 150 150" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g transform="translate(-5, -260)">`
                    + svg
                    + `</g>
                </svg>`;
    }
}