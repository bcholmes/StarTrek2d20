import { Division } from "../common/character";
import { DivisionColors } from "./model/divisionColors";
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


const DominionWarCommbadge = `<g id="g6426">
    <path id="path882_1_" fill="#ffffff" d="m 328.76833,314.91763 c -15.72989,0.062 -31.06633,1.08076 -39.00882,3.49535 -1.32402,0.34773 -1.83501,0.94526 -2.65783,2.39172 -2.2301,5.49689 -3.92635,13.13572 -4.14838,20.14438 0.43426,1.94766 -0.13551,3.10026 2.38683,3.27985 31.89893,6.34583 82.19702,3.20965 95.26744,-1.32239 1.93787,-0.67589 1.46442,-0.74935 1.46605,-2.8766 -0.20243,-8.91877 -2.23826,-14.45648 -5.71075,-20.64558 -1.05465,-1.21301 -1.33055,-1.21464 -2.77702,-1.62605 -8.65592,-1.75339 -26.98977,-2.91252 -44.81752,-2.84068 z m -34.48984,12.44187 h 75.76793 c 1.48402,0 2.67906,1.19505 2.67906,2.67906 0,1.48402 -1.19504,2.67906 -2.67906,2.67906 h -75.76793 c -1.48401,0 -2.67906,-1.19504 -2.67906,-2.67906 0,-1.48401 1.19505,-2.67906 2.67906,-2.67906 z" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path id="path878_1_" fill="#ffffff" d="m 347.54134,313.03853 c -4.27082,-11.30397 -11.8117,-30.16514 -14.74871,-30.16514 -0.72976,0 -1.96889,0 -7.1915,11.70068 -2.31826,5.1916 -4.88957,11.54233 -7.47721,18.38446 l -1.49218,4.07982 c -0.5714,1.53952 -1.12647,3.11169 -1.68318,4.68386 -3.28638,9.27141 -9.90649,29.03866 -13.54224,46.93008 l -0.72976,3.74677 c -0.82608,4.5255 -1.41218,8.87469 -1.66686,12.82879 -0.0163,0.23836 0.08,0.52406 0.23836,0.69875 0.17468,0.19101 0.44406,0.2857 0.69874,0.2857 0.55508,0 0.6514,-0.08 4.42918,-4.57285 1.2228,-1.44483 2.76232,-3.27005 4.52551,-5.31894 l 2.57131,-2.92068 c 9.30406,-10.54156 22.84629,-24.49683 30.67287,-24.83151 2.65131,0 10.14484,13.63856 15.24175,23.46504 l 1.63584,3.19169 c 0.84078,1.65054 1.57217,3.09537 2.12725,4.20715 3.3027,6.55644 3.3027,6.55644 4.01614,6.55644 0.23836,0 0.49141,-0.0947 0.6514,-0.28571 0.17468,-0.17468 0.26937,-0.46038 0.25468,-0.69874 -0.19101,-3.90512 -0.71507,-8.17595 -1.44483,-12.62146 l -0.66609,-3.77778 c -3.46107,-18.09876 -10.0975,-37.99172 -13.38388,-47.27946 -0.031,-0.08 -0.60405,-1.68318 -1.52482,-4.19082 z" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path id="path976" style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:1.63258;stroke-opacity:1" d="m 332.75299,287.45308 c -3.88135,7.01826 -6.78377,14.52407 -9.76291,21.95549 -5.47225,14.13746 -10.30774,28.54566 -14.34631,43.17543 -1.7114,6.25454 -3.314,12.83267 -4.54284,19.31058 -0.32502,1.66038 -0.63465,3.54427 -0.86023,4.97614 -0.49116,1.77811 0.2285,0.87849 0.97702,-0.0849 7.63774,-8.88123 15.44151,-17.7415 24.61118,-25.08874 3.94579,-2.98948 8.29507,-6.09402 13.40388,-6.41499 3.04332,0.23874 4.87846,3.05622 6.55015,5.27635 4.80319,6.97695 8.64977,14.55255 12.56567,22.04702 -2.75569,-15.8786 -7.44479,-31.34893 -12.59713,-46.59453 -3.99852,-11.35508 -8.17923,-22.67407 -13.29654,-33.58006 -0.83045,-1.67514 -1.69171,-3.49537 -2.70194,-4.97773 z"/>
</g>`;

