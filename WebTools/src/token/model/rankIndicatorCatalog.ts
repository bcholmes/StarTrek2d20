import { Rank } from "../../helpers/ranks";
import { DominionWarUniformPack } from "./dominionWarUniformPack";
import { EnterpriseUniformPack } from "./enterpriseUniformPack";
import { KlingonArmorUniformPack } from "./klingonArmorUniformPack";
import { MonsterMaroonUniformPack } from "./monsterMaroonUniformPack";
import { isEnlistedRank } from "./rankHelper";
import Swatch from "./swatch";
import { Token } from "./token";
import { TosKlingonUniformPack } from "./tosKlingonUniformPack";
import { TosUniformPack } from "./tosUniformPack";
import { DefaultRed } from "./uniformCatalog";
import { UniformEra } from "./uniformEra";
import { UniformVariantType } from "./uniformVariantTypeEnum";

const MonsterMaroonEnsign = `<g>
    <path style="fill:url(#rankEnsignGradient);fill-opacity:1;stroke:#000000;stroke-width:0.616;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 147.97498,301.17001 13.38147,7.47618 3.1192,-14.96097 -5.8279,2.64357 2.7087,12.3174 -7.34293,-10.21529 z" id="path71458"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.616;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:2;stroke-dasharray:none;stroke-opacity:1" d="m 154.01122,298.49181 7.34523,10.15438 -2.711,-12.25649 c -0.81024,1.92403 -2.56945,2.81182 -4.63423,2.10211 z" id="path71460" />
    <path id="path71462" style="fill:none;stroke:#000000;stroke-width:0.213;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 160.6857,307.78164 c 0.15094,-0.0532 0.2971,-0.11794 0.43835,-0.19409 m -1.21429,-0.95286 c 0.32406,-0.0871 0.62769,-0.22491 0.90955,-0.41183 m -1.66145,-0.62298 c 0.51139,-0.0928 0.97582,-0.30495 1.38869,-0.63066 m -2.19511,-0.44622 c 0.72364,-0.064 1.36117,-0.35307 1.90076,-0.85268 m -2.68841,-0.30089 c 0.93814,-0.0138 1.74147,-0.3885 2.38623,-1.09489 m -3.2329,-0.0567 c 1.18514,0.0851 2.17263,-0.37501 2.91897,-1.32668 m -3.65867,0.2561 c 1.40854,0.19282 2.55544,-0.35342 3.37277,-1.55497 m -4.37803,0.20865 c 1.74133,0.40744 3.12026,-0.24798 4.02164,-1.82424" />
</g>`

const MonsterMaroonEnsignGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankEnsignGradient" x1="288.47208" y1="200.61588" x2="348.80151" y2="258.85245" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.2071361,-0.09395797,0.09395797,0.2071361,68.952132,285.79404)"/>`;

const MonsterMaroonEnsignBorder = `<g>
    <path style="fill:url(#rankEnsignGradientBorder);fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-dasharray:none" d="m 21.963235,280.2212 27.64595,25.75162 16.248475,-33.98447 -15.503137,2.90777 -0.745338,31.0767 -11.582458,-28.76449 z" id="path70630"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:2;stroke-opacity:1;stroke-dasharray:none" d="m 37.98546,277.35279 11.623725,28.62003 0.704072,-30.93223 c -3.068952,4.13041 -7.801447,5.22312 -12.327797,2.3122 z" id="path70632"/>
    <path id="path70634" style="fill:none;stroke:#000000;stroke-width:0.392436;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 48.510915,303.50946 c 0.392553,-0.0387 0.780459,-0.10794 1.163295,-0.20735 m -2.347613,-2.99379 c 0.826904,-0.0184 1.63463,-0.16999 2.419096,-0.45201 m -3.611694,-2.46656 c 1.278686,0.078 2.515017,-0.15726 3.694567,-0.69467 m -4.99301,-2.35663 c 1.76988,0.2716 3.465766,-0.0463 5.05074,-0.92559 m -6.259202,-2.29826 c 2.253913,0.51768 4.396964,0.0921 6.355068,-1.22048 m -7.70603,-2.03319 c 2.787185,0.89935 5.421221,0.37749 7.76646,-1.46267 m -8.908866,-1.53438 c 3.258761,1.28834 6.324952,0.65385 8.98682,-1.74281 m -10.6031,-2.0702 c 3.929445,1.99745 7.615209,1.23779 10.698224,-2.00656"/>
</g>`;

const MonsterMaroonEnsignBorderGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankEnsignGradientBorder" x1="20.658312" y1="279.23148" x2="66.73365" y2="297.92786" gradientUnits="userSpaceOnUse"/>`;

const MonsterMaroonLieutenantJG = `<g>
    <path id="path48218" style="fill:url(#rankLieutenantJGGradient);fill-opacity:1;stroke:#000000;stroke-width:0.550252;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 143.31991,290.82022 c 4.72401,-2.41564 9.37536,-4.19296 13.69874,-6.41371 -0.20367,2.73185 -1.20398,4.14591 -1.63699,6.67966 -1.31385,0.60306 -2.64575,1.2145 -3.9961,1.8345 -2.76399,-1.01548 -5.09666,-1.27631 -8.06565,-2.10045 z m 13.27833,23.57908 c 4.32446,-1.66027 8.84166,-3.90996 12.76011,-5.41091 -1.86004,-1.06787 -4.61132,-1.99102 -6.63858,-3.02268 -1.24475,0.50165 -2.50786,1.01045 -3.78978,1.52651 -0.86189,2.15783 -1.3756,4.81579 -2.33175,6.90708 z"/>
    <path id="rect48220" d="m 157.57484,304.45965 c 0.4715,1.014 0.92262,2.02219 1.3551,3.0238 l 3.82687,-1.51119 c -0.41549,-1.02322 -0.8505,-2.05499 -1.30679,-3.09465 -1.11195,-2.16925 -4.80065,-0.56326 -3.87518,1.58204 z m -0.23821,-10.0107 c -0.60613,-1.12248 -1.24044,-2.25164 -1.90493,-3.38676 l -4.06027,1.86975 c 0.67443,1.09048 1.3197,2.17772 1.93778,3.26086 1.22263,2.23516 5.2617,0.81493 4.02742,-1.74385 z" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.550252;stroke-miterlimit:9;stroke-dasharray:none"/>
    <path id="path48224" style="fill:none;stroke:#000000;stroke-width:0.254309px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 152.30161,294.48114 3.99703,-1.79801 m -2.99646,3.51422 3.97373,-1.74484 m 0.3007,10.03004 3.84171,-1.54589 m -3.1179,3.10902 3.81277,-1.51791"/>
</g>`;

const MonsterMaroonLieutenantJGGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankLieutenantJGGradient" gradientUnits="userSpaceOnUse" x1="123.91869" y1="256.09821" x2="199.89598" y2="231.10127" gradientTransform="matrix(0.25412224,0.0097558,-0.0097558,0.25412224,117.79097,236.30384)"/>`;

const MonsterMaroonLieutenantJGBorder = `<g>
    <path id="path46982" style="fill:url(#rankLieutenantJGGradientBorder);fill-opacity:1;stroke:#000000;stroke-width:0.962316;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 28.857856,314.08957 42.534192,-8.07716 -17.258433,-10.74761 -12.672781,2.47132 z m -12.782448,-65.83887 42.46656,-8.42551 -11.94532,16.28964 -12.812,2.41254 z"/>
    <path id="rect46984" style="fill:#d9a14b;stroke:#000000;stroke-width:1.11071;stroke-miterlimit:9" transform="rotate(-10.987143)" d="m -2.9661264,291.73565 0,8.43611 H -16.096262 l 0,-8.62637 c -0.01568,-6.65966 12.8692224,-6.84362 13.1301356,0.19026 z m -13.1301356,-22.79424 0,-8.69236 13.1301356,0 0,8.71624 c 0.1745967,6.13686 -13.0177936,6.9948 -13.1301356,-0.0239 z"/>
    <path id="path46988" style="fill:none;stroke:#000000;stroke-width:0.740243px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 40.611753,293.76648 12.747597,-2.47491 m -13.614414,-1.98983 12.747596,-2.47491 M 35.41085,266.97805 48.158446,264.50314 m -13.565683,-1.90343 12.747596,-2.47491"/>
</g>`;

const MonsterMaroonLieutenantJGBorderGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankLieutenantJGGradientBorder" gradientUnits="userSpaceOnUse" x1="193.91504" y1="219.56265" x2="252.40115" y2="234.90327" gradientTransform="matrix(0.72667468,-0.14108203,0.14108203,0.72667468,-152.64226,139.84311)"/>`;

const MonsterMaroonLieutenant = `<g>
    <path id="path48218" style="fill:url(#rankLieutenantGradient);fill-opacity:1;stroke:#000000;stroke-width:0.550252;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 143.31991,290.82022 c 4.72401,-2.41564 9.37536,-4.19296 13.69874,-6.41371 -0.20367,2.73185 -1.20398,4.14591 -1.63699,6.67966 -1.31385,0.60306 -2.64575,1.2145 -3.9961,1.8345 -2.76399,-1.01548 -5.09666,-1.27631 -8.06565,-2.10045 z m 13.27833,23.57908 c 4.32446,-1.66027 8.84166,-3.90996 12.76011,-5.41091 -1.86004,-1.06787 -4.61132,-1.99102 -6.63858,-3.02268 -1.24475,0.50165 -2.50786,1.01045 -3.78978,1.52651 -0.86189,2.15783 -1.3756,4.81579 -2.33175,6.90708 z"/>
    <path id="rect48220" d="m 158.92994,307.48345 3.82687,-1.51119 c -1.95076,-4.80408 -4.33178,-9.79669 -7.32511,-14.91007 l -4.06027,1.86975 c 3.0576,4.94385 5.51596,9.82099 7.55851,14.55151 z" style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.550252;stroke-miterlimit:9;stroke-dasharray:none"/>
    <path id="path48224" style="fill:none;stroke:#000000;stroke-width:0.254309px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 152.30161,294.48114 3.99703,-1.79801 m -2.99646,3.51422 3.97373,-1.74484 m -3.02579,3.44086 3.94929,-1.69653 m -3.05079,3.37276 3.92381,-1.65277 m -3.07178,3.30954 3.89739,-1.61326 m -3.08894,3.25083 3.86999,-1.57771 m -3.10248,3.19632 3.84171,-1.54589 m -3.1179,3.10902 3.81277,-1.51791"/>
</g>`;

const MonsterMaroonLieutenantGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankLieutenantGradient" gradientUnits="userSpaceOnUse" x1="123.91869" y1="256.09821" x2="199.89598" y2="231.10127" gradientTransform="matrix(0.25412224,0.0097558,-0.0097558,0.25412224,117.79097,236.30384)"/>`;

const MonsterMaroonLieutenantBorder = `<g>
    <path id="path46982" style="fill:url(#rankLieutenantGradientBorder);fill-opacity:1;stroke:#000000;stroke-width:0.962316;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 28.857856,314.08957 42.534192,-8.07716 -17.258433,-10.74761 -12.672781,2.47132 z m -12.782448,-65.83887 42.46656,-8.42551 -11.94532,16.28964 -12.812,2.41254 z"/>
    <rect style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.11071;stroke-miterlimit:9;stroke-dasharray:none" id="rect46984" width="13.130136" height="39.92271" x="-16.096262" y="260.24905" transform="rotate(-10.987143)"/>
    <path id="path46988" style="fill:none;stroke:#000000;stroke-width:0.740243px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 40.611753,293.76648 12.747597,-2.47491 m -13.614414,-1.98983 12.747596,-2.47491 m -13.614413,-1.98982 12.747596,-2.47492 m -13.614413,-1.98982 12.747596,-2.47492 m -13.614414,-1.98982 12.747596,-2.47492 m -13.614412,-1.98982 12.747596,-2.47491 m -13.614414,-1.98983 12.747596,-2.47491 m -13.565683,-1.90343 12.747596,-2.47491"/>
</g>`;

const MonsterMaroonLieutenantBorderGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankLieutenantGradientBorder" gradientUnits="userSpaceOnUse" x1="193.91504" y1="219.56265" x2="252.40115" y2="234.90327" gradientTransform="matrix(0.72667468,-0.14108203,0.14108203,0.72667468,-152.64226,139.84311)"/>`;

const MonsterMaroonLtCommander = `<g>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.616398;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 159.04699,293.31661 -8.15163,4.2011 c 0.7965,1.28855 1.56006,2.60272 2.29845,3.93748 l 8.20533,-4.09423 c -0.74864,-1.35661 -1.53037,-2.70618 -2.35215,-4.04435 z" id="path51055"/>
    <path id="path51061" style="fill:none;stroke:#000000;stroke-width:0.21342px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 151.87999,296.9587 c 0.81736,1.32173 1.59935,2.66839 2.35413,4.03473 m -1.03728,-4.64862 c 0.80027,1.29741 1.56588,2.61625 2.30427,3.95176 m 1.26704,-0.64171 c -0.73732,-1.33388 -1.50291,-2.65327 -2.30397,-3.95356 m 1.23987,-0.63886 c 0.80486,1.30775 1.57319,2.63249 2.31208,3.96968 m -1.13932,-4.66965 c 0.83981,1.36295 1.63907,2.74199 2.40558,4.13218 m 1.16292,-0.674 c -0.7421,-1.34402 -1.51596,-2.67951 -2.32843,-4.00217"/>
    <path id="path51053" style="fill:url(#rankLtCommanderGradient);fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.616398;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 154.04393,285.55423 c 0.58643,0.79884 1.14265,1.59925 1.67498,2.39608 v 0 c 1.70469,2.53871 3.24061,5.12948 4.658,7.74221 v 0 c 1.41774,2.61038 2.73726,5.27672 3.95384,7.9998 0.36647,0.81866 0.72598,1.64739 1.07555,2.48729 -1.21325,-0.43899 -2.44103,-0.84762 -3.68317,-1.23652 -0.65955,-0.20691 -1.32356,-0.4082 -1.992,-0.60391 -0.28052,0.65738 -0.56841,1.31531 -0.86372,1.97371 -0.56735,1.2662 -1.16178,2.53431 -1.78977,3.79488 -0.33319,-0.81377 -0.68021,-1.62626 -1.03767,-2.43866 -1.18425,-2.68488 -2.47858,-5.31493 -3.87739,-7.89048 v 0 c -1.40308,-2.57981 -2.89479,-5.08786 -4.53118,-7.48924 v 0 c -0.5133,-0.74851 -1.03112,-1.48184 -1.56017,-2.19434 1.48318,0.1682 2.96385,0.3952 4.42774,0.65584 0.67469,0.11974 1.34583,0.24696 2.01325,0.38101 0.18967,-0.58328 0.37131,-1.16759 0.54444,-1.75325 0.37487,-1.26227 0.71259,-2.53264 0.98727,-3.82442 z m -1.45459,-5.71835 c 2.1106,2.3121 3.84706,4.65415 5.35194,6.9221 v 0 c 1.72322,2.57657 3.27114,5.19013 4.69252,7.81188 1.42291,2.61996 2.7494,5.29626 3.97492,8.0298 1.06658,2.37172 2.08422,4.85252 2.9839,7.47069 -2.7518,-1.07419 -5.57959,-1.90739 -8.48841,-2.616 -1.39919,2.81923 -2.95344,5.63789 -4.73266,8.35158 -0.75244,-2.33103 -1.68372,-4.65266 -2.70964,-6.99616 -1.17506,-2.67388 -2.46218,-5.2935 -3.85558,-7.85906 -1.39902,-2.57033 -2.87791,-5.05474 -4.49447,-7.41685 v 0 c -1.4562,-2.10667 -2.90525,-4.04806 -4.51169,-5.69173 3.25473,-0.19796 6.58813,0.0769 9.84796,0.5617 0.96278,-2.75122 1.69477,-5.55783 1.94121,-8.56795 z"/>
</g>`;

const MonsterMaroonLtCommanderBorder = `<g>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 30.670442,274.27704 24.769456,-4.55272 1.937086,10.53887 -24.769456,4.55273 z" id="path50307"/>
    <path id="path50313" style="fill:none;stroke:#000000;stroke-width:0.580727px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 52.513054,270.15265 1.978269,10.76293 m -5.72346,-9.93697 1.929347,10.49676 m -3.773222,0.67346 -1.922209,-10.45793 m -3.769652,0.69288 1.922208,10.45793 m -5.727239,-9.95753 1.992965,10.84289 m -3.804768,0.50182 -1.922734,-10.46079"/>
    <path id="path5642" style="display:inline;fill:url(#rankLtCommanderGradientBorder);fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 26.521652,252.07503 9.733017,52.95326 10.683087,-11.57101 14.099425,7.01589 -9.715223,-52.85646 -10.700874,11.47421 z m -9.472945,-10.15802 13.962798,75.96416 17.349727,-16.67935 21.372669,9.56202 -13.962519,-75.9642 -16.520395,16.83715 z"/>
</g>`;

const MonsterMaroonLtCommanderGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankLtCommanderGradient" x1="139.85434" y1="285.12982" x2="170.35454" y2="312.58743" gradientUnits="userSpaceOnUse"/>`;

const MonsterMaroonLtCommanderBorderGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankLtCommanderGradientBorder" x1="18.235147" y1="237.86584" x2="66.005089" y2="320.23874" gradientUnits="userSpaceOnUse"/>`;

