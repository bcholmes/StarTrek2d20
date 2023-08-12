import { Rank } from "../../helpers/ranks";
import { BaseNeckProvider } from "./baseNeckProvider";
import RankIndicatorCatalog from "./rankIndicatorCatalog";
import Swatch from "./swatch";
import { Token } from "./token";

const DominionWarCommbadge = `<g id="g6426">
    <path id="path882_1_" fill="#ffffff" d="m 328.76833,314.91763 c -15.72989,0.062 -31.06633,1.08076 -39.00882,3.49535 -1.32402,0.34773 -1.83501,0.94526 -2.65783,2.39172 -2.2301,5.49689 -3.92635,13.13572 -4.14838,20.14438 0.43426,1.94766 -0.13551,3.10026 2.38683,3.27985 31.89893,6.34583 82.19702,3.20965 95.26744,-1.32239 1.93787,-0.67589 1.46442,-0.74935 1.46605,-2.8766 -0.20243,-8.91877 -2.23826,-14.45648 -5.71075,-20.64558 -1.05465,-1.21301 -1.33055,-1.21464 -2.77702,-1.62605 -8.65592,-1.75339 -26.98977,-2.91252 -44.81752,-2.84068 z m -34.48984,12.44187 h 75.76793 c 1.48402,0 2.67906,1.19505 2.67906,2.67906 0,1.48402 -1.19504,2.67906 -2.67906,2.67906 h -75.76793 c -1.48401,0 -2.67906,-1.19504 -2.67906,-2.67906 0,-1.48401 1.19505,-2.67906 2.67906,-2.67906 z" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path id="path878_1_" fill="#ffffff" d="m 347.54134,313.03853 c -4.27082,-11.30397 -11.8117,-30.16514 -14.74871,-30.16514 -0.72976,0 -1.96889,0 -7.1915,11.70068 -2.31826,5.1916 -4.88957,11.54233 -7.47721,18.38446 l -1.49218,4.07982 c -0.5714,1.53952 -1.12647,3.11169 -1.68318,4.68386 -3.28638,9.27141 -9.90649,29.03866 -13.54224,46.93008 l -0.72976,3.74677 c -0.82608,4.5255 -1.41218,8.87469 -1.66686,12.82879 -0.0163,0.23836 0.08,0.52406 0.23836,0.69875 0.17468,0.19101 0.44406,0.2857 0.69874,0.2857 0.55508,0 0.6514,-0.08 4.42918,-4.57285 1.2228,-1.44483 2.76232,-3.27005 4.52551,-5.31894 l 2.57131,-2.92068 c 9.30406,-10.54156 22.84629,-24.49683 30.67287,-24.83151 2.65131,0 10.14484,13.63856 15.24175,23.46504 l 1.63584,3.19169 c 0.84078,1.65054 1.57217,3.09537 2.12725,4.20715 3.3027,6.55644 3.3027,6.55644 4.01614,6.55644 0.23836,0 0.49141,-0.0947 0.6514,-0.28571 0.17468,-0.17468 0.26937,-0.46038 0.25468,-0.69874 -0.19101,-3.90512 -0.71507,-8.17595 -1.44483,-12.62146 l -0.66609,-3.77778 c -3.46107,-18.09876 -10.0975,-37.99172 -13.38388,-47.27946 -0.031,-0.08 -0.60405,-1.68318 -1.52482,-4.19082 z" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.63258;stroke-opacity:1"/>
    <path id="path976" style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:1.63258;stroke-opacity:1" d="m 332.75299,287.45308 c -3.88135,7.01826 -6.78377,14.52407 -9.76291,21.95549 -5.47225,14.13746 -10.30774,28.54566 -14.34631,43.17543 -1.7114,6.25454 -3.314,12.83267 -4.54284,19.31058 -0.32502,1.66038 -0.63465,3.54427 -0.86023,4.97614 -0.49116,1.77811 0.2285,0.87849 0.97702,-0.0849 7.63774,-8.88123 15.44151,-17.7415 24.61118,-25.08874 3.94579,-2.98948 8.29507,-6.09402 13.40388,-6.41499 3.04332,0.23874 4.87846,3.05622 6.55015,5.27635 4.80319,6.97695 8.64977,14.55255 12.56567,22.04702 -2.75569,-15.8786 -7.44479,-31.34893 -12.59713,-46.59453 -3.99852,-11.35508 -8.17923,-22.67407 -13.29654,-33.58006 -0.83045,-1.67514 -1.69171,-3.49537 -2.70194,-4.97773 z"/>
</g>`;


