import { Species } from "../../helpers/speciesEnum";
import { HairType, allHairTypes } from "./hairTypeEnum";


class SpeciesRestrictions {

    // default in the sense that "the drawing was originally created using this skin colour"
    static DEFAULT_SKIN_COLOR = "#cd976d";
    static DEFAULT_SKIN_COLOR_REGEX = /#cd976d/g;

    static DEFAULT_HAIR_COLOR = "#383838";
    static DEFAULT_HAIR_COLOR_REGEX = /#383838/g;

    static DEFAULT_LIPSTICK_COLOR = "#a9777a";

    static getSkinColors(species: Species) {
        if (species === Species.Orion) {
            return ["#a2b152", "#8e932f", "#8f8f0b", "#838218", "#7a863a", "#6f7f36", "#6b764c", "#697543", "#5d6937", "#5a6135", "#4c4c1a", "#414b26"];
        } else if (species === Species.Bolian) {
            return ["#97c3f2", "#87acda", "#5883a6", "#5772b7", "#0665b3", "#385f8d"]; // "#597986",
        } else {
            return ["#F8E0DE", "#F4D5CA", "#CEB29C", "#CAA18B", SpeciesRestrictions.DEFAULT_SKIN_COLOR, "#AB7D5C", "#9B7A57", "#8C644A", "#704A35", "#53382D", "#473028"];
        }
    }

    static getEyeColors(species: Species) {
        if (species === Species.Betazoid) {
            return ["#111111"];
        } else {
            return ["#e1bbc3", "#8bb5db", "#4079c0", "#b4b8b9", "#8e9796", "#758a9d", "#88967d", "#6e9d4d", "#aa6925", "#863603", "#56220c", "#3f0c08", "#280000"];
        }
    }

    static getDefaultEyeColor(species: Species) {
        let colours = SpeciesRestrictions.getEyeColors(species);
        return colours[Math.floor(colours.length / 2)];
    }

    static getHairColors(species: Species) {
        return ["#fdf2dc", "#fae9b5", "#f0c882", "#f9c861", "#e9a63d", "#e38732", "#913c13", "#430c05", "#4e0300", "#811002",
            "#ba260a", "#230703", "#391201", "#722707", "#202020", "#2a2a2a", SpeciesRestrictions.DEFAULT_HAIR_COLOR, "#37261e", "#706f74", "#a78c6f",
            "#f1eae4", "#f4f3f1", "#e1ddda",

            "#d0c7e2", "#bcb8db", "#8180bc", "#6d6aaf", "#514fa3", "#352f8f", "#3d387a",
            "#f8edf3", "#f2d7e0", "#e8c2cf", "#dea9bb", "#dca7b9", "#d6a1b3", "#a67a89",
            "#c9df8a", "#77ab59", "#11823b", "#36802d", "#234d20", "#004d25", "#02231c",
        ];
    }

    static getLipstickColors(species: Species) {
        return ["#a9777a", "#8f575a", "#783d53", "#852d67", "#81152b",
            "#e1272a", "#c5232e", "#e02d40", "#9e2632", "#95242a",
            "#c77f70", "#e45e69", "#ce5c56", "#c24853", "#e92154",
            "#e595bf", "#ef4b8c", "#e856bb", "#ac4f7e", "#be2d70",
            "#c36f93", "#ca6a85", "#cd5d89", "#a63f5c", "#ad4f5d",
            "#de928f", "#ec909b", "#e2889e", "#d67788", "#c89898"];
    }

    static getHairTypes(species: Species) {
        if (species === Species.Deltan || species === Species.Bolian) {
            return [ HairType.Bald ];
        } else {
            return allHairTypes;
        }
    }
}

export default SpeciesRestrictions;
