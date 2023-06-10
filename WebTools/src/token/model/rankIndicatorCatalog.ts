import { RankIndicator, isEnlistedRank } from "./rankIndicatorEnum";
import Swatch from "./swatch";
import { Token } from "./token";
import { DefaultRed } from "./uniformCatalog";
import { UniformEra } from "./uniformEra";

const TngEnsignRankPip = `<g id="g18710">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path19242"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path19246"/>
</g>`;

const TngLtJGRankPip = `<g id="1Pt5Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
    <path d="m 226.48517,242.98478 c -1.24296,0 -2.25,1.00704 -2.25,2.25 0,1.24296 1.00704,2.25 2.25,2.25 1.24296,0 2.25,-1.00704 2.25,-2.25 0,-1.24296 -1.00704,-2.25 -2.25,-2.25" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.712701" id="path24030"/>
</g>`;

const TngLtRankPip = `<g id="2Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
</g>`;

const TngLcdrRankPip = `<g id="2pt5Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
    <path d="m 216.21995,234.59538 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26929"/>
    <path d="m 216.21995,235.13685 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26931"/>
    <path d="m 216.19273,236.5275 c -1.24295,0 -2.25,1.00705 -2.25,2.25 0,1.24295 1.00705,2.25 2.25,2.25 1.24295,0 2.25,-1.00705 2.25,-2.25 0,-1.24295 -1.00705,-2.25 -2.25,-2.25" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.7127" id="path27552"/>
</g>`;

const TngCmdrRankPip = `<g id="3Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
    <path d="m 216.21995,234.59538 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26929"/>
    <path d="m 216.21995,235.13685 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26931"/>
</g>`;

const TngCaptainRankPip = `<g id="4Pips">
    <path d="m 237.47786,247.46707 c -2.32533,0 -4.20933,1.884 -4.20933,4.20933 0,2.32534 1.884,4.20934 4.20933,4.20934 2.32533,0 4.20933,-1.884 4.20933,-4.20934 0,-2.32533 -1.884,-4.20933 -4.20933,-4.20933" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22601"/>
    <path d="m 237.47786,248.00854 c -2.02533,0 -3.668,1.64266 -3.668,3.668 0,2.02533 1.64267,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02534 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81066 c 0,2.63867 -2.13866,4.77734 -4.77733,4.77734 -2.63733,0 -4.776,-2.13867 -4.776,-4.77734 0,-2.63733 2.13867,-4.776 4.776,-4.776 2.63867,0 4.77733,2.13867 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22605"/>
    <path d="m 226.52693,241.0672 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22609"/>
    <path d="m 226.52693,241.60867 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path22613"/>
    <path d="m 216.21995,234.59538 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26929"/>
    <path d="m 216.21995,235.13685 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path26931"/>
    <path d="m 206.39236,227.88386 c -2.32534,0 -4.20934,1.884 -4.20934,4.20934 0,2.32533 1.884,4.20933 4.20934,4.20933 2.32533,0 4.20933,-1.884 4.20933,-4.20933 0,-2.32534 -1.884,-4.20934 -4.20933,-4.20934" style="fill:#fbb03b;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path27070"/>
    <path d="m 206.39236,228.42533 c -2.02534,0 -3.668,1.64267 -3.668,3.668 0,2.02533 1.64266,3.668 3.668,3.668 2.02533,0 3.668,-1.64267 3.668,-3.668 0,-2.02533 -1.64267,-3.668 -3.668,-3.668 m 4.88933,3.81067 c 0,2.63866 -2.13867,4.77733 -4.77733,4.77733 -2.63734,0 -4.776,-2.13867 -4.776,-4.77733 0,-2.63734 2.13866,-4.776 4.776,-4.776 2.63866,0 4.77733,2.13866 4.77733,4.776" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path27072"/>
</g>`;

const TngCaptainRankPipBorder = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40813" cx="69.152542" cy="336.27118" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40817" cx="48.135593" cy="321.52542" r="8.8999996"/>
</g>`;

const TngCmdrRankPipBorder = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40813" cx="69.152542" cy="336.27118" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
</g>`;

const TngLcdrRankPipBorder = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40813" cx="69.152542" cy="336.27118" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
    <circle style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1.17822;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle41628" cx="69.152542" cy="336.27118" r="5.2430916"/>
</g>`

const TngLtRankPipBorder = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
</g>`;