const MonsterMaroonCommander = `<g>
    <path id="path51053" style="fill:url(#rankCommanderGradient);fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.616398;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 154.29817,285.97796 c 0.58643,0.79884 0.88841,1.17552 1.42074,1.97235 v 0 c 1.70469,2.53871 3.24061,5.12948 4.658,7.74221 v 0 c 1.41774,2.61038 2.73726,5.27672 3.95384,7.9998 0.36647,0.81866 0.72598,1.64739 1.07555,2.48729 -1.21325,-0.43899 -2.44103,-0.84762 -3.68317,-1.23652 -0.65955,-0.20691 -1.32356,-0.4082 -1.992,-0.60391 -0.28052,0.65738 -0.56841,1.31531 -0.86372,1.97371 -0.56735,1.2662 -1.16178,2.53431 -1.78977,3.79488 -0.33319,-0.81377 -0.68021,-1.62626 -1.03767,-2.43866 -1.18425,-2.68488 -2.47858,-5.31493 -3.87739,-7.89048 v 0 c -1.40308,-2.57981 -2.89479,-5.08786 -4.53118,-7.48924 v 0 c -0.5133,-0.74851 -1.03112,-1.48184 -1.56017,-2.19434 2.31005,0.27003 4.34436,0.63017 6.44099,1.03685 0.71699,-1.79451 1.43912,-3.56797 1.78595,-5.15394 z m -1.2851,-5.46411 c 2.1106,2.3121 3.42333,3.97618 5.03738,6.39844 1.61405,2.42226 3.16197,5.03582 4.58335,7.65757 1.42291,2.61996 2.7494,5.29626 3.97492,8.0298 1.06658,2.37172 2.08422,4.85252 2.9839,7.47069 -2.7518,-1.07419 -5.57959,-1.90739 -8.48841,-2.616 -1.39919,2.81923 -2.95344,5.63789 -4.73266,8.35158 -0.75244,-2.33103 -1.68372,-4.65266 -2.70964,-6.99616 -1.17506,-2.67388 -2.46218,-5.2935 -3.85558,-7.85906 -1.39902,-2.57033 -2.87791,-5.05474 -4.49447,-7.41685 v 0 c -1.4562,-2.10667 -2.90525,-4.04806 -4.51169,-5.69173 3.25473,-0.19796 6.58813,0.0769 9.84796,0.5617 1.21702,-2.58173 1.77952,-4.71037 2.36494,-7.88998 z"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.616398;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 157.63113,290.93345 -8.15163,4.2011 c 0.7965,1.28855 1.56006,2.60272 2.29845,3.93748 l 8.20533,-4.09423 c -0.74864,-1.35661 -1.53037,-2.70618 -2.35215,-4.04435 z" id="path51055"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.616398;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 160.61886,296.14031 -8.21764,4.08014 c 0.74302,1.38317 1.45575,2.78161 2.13735,4.19532 l 8.25475,-4.02258 c -0.69587,-1.43335 -1.42092,-2.85094 -2.17446,-4.25288 z" id="path51057"/>
    <path id="path51059" style="fill:none;stroke:#000000;stroke-width:0.21342px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 153.43138,299.73586 c 0.73856,1.3755 1.44749,2.76609 2.12599,4.17179 m -0.80227,-4.76421 c 0.72119,1.3447 1.41447,2.70383 2.07908,4.07741 m 1.27435,-0.63062 c -0.66439,-1.37137 -1.35693,-2.72833 -2.07693,-4.07092 m 1.24928,-0.62008 c 0.72156,1.34534 1.41591,2.70511 2.08238,4.07935 m -0.89561,-4.76264 c 0.75072,1.39713 1.4725,2.80982 2.16456,4.23815 m 1.17338,-0.66536 c -0.6707,-1.38022 -1.36877,-2.74583 -2.09354,-4.09689"/>
    <path id="path51061" style="fill:none;stroke:#000000;stroke-width:0.21342px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 150.46413,294.57554 c 0.81736,1.32173 1.59935,2.66839 2.35413,4.03473 m -1.03728,-4.64862 c 0.80027,1.29741 1.56588,2.61625 2.30427,3.95176 m 1.26704,-0.64171 c -0.73732,-1.33388 -1.50291,-2.65327 -2.30397,-3.95356 m 1.23987,-0.63886 c 0.80486,1.30775 1.57319,2.63249 2.31208,3.96968 m -1.13932,-4.66965 c 0.83981,1.36295 1.63907,2.74199 2.40558,4.13218 m 1.16292,-0.674 c -0.7421,-1.34402 -1.51596,-2.67951 -2.32843,-4.00217"/>
</g>`;

const MonsterMaroonSilverMetalGradient = `<linearGradient id="silverMetalGradient">
    <stop style="stop-color:#f2f2f2;stop-opacity:1;" offset="0" id="stop7283"/>
    <stop style="stop-color:#aeaeae;stop-opacity:1;" offset="0.25261438" id="stop7415"/>
    <stop style="stop-color:#929292;stop-opacity:1;" offset="0.37630719" id="stop7421"/>
    <stop style="stop-color:#4d4d4d;stop-opacity:1;" offset="0.5" id="stop7417"/>
    <stop style="stop-color:#aeaeae;stop-opacity:1;" offset="0.75" id="stop7419"/>
    <stop style="stop-color:#f1f1f1;stop-opacity:1;" offset="1" id="stop7285"/>
</linearGradient>`;

const MonsterMaroonCommanderGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankCommanderGradient" x1="139.85434" y1="285.12982" x2="170.35454" y2="312.58743" gradientUnits="userSpaceOnUse"/>`;

const MonsterMaroonCommanderBorderGradient = `
<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankCommanderGradientBorder" x1="18.235147" y1="237.86584" x2="66.005089" y2="320.23874" gradientUnits="userSpaceOnUse"/>`;