const TosCommandDelta = `<g>
    <path id="path878_1_" fill="#ffffff" d="m 347.54134,313.03853 c -4.27082,-11.30397 -11.8117,-30.16514 -14.74871,-30.16514 -0.72976,0 -1.96889,0 -7.1915,11.70068 -2.31826,5.1916 -4.88957,11.54233 -7.47721,18.38446 l -1.49218,4.07982 c -0.5714,1.53952 -1.12647,3.11169 -1.68318,4.68386 -3.28638,9.27141 -9.90649,29.03866 -13.54224,46.93008 l -0.72976,3.74677 c -0.82608,4.5255 -1.41218,8.87469 -1.66686,12.82879 -0.0163,0.23836 0.08,0.52406 0.23836,0.69875 0.17468,0.19101 0.44406,0.2857 0.69874,0.2857 0.55508,0 0.6514,-0.08 4.42918,-4.57285 1.2228,-1.44483 2.76232,-3.27005 4.52551,-5.31894 l 2.57131,-2.92068 c 9.30406,-10.54156 22.84629,-24.49683 30.67287,-24.83151 2.65131,0 10.14484,13.63856 15.24175,23.46504 l 1.63584,3.19169 c 0.84078,1.65054 1.57217,3.09537 2.12725,4.20715 3.3027,6.55644 3.3027,6.55644 4.01614,6.55644 0.23836,0 0.49141,-0.0947 0.6514,-0.28571 0.17468,-0.17468 0.26937,-0.46038 0.25468,-0.69874 -0.19101,-3.90512 -0.71507,-8.17595 -1.44483,-12.62146 l -0.66609,-3.77778 c -3.46107,-18.09876 -10.0975,-37.99172 -13.38388,-47.27946 -0.031,-0.08 -0.60405,-1.68318 -1.52482,-4.19082 z" style="fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path d="m 334.53364,307.2194 3.81538,21.1054 8.77741,0.28335 -6.74057,4.80193 3.97817,11.92865 -8.30134,-9.18817 -6.85702,8.94649 2.43836,-11.52325 -9.00302,-4.86307 9.87428,-0.17542 z" style="display:inline;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.94912" id="path2508"/>
</g>`;

const TosEngineeringDelta = `<g>
    <path id="path41840" fill="#ffffff" d="m 347.54134,313.03853 c -4.27082,-11.30397 -11.8117,-30.16514 -14.74871,-30.16514 -0.72976,0 -1.96889,0 -7.1915,11.70068 -2.31826,5.1916 -4.88957,11.54233 -7.47721,18.38446 l -1.49218,4.07982 c -0.5714,1.53952 -1.12647,3.11169 -1.68318,4.68386 -3.28638,9.27141 -9.90649,29.03866 -13.54224,46.93008 l -0.72976,3.74677 c -0.82608,4.5255 -1.41218,8.87469 -1.66686,12.82879 -0.0163,0.23836 0.08,0.52406 0.23836,0.69875 0.17468,0.19101 0.44406,0.2857 0.69874,0.2857 0.55508,0 0.6514,-0.08 4.42918,-4.57285 1.2228,-1.44483 2.76232,-3.27005 4.52551,-5.31894 l 2.57131,-2.92068 c 9.30406,-10.54156 22.84629,-24.49683 30.67287,-24.83151 2.65131,0 10.14484,13.63856 15.24175,23.46504 l 1.63584,3.19169 c 0.84078,1.65054 1.57217,3.09537 2.12725,4.20715 3.3027,6.55644 3.3027,6.55644 4.01614,6.55644 0.23836,0 0.49141,-0.0947 0.6514,-0.28571 0.17468,-0.17468 0.26937,-0.46038 0.25468,-0.69874 -0.19101,-3.90512 -0.71507,-8.17595 -1.44483,-12.62146 l -0.66609,-3.77778 c -3.46107,-18.09876 -10.0975,-37.99172 -13.38388,-47.27946 -0.031,-0.08 -0.60405,-1.68318 -1.52482,-4.19082 z" style="fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path style="display:inline;fill:#000000;fill-opacity:1;stroke:none;stroke-width:2.05242px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 332.22662,328.30681 3.48221,5.75541 8.45048,-1.4464 0.39294,-12.74753 -9.02541,-5.3058 -11.73749,7.10295 1.90923,15.51251 c 0,0 8.7894,3.50406 12.17137,4.29578 3.38196,0.79173 7.87558,1.20773 7.87558,1.20773 v -0.51947 c 0,0 -9.78395,-4.12943 -12.9994,-6.5148 -3.21547,-2.38539 -4.94349,-4.83086 -5.13831,-8.0154 -0.19477,-3.18454 1.5707,-6.6667 3.81846,-8.12745 2.24775,-1.46076 4.6722,-1.47793 6.68232,-0.46408 2.01013,1.01386 3.40643,2.53957 3.76179,4.60308 0.35536,2.0635 0.37606,3.93989 -0.8268,5.78435 -1.20286,1.84447 -3.30592,1.29522 -4.71766,0.39418 -1.41176,-0.90105 -2.99043,-3.14468 -2.99043,-3.14468 z" id="path18493"/>
</g>`;