const TngLtJgRankPipBorder = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
    <circle style="fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="use40815" cx="90.169495" cy="351.01694" r="8.8999996"/>
    <circle style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1.17822;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle43141" cx="90.169495" cy="351.01694" r="5.2430916"/>
</g>`;

const TngEnsignRankPipBorder = `<g>
    <rect style="opacity:1;fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <circle style="opacity:1;fill:#fbb03b;fill-opacity:1;fill-rule:evenodd;stroke:#fbb03b;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path40811" cx="111.18644" cy="365.93219" r="8.8999996"/>
</g>`;


const TngMasterChiefPettyOfficer = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path132517"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path132519"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 235.39896,247.24012 1.2629,0.68234 -0.97697,1.80824 1.19447,3.76014 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68232 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36226 z" id="path132521"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path132523" cx="329.21188" cy="107.73019" r="0.86615855" transform="rotate(28.381823)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle132525" cx="331.18564" cy="110.47058" r="0.86615855" transform="rotate(28.381823)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle132527" cx="329.21188" cy="113.37409" r="0.86615855" transform="rotate(28.381823)"/>
</g>`;

const TngMasterChiefPettyOfficerBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path146353"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path146355"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 107.59404,345.09125 3.75924,2.61232 -3.74031,5.38254 2.44596,12.34193 -12.657625,2.35328 -3.443484,4.95536 -3.759244,-2.61226 4.096549,-5.89518 11.057494,-1.69151 -2.21133,-11.03868 z" id="path146357"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146359" cx="299.89856" cy="228.69986" r="2.7622666" transform="rotate(34.795326)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146361" cx="306.19308" cy="237.43925" r="2.7622666" transform="rotate(34.795326)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146363" cx="299.89856" cy="246.69885" r="2.7622666" transform="rotate(34.795326)"/>
</g>`;

const TngSeniorChiefPettyOfficer = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path132517"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path132519"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 235.39896,247.24012 1.2629,0.68234 -0.97697,1.80824 1.19447,3.76014 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68232 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36226 z" id="path132521"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path132523" cx="329.21188" cy="107.73019" r="0.86615855" transform="rotate(28.381823)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle132525" cx="331.18564" cy="110.47058" r="0.86615855" transform="rotate(28.381823)"/>
</g>`;

const TngSeniorChiefPettyOfficerBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path146353"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path146355"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 107.59404,345.09125 3.75924,2.61232 -3.74031,5.38254 2.44596,12.34193 -12.657625,2.35328 -3.443484,4.95536 -3.759244,-2.61226 4.096549,-5.89518 11.057494,-1.69151 -2.21133,-11.03868 z" id="path146357"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146359" cx="299.89856" cy="228.69986" r="2.7622666" transform="rotate(34.795326)"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146361" cx="306.19308" cy="237.43925" r="2.7622666" transform="rotate(34.795326)"/>
</g>`;

const TngChiefPettyOfficer = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path132517"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path132519"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 235.39896,247.24012 1.2629,0.68234 -0.97697,1.80824 1.19447,3.76014 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68232 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36226 z" id="path132521"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="path132523" cx="329.21188" cy="107.73019" r="0.86615855" transform="rotate(28.381823)"/>
</g>`;

const TngChiefPettyOfficerBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path146353"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path146355"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 107.59404,345.09125 3.75924,2.61232 -3.74031,5.38254 2.44596,12.34193 -12.657625,2.35328 -3.443484,4.95536 -3.759244,-2.61226 4.096549,-5.89518 11.057494,-1.69151 -2.21133,-11.03868 z" id="path146357"/>
    <circle style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="circle146359" cx="299.89856" cy="228.69986" r="2.7622666" transform="rotate(34.795326)"/>
</g>`;

const TngPettyOfficer1stClass = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path132517"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path132519"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 235.39896,247.24012 1.2629,0.68234 -0.97697,1.80824 1.19447,3.76014 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68232 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36226 z" id="path132521"/>
</g>`;

const TngPettyOfficer1stClassBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path146353"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path146355"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 107.59404,345.09125 3.75924,2.61232 -3.74031,5.38254 2.44596,12.34193 -12.657625,2.35328 -3.443484,4.95536 -3.759244,-2.61226 4.096549,-5.89518 11.057494,-1.69151 -2.21133,-11.03868 z" id="path146357"/>
</g>`;

const TngPettyOfficer2ndClass = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path148999"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path149001"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path149003"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 232.50003,245.67387 1.2629,0.68233 -0.97697,1.80824 1.19447,3.76015 -3.86176,1.17665 -0.89944,1.66473 -1.2629,-0.68233 1.07002,-1.98046 3.38633,-0.91439 -1.07571,-3.36224 z" id="path149005"/>
</g>`;