const MonsterMaroonCommanderBorder = `<g>
    <path id="path5642" style="fill:url(#rankCommanderGradientBorder);fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-dasharray:none" d="m 26.521652,252.07503 9.733017,52.95326 10.683087,-11.57101 14.099425,7.01589 -9.715223,-52.85646 -10.700874,11.47421 z m -9.472945,-10.15802 13.962798,75.96416 17.349727,-16.67935 21.372669,9.56202 -13.962519,-75.9642 -16.520395,16.83715 z"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-dasharray:none" d="m 29.145018,266.31094 24.769456,-4.55272 1.937086,10.53887 -24.769456,4.55273 z" id="path50307"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-dasharray:none" d="m 31.628372,279.85855 24.782512,-4.55512 1.992866,10.84234 -24.782512,4.55513 z" id="path50309"/>
    <path id="path50311" style="fill:none;stroke:#000000;stroke-width:0.580727px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 53.507183,275.89438 1.978268,10.76293 m -5.72346,-9.93698 1.929347,10.49677 m -3.773222,0.67346 -1.922208,-10.45793 m -3.769653,0.69288 1.922208,10.45793 m -5.727239,-9.95754 1.992966,10.84289 m -3.804769,0.50183 -1.922733,-10.46079"/>
    <path id="path50313" style="fill:none;stroke:#000000;stroke-width:0.580727px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 50.98763,262.18655 1.978269,10.76293 m -5.72346,-9.93697 1.929347,10.49676 m -3.773222,0.67346 -1.922209,-10.45793 m -3.769652,0.69288 1.922208,10.45793 m -5.727239,-9.95753 1.992965,10.84289 m -3.804768,0.50182 -1.922734,-10.46079"/>
</g>`;

const MonsterMaroonBorderStrap = `<g>
    <path id="path50181" style="fill:#d30000;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:0.999998;stroke-miterlimit:9;stroke-dasharray:none;stroke-opacity:1" d="M 39.600108,79.3 C 7.7983389,121.99929 -5.6658354,175.61629 2.1900272,228.27431 L 3.4712747,235.5243 30.727079,382.53767 93.85,370.51036 Z"/>
    <path id="path4141" style="color:#000000;fill:#d9a14b;-inkscape-stroke:none" d="M 38.376953 81.03125 C 37.965683 81.595848 37.574845 82.171951 37.169922 82.740234 L 90.925781 371.06641 L 92.400391 370.78516 L 38.376953 81.03125 z M 0.0546875 200.92578 C 0.091440618 204.32306 0.22074359 207.72374 0.43164062 211.12695 L 32.332031 382.23047 L 33.804688 381.95117 L 0.0546875 200.92578 z "/>
    <path id="path2330" style="color:#000000;fill:#000000;fill-rule:evenodd;stroke-miterlimit:9;-inkscape-stroke:none" d="M 39.599609 79.300781 C 7.7978721 122.00003 -5.6664016 175.61547 2.1894531 228.27344 L 3.4707031 235.52344 L 30.726562 382.53711 L 93.849609 370.50977 L 39.599609 79.300781 z M 38.798828 83.185547 L 92.101562 369.31641 L 31.925781 380.7832 L 4.9472656 235.25781 L 3.6738281 228.05273 L 3.671875 228.03906 C -3.942893 176.9727 8.771647 125.07127 38.798828 83.185547 z "/>
</g>`;

