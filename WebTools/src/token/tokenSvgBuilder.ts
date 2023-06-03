import EarCatalog from "./model/earCatalog";
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


const DominionWarCommbadge = `<g id="g6426">
    <path id="path882_1_" fill="#ffffff" d="m 328.76833,314.91763 c -15.72989,0.062 -31.06633,1.08076 -39.00882,3.49535 -1.32402,0.34773 -1.83501,0.94526 -2.65783,2.39172 -2.2301,5.49689 -3.92635,13.13572 -4.14838,20.14438 0.43426,1.94766 -0.13551,3.10026 2.38683,3.27985 31.89893,6.34583 82.19702,3.20965 95.26744,-1.32239 1.93787,-0.67589 1.46442,-0.74935 1.46605,-2.8766 -0.20243,-8.91877 -2.23826,-14.45648 -5.71075,-20.64558 -1.05465,-1.21301 -1.33055,-1.21464 -2.77702,-1.62605 -8.65592,-1.75339 -26.98977,-2.91252 -44.81752,-2.84068 z m -34.48984,12.44187 h 75.76793 c 1.48402,0 2.67906,1.19505 2.67906,2.67906 0,1.48402 -1.19504,2.67906 -2.67906,2.67906 h -75.76793 c -1.48401,0 -2.67906,-1.19504 -2.67906,-2.67906 0,-1.48401 1.19505,-2.67906 2.67906,-2.67906 z" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path id="path878_1_" fill="#ffffff" d="m 347.54134,313.03853 c -4.27082,-11.30397 -11.8117,-30.16514 -14.74871,-30.16514 -0.72976,0 -1.96889,0 -7.1915,11.70068 -2.31826,5.1916 -4.88957,11.54233 -7.47721,18.38446 l -1.49218,4.07982 c -0.5714,1.53952 -1.12647,3.11169 -1.68318,4.68386 -3.28638,9.27141 -9.90649,29.03866 -13.54224,46.93008 l -0.72976,3.74677 c -0.82608,4.5255 -1.41218,8.87469 -1.66686,12.82879 -0.0163,0.23836 0.08,0.52406 0.23836,0.69875 0.17468,0.19101 0.44406,0.2857 0.69874,0.2857 0.55508,0 0.6514,-0.08 4.42918,-4.57285 1.2228,-1.44483 2.76232,-3.27005 4.52551,-5.31894 l 2.57131,-2.92068 c 9.30406,-10.54156 22.84629,-24.49683 30.67287,-24.83151 2.65131,0 10.14484,13.63856 15.24175,23.46504 l 1.63584,3.19169 c 0.84078,1.65054 1.57217,3.09537 2.12725,4.20715 3.3027,6.55644 3.3027,6.55644 4.01614,6.55644 0.23836,0 0.49141,-0.0947 0.6514,-0.28571 0.17468,-0.17468 0.26937,-0.46038 0.25468,-0.69874 -0.19101,-3.90512 -0.71507,-8.17595 -1.44483,-12.62146 l -0.66609,-3.77778 c -3.46107,-18.09876 -10.0975,-37.99172 -13.38388,-47.27946 -0.031,-0.08 -0.60405,-1.68318 -1.52482,-4.19082 z" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path id="path976" style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:1.63258;stroke-opacity:1" d="m 332.75299,287.45308 c -3.88135,7.01826 -6.78377,14.52407 -9.76291,21.95549 -5.47225,14.13746 -10.30774,28.54566 -14.34631,43.17543 -1.7114,6.25454 -3.314,12.83267 -4.54284,19.31058 -0.32502,1.66038 -0.63465,3.54427 -0.86023,4.97614 -0.49116,1.77811 0.2285,0.87849 0.97702,-0.0849 7.63774,-8.88123 15.44151,-17.7415 24.61118,-25.08874 3.94579,-2.98948 8.29507,-6.09402 13.40388,-6.41499 3.04332,0.23874 4.87846,3.05622 6.55015,5.27635 4.80319,6.97695 8.64977,14.55255 12.56567,22.04702 -2.75569,-15.8786 -7.44479,-31.34893 -12.59713,-46.59453 -3.99852,-11.35508 -8.17923,-22.67407 -13.29654,-33.58006 -0.83045,-1.67514 -1.69171,-3.49537 -2.70194,-4.97773 z"/>
</g>`

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
            HairCatalog.instance.getHair(token, HairElement.BehindHead) +
            ProstheticCatalog.instance.getProsthetic(token, ProstheticPlacement.VeryBack) +
            UniformCatalog.instance.getBody(token) +
            RankIndicatorCatalog.instance.getRankIndicator(token) +
            HeadCatalog.instance.getHead(token) +
            NasoLabialFoldCatalog.instance.getNasoLabialFold(token) +
            FacialHairCatalog.instance.getFacialHair(token, FacialHairPlacement.Chin) +
            MouthCatalog.instance.getMouth(token) +
            FacialHairCatalog.instance.getFacialHair(token, FacialHairPlacement.UpperLip) +
            EyeCatalog.instance.getEyes(token) +
            NoseCatalog.instance.getNose(token) +
            EyeBrowCatalog.instance.getEyeBrows(token) +
            HairCatalog.instance.getHair(token, HairElement.BehindEars) +
            EarCatalog.instance.getEar(token) +
            HairCatalog.instance.getHair(token, HairElement.CoveringEars) +
            ProstheticCatalog.instance.getProsthetic(token, ProstheticPlacement.VeryFront) +
            "</g>" +
        "</g>"

        + (fancyBorder ? TokenSvgBuilder.createBorder(token) : "")

        + `</g>
        </svg>`;
    }

    private static createBorder(token: Token) {
        return "<circle cx=\"200px\" cy=\"200px\" r=\"190px\" stroke=\"" + token.divisionColor + "\" stroke-width=\"20px\" />"
            + "<circle cx=\"200px\" cy=\"200px\" r=\"180px\" stroke=\"black\" stroke-width=\"2px\" />"
            + RankIndicatorCatalog.instance.getBorderRankIndicator(token)
            + DominionWarCommbadge;
    }
}