const TngPettyOfficer2ndClassBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path149013"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path149015"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path149017"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 98.964873,339.09489 3.759237,2.61229 -3.740307,5.38254 2.445957,12.34195 -12.657626,2.35329 -3.443484,4.95536 -3.759241,-2.61229 4.096549,-5.89518 11.057496,-1.69151 -2.211338,-11.03862 z" id="path149019"/>
</g>`;

const TngPettyOfficer3rdClass = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path149076"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path149078"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.19248px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.80202,244.21616 1.2629,0.68234 -0.97698,1.80823 1.19447,3.76016 -3.86175,1.17664 -0.89945,1.66473 -1.26289,-0.68233 1.07002,-1.98045 3.38633,-0.91439 -1.07572,-3.36225 z" id="path149080"/>
</g>`;

const TngPettyOfficer3rdClassBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path149064"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path149066"/>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.613838px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 90.93378,333.51408 3.759237,2.61232 -3.740338,5.3825 2.445953,12.34199 -12.657591,2.35326 -3.443515,4.95535 -3.75921,-2.61228 4.096546,-5.89515 11.057496,-1.69151 -2.211367,-11.03865 z" id="path149068"/>
</g>`;

const TngCrewman1st = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path132489"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path132497"/>
    <path id="path150722" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.30227,251.75692 -1.21518,2.33462 -1.24048,-0.6731 1.05554,-1.9453 -0.37078,-5.63871 1.14732,-2.11447 1.24049,0.6731 -0.96375,1.77615 z"/>
    <path id="path150724" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 231.65464,253.03333 -1.21518,2.33462 -1.24048,-0.67309 1.05554,-1.94531 -0.37078,-5.63871 1.14732,-2.11446 1.24049,0.6731 -0.96375,1.77614 z"/>
    <path id="path150726" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 234.04688,254.33138 -1.21518,2.33462 -1.24048,-0.6731 1.05554,-1.9453 -0.37078,-5.63871 1.14732,-2.11446 1.24049,0.67309 -0.96375,1.77615 z"/>
</g>`;

const TngCrewman1stBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path146349"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path146351"/>
    <path id="path150684" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.859195,357.93478 -4.611423,6.89663 -3.655036,-2.53617 3.977177,-5.73176 0.779918,-17.79545 4.323022,-6.23018 3.655036,2.53617 -3.631338,5.23335 z"/>
    <path id="path150686" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 94.790355,362.74421 -4.611423,6.89663 -3.655036,-2.53618 3.977177,-5.73175 0.779918,-17.79546 4.323022,-6.23017 3.655036,2.53617 -3.631339,5.23335 z"/>
    <path id="path150688" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 101.83899,367.63515 -4.611425,6.89662 -3.655035,-2.53617 3.977177,-5.73175 0.779917,-17.79546 4.323026,-6.23018 3.65503,2.53618 -3.63134,5.23334 z"/>
</g>`;

const TngCrewman2nd = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path151529"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path151531"/>
    <path id="path151533" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.30227,251.75692 -1.21518,2.33462 -1.24048,-0.6731 1.05554,-1.9453 -0.37078,-5.63871 1.14732,-2.11447 1.24049,0.6731 -0.96375,1.77615 z"/>
    <path id="path151535" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 231.65464,253.03333 -1.21518,2.33462 -1.24048,-0.67309 1.05554,-1.94531 -0.37078,-5.63871 1.14732,-2.11446 1.24049,0.6731 -0.96375,1.77614 z"/>
</g>`;

const TngCrewman2ndBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path151515"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path151517"/>
    <path id="path151519" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.859195,357.93478 -4.611423,6.89663 -3.655036,-2.53617 3.977177,-5.73176 0.779918,-17.79545 4.323022,-6.23018 3.655036,2.53617 -3.631338,5.23335 z"/>
    <path id="path151521" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 94.790355,362.74421 -4.611423,6.89663 -3.655036,-2.53618 3.977177,-5.73175 0.779918,-17.79546 4.323022,-6.23017 3.655036,2.53617 -3.631339,5.23335 z"/>