const MonsterMaroonCaptain = `<g>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.616;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 156.56928,288.65387 -8.1109,4.99756 c 0.73539,1.10271 1.45118,2.21378 2.14821,3.33221 l 8.19949,-4.76771 c -0.72424,-1.19256 -1.46955,-2.38024 -2.2368,-3.56206 z" id="path55003"/>
    <path id="path55005" style="fill:none;stroke:#000000;stroke-width:0.213;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 149.39877,293.02458 c 0.75541,1.13551 1.49006,2.27945 2.20488,3.43075 m -0.93275,-4.15497 c 0.74118,1.11967 1.46227,2.24696 2.16412,3.38089 m 1.24895,-0.73489 c -0.7035,-1.14093 -1.42644,-2.27563 -2.16967,-3.40315 m 1.23447,-0.76042 c 0.74805,1.13945 1.47545,2.28572 2.18306,3.43786 m -0.99502,-4.25905 c 0.78131,1.19353 1.54002,2.39398 2.27712,3.60032 m 1.19908,-0.78362 c -0.71585,-1.17478 -1.45218,-2.34445 -2.20986,-3.50806"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.616;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 159.29586,293.0285 -8.21761,4.71773 c 0.68556,1.1168 1.35281,2.24084 2.00261,3.37112 l 8.28844,-4.50771 c -0.67117,-1.19793 -1.36203,-2.39195 -2.07344,-3.58114 z" id="path55007"/>
    <path id="path55009" style="fill:none;stroke:#000000;stroke-width:0.213;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 152.03322,297.15199 c 0.70373,1.14913 1.3881,2.30551 2.05398,3.46811 m -0.7671,-4.1491 c 0.6899,1.13191 1.36103,2.27033 2.01424,3.41433 m 1.26295,-0.69529 c -0.65413,-1.14999 -1.3264,-2.29479 -2.01764,-3.43347 m 1.2507,-0.71786 c 0.69514,1.14961 1.37098,2.305 2.02834,3.4652 m -0.8213,-4.24439 c 0.72546,1.20305 1.42981,2.41191 2.11394,3.62556 m 1.21503,-0.74458 c -0.66385,-1.18091 -1.34685,-2.35768 -2.04982,-3.52941"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:0.616;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 161.82321,297.42578 -8.3026,4.4621 c 0.63922,1.12828 1.26139,2.26268 1.86736,3.40221 l 8.35641,-4.27075 c -0.62172,-1.20107 -1.26183,-2.39923 -1.92117,-3.59356 z" id="path55011"/>
    <path id="path55013" style="fill:none;stroke:#000000;stroke-width:0.213;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 154.4874,301.3235 c 0.65568,1.16012 1.29332,2.32634 1.91378,3.49764 m -0.61535,-4.13916 c 0.64217,1.14163 1.26685,2.28871 1.87485,3.44029 m 1.27373,-0.65918 c -0.60823,-1.15662 -1.23336,-2.3091 -1.87618,-3.45653 m 1.26363,-0.67896 c 0.64585,1.15739 1.27368,2.31952 1.8843,3.48544 m -0.66177,-4.22618 c 0.67344,1.21014 1.32713,2.42502 1.96198,3.6436 m 1.22764,-0.70894 c -0.61542,-1.18477 -1.2487,-2.3664 -1.90068,-3.54399"/>
    <path id="path55015" style="fill:url(#rankCaptainGradientA);fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.616;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 156.43079,288.63828 c -2.15027,-0.38728 -4.30919,-0.72233 -6.47329,-1.0006 -0.45657,2.00694 -0.96447,3.9833 -1.51923,5.93117 2.55388,3.82446 4.87264,7.75149 6.99192,11.73945 2.02992,0.58896 4.04638,1.22222 6.04596,1.89485 0.76935,-2.00665 1.50144,-4.04017 2.19095,-6.10264 -2.17394,-4.2009 -4.57397,-8.36814 -7.23631,-12.46223 z m 1.10226,-2.78581 c -3.30769,-0.62716 -6.63672,-1.13014 -9.97456,-1.49229 -0.58337,3.12041 -1.2963,6.16587 -2.12231,9.144 3.21027,4.63885 6.06108,9.45596 8.62081,14.37009 3.05687,0.84346 6.08432,1.78545 9.0707,2.80965 1.24417,-2.97042 2.41299,-5.99909 3.48874,-9.09284 -2.65083,-5.3046 -5.65526,-10.57578 -9.08338,-15.73861 z"/>
    <path id="path55017" style="fill:url(#rankCaptainGradientB);fill-opacity:1;stroke:#000000;stroke-width:0.616;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 143.5549,279.35199 c 2.28131,2.70339 4.41075,5.47028 6.4026,8.28569 -3.0068,-1.39381 -6.06234,-2.65958 -9.15654,-3.77506 1.0706,-0.6006 2.14071,-1.19466 3.21026,-1.78223 -0.13885,-0.90502 -0.29077,-1.81444 -0.45632,-2.7284 1.02588,0.24578 2.04941,0.50667 3.07022,0.78203 0.86785,-0.85978 1.73003,-1.72173 2.58654,-2.58588 0.41641,3.43313 0.65674,6.79385 0.74584,10.08954"/>
    <path id="path55019" style="fill:none;stroke:#000000;stroke-width:0.213;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1;fill-opacity:1" d="m 149.76952,284.4767 c -0.39993,0.41801 -0.80143,0.83519 -1.20451,1.25154 -0.53084,0.19589 -1.0617,0.39377 -1.59255,0.59368 m 2.6509,-4.04023 c -0.69672,0.70048 -1.3976,1.39908 -2.10263,2.0958 -0.87584,0.34843 -1.75166,0.70228 -2.62739,1.06158 m 4.59893,-5.15452 c -0.93378,0.96572 -1.87529,1.92783 -2.82453,2.88639 -1.13016,0.52916 -2.26061,1.06641 -3.39123,1.61182 m 6.00464,-6.29068 c -1.20533,1.12572 -2.41988,2.24914 -3.64369,3.37036 -1.3843,0.74579 -2.76965,1.50235 -4.15594,2.26977"/>
    <path id="path55021" style="fill:url(#rankCaptainGradientC);fill-opacity:1;stroke:#000000;stroke-width:0.616;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 165.45905,315.97642 c -1.22736,-2.91227 -2.54003,-5.81886 -3.9498,-8.70552 -0.28434,3.05921 -0.6596,6.07437 -1.10515,9.04834 0.997,-0.60652 1.98963,-1.21359 2.9779,-1.82122 0.69678,0.48788 1.3892,0.98081 2.07705,1.4784 0.26168,-0.91157 0.51706,-1.82786 0.76557,-2.74899 1.11937,-0.33307 2.23511,-0.66212 3.34721,-0.98719 -2.62829,-1.72741 -5.31913,-3.39062 -8.06258,-4.96934"/>
    <path id="path55023" style="fill:none;stroke:#000000;stroke-width:0.213;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 164.05938,308.77977 c -0.54611,0.13592 -1.09295,0.27309 -1.64052,0.41153 -0.4225,0.34028 -0.84619,0.68 -1.27104,1.01916 m 4.68021,-0.35124 c -0.92039,0.25407 -1.84302,0.51131 -2.76788,0.77175 -0.71264,0.55046 -1.42836,1.09958 -2.14716,1.64736 m 6.51084,-1.46306 c -1.24631,0.33561 -2.4969,0.6769 -3.7517,1.02396 -0.97977,0.67676 -1.96452,1.35207 -2.9542,2.02594 m 8.08189,-2.13893 c -1.49738,0.49097 -3.00145,0.98844 -4.51217,1.49251 -1.27195,0.79018 -2.55124,1.57936 -3.83786,2.36756"/>
</g>`;

const MonsterMaroonCaptainGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankCaptainGradientA" x1="145.13077" y1="291.19705" x2="167.22246" y2="304.50018" gradientUnits="userSpaceOnUse"/>
<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankCaptainGradientB" x1="140.11299" y1="284.83569" x2="150.927" y2="281.18274" gradientUnits="userSpaceOnUse"/>
<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankCaptainGradientC" x1="159.52319" y1="313.34897" x2="169.51608" y2="309.42203" gradientUnits="userSpaceOnUse"/>`;

