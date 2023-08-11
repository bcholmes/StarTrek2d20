import SpeciesRestrictions from "./speciesRestrictions";
import { Token } from "./token";
import { UniformEra } from "./uniformEra";
import UniformPackCollection from "./uniformPackCollection";

export const BaseMaleBodyBolianNeckRidge = `<g>
    <path style="display:inline;fill:none;stroke:#000000;stroke-width:0.8;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="m 260.11976,248.62275 23.2919,-42.7347" id="path1746"/>
    <path style="color:#000000;display:inline;fill:#000000;fill-opacity:0.2;-inkscape-stroke:none" d="m 280.56961,203.94359 -23.46249,43.15852 1.7902,0.83818 23.12351,-42.81954 z" id="path1748"/>
</g>`;

export const BaseFemaleBolianNeckRidge = `<g>
    <path id="path34966" style="color:#000000;fill:#000000;fill-opacity:0.2;-inkscape-stroke:none" d="M 273.97266 200.25391 C 273.97266 200.25391 270.25838 210.29755 266.31836 221.11523 C 262.37834 231.93292 258.2257 243.4769 257.30273 246.64258 C 255.4757 252.90912 255.44099 259.20324 256.75586 264.11328 C 257.10618 265.42148 258.11153 267.53495 259.43359 270.0625 C 260.75566 272.59005 262.39161 275.5007 263.98828 278.25977 C 266.75284 283.03698 269.03927 286.7722 269.69922 287.84766 C 268.40833 287.67373 267.24805 287.42188 267.24805 287.42188 C 267.24805 287.42188 270.30012 290.03155 271.41211 290.32031 C 272.5241 290.60907 272.20857 290.67635 273.22461 290.13867 C 274.24065 289.60099 276.48242 286.24609 276.48242 286.24609 C 276.48242 286.24609 273.9928 287.73165 272.4082 287.9668 C 272.20515 287.99693 271.96963 288.00915 271.71289 288.00977 C 271.62475 287.86668 268.69796 283.11486 265.56055 277.69336 C 263.96811 274.94161 262.33442 272.04151 261.02344 269.53516 C 259.71245 267.02879 258.72067 264.88491 258.42773 263.79102 C 257.16956 259.09263 257.19137 252.95363 258.96875 246.85742 C 259.84798 243.84174 264.02392 232.2074 267.96289 221.39258 C 271.90186 210.57776 275.61523 200.53516 275.61523 200.53516 L 273.97266 200.25391 z "/>
    <path style="color:#000000;fill:#000000;-inkscape-stroke:none" d="m 276.30859,200.91016 c 0,0 -3.80869,10.17677 -7.81836,21.17382 -2.00483,5.49853 -4.05928,11.20109 -5.71484,15.94336 -1.65556,4.74228 -2.90671,8.49876 -3.32422,10.20118 -1.61875,6.60056 -1.71563,10.19872 -0.41211,15.0664 0.34935,1.30456 1.34462,3.44195 2.6543,6.00586 1.30968,2.56391 2.92925,5.52203 4.50976,8.33008 3.16103,5.6161 6.35222,10.37283 6.35222,10.37283 l 0.2832,-0.12956 c 0,0 -2.67321,-5.0033 -5.82639,-10.60547 -1.57659,-2.80108 -3.13075,-5.87923 -4.43012,-8.42296 -1.29937,-2.54373 -2.28421,-4.71299 -2.57812,-5.81054 -1.26954,-4.74076 -1.18358,-8.03794 0.41796,-14.56836 0.38757,-1.58033 1.64396,-5.37467 3.29688,-10.10938 1.65292,-4.7347 3.707,-10.43557 5.71094,-15.93164 4.00787,-10.99213 7.81445,-21.16406 7.81445,-21.16406 z" id="path34964"/>
</g>`;

export const DefaultRed = /#d30000/g;

class UniformCatalog {

    private static _instance: UniformCatalog;

    public static get instance() {
        if (UniformCatalog._instance == null) {
            UniformCatalog._instance = new UniformCatalog();
        }
        return UniformCatalog._instance;
    }

    getBody(token: Token) {
        return this.getUniformPack(token.uniformEra).getUniformAndVariantBody(token);
    }

    getSwatches(uniformEra: UniformEra) {
        return this.getUniformPack(uniformEra).getUniformSwatches();
    }

    getUniformVariantSwatches(token: Token) {
        let uniformPack = this.getUniformPack(token.uniformEra);
        if (uniformPack != null) {
            return uniformPack.getUniformVariantSwatches(token);
        } else {
            return [];
        }
    }

    getUniformPack(era: UniformEra) {
        return UniformPackCollection.instance.getUniformPack(era);
    }

    static decorateSwatch(svg: string, clipPathId: number, token: Token) {
        let result = `<svg viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <clipPath id="clipPath` + clipPathId + `">
                        <circle cx="150" cy="150" r="150" fill="#ffffff" />
                    </clipPath>
                </defs>
                <g clip-path="url(#clipPath` + clipPathId + `">
                    <g transform="translate(-70, -130)">`
                    + svg.replace(DefaultRed, token.divisionColor).replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, token.skinColor)
                + `</g>
                </g>
            </svg>`;
        return result;
    }
}

export default UniformCatalog;