</g>`;

const TngCrewman3rd = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.400393;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 228.24801,242.35683 12.71512,6.86982 1.01368,3.47707 -3.03947,5.62565 -3.37082,0.88569 -12.71512,-6.86983 z" id="path152318"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.177902px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 228.45618,243.05431 11.94505,6.45377 0.98918,3.19822 -2.76388,5.11557 -3.1326,0.76896 -11.94505,-6.45377 z" id="path152320"/>
    <path id="path152322" style="display:inline;fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.189247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 229.30227,251.75692 -1.21518,2.33462 -1.24048,-0.6731 1.05554,-1.9453 -0.37078,-5.63871 1.14732,-2.11447 1.24049,0.6731 -0.96375,1.77615 z"/>
</g>`;

const TngCrewman3rdBorder = `<g>
    <path style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:1.27689;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 86.671255,327.06801 37.848765,26.30097 1.97385,11.38044 -11.63655,16.74572 -10.99812,1.60609 -37.848761,-26.30101 z" id="path152306"/>
    <path style="fill:#383838;fill-opacity:1;stroke:#000000;stroke-width:0.567347px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.082511,329.35258 35.556519,24.70813 1.99554,10.48799 -10.58146,15.22738 -10.20158,1.32101 -35.55652,-24.70813 z" id="path152308"/>
    <path id="path152310" style="fill:#a1b7cc;fill-opacity:1;stroke:#000000;stroke-width:0.596538px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 87.859195,357.93478 -4.611423,6.89663 -3.655036,-2.53617 3.977177,-5.73176 0.779918,-17.79545 4.323022,-6.23018 3.655036,2.53617 -3.631338,5.23335 z"/>
</g>`;

const TosEnsign = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect16540" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
</g>`;

const TosLieutenantJG = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect13231" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
    <path id="path13233" style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.45;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 96.348815,374.29165 1.20648,0.831 4.107635,0.18509 c 1.46002,0.0755 2.15153,-0.0982 2.91449,-1.09012 l 2.75357,-3.99771 -6.00035,-0.27072 c -1.380165,-0.15891 -2.037985,0.18426 -2.932765,1.36755 z m 5.556905,-8.0677 5.89863,0.26518 c 1.41516,0.0483 2.18905,-0.25034 2.88193,-1.14051 l 2.72015,-3.9492 -6.33071,-0.28564 c -1.30378,-0.0518 -1.90011,0.47864 -2.64347,1.44211 z m 6.07545,-8.82048 6.15941,0.2769 c 1.20942,0.10771 1.93319,-0.26923 2.72907,-1.30894 l 2.20445,-3.20048 -0.94848,-0.65329 -5.03368,-0.22705 c -1.04005,-0.10919 -1.77994,0.27708 -2.36458,1.12587 z"/>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect13235" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
</g>`;

const TosLieutenant = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect11251" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
    <g id="g11261" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-240.46769,291.99762)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect11253" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="path11255" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path11257" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path11259" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect11263" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
</g>`;

const TosLtCommander = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect8478" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
    <path id="path8480" style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.45;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 88.610365,368.75659 1.20648,0.831 4.107634,0.18509 c 1.46002,0.0755 2.15153,-0.0982 2.91449,-1.09012 l 2.753569,-3.99771 -6.000349,-0.27072 c -1.380164,-0.15891 -2.037984,0.18426 -2.932764,1.36755 z m 5.556904,-8.0677 5.898631,0.26518 c 1.41516,0.0483 2.18905,-0.25034 2.88193,-1.14051 l 2.72015,-3.9492 -6.330712,-0.28564 c -1.303779,-0.0518 -1.900109,0.47864 -2.643469,1.44211 z m 6.075451,-8.82048 6.15941,0.2769 c 1.20942,0.10771 1.93319,-0.26923 2.72907,-1.30894 l 2.20445,-3.20048 -0.94848,-0.65329 -5.03368,-0.22705 c -1.04005,-0.10919 -1.77994,0.27708 -2.36458,1.12587 z"/>
    <g id="g8490" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-240.46769,291.99762)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect8482" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="path8484" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path8486" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path8488" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect8492" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
</g>`;

const TosCommander = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect6554" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
    <g id="g6564" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-240.46769,291.99762)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect6556" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="path6558" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path6560" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path6562" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <g id="g6574" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-250.05558,285.5258)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect6566" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="path6568" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path6570" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path6572" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect6576" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
