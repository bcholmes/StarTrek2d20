import { Rank } from "../../helpers/ranks";
import { Species } from "../../helpers/speciesEnum";
import { BodyType } from "./bodyTypeEnum";
import RankIndicatorCatalog from "./rankIndicatorCatalog";
import SpeciesRestrictions from "./speciesRestrictions";
import Swatch from "./swatch";
import { Token } from "./token";

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


export const TngEraFemaleBodyBolianRidge = `<g>
    <path style="fill:none;stroke:#000000;stroke-width:0.8;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 260.11976,248.62275 16.76647,-47.90419" id="path1746"/>
    <path style="color:#000000;fill:#000000;fill-opacity:0.2;-inkscape-stroke:none" d="m 273.8747,199.19782 -16.76758,47.90429 1.7902,0.83818 16.76758,-47.90429 z" id="path1748"/>
</g>`;

export const TngEraMaleBodyBolianRidge = `<g>
    <path style="display:inline;fill:none;stroke:#000000;stroke-width:0.8;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 260.11976,248.62275 23.2919,-42.7347" id="path1746"/>
    <path style="color:#000000;display:inline;fill:#000000;fill-opacity:0.2;-inkscape-stroke:none" d="m 280.56961,203.94359 -23.46249,43.15852 1.7902,0.83818 23.12351,-42.81954 z" id="path1748"/>
</g>`;


const TngNecks = {
    averageMale: `<g>
            <path d="m 213.63253,151.29441 -13.54934,47.14666 c 0,0 12.42667,24.85333 21.464,31.49067 9.03734,6.636 24.148,15.816 35.02134,17.228 l 3.67066,3.67066 2.82534,-2.824 5.224,-2.25866 4.3151,-10.28435 17.92623,-23.67699 z" style="display:inline;fill:#cd976d;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path171974" />
            <path d="m 200.08306,198.44081 c 0,0 12.86667,21.57066 17.836,27.06399 4.96933,5.49334 32.696,1.83067 40.54267,4.18534 6.33866,1.90133 13.09866,2.66533 15.47066,2.89066 l 16.59734,-20.79333 -76.89734,-60.49333 z" style="display:inline;opacity:0.199997;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path171984"/>
            <path d="m 211.64493,149.52841 c -1.01067,4.99733 -6.2,23.82533 -7.36934,28.788 -0.956,4.064 -1.95733,8.11866 -3.072,12.14266 -0.516,1.85867 -1.07466,3.70267 -1.63333,5.54934 -0.18666,0.616 -0.95466,1.86266 -0.88133,2.47466 0.02,0.16934 0.80667,2.38267 1.11067,1.93733 3.68799,-5.38666 5.03733,-14.18666 7.12666,-20.38133 1.49067,-4.41866 7.06133,-22.68666 8.552,-27.104 0,0 -3.83333,-3.40666 -3.83333,-3.40666" style="display:inline;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path171994"/>
            <path d="m 293.27599,213.31907 c -2.83733,2.044 -16.28266,19.912 -18.592,22.53067 -1.87866,2.13066 -4.41733,10.85066 -7.52933,10.948 -2.104,0.0653 -1.74133,-3.72534 -1.19333,-5.332 0.26266,-0.76934 21.288,-30.90934 21.288,-30.90934 0,0 6.02666,2.76267 6.02666,2.76267" style="display:inline;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path171998"/>
        </g>`,

    averageFemale: `<g>
            <path d="m 213.63253,151.29441 -5.49067,30.848 -9.21193,18.45217 c 0,0 13.57993,22.69982 22.61726,29.33716 9.03734,6.636 24.148,15.816 35.02134,17.228 l 3.67066,0.60693 2.82534,0.23973 5.224,-2.25866 1.832,-12.39334 13.08133,-27.18533 z" style="fill:#cd976d;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283414" />
            <path d="m 199.16985,199.75598 c 0,0 11.14568,18.87824 18.74974,25.74882 16.89748,4.64849 35.91739,5.03279 53.5,5.14934 l 11.78267,-24.48534 -69.56933,-54.87466 -5.69867,31.472 z" style="opacity:0.199997;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283424" />
            <path d="m 211.64493,149.52841 c -1.01067,4.99733 -2.99139,25.24509 -4.128,30.15333 -1.11614,3.58085 -2.42213,8.10992 -4.32571,11.82632 -1.90358,3.7164 -2.7377,5.49633 -4.27987,8.42311 l 2.35504,3.10823 c 4.22257,-7.93797 7.1452,-15.38433 8.95587,-21.62566 1.29067,-4.45067 3.76533,-24.06133 5.256,-28.47867 l -3.83333,-3.40666" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283434" />
            <path d="m 285.86613,207.63814 c -2.232,2.508 -11.62934,23.48 -13.308,26.58266 -1.36534,2.52267 -2.372,12.41734 -5.128,12.788 -1.86267,0.25067 -2.084,-3.988 -1.828,-5.81866 0.124,-0.87467 14.504,-36.10934 14.504,-36.10934 0,0 5.76,2.55734 5.76,2.55734" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283438"/>
        </g>`
}



export abstract class BaseTngEraUniformPack {

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

    protected getNeck(body: BodyType, skinColor: string, species?: Species) {
        if (body === BodyType.AverageMale) {
            let result = TngNecks.averageMale.replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, skinColor);
            if (species === Species.Bolian) {
                result += TngEraMaleBodyBolianRidge
            }
            return result;
        } else {
            let result = TngNecks.averageFemale.replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, skinColor);
            if (species === Species.Bolian) {
                result += TngEraFemaleBodyBolianRidge
            }
            return result;
        }
    }
}