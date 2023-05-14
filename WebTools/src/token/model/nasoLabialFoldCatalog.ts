import { NasoLabialFoldType } from "./nasoLabialFoldTypeEnum";
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
    <path style="fill:#000000;fill-opacity:0.1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 282.83773,180.45032 c 0,0 -5.25728,11.66101 -5.81838,15.32444 -0.56109,3.66344 1.05149,7.03749 2.14949,9.74151 1.098,2.70401 9.52413,11.62294 7.14097,13.10754 -2.38316,1.48461 -7.89903,-6.91275 -9.93934,-10.07799 -2.04032,-3.16523 -2.43291,-9.55521 -1.11624,-14.05429 1.31667,-4.49908 7.5835,-14.04121 7.5835,-14.04121 z" id="path28517"/>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 330.33898,186.27119 c 0,0 1.71789,5.19562 2.05447,8.45401 0.33658,3.25839 0.94151,6.32656 0.40919,9.59932 -0.53232,3.27276 -1.6162,5.3365 -1.6162,5.3365 0,0 0.33771,-4.94097 0.33898,-7.45763 10e-4,-2.51666 -0.14456,-4.97042 -0.33898,-7.62712 -0.19442,-2.6567 -0.84746,-8.30508 -0.84746,-8.30508 z" id="path28882"/>
</g>`;

const SubtleNasoLabial = `<g>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 297.82379,165.81055 c 0,0 -9.28417,9.86957 -11.68524,13.60281 -2.40107,3.73324 -2.51681,7.25084 -2.51681,7.25084 0,0 3.92568,-6.67508 6.41189,-10.30697 2.48621,-3.63189 7.79016,-10.54668 7.79016,-10.54668 z" id="path33734"/>
    <path style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 327.36647,171.74306 c 0,0 3.16486,5.41198 4.01493,7.37068 0.85007,1.9587 2.15728,5.75274 2.15728,5.75274 0,0 0.85043,-2.66246 -10e-6,-4.67409 -0.85044,-2.01163 -6.1722,-8.44933 -6.1722,-8.44933 z" id="path33736"/>
</g>`


class NasoLabialFoldCatalog {

    private static _instance: NasoLabialFoldCatalog;

    swatches = [
        new Swatch(NasoLabialFoldType.None, "None", NasoLabialFoldCatalog.decorateSwatch("")),
        new Swatch(NasoLabialFoldType.Subtle, "Subtle", NasoLabialFoldCatalog.decorateSwatch(SubtleNasoLabial)),
        new Swatch(NasoLabialFoldType.Meaney, "Subtle, Wide", NasoLabialFoldCatalog.decorateSwatch(MeaneyNasoLabial)),
        new Swatch(NasoLabialFoldType.Nimoy, "Haughty", NasoLabialFoldCatalog.decorateSwatch(NimoyNasoLabial)),
        new Swatch(NasoLabialFoldType.Lewis, "Pronounced", NasoLabialFoldCatalog.decorateSwatch(LewisNasoLabial)),
//        new Swatch(MouthType.Mouth3, "Medium Lip Frowning", NasoLabialFoldCatalog.decorateSwatch(MediumLip2)),
//        new Swatch(MouthType.Mouth4, "Fuller Lip", NasoLabialFoldCatalog.decorateSwatch(FullerLip)),
//        new Swatch(MouthType.Mouth5, "Fairly Full Lip", NasoLabialFoldCatalog.decorateSwatch(FullerLip2)),
//        new Swatch(MouthType.Mouth6, "Broad, Full Lip", NasoLabialFoldCatalog.decorateSwatch(FullerLip3)),
    ];

    public static get instance() {
        if (NasoLabialFoldCatalog._instance == null) {
            NasoLabialFoldCatalog._instance = new NasoLabialFoldCatalog();
        }
        return NasoLabialFoldCatalog._instance;
    }

    getNasoLabialFold(token: Token) {
        if (token.nasoLabialFold === NasoLabialFoldType.Nimoy) {
            return NimoyNasoLabial;
        } else if (token.nasoLabialFold === NasoLabialFoldType.Subtle) {
            return SubtleNasoLabial;
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