const TosScienceDelta = `<g>
    <path id="path41077" fill="#ffffff" d="m 347.54134,313.03853 c -4.27082,-11.30397 -11.8117,-30.16514 -14.74871,-30.16514 -0.72976,0 -1.96889,0 -7.1915,11.70068 -2.31826,5.1916 -4.88957,11.54233 -7.47721,18.38446 l -1.49218,4.07982 c -0.5714,1.53952 -1.12647,3.11169 -1.68318,4.68386 -3.28638,9.27141 -9.90649,29.03866 -13.54224,46.93008 l -0.72976,3.74677 c -0.82608,4.5255 -1.41218,8.87469 -1.66686,12.82879 -0.0163,0.23836 0.08,0.52406 0.23836,0.69875 0.17468,0.19101 0.44406,0.2857 0.69874,0.2857 0.55508,0 0.6514,-0.08 4.42918,-4.57285 1.2228,-1.44483 2.76232,-3.27005 4.52551,-5.31894 l 2.57131,-2.92068 c 9.30406,-10.54156 22.84629,-24.49683 30.67287,-24.83151 2.65131,0 10.14484,13.63856 15.24175,23.46504 l 1.63584,3.19169 c 0.84078,1.65054 1.57217,3.09537 2.12725,4.20715 3.3027,6.55644 3.3027,6.55644 4.01614,6.55644 0.23836,0 0.49141,-0.0947 0.6514,-0.28571 0.17468,-0.17468 0.26937,-0.46038 0.25468,-0.69874 -0.19101,-3.90512 -0.71507,-8.17595 -1.44483,-12.62146 l -0.66609,-3.77778 c -3.46107,-18.09876 -10.0975,-37.99172 -13.38388,-47.27946 -0.031,-0.08 -0.60405,-1.68318 -1.52482,-4.19082 z" style="fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path id="path18248" style="color:#000000;display:inline;fill:#000000;stroke-width:1.85433;stroke-miterlimit:40;-inkscape-stroke:none" d="m 333.80329,316.98745 c -7.50792,0 -13.61047,6.15944 -13.61047,13.71187 0,7.55239 6.10255,13.70826 13.61047,13.70826 7.5079,0 13.61046,-6.15587 13.61046,-13.70826 0,-7.55243 -6.10256,-13.71187 -13.61046,-13.71187 z m 0,2.48089 c 5.07005,0 9.33604,3.39824 10.68411,8.07282 -0.62793,-0.69531 -1.447,-1.30323 -2.38672,-1.80724 -2.17714,-1.16759 -5.08974,-1.85433 -8.29739,-1.85433 -3.20766,0 -6.12026,0.68674 -8.29739,1.85433 -0.93973,0.50401 -1.7588,1.11193 -2.38671,1.80724 1.34807,-4.67458 5.61404,-8.07282 10.6841,-8.07282 z m 0,6.04829 c 2.97049,0 5.65075,0.65501 7.52234,1.65875 1.87159,1.00375 2.84667,2.27954 2.84667,3.52394 0,1.2444 -0.97508,2.51658 -2.84667,3.52033 -1.87159,1.00374 -4.55185,1.65875 -7.52234,1.65875 -2.9705,0 -5.65073,-0.65501 -7.52233,-1.65875 -1.87158,-1.00375 -2.84669,-2.27593 -2.84669,-3.52033 0,-1.2444 0.97511,-2.52019 2.84669,-3.52394 1.8716,-1.00374 4.55183,-1.65875 7.52233,-1.65875 z m -10.6841,8.3336 c 0.62813,0.69536 1.44611,1.30641 2.38671,1.81087 2.17713,1.1676 5.08973,1.85432 8.29739,1.85432 3.20765,0 6.12025,-0.68672 8.29739,-1.85432 0.94059,-0.50446 1.75857,-1.11551 2.38672,-1.81087 -1.34592,4.67721 -5.61164,8.07646 -10.68411,8.07646 -5.07248,0 -9.3382,-3.39925 -10.6841,-8.07646 z"/>
</g>`;

