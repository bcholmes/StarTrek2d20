import { NasoLabialFoldType } from "./nasoLabialFoldTypeEnum";
import SpeciesRestrictions from "./speciesRestrictions";
import Swatch from "./swatch";
import { Token } from "./token";

const NimoyNasoLabial = `<g>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 297.11864,165.9322 c 0,0 -11.65326,14.36827 -15.08474,21.52543 -3.43148,7.15716 -3.72181,7.3278 -3.38983,10.33898 0.33198,3.01118 3.72881,6.27119 3.72881,6.27119 0,0 -1.55137,-4.21703 -1.56479,-6.46977 -0.0134,-2.25274 0.59107,-4.9969 3.66038,-11.1694 3.06931,-6.1725 12.65017,-20.49643 12.65017,-20.49643 z" id="path19851"/>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 328.44511,170.30487 c 0,0 4.81723,11.46505 6.23213,16.83873 1.4149,5.37368 0.83894,8.80887 0.83894,8.80887 0,0 0.86326,-2.37302 1.07863,-3.83515 0.21537,-1.46213 0.28107,-2.52407 -0.47939,-5.63288 -0.76046,-3.10882 -7.67031,-16.17957 -7.67031,-16.17957 z" id="path20503"/>
    <path style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 328.27562,169.7964 c 0,0 4.98672,11.97352 6.40162,17.3472 1.4149,5.37368 0.83894,8.80887 0.83894,8.80887 0,0 0.65352,-2.49286 0.56927,-4.04488 -0.0842,-1.55202 -0.0485,-2.01472 -0.92882,-5.18346 -0.88031,-3.16874 -6.88101,-16.92773 -6.88101,-16.92773 z" id="path20505"/>
    <path style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 288.88831,176.79212 c -1.87252,2.73583 -5.62437,8.15852 -6.89678,10.66551 -3.1206,6.14837 -3.80655,7.92102 -3.34746,10.33898 0.45909,2.41796 2.54237,5.00001 2.54237,5.00001 0,0 -1.17326,-2.56213 -1.44369,-5.33899 -0.27044,-2.77687 5.81968,-15.03533 9.14556,-20.66551 z" id="path20507"/>
</g>`;

const MeaneyNasoLabial = `<g>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 297.98666,168.53275 c 0,0 -0.19422,0.90574 -3.27174,3.9685 -3.07752,3.06276 -13.95713,7.63481 -17.04668,11.40557 -3.08955,3.77076 -2.53433,6.07083 -2.71186,8.19729 -0.17753,2.12646 0.29786,4.84504 0.29786,4.84504 0,0 0.37721,-3.86351 0.55812,-5.92368 0.1809,-2.06017 0.75154,-3.69058 2.79234,-6.56053 2.0408,-2.86995 15.10573,-8.83662 17.50551,-12.40196 2.39978,-3.56534 1.87645,-3.53023 1.87645,-3.53023 z" id="path25683"/>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 328.38984,174.57627 c 0,0 3.21052,2.50615 4.8305,4.83051 1.61998,2.32436 4.49153,10.76272 4.49153,10.76272 0,0 -0.71305,-5.20411 -1.35594,-7.03391 -0.64289,-1.8298 -1.11703,-3.19086 -2.37288,-4.57627 -1.25585,-1.38541 -5.59321,-3.98305 -5.59321,-3.98305 z" id="path25685"/>
</g>`;

const LewisNasoLabial = `<g>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 297.11864,165.9322 c 0,0 -12.07699,15.63946 -15.08474,21.52543 -3.00775,5.88597 -2.11164,8.55661 -1.10169,11.48304 1.00994,2.92644 6.77114,12.96486 6.77114,12.96486 0,0 -3.91576,-10.10561 -4.35289,-14.13801 -0.43713,-4.0324 -0.21401,-6.35283 1.58411,-10.99991 1.79813,-4.64708 12.18407,-20.83541 12.18407,-20.83541 z" id="path19851"/>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 328.55002,172.2982 c 0,0 4.71232,9.47172 6.12722,14.8454 1.4149,5.37368 0.83894,8.80887 0.83894,8.80887 0,0 0.96817,-2.32056 1.18354,-3.78269 0.21537,-1.46213 0.33353,-2.89127 -0.42693,-6.00008 -0.76046,-3.10882 -7.72277,-13.8715 -7.72277,-13.8715 z" id="path20503"/>
    <path style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 328.27562,171.73727 c 0,0 4.98672,10.03265 6.40162,15.40633 1.4149,5.37368 0.83894,8.80887 0.83894,8.80887 0,0 0.65352,-2.49286 0.56927,-4.04488 -0.0842,-1.55202 -0.0485,-2.01472 -0.92882,-5.18346 -0.88031,-3.16874 -6.88101,-14.98686 -6.88101,-14.98686 z" id="path20505"/>
    <path style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 294.31204,169.58873 c -1.00599,1.46979 -4.96383,6.4573 -7.51069,10.28456 -2.1938,3.2967 -4.221,6.4242 -4.80982,7.58434 -3.12058,6.14838 -2.28113,7.49729 -1.82204,9.91525 0.45909,2.41796 7.46968,14.65853 7.46968,14.65853 0,0 -5.73592,-11.69886 -6.07138,-16.27295 -0.18611,-2.53768 1.21721,-6.56722 4.27482,-12.24083 2.77713,-5.15315 6.88643,-11.24913 8.46943,-13.9289 z" id="path20507"/>
</g>`;