</g>`;

const TosCaptain = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect4774" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
    <path id="path4776" style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.45;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 88.610365,368.75659 1.20648,0.831 4.107634,0.18509 c 1.46002,0.0755 2.15153,-0.0982 2.91449,-1.09012 l 2.753569,-3.99771 -6.000349,-0.27072 c -1.380164,-0.15891 -2.037984,0.18426 -2.932764,1.36755 z m 5.556904,-8.0677 5.898631,0.26518 c 1.41516,0.0483 2.18905,-0.25034 2.88193,-1.14051 l 2.72015,-3.9492 -6.330712,-0.28564 c -1.303779,-0.0518 -1.900109,0.47864 -2.643469,1.44211 z m 6.075451,-8.82048 6.15941,0.2769 c 1.20942,0.10771 1.93319,-0.26923 2.72907,-1.30894 l 2.20445,-3.20048 -0.94848,-0.65329 -5.03368,-0.22705 c -1.04005,-0.10919 -1.77994,0.27708 -2.36458,1.12587 z"/>
    <g id="g4786" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-240.46769,291.99762)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect4778" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="path4780" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path4782" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path4784" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <g id="g4796" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-258.20528,279.77306)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect4788" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="path4790" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path4792" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path4794" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect4798" width="126.25761" height="30.247616" x="195.43486" y="222.39742" transform="rotate(34.627047)"/>
</g>`

const TosEnsignRankBorder = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
</g>`;

const TosLieutenantJGBorder = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <path id="rect45766" style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.45;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 95.390026,373.33286 1.20648,0.831 4.107634,0.18509 c 1.46002,0.0755 2.15153,-0.0982 2.91449,-1.09012 l 2.75357,-3.99771 -6.00035,-0.27072 c -1.380164,-0.15891 -2.037984,0.18426 -2.932764,1.36755 z m 5.556904,-8.0677 5.89863,0.26518 c 1.41516,0.0483 2.18905,-0.25034 2.88193,-1.14051 l 2.72015,-3.9492 -6.33071,-0.28564 c -1.30378,-0.0518 -1.90011,0.47864 -2.64347,1.44211 z m 6.07545,-8.82048 6.15941,0.2769 c 1.20942,0.10771 1.93319,-0.26923 2.72907,-1.30894 l 2.20445,-3.20048 -0.94848,-0.65329 -5.03368,-0.22705 c -1.04005,-0.10919 -1.77994,0.27708 -2.36458,1.12587 z"/>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect47378" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
</g>`;

const TosLieutenantBorder = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <g id="g51917" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-240.46769,291.99762)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect50013" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="rect51906" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path51909" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path51911" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect47378" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
</g>`;

const TosLtCommanderBorder = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <path id="rect45766" style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.45;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 88.610365,368.75659 1.20648,0.831 4.107634,0.18509 c 1.46002,0.0755 2.15153,-0.0982 2.91449,-1.09012 l 2.753569,-3.99771 -6.000349,-0.27072 c -1.380164,-0.15891 -2.037984,0.18426 -2.932764,1.36755 z m 5.556904,-8.0677 5.898631,0.26518 c 1.41516,0.0483 2.18905,-0.25034 2.88193,-1.14051 l 2.72015,-3.9492 -6.330712,-0.28564 c -1.303779,-0.0518 -1.900109,0.47864 -2.643469,1.44211 z m 6.075451,-8.82048 6.15941,0.2769 c 1.20942,0.10771 1.93319,-0.26923 2.72907,-1.30894 l 2.20445,-3.20048 -0.94848,-0.65329 -5.03368,-0.22705 c -1.04005,-0.10919 -1.77994,0.27708 -2.36458,1.12587 z"/>
    <g id="g51917" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-240.46769,291.99762)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect50013" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="rect51906" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path51909" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path51911" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect47378" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
</g>`;