const MonsterMaroonCaptainBorder = `<g>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.0141;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 26.328416,257.10592 25.759285,-4.83682 2.057961,10.96003 -25.759286,4.83681 z" id="path54049"/>
    <path id="path54051" style="fill:none;stroke:#000000;stroke-width:0.604365px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 49.04346,252.72655 2.101711,11.19303 m -5.996018,-10.31853 2.049737,10.91624 m -3.924086,0.71592 -2.042154,-10.87585 m -3.920295,0.73611 2.042155,10.87585 m -6.000035,-10.33991 2.117327,11.2762 m -3.957602,0.53742 -2.042712,-10.87882"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.0141;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 28.854442,270.55871 25.759286,-4.83681 2.05796,10.96002 -25.759284,4.83681 z" id="path54053"/>
    <path id="path54055" style="fill:none;stroke:#000000;stroke-width:0.604365px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 51.569485,266.17933 2.101713,11.19304 m -5.99602,-10.31852 2.049739,10.91623 M 45.80083,278.686 43.758676,267.81015 m -3.920294,0.73611 2.042154,10.87585 m -6.000035,-10.3399 2.117327,11.27619 m -3.957601,0.53743 -2.042713,-10.87883"/>
    <path style="fill:#d9a14b;fill-opacity:1;stroke:#000000;stroke-width:1.0141;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 31.380468,284.01149 25.759285,-4.83681 2.057961,10.96003 -25.759285,4.83682 z" id="path54057"/>
    <path id="path54059" style="fill:none;stroke:#000000;stroke-width:0.604365px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 54.095512,279.63212 2.101712,11.19303 m -5.99602,-10.31852 2.049738,10.91624 m -3.924086,0.71591 -2.042154,-10.87584 m -3.920294,0.73611 2.042153,10.87585 m -6.000034,-10.33991 2.117327,11.2762 m -3.957602,0.53742 -2.042711,-10.87882"/>
    <path id="path54061" style="fill:url(#rankCaptainGradientBorderA);fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1.0141;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 26.581419,256.82806 10.900219,-13.72752 14.486489,8.96066 7.170654,38.18856 -10.045572,14.6902 -15.341137,-9.92334 z m -7.581989,-3.29357 16.485832,-21.06599 22.136693,13.81385 8.922574,47.51872 -15.414203,21.98792 -23.208321,-14.73579 z"/>
    <path id="path54063" style="fill:url(#rankCaptainGradientBorderB);fill-opacity:1;stroke:#000000;stroke-width:1.0141;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 32.388845,215.97798 5.092793,27.12256 m 0,0 9.080091,-24.61729 -9.302687,3.09454 -4.870197,-5.59981 -3.809019,7.2295 -10.008577,0.53153 z"/>
    <path id="path54065" style="fill:none;stroke:#000000;stroke-width:0.483491;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 31.57326,236.83622 4.77571,0.0563 4.171042,-1.89507 m -13.076236,-2.38923 8.14644,-0.17953 6.970943,-3.05616 M 23.64527,228.874 l 11.07129,-0.25221 9.411392,-3.5938 m -23.748888,0.40895 13.530838,-1.11114 12.034081,-4.00686"/>
    <path id="path54067" style="fill:url(#rankCaptainGradientBorderC);fill-opacity:1;stroke:#000000;stroke-width:1.0141;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="M 54.225684,332.27386 49.13289,305.1513 m 0,0 17.391531,19.64673 -9.791594,0.49078 -2.507143,6.98505 -6.172074,-5.35536 -9.519668,3.13529 z"/>
    <path id="path54069" style="fill:none;stroke:#000000;stroke-width:0.483491;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 45.856119,312.90206 4.429997,-1.78485 4.574373,0.25293 m -11.318876,6.9699 7.656682,-2.78782 7.604747,0.31928 m -17.446622,7.3263 10.408679,-3.78106 10.074003,-0.065 m -22.279619,8.2338 13.012274,-3.87285 12.667882,-0.63143"/>
</g>`;

const MonsterMaroonCaptainBorderGradient = `<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankCaptainGradientBorderA" x1="17.16724" y1="244.9485" x2="67.598877" y2="303.32516" gradientUnits="userSpaceOnUse"/>
<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankCaptainGradientBorderB" x1="17.425951" y1="229.55769" x2="47.402425" y2="229.55769" gradientUnits="userSpaceOnUse"/>
<linearGradient xlink:href="#silverMetalGradient" xmlns:xlink="http://www.w3.org/1999/xlink" id="rankCaptainGradientBorderC" x1="37.628781" y1="318.67825" x2="67.603143" y2="318.67825" gradientUnits="userSpaceOnUse"/>`;

class RankIndicatorCatalog {

    private static _instance: RankIndicatorCatalog;