const TngEnsignRankPip: string = `<g id="g18710">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path19242"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path19246"/>
</g>`;

const TngLtJGRankPip: string = `<g id="1Pt5Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
    <path d="m 226.48517,242.98478 c -1.24296,0 -2.25,1.00704 -2.25,2.25 0,1.24296 1.00704,2.25 2.25,2.25 1.24296,0 2.25,-1.00704 2.25,-2.25 0,-1.24296 -1.00704,-2.25 -2.25,-2.25" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.712701" id="path24030"/>
</g>`;

const TngLtRankPip: string = `<g id="2Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
</g>`;

const TngLcdrRankPip: string = `<g id="2pt5Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
    <path d="m 216.21995,234.59538 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26929"/>
    <path d="m 216.21995,235.13685 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26931"/>
    <path d="m 216.19273,236.5275 c -1.24295,0 -2.25,1.00705 -2.25,2.25 0,1.24295 1.00705,2.25 2.25,2.25 1.24295,0 2.25,-1.00705 2.25,-2.25 0,-1.24295 -1.00705,-2.25 -2.25,-2.25" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.7127" id="path27552"/>
</g>`;

const TngCmdrRankPip: string = `<g id="3Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
    <path d="m 216.21995,234.59538 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26929"/>
    <path d="m 216.21995,235.13685 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26931"/>
</g>`;

const TngCaptainRankPip: string = `<g id="4Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
    <path d="m 216.21995,234.59538 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26929"/>
    <path d="m 216.21995,235.13685 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26931"/>
    <path d="m 206.39236,227.88386 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path27070"/>
    <path d="m 206.39236,228.42533 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path27072"/>
</g>`;

const TngCaptainRankPipBorder: string = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40813" cx="69.152542" cy="336.27118" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40817" cx="48.135593" cy="321.52542" r="8.8999996"/>
</g>`;

const TngCmdrRankPipBorder: string = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40813" cx="69.152542" cy="336.27118" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
</g>`;

const TngLcdrRankPipBorder: string = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40813" cx="69.152542" cy="336.27118" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
    <circle style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1.17822;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle41628" cx="69.152542" cy="336.27118" r="5.2430916"/>
</g>`

const TngLtRankPipBorder: string = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
</g>`;

const TngLtJgRankPipBorder: string = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
    <circle style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1.17822;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle43141" cx="90.169495" cy="351.01694" r="5.2430916"/>
</g>`;

const TngEnsignRankPipBorder: string = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
</g>`;


const TngMasterChiefPettyOfficer: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path132517"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path132519"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 235.39896,247.24012 1.2629,0.68234 -0.97697,1.80824 1.19447,3.76014 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68232 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36226 z" id="path132521"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path132523" cx="329.21188" cy="107.73019" r="0.86615855" transform="rotate(28.381823)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle132525" cx="331.18564" cy="110.47058" r="0.86615855" transform="rotate(28.381823)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle132527" cx="329.21188" cy="113.37409" r="0.86615855" transform="rotate(28.381823)"/>
</g>`;

const TngMasterChiefPettyOfficerBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path146353"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path146355"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 107.59404,345.09125 3.75924,2.61232 -3.74031,5.38254 2.44596,12.34193 -12.657625,2.35328 -3.443484,4.95536 -3.759244,-2.61226 4.096549,-5.89518 11.057494,-1.69151 -2.21133,-11.03868 z" id="path146357"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146359" cx="299.89856" cy="228.69986" r="2.7622666" transform="rotate(34.795326)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146361" cx="306.19308" cy="237.43925" r="2.7622666" transform="rotate(34.795326)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146363" cx="299.89856" cy="246.69885" r="2.7622666" transform="rotate(34.795326)"/>
</g>`;