const TwokDelta = `<g>
    <path id="path39671" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.83297;stroke-miterlimit:9;stroke-dasharray:none;stroke-opacity:1" d="m 333.80983,293.88475 a 44.358515,44.358515 0 0 0 -44.35863,44.35863 44.358515,44.358515 0 0 0 44.35863,44.35865 44.358515,44.358515 0 0 0 44.35863,-44.35865 44.358515,44.358515 0 0 0 -44.35863,-44.35863 z m 0,7.74952 a 36.610185,36.610185 0 0 1 36.60911,36.60911 36.610185,36.610185 0 0 1 -36.60911,36.61152 36.610185,36.610185 0 0 1 -36.61152,-36.61152 36.610185,36.610185 0 0 1 36.61152,-36.60911 z"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:2.44396;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 298.92242,394.10683 c 3.68401,-38.91648 14.60206,-77.63203 35.1655,-108.91258 17.41529,30.67772 27.79751,62.76204 34.16078,98.0615 0,0 -12.53724,-28.43599 -21.5012,-28.53429 -15.99705,-0.50019 -47.82508,39.38537 -47.82508,39.38537 z" id="path39673"/>
    <path style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:1.22197px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 331.67658,331.21082 3.61701,-30.94564 4.01892,30.74468 8.43973,3.21515 -7.63594,3.21512 1.00472,8.03783 -5.62647,-7.63593 -5.42554,8.64065 1.00473,-9.24349 -7.63593,-3.61703 z" id="path39675"/>
</g>`;