    private monsterMaroonSwatches = [
        new Swatch(Rank.None, "None", (token) => RankIndicatorCatalog.decorateSwatch("", Rank.None, token), "Rank.none.name"),
        new Swatch(Rank.Ensign, "Ensign", (token) => RankIndicatorCatalog.decorateSwatch(MonsterMaroonEnsignBorder, Rank.Ensign, token, MonsterMaroonEnsignBorderGradient), "Rank.ensign.name"),
        new Swatch(Rank.LieutenantJG, "Lieutenant J.G.", (token) => RankIndicatorCatalog.decorateSwatch(MonsterMaroonLieutenantJGBorder, Rank.LieutenantJG, token, MonsterMaroonLieutenantJGBorderGradient), "Rank.lieutenantJG.name"),
        new Swatch(Rank.Lieutenant, "Lieutenant", (token) => RankIndicatorCatalog.decorateSwatch(MonsterMaroonLieutenantBorder, Rank.Lieutenant, token, MonsterMaroonLieutenantBorderGradient), "Rank.lieutenant.name"),
        new Swatch(Rank.LtCommander, "Lt. Commander", (token) => RankIndicatorCatalog.decorateSwatch(MonsterMaroonLtCommanderBorder, Rank.LtCommander, token, MonsterMaroonLtCommanderBorderGradient), "Rank.ltCommander.name"),
        new Swatch(Rank.Commander, "Commander", (token) => RankIndicatorCatalog.decorateSwatch(MonsterMaroonCommanderBorder, Rank.Commander, token, MonsterMaroonCommanderBorderGradient), "Rank.commander.name"),
        new Swatch(Rank.Captain, "Captain", (token) => RankIndicatorCatalog.decorateSwatch(MonsterMaroonCaptainBorder, Rank.Captain, token, MonsterMaroonCaptainBorderGradient), "Rank.captain.name")
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
        } else if (token.uniformEra === UniformEra.MonsterMaroon) {
            if (token.variant === UniformVariantType.Base) {
                switch (token.rankIndicator) {
                    case Rank.Ensign:
                        return MonsterMaroonEnsign;
                    case Rank.LieutenantJG:
                        return MonsterMaroonLieutenantJG;
                    case Rank.Lieutenant:
                        return MonsterMaroonLieutenant;
                    case Rank.LtCommander:
                        return MonsterMaroonLtCommander;
                    case Rank.Commander:
                        return MonsterMaroonCommander;
                    case Rank.Captain:
                        return MonsterMaroonCaptain;
                    default:
                        return "";
                }
            } else {
                return "";
            }
        } else {
            return this.getUniformPack(token.uniformEra).getRankIndicator(token);
        }
    }

    getBorderRankDefinitions(token: Token, bordered: boolean) {
        if (token.uniformEra === UniformEra.MonsterMaroon) {
            if (token.rankIndicator === Rank.Ensign) {
                return MonsterMaroonSilverMetalGradient +
                    MonsterMaroonEnsignGradient +
                    (bordered ? MonsterMaroonEnsignBorderGradient : "");
            } else if (token.rankIndicator === Rank.LieutenantJG) {
                return MonsterMaroonSilverMetalGradient +
                    MonsterMaroonLieutenantJGGradient +
                    (bordered ? MonsterMaroonLieutenantJGBorderGradient : "");
            } else if (token.rankIndicator === Rank.Lieutenant) {
                return MonsterMaroonSilverMetalGradient +
                    MonsterMaroonLieutenantGradient +
                    (bordered ? MonsterMaroonLieutenantBorderGradient : "");
            } else if (token.rankIndicator === Rank.LtCommander) {
                return MonsterMaroonSilverMetalGradient +
                    MonsterMaroonLtCommanderGradient +
                    (bordered ? MonsterMaroonLtCommanderBorderGradient : "");
            } else if (token.rankIndicator === Rank.Commander) {
                return MonsterMaroonSilverMetalGradient +
                    MonsterMaroonCommanderGradient +
                    (bordered ? MonsterMaroonCommanderBorderGradient : "");
            } else if (token.rankIndicator === Rank.Captain) {
                return MonsterMaroonSilverMetalGradient +
                    MonsterMaroonCaptainGradient +
                    (bordered ? MonsterMaroonCaptainBorderGradient : "");
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    getBorderRankIndicator(token: Token) {
        if (token.uniformEra === UniformEra.OriginalSeries) {
            return this.getUniformPack(token.uniformEra).getRankBorderIndicator(token);
        } else if (token.uniformEra === UniformEra.MonsterMaroon) {
            let strap = MonsterMaroonBorderStrap.replace(DefaultRed, token.divisionColor);
            let rank = "";
            switch (token.rankIndicator) {
                case Rank.Ensign:
                    rank = MonsterMaroonEnsignBorder;
                    break;
                case Rank.LieutenantJG:
                    rank = MonsterMaroonLieutenantJGBorder;
                    break;
                case Rank.Lieutenant:
                    rank = MonsterMaroonLieutenantBorder;
                    break;
                case Rank.LtCommander:
                    rank = MonsterMaroonLtCommanderBorder;
                    break;
                case Rank.Commander:
                    rank = MonsterMaroonCommanderBorder;
                    break;
                case Rank.Captain:
                    rank = MonsterMaroonCaptainBorder;
                    break;
                case Rank.None:
                default:
                    strap = "";
                    rank = "";
            }
            return strap + rank;
        } else {
            return this.getUniformPack(token.uniformEra).getRankBorderIndicator(token);
        }
    }

    getUniformPack(era: UniformEra) {
        if (era === UniformEra.MonsterMaroon) {
            return new MonsterMaroonUniformPack();
        } else if (era === UniformEra.Enterprise) {
            return new EnterpriseUniformPack();
        } else if (era === UniformEra.Klingon) {
            return new KlingonArmorUniformPack();
        } else if (era === UniformEra.OriginalSeriesKlingon) {
            return new TosKlingonUniformPack();
        } else if (era === UniformEra.OriginalSeries) {
            return new TosUniformPack();
        } else if (era === UniformEra.DominionWar) {
            return new DominionWarUniformPack();
        } else {
            return null;
        }
    }

    getSwatches(token: Token) {
        if (token.uniformEra === UniformEra.MonsterMaroon) {
            return this.monsterMaroonSwatches;
        } else {
            return this.getUniformPack(token.uniformEra).getRankSwatches();
        }
    }

    static decorateSwatch(svg: string, rankIndicator: Rank, token: Token, gradient: string = "") {
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
            </svg>`;
        } else if (token.uniformEra === UniformEra.MonsterMaroon) {
            let gradientKey = 'rank' + Rank[rankIndicator] + "Gradient";
            return `<svg viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>`
                + MonsterMaroonSilverMetalGradient.replace(new RegExp("silverMetalGradient", 'g'), "silverMetalGradient" + rankIndicator)
                + gradient.replace(new RegExp(gradientKey, 'g'), gradientKey + "Swatch" + rankIndicator).replace(new RegExp("silverMetalGradient", 'g'), "silverMetalGradient" + rankIndicator)
            + `</defs>
            <g transform="translate(22, -211)">`
            + svg.replace(new RegExp(gradientKey, 'g'), gradientKey + "Swatch" + rankIndicator)
            + `</g>
            </svg>`;
        } else if (token.uniformEra === UniformEra.Enterprise) {
            return `<svg viewBox="0 0 175 175" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g transform="translate(5, -260)">`
                    + svg
                    + `</g>
                </svg>`;
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