const TngSeniorChiefPettyOfficer: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path132517"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path132519"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 235.39896,247.24012 1.2629,0.68234 -0.97697,1.80824 1.19447,3.76014 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68232 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36226 z" id="path132521"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path132523" cx="329.21188" cy="107.73019" r="0.86615855" transform="rotate(28.381823)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle132525" cx="331.18564" cy="110.47058" r="0.86615855" transform="rotate(28.381823)"/>
</g>`;

const TngSeniorChiefPettyOfficerBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path146353"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path146355"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 107.59404,345.09125 3.75924,2.61232 -3.74031,5.38254 2.44596,12.34193 -12.657625,2.35328 -3.443484,4.95536 -3.759244,-2.61226 4.096549,-5.89518 11.057494,-1.69151 -2.21133,-11.03868 z" id="path146357"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146359" cx="299.89856" cy="228.69986" r="2.7622666" transform="rotate(34.795326)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146361" cx="306.19308" cy="237.43925" r="2.7622666" transform="rotate(34.795326)"/>
</g>`;

const TngChiefPettyOfficer: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path132517"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path132519"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 235.39896,247.24012 1.2629,0.68234 -0.97697,1.80824 1.19447,3.76014 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68232 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36226 z" id="path132521"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path132523" cx="329.21188" cy="107.73019" r="0.86615855" transform="rotate(28.381823)"/>
</g>`;

const TngChiefPettyOfficerBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path146353"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path146355"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 107.59404,345.09125 3.75924,2.61232 -3.74031,5.38254 2.44596,12.34193 -12.657625,2.35328 -3.443484,4.95536 -3.759244,-2.61226 4.096549,-5.89518 11.057494,-1.69151 -2.21133,-11.03868 z" id="path146357"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146359" cx="299.89856" cy="228.69986" r="2.7622666" transform="rotate(34.795326)"/>
</g>`;

const TngPettyOfficer1stClass: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path132517"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path132519"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 235.39896,247.24012 1.2629,0.68234 -0.97697,1.80824 1.19447,3.76014 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68232 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36226 z" id="path132521"/>
</g>`;

const TngPettyOfficer1stClassBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path146353"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path146355"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 107.59404,345.09125 3.75924,2.61232 -3.74031,5.38254 2.44596,12.34193 -12.657625,2.35328 -3.443484,4.95536 -3.759244,-2.61226 4.096549,-5.89518 11.057494,-1.69151 -2.21133,-11.03868 z" id="path146357"/>
</g>`;

const TngPettyOfficer2ndClass: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path148999"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path149001"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path149003"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path149005"/>
</g>`;

const TngPettyOfficer2ndClassBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path149013"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path149015"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path149017"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path149019"/>
</g>`;

const TngPettyOfficer3rdClass: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path149076"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path149078"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path149080"/>
</g>`;

const TngPettyOfficer3rdClassBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path149064"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path149066"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path149068"/>
</g>`;

const TngCrewman1st: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path id="path150722" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.30227,251.75692 -1.21518,2.33462 -1.24048,-0.6731 1.05554,-1.9453 -0.37078,-5.63871 1.14732,-2.11447 1.24049,0.6731 -0.96375,1.77615 z"/>
    <path id="path150724" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 231.65464,253.03333 -1.21518,2.33462 -1.24048,-0.67309 1.05554,-1.94531 -0.37078,-5.63871 1.14732,-2.11446 1.24049,0.6731 -0.96375,1.77614 z"/>
    <path id="path150726" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 234.04688,254.33138 -1.21518,2.33462 -1.24048,-0.6731 1.05554,-1.9453 -0.37078,-5.63871 1.14732,-2.11446 1.24049,0.67309 -0.96375,1.77615 z"/>
</g>`;

const TngCrewman1stBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path id="path150684" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.859195,357.93478 -4.611423,6.89663 -3.655036,-2.53617 3.977177,-5.73176 0.779918,-17.79545 4.323022,-6.23018 3.655036,2.53617 -3.631338,5.23335 z"/>
    <path id="path150686" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 94.790355,362.74421 -4.611423,6.89663 -3.655036,-2.53618 3.977177,-5.73175 0.779918,-17.79546 4.323022,-6.23017 3.655036,2.53617 -3.631339,5.23335 z"/>
    <path id="path150688" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 101.83899,367.63515 -4.611425,6.89662 -3.655035,-2.53617 3.977177,-5.73175 0.779917,-17.79546 4.323026,-6.23018 3.65503,2.53618 -3.63134,5.23334 z"/>
</g>`;