const SubtleNasoLabial = `<g>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 297.82379,165.81055 c 0,0 -9.28417,9.86957 -11.68524,13.60281 -2.40107,3.73324 -2.51681,7.25084 -2.51681,7.25084 0,0 3.92568,-6.67508 6.41189,-10.30697 2.48621,-3.63189 7.79016,-10.54668 7.79016,-10.54668 z" id="path33734"/>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 327.36647,171.74306 c 0,0 3.16486,5.41198 4.01493,7.37068 0.85007,1.9587 2.15728,5.75274 2.15728,5.75274 0,0 0.85043,-2.66246 -10e-6,-4.67409 -0.85044,-2.01163 -6.1722,-8.44933 -6.1722,-8.44933 z" id="path33736"/>
</g>`

const CherubicNasoLabial = `<g>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 278.59873,180.95541 c 0,0 3.0991,-0.21357 4.3949,-0.38216 1.2958,-0.16859 2.78549,-0.28559 4.01274,-0.63694 1.22725,-0.35135 2.36357,-0.82127 3.3121,-1.40128 0.94853,-0.58001 1.65584,-1.27982 2.35669,-1.97452 0.70085,-0.6947 1.06392,-1.18408 1.84713,-2.16561 0.78321,-0.98153 2.80255,-3.75796 2.80255,-3.75796 0,0 -1.02571,2.48542 -1.78344,3.82166 -0.75773,1.33624 -1.51461,2.5027 -2.67516,3.56688 -1.16055,1.06418 -2.20023,1.84159 -3.75796,2.35668 -1.55773,0.51509 -3.92579,0.94623 -5.5414,0.95542 -1.61561,0.009 -4.96815,-0.38217 -4.96815,-0.38217 z" id="path2"/>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 326.65059,172.91448 c 0,0 1.17909,2.39274 2.07553,3.51864 0.89644,1.1259 2.20396,2.67134 3.2484,3.43949 1.04444,0.76815 1.83326,1.05764 2.73886,1.33758 0.9056,0.27994 2.70154,0.29208 2.70154,0.29208 0,0 -1.75301,-0.42253 -2.63785,-0.80164 -0.88484,-0.37911 -1.54458,-0.64755 -2.5587,-1.40127 -1.01412,-0.75372 -2.25624,-2.27018 -3.16605,-3.29345 -0.90981,-1.02327 -2.40173,-3.09143 -2.40173,-3.09143 z" id="path3"/>
    <path style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 297.19745,170.76433 c 0,0 -1.52838,2.27924 -2.42038,3.3758 -0.89201,1.09656 -1.95655,2.34342 -2.92994,3.18471 -0.97339,0.84129 -2.80254,1.91083 -2.80254,1.91083 0,0 1.97643,-0.89045 2.99363,-1.71975 1.0172,-0.8293 2.07087,-2.18126 2.92994,-3.3121 0.85906,-1.13084 2.22929,-3.43949 2.22929,-3.43949 z" id="path4"/>
    <path style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 326.66532,172.85833 c 0,0 0.70882,1.34664 1.171,2.07178 0.46218,0.72514 1.48628,2.20689 1.48628,2.20689 0,0 -1.16632,-1.42554 -1.62139,-2.16185 -0.45507,-0.73631 -1.03589,-2.11682 -1.03589,-2.11682 z" id="path5"/>
</g>`;

class NasoLabialFoldCatalog {

    private static _instance: NasoLabialFoldCatalog;

    swatches = [
        new Swatch(NasoLabialFoldType.None, "None", NasoLabialFoldCatalog.decorateSwatch(""), "NasoLabialFoldType.none"),
        new Swatch(NasoLabialFoldType.Subtle, "Subtle", NasoLabialFoldCatalog.decorateSwatch(SubtleNasoLabial), "NasoLabialFoldType.subtle"),
        new Swatch(NasoLabialFoldType.Meaney, "Subtle, Wide", NasoLabialFoldCatalog.decorateSwatch(MeaneyNasoLabial), "NasoLabialFoldType.meaney"),
        new Swatch(NasoLabialFoldType.Cherubic, "Cherubic", NasoLabialFoldCatalog.decorateSwatch(CherubicNasoLabial), "NasoLabialFoldType.cherubic"),
        new Swatch(NasoLabialFoldType.Nimoy, "Haughty", NasoLabialFoldCatalog.decorateSwatch(NimoyNasoLabial), "NasoLabialFoldType.nimoy"),
        new Swatch(NasoLabialFoldType.Lewis, "Pronounced", NasoLabialFoldCatalog.decorateSwatch(LewisNasoLabial), "NasoLabialFoldType.lewis"),
    ];

    public static get instance() {
        if (NasoLabialFoldCatalog._instance == null) {
            NasoLabialFoldCatalog._instance = new NasoLabialFoldCatalog();
        }
        return NasoLabialFoldCatalog._instance;
    }

    getNasoLabialFold(token: Token) {
        if (SpeciesRestrictions.isRubberHeaded(token.species)) {
            return "";
        } else if (token.nasoLabialFold === NasoLabialFoldType.Nimoy) {
            return NimoyNasoLabial;
        } else if (token.nasoLabialFold === NasoLabialFoldType.Subtle) {
            return SubtleNasoLabial;
        } else if (token.nasoLabialFold === NasoLabialFoldType.Cherubic) {
            return CherubicNasoLabial;
        } else if (token.nasoLabialFold === NasoLabialFoldType.Meaney) {
            return MeaneyNasoLabial;
        } else if (token.nasoLabialFold === NasoLabialFoldType.Lewis) {
            return LewisNasoLabial;
        } else {
            return "";
        }
    }

    private static decorateSwatch(svg: string) {
        let result = `<svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g transform="translate(-255, -140)">`
            + svg
            + `</g>
            </svg>`;
        return result;
    }
}

export default NasoLabialFoldCatalog;