const TosCommanderBorder = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <g id="g51917" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-240.46769,291.99762)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect50013" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="rect51906" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path51909" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path51911" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <g id="g865" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-250.05558,285.5258)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect857" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="path859" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path861" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path863" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect47378" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
</g>`;

const TosCaptainBorder = `<g>
    <rect style="opacity:1;fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect34812" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
    <path id="rect45766" style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.45;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 88.610365,368.75659 1.20648,0.831 4.107634,0.18509 c 1.46002,0.0755 2.15153,-0.0982 2.91449,-1.09012 l 2.753569,-3.99771 -6.000349,-0.27072 c -1.380164,-0.15891 -2.037984,0.18426 -2.932764,1.36755 z m 5.556904,-8.0677 5.898631,0.26518 c 1.41516,0.0483 2.18905,-0.25034 2.88193,-1.14051 l 2.72015,-3.9492 -6.330712,-0.28564 c -1.303779,-0.0518 -1.900109,0.47864 -2.643469,1.44211 z m 6.075451,-8.82048 6.15941,0.2769 c 1.20942,0.10771 1.93319,-0.26923 2.72907,-1.30894 l 2.20445,-3.20048 -0.94848,-0.65329 -5.03368,-0.22705 c -1.04005,-0.10919 -1.77994,0.27708 -2.36458,1.12587 z"/>
    <g id="g51917" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-240.46769,291.99762)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect50013" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="rect51906" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path51909" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path51911" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <g id="g2559" transform="matrix(0.59120647,-0.8382132,0.8382132,0.59120647,-258.20528,279.77306)">
        <rect style="opacity:1;fill:#ffd59c;fill-opacity:1;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect2551" width="28.059921" height="5.1700811" x="125.05373" y="316.33209" rx="0" ry="0"/>
        <path id="path2553" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" transform="rotate(46.33222)" d="m 325.3487,124.76265 0.95071,-1.04483 0.0422,2.12776 c -0.0669,0.7562 -1.25872,1.5395 -2.27776,1.46427 l -8.20257,-0.0256 -1.11848,1.10723 -0.26503,-2.16058 c -0.008,-0.93982 0.53648,-1.51249 1.22913,-1.52357 z"/>
        <path id="path2555" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 143.71967,321.65786 1.41222,-0.0337 -1.50999,1.4997 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.65144,-6.03598 -1.54934,-0.0613 1.36228,-1.58176 c 0.67431,-0.65471 1.61954,-0.4618 2.00128,-0.0913 z"/>
        <path id="path2557" style="opacity:1;fill:#ffd59c;stroke:#000000;stroke-width:0.487457;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" d="m 153.55018,321.48837 0.71733,0.0454 -0.8151,1.42065 c -0.59319,0.47374 -1.98272,0.15248 -2.63192,-0.63659 l -5.64516,-5.95105 -1.57321,-0.0445 1.37987,-1.68353 c 0.67431,-0.65471 1.42379,-0.66331 1.87149,-0.25 z"/>
    </g>
    <rect style="opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#ffd59c;stroke-width:2;stroke-miterlimit:40;stroke-dasharray:none;stroke-opacity:1" id="rect47378" width="126.25761" height="30.247616" x="195.43486" y="222.39742" rx="4" ry="4" transform="rotate(34.627047)"/>