const TngCrewman2nd: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path151529"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path151531"/>
    <path id="path151533" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.30227,251.75692 -1.21518,2.33462 -1.24048,-0.6731 1.05554,-1.9453 -0.37078,-5.63871 1.14732,-2.11447 1.24049,0.6731 -0.96375,1.77615 z"/>
    <path id="path151535" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 231.65464,253.03333 -1.21518,2.33462 -1.24048,-0.67309 1.05554,-1.94531 -0.37078,-5.63871 1.14732,-2.11446 1.24049,0.6731 -0.96375,1.77614 z"/>
</g>`;

const TngCrewman2ndBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path151515"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path151517"/>
    <path id="path151519" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.859195,357.93478 -4.611423,6.89663 -3.655036,-2.53617 3.977177,-5.73176 0.779918,-17.79545 4.323022,-6.23018 3.655036,2.53617 -3.631338,5.23335 z"/>
    <path id="path151521" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 94.790355,362.74421 -4.611423,6.89663 -3.655036,-2.53618 3.977177,-5.73175 0.779918,-17.79546 4.323022,-6.23017 3.655036,2.53617 -3.631339,5.23335 z"/>
</g>`;

const TngCrewman3rd: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path152318"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path152320"/>
    <path id="path152322" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.30227,251.75692 -1.21518,2.33462 -1.24048,-0.6731 1.05554,-1.9453 -0.37078,-5.63871 1.14732,-2.11447 1.24049,0.6731 -0.96375,1.77615 z"/>
</g>`;

const TngCrewman3rdBorder: string = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path152306"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path152308"/>
    <path id="path152310" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.859195,357.93478 -4.611423,6.89663 -3.655036,-2.53617 3.977177,-5.73176 0.779918,-17.79545 4.323022,-6.23018 3.655036,2.53617 -3.631338,5.23335 z"/>
</g>`;


export abstract class BaseTngEraUniformPack extends BaseNeckProvider {

    getRankSwatches() {
        return [
            new Swatch(Rank.None, "None", (token) => RankIndicatorCatalog.decorateSwatch("", Rank.None, token), "Rank.none.name"),
            new Swatch(Rank.Ensign, "Ensign", (token) => RankIndicatorCatalog.decorateSwatch(TngEnsignRankPip, Rank.Ensign, token), "Rank.ensign.name"),
            new Swatch(Rank.LieutenantJG, "Lieutenant J.G.", (token) => RankIndicatorCatalog.decorateSwatch(TngLtJGRankPip, Rank.LieutenantJG, token), "Rank.lieutenantJG.name"),
            new Swatch(Rank.Lieutenant, "Lieutenant", (token) => RankIndicatorCatalog.decorateSwatch(TngLtRankPip, Rank.Lieutenant, token), "Rank.lieutenant.name"),
            new Swatch(Rank.LtCommander, "Lt. Commander", (token) => RankIndicatorCatalog.decorateSwatch(TngLcdrRankPip, Rank.LtCommander, token), "Rank.ltCommander.name"),
            new Swatch(Rank.Commander, "Commander", (token) => RankIndicatorCatalog.decorateSwatch(TngCmdrRankPip, Rank.Commander, token), "Rank.commander.name"),
            new Swatch(Rank.Captain, "Captain", (token) => RankIndicatorCatalog.decorateSwatch(TngCaptainRankPip, Rank.Captain, token), "Rank.captain.name"),

            new Swatch(Rank.Crewman3rdClass, "Crewman 3rd Class", (token) => RankIndicatorCatalog.decorateSwatch(TngCrewman3rd, Rank.Crewman3rdClass, token), "Rank.crewman3rdClass.name"),
            new Swatch(Rank.Crewman2ndClass, "Crewman 2nd Class", (token) => RankIndicatorCatalog.decorateSwatch(TngCrewman2nd, Rank.Crewman2ndClass, token), "Rank.crewman2ndClass.name"),
            new Swatch(Rank.Crewman1stClass, "Crewman 1st Class", (token) => RankIndicatorCatalog.decorateSwatch(TngCrewman1st, Rank.Crewman1stClass, token), "Rank.crewman1stClass.name"),
            new Swatch(Rank.PettyOfficer3rdClass, "Petty Officer 3rd Class", (token) => RankIndicatorCatalog.decorateSwatch(TngPettyOfficer3rdClass, Rank.PettyOfficer3rdClass, token), "Rank.pettyOfficer3rdClass.name"),
            new Swatch(Rank.PettyOfficer2ndClass, "Petty Officer 2nd Class", (token) => RankIndicatorCatalog.decorateSwatch(TngPettyOfficer2ndClass, Rank.PettyOfficer2ndClass, token), "Rank.pettyOfficer2ndClass.name"),
            new Swatch(Rank.PettyOfficer1stClass, "Petty Officer 1st Class", (token) => RankIndicatorCatalog.decorateSwatch(TngPettyOfficer1stClass, Rank.PettyOfficer1stClass, token), "Rank.pettyOfficer1stClass.name"),
            new Swatch(Rank.ChiefPettyOfficer, "Chief Petty Officer", (token) => RankIndicatorCatalog.decorateSwatch(TngChiefPettyOfficer, Rank.ChiefPettyOfficer, token), "Rank.chiefPettyOfficer.name"),
            new Swatch(Rank.SeniorChiefPettyOfficer, "Senior Chief Petty Officer", (token) => RankIndicatorCatalog.decorateSwatch(TngSeniorChiefPettyOfficer, Rank.SeniorChiefPettyOfficer, token), "Rank.seniorChiefPettyOfficer.name"),
            new Swatch(Rank.MasterChiefPettyOfficer, "Master Chief Petty Officer", (token) => RankIndicatorCatalog.decorateSwatch(TngMasterChiefPettyOfficer, Rank.MasterChiefPettyOfficer, token), "Rank.masterChiefPettyOfficer.name")
            ];
    }