const KlingonEmblem = `<g>
    <path d="m 373.45807,351.99135 a 41.83528,41.83528 0 1 1 -83.67056,0 41.83528,41.83528 0 1 1 83.67056,0 z" id="path3776" style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2.14577;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>
    <path d="m 330.85306,244.55243 c -9.35023,79.77438 -15.10278,90.43185 -19.3116,98.00633 l 19.57981,29.64634 19.15067,-30.39736 c -13.694,-31.63095 -16.46781,-77.06389 -19.41888,-97.25531 z" id="path2996" style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0.424834;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>
    <path d="m 310.13754,344.31597 c -2.46403,3.5564 -11.39819,6.95986 -14.30232,8.83751 -13.7848,8.91248 -19.84054,21.02468 -18.08635,39.41655 24.30164,-18.93619 32.01041,-19.76316 51.75232,-18.04907 z" id="path2998" style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0.424834;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>
    <path d="m 352.13104,344.3658 -20.27177,30.43259 c 15.17995,9.33983 34.50863,5.32124 49.54797,-0.51248 5.76549,-2.23641 9.97556,-4.54083 15.64547,-8.13331 -15.52819,-1.56136 -34.83441,-8.46899 -44.92167,-21.7868 z" id="path3000" style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0.424834;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>
    <path d="m 330.85125,255.20636 c -4.52899,31.01353 -7.72649,69.59959 -17.31901,86.88207 l 17.60024,26.40036 16.99333,-27.159 c -11.97748,-31.38728 -13.11695,-57.94322 -17.27456,-86.12343 z" id="path3770" style="fill:#ca0001;fill-opacity:1;stroke:none;stroke-width:1.20024"/>
    <path d="m 279.31799,388.82009 c -1.28172,-17.0609 8.00386,-28.5166 17.77753,-34.06 4.91726,-2.78896 11.24,-6.56837 12.49184,-7.28539 l 16.68987,25.18655 c -20.56795,-3.29948 -33.5328,5.69319 -46.95924,16.15884 z" id="path3772" style="fill:#ca0001;fill-opacity:1;stroke:none;stroke-width:1.20024"/>
    <path d="m 352.14656,347.32298 c 0,0 -10.9976,17.25184 -17.22092,27.00726 15.9009,9.55306 43.57768,0.9825 56.82145,-7.13114 -21.50581,-4.21757 -32.53244,-11.89755 -39.60053,-19.87612 z" id="path3774" style="fill:#ca0001;fill-opacity:1;stroke:none;stroke-width:1.20024"/>
</g>`;

export class TokenSvgBuilder {

    static createSvg(token: Token, rounded: boolean = false, fancyBorder: boolean = false) {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <svg viewBox="0 0 400 400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>Token</title>
                <defs>
                    <clipPath id="clipPath">
                        <circle cx="200px" cy="200px" r="200px" fill="#ffffff" />
                    </clipPath>`
                + RankIndicatorCatalog.instance.getBorderRankDefinitions(token, fancyBorder)
                + HairCatalog.instance.getDefinitions(token.hairType, token)
                + `</defs>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">`

        + "<g id=\"background\"" + (rounded ? " clip-path=\"url(#clipPath)\"" : "") + " >" +
            `<rect width="400px" height="400px" x="0" y="0" fill="white"/>` +
            "<g"  + (rounded ? " transform=\"translate(-60,0)\"" : "") + ">" +
            HairCatalog.instance.getHair(token, HairElement.BehindHead) +
            ProstheticCatalog.instance.getProsthetic(token, ProstheticPlacement.VeryBack) +
            UniformCatalog.instance.getBody(token) +
            RankIndicatorCatalog.instance.getRankIndicator(token) +
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
            EarCatalog.instance.getEar(token) +
            ExtrasCatalog.instance.getExtras(token, ExtraCategory.Ear) +
            HairCatalog.instance.getHair(token, HairElement.CoveringEars) +
            ProstheticCatalog.instance.getProsthetic(token, ProstheticPlacement.VeryFront) +
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
        if (token.uniformEra === UniformEra.MonsterMaroon) {
            return "#700000";
        } else if (token.uniformEra === UniformEra.Klingon || token.uniformEra === UniformEra.OriginalSeriesKlingon) {
            return "#ca0001";
        } else {
            return token.divisionColor;
        }
    }

    private static getDelta(token: Token) {
        if (token.uniformEra === UniformEra.OriginalSeries) {
            let division = DivisionColors.getDivision(token.uniformEra, token.divisionColor);
            if (division === Division[Division.Command]) {
                return TosCommandDelta;
            } else if (division === Division[Division.Operations]) {
                return TosEngineeringDelta;
            } else if (division === Division[Division.Science]) {
                return TosScienceDelta;
            }
        } else if (token.uniformEra === UniformEra.MonsterMaroon) {
            return TwokDelta;
        } else if (token.uniformEra === UniformEra.OriginalSeriesKlingon || token.uniformEra === UniformEra.Klingon) {
            return KlingonEmblem;
        } else {
            return DominionWarCommbadge;
        }
    }
}