</g>`;

class RankIndicatorCatalog {

    private static _instance: RankIndicatorCatalog;

    private tngSwatches = [
        new Swatch(RankIndicator.None, "None", (token) => RankIndicatorCatalog.decorateSwatch("", RankIndicator.None, token)),
        new Swatch(RankIndicator.Ensign, "Ensign", (token) => RankIndicatorCatalog.decorateSwatch(TngEnsignRankPip, RankIndicator.Ensign, token)),
        new Swatch(RankIndicator.LieutenantJG, "Lieutenant J.G.", (token) => RankIndicatorCatalog.decorateSwatch(TngLtJGRankPip, RankIndicator.LieutenantJG, token)),
        new Swatch(RankIndicator.Lieutenant, "Lieutenant", (token) => RankIndicatorCatalog.decorateSwatch(TngLtRankPip, RankIndicator.Lieutenant, token)),
        new Swatch(RankIndicator.LtCommander, "Lt. Commander", (token) => RankIndicatorCatalog.decorateSwatch(TngLcdrRankPip, RankIndicator.LtCommander, token)),
        new Swatch(RankIndicator.Commander, "Commander", (token) => RankIndicatorCatalog.decorateSwatch(TngCmdrRankPip, RankIndicator.Commander, token)),
        new Swatch(RankIndicator.Captain, "Captain", (token) => RankIndicatorCatalog.decorateSwatch(TngCaptainRankPip, RankIndicator.Captain, token)),

        new Swatch(RankIndicator.Crewman3rdClass, "Crewman 3rd Class", (token) => RankIndicatorCatalog.decorateSwatch(TngCrewman3rd, RankIndicator.Crewman3rdClass, token)),
        new Swatch(RankIndicator.Crewman2ndClass, "Crewman 2nd Class", (token) => RankIndicatorCatalog.decorateSwatch(TngCrewman2nd, RankIndicator.Crewman2ndClass, token)),
        new Swatch(RankIndicator.Crewman1stClass, "Crewman 1st Class", (token) => RankIndicatorCatalog.decorateSwatch(TngCrewman1st, RankIndicator.Crewman1stClass, token)),
        new Swatch(RankIndicator.PettyOfficer3rdClass, "Petty Officer 3rd Class", (token) => RankIndicatorCatalog.decorateSwatch(TngPettyOfficer3rdClass, RankIndicator.PettyOfficer3rdClass, token)),
        new Swatch(RankIndicator.PettyOfficer2ndClass, "Petty Officer 2nd Class", (token) => RankIndicatorCatalog.decorateSwatch(TngPettyOfficer2ndClass, RankIndicator.PettyOfficer2ndClass, token)),
        new Swatch(RankIndicator.PettyOfficer1stClass, "Petty Officer 1st Class", (token) => RankIndicatorCatalog.decorateSwatch(TngPettyOfficer1stClass, RankIndicator.PettyOfficer1stClass, token)),
        new Swatch(RankIndicator.ChiefPettyOfficer, "Chief Petty Officer", (token) => RankIndicatorCatalog.decorateSwatch(TngChiefPettyOfficer, RankIndicator.ChiefPettyOfficer, token)),
        new Swatch(RankIndicator.SeniorChiefPettyOfficer, "Senior Chief Petty Officer", (token) => RankIndicatorCatalog.decorateSwatch(TngSeniorChiefPettyOfficer, RankIndicator.SeniorChiefPettyOfficer, token)),
        new Swatch(RankIndicator.MasterChiefPettyOfficer, "Master Chief Petty Officer", (token) => RankIndicatorCatalog.decorateSwatch(TngMasterChiefPettyOfficer, RankIndicator.MasterChiefPettyOfficer, token))

    ];

    private tosSwatches = [
        new Swatch(RankIndicator.None, "None", (token) => RankIndicatorCatalog.decorateSwatch("", RankIndicator.None, token)),
        new Swatch(RankIndicator.Ensign, "Ensign", (token) => RankIndicatorCatalog.decorateSwatch(TosEnsign, RankIndicator.Ensign, token)),
        new Swatch(RankIndicator.LieutenantJG, "Lieutenant J.G.", (token) => RankIndicatorCatalog.decorateSwatch(TosLieutenantJG, RankIndicator.LieutenantJG, token)),
        new Swatch(RankIndicator.Lieutenant, "Lieutenant", (token) => RankIndicatorCatalog.decorateSwatch(TosLieutenant, RankIndicator.Lieutenant, token)),
        new Swatch(RankIndicator.LtCommander, "Lt. Commander", (token) => RankIndicatorCatalog.decorateSwatch(TosLtCommander, RankIndicator.LtCommander, token)),
        new Swatch(RankIndicator.Commander, "Commander", (token) => RankIndicatorCatalog.decorateSwatch(TosCommander, RankIndicator.Commander, token)),
        new Swatch(RankIndicator.Captain, "Captain", (token) => RankIndicatorCatalog.decorateSwatch(TosCaptain, RankIndicator.Captain, token))
    ];

    public static get instance() {
        if (RankIndicatorCatalog._instance == null) {
            RankIndicatorCatalog._instance = new RankIndicatorCatalog();
        }
        return RankIndicatorCatalog._instance;
    }

    getRankIndicator(token: Token) {
        if (token.uniformEra === UniformEra.OriginalSeries) {
            return "";
        } else {
            switch (token.rankIndicator) {
                case RankIndicator.Ensign:
                    return TngEnsignRankPip;
                case RankIndicator.LieutenantJG:
                    return TngLtJGRankPip;
                case RankIndicator.Lieutenant:
                    return TngLtRankPip;
                case RankIndicator.LtCommander:
                    return TngLcdrRankPip;
                case RankIndicator.Commander:
                    return TngCmdrRankPip;
                case RankIndicator.Captain:
                    return TngCaptainRankPip;

                case RankIndicator.Crewman3rdClass:
                    return TngCrewman3rd;
                case RankIndicator.Crewman2ndClass:
                    return TngCrewman2nd;
                case RankIndicator.Crewman1stClass:
                    return TngCrewman1st;
                case RankIndicator.PettyOfficer3rdClass:
                    return TngPettyOfficer3rdClass;
                case RankIndicator.PettyOfficer2ndClass:
                    return TngPettyOfficer2ndClass;
                case RankIndicator.PettyOfficer1stClass:
                    return TngPettyOfficer1stClass;
                case RankIndicator.ChiefPettyOfficer:
                    return TngChiefPettyOfficer;
                case RankIndicator.SeniorChiefPettyOfficer:
                    return TngSeniorChiefPettyOfficer;
                case RankIndicator.MasterChiefPettyOfficer:
                    return TngMasterChiefPettyOfficer;

                default:
                    return "";
            }
        }
    }

    getBorderRankIndicator(token: Token) {
        if (token.uniformEra === UniformEra.OriginalSeries) {
            switch (token.rankIndicator) {
                case RankIndicator.Ensign:
                    return TosEnsignRankBorder.replace(DefaultRed, token.divisionColor);
                case RankIndicator.LieutenantJG:
                    return TosLieutenantJGBorder.replace(DefaultRed, token.divisionColor);
                case RankIndicator.Lieutenant:
                    return TosLieutenantBorder.replace(DefaultRed, token.divisionColor);
                case RankIndicator.LtCommander:
                    return TosLtCommanderBorder.replace(DefaultRed, token.divisionColor);
                case RankIndicator.Commander:
                    return TosCommanderBorder.replace(DefaultRed, token.divisionColor);
                case RankIndicator.Captain:
                    return TosCaptainBorder.replace(DefaultRed, token.divisionColor);
                default:
                    return "";
            }
        } else {
            switch (token.rankIndicator) {
                case RankIndicator.Ensign:
                    return TngEnsignRankPipBorder;
                case RankIndicator.LieutenantJG:
                    return TngLtJgRankPipBorder;
                case RankIndicator.Lieutenant:
                    return TngLtRankPipBorder;
                case RankIndicator.LtCommander:
                    return TngLcdrRankPipBorder;
                case RankIndicator.Commander:
                    return TngCmdrRankPipBorder;
                case RankIndicator.Captain:
                    return TngCaptainRankPipBorder;
                case RankIndicator.Crewman3rdClass:
                    return TngCrewman3rdBorder;
                case RankIndicator.Crewman2ndClass:
                    return TngCrewman2ndBorder;
                case RankIndicator.Crewman1stClass:
                    return TngCrewman1stBorder;
                case RankIndicator.PettyOfficer3rdClass:
                    return TngPettyOfficer3rdClassBorder;
                case RankIndicator.PettyOfficer2ndClass:
                    return TngPettyOfficer2ndClassBorder;
                case RankIndicator.PettyOfficer1stClass:
                    return TngPettyOfficer1stClassBorder;
                case RankIndicator.ChiefPettyOfficer:
                    return TngChiefPettyOfficerBorder;
                case RankIndicator.SeniorChiefPettyOfficer:
                    return TngSeniorChiefPettyOfficerBorder;
                case RankIndicator.MasterChiefPettyOfficer:
                    return TngMasterChiefPettyOfficerBorder;
                default:
                    return "";
            }
        }
    }

    getSwatches(token: Token) {
        if (token.uniformEra === UniformEra.OriginalSeries) {
            return this.tosSwatches;
        } else {
            return this.tngSwatches;
        }
    }

    private static decorateSwatch(svg: string, rankIndicator: RankIndicator, token: Token) {
        if (token.uniformEra === UniformEra.OriginalSeries) {
            return `<svg viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <clipPath id="rankClipPath` + rankIndicator + `">
                        <circle cx="40" cy="40" r="40" fill="#ffffff" />
                    </clipPath>
                </defs>
                <g clip-path="url(#rankClipPath` + rankIndicator + `">
                    <g transform="translate(-65, -318)">`
            + svg.replace(DefaultRed, token.divisionColor)
            + `</g>
            + </g>
            </svg>`
        } else {
            if (isEnlistedRank(rankIndicator)) {
                return `<svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g transform="translate(-212, -230)">`
                    + svg
                    + `</g>
                    </svg>`;
            } else {
                return `<svg viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g transform="translate(-180, -200)">`
                    + svg
                    + `</g>
                    </svg>`;
            }
        }
    }
}

export default RankIndicatorCatalog;