    getRankBorderIndicator(token: Token) {
        switch (token.rankIndicator) {
            case Rank.Ensign:
                return TngEnsignRankPipBorder;
            case Rank.LieutenantJG:
                return TngLtJgRankPipBorder;
            case Rank.Lieutenant:
                return TngLtRankPipBorder;
            case Rank.LtCommander:
                return TngLcdrRankPipBorder;
            case Rank.Commander:
                return TngCmdrRankPipBorder;
            case Rank.Captain:
                return TngCaptainRankPipBorder;
            case Rank.Crewman3rdClass:
                return TngCrewman3rdBorder;
            case Rank.Crewman2ndClass:
                return TngCrewman2ndBorder;
            case Rank.Crewman1stClass:
                return TngCrewman1stBorder;
            case Rank.PettyOfficer3rdClass:
                return TngPettyOfficer3rdClassBorder;
            case Rank.PettyOfficer2ndClass:
                return TngPettyOfficer2ndClassBorder;
            case Rank.PettyOfficer1stClass:
                return TngPettyOfficer1stClassBorder;
            case Rank.ChiefPettyOfficer:
                return TngChiefPettyOfficerBorder;
            case Rank.SeniorChiefPettyOfficer:
                return TngSeniorChiefPettyOfficerBorder;
            case Rank.MasterChiefPettyOfficer:
                return TngMasterChiefPettyOfficerBorder;
            default:
                return "";
        }
    }

    getRankIndicator(token: Token): string {
        switch (token.rankIndicator) {
            case Rank.Ensign:
                return TngEnsignRankPip;
            case Rank.LieutenantJG:
                return TngLtJGRankPip;
            case Rank.Lieutenant:
                return TngLtRankPip;
            case Rank.LtCommander:
                return TngLcdrRankPip;
            case Rank.Commander:
                return TngCmdrRankPip;
            case Rank.Captain:
                return TngCaptainRankPip;

            case Rank.Crewman3rdClass:
                return TngCrewman3rd;
            case Rank.Crewman2ndClass:
                return TngCrewman2nd;
            case Rank.Crewman1stClass:
                return TngCrewman1st;
            case Rank.PettyOfficer3rdClass:
                return TngPettyOfficer3rdClass;
            case Rank.PettyOfficer2ndClass:
                return TngPettyOfficer2ndClass;
            case Rank.PettyOfficer1stClass:
                return TngPettyOfficer1stClass;
            case Rank.ChiefPettyOfficer:
                return TngChiefPettyOfficer;
            case Rank.SeniorChiefPettyOfficer:
                return TngSeniorChiefPettyOfficer;
            case Rank.MasterChiefPettyOfficer:
                return TngMasterChiefPettyOfficer;

            default:
                return "";
        }
    }

    getRankBorderDefinitions(token: Token, bordered: boolean) {
        return "";
    }


    getBorderColor(token: Token) {
        return token.divisionColor;
    }

    getBorderLogo(token: Token): string {
        return DominionWarCommbadge;
    }
}