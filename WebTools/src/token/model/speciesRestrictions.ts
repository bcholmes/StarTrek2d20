import { Species } from "../../helpers/speciesEnum";
import { ExtraType } from "./extrasTypeEnum";
import { HairType, allHairTypes, isTallForeheadHair } from "./hairTypeEnum";
import { NoseType } from "./noseTypeEnum";
import { SpeciesOption } from "./speciesOptionEnum";


class SpeciesRestrictions {

    // default in the sense that "the drawing was originally created using this skin colour"
    static DEFAULT_SKIN_COLOR = "#cd976d";
    static DEFAULT_SKIN_COLOR_REGEX = /#cd976d/g;

    static DEFAULT_HAIR_COLOR = "#383838";
    static DEFAULT_HAIR_COLOR_REGEX = /#383838/g;

    static DEFAULT_LIPSTICK_COLOR = "#a9777a";

    static DEFAULT_EYE_COLOR_REGEX = /#754324/g;

    static getSkinColors(species: Species) {
        if (species === Species.Orion) {
            return ["#a2b152", "#8e932f", "#8f8f0b", "#838218", "#7a863a", "#6f7f36", "#6b764c", "#697543", "#5d6937", "#5a6135", "#4c4c1a", "#414b26"];
        } else if (species === Species.Andorian) {
            return ["#bbb6c7", "#b0c2cc", "#a9d8f4", "#7ca9e0", "#919bd5", "#6e87bf", "#3e8fb8", "#0068a5"];
        } else if (species === Species.Bolian) {
            return ["#97c3f2", "#87acda", "#5883a6", "#5772b7", "#0665b3", "#385f8d"]; // "#597986",
        } else if (species === Species.Ferengi) {
            return ["#d18352"];
        } else if (species === Species.Saurian) {
            return ["#de898a", "#ca7882", "#b6677a", "#a77e86", "#989591", "#626163", "#7c6a61", "#603f31"];
        } else if (species === Species.Efrosian) {
//            return ["#ffd9c6", "#feb582", "#f8a271", "#ff8740", "#d7580b", "#d13703", "#b72001", "#822601"];
            return ["#ffd9c6", "#d8b092", "#e1ad88", "#d69972", "#d18352", "#b06e46", "#9e603b", "#834b2b", "#70432c"];
        } else {
            return ["#F8E0DE", "#F4D5CA", "#F2C8B8", "#E1BA93", "#dcbda1", "#CEB29C", "#CAA18B", SpeciesRestrictions.DEFAULT_SKIN_COLOR, "#AB7D5C", "#9B7A57", "#9b6b43", "#8C644A", "#704A35", "#53382D", "#473028"];
        }
    }

    static getEyeColors(species: Species) {
        if (species === Species.Betazoid || species === Species.Saurian) {
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
        if (species === Species.Andorian || species === Species.Efrosian) {
            return ["#fdf2dc", "#f8edf3", "#bbbbbb", "#dddddd" ];
        } else {

            return ["#fdf2dc", "#fae9b5", "#f0c882", "#f9c861", "#e9a63d", "#e38732", "#913c13", "#430c05", "#4e0300", "#811002",
                "#ba260a", "#230703", "#391201", "#722707", "#202020", "#2a2a2a", SpeciesRestrictions.DEFAULT_HAIR_COLOR, "#37261e", "#706f74", "#a78c6f",
                "#f1eae4", "#f4f3f1", "#e1ddda",

                "#d0c7e2", "#bcb8db", "#8180bc", "#6d6aaf", "#514fa3", "#352f8f", "#3d387a",
                "#f8edf3", "#f2d7e0", "#e8c2cf", "#dea9bb", "#dca7b9", "#d6a1b3", "#a67a89",
                "#c9df8a", "#77ab59", "#11823b", "#36802d", "#234d20", "#004d25", "#02231c",
            ];
        }
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
        if (this.isBald(species) || SpeciesRestrictions.isRubberHeaded(species)) {
            return [ HairType.Bald ];
        } else if (species === Species.Andorian) {
            // the corn rows don't look right with the Antennae
            return allHairTypes.filter(h => h !== HairType.CornRows);
        } else if (this.isTallForeheaded(species)) {
            return allHairTypes.filter(h => isTallForeheadHair(h));
        } else {
            return allHairTypes;
        }
    }

    static getDefaultHairType(species: Species) {
        if (species === Species.Efrosian) {
            return HairType.HighForeheadEfrosianStyle;
        } else {
            return this.getHairTypes(species)[0];
        }
    }

    static isFacialHairSupportedFor(species: Species) {
        return !this.isBald(species);
    }

    static isOptionsSupportedFor(species: Species) {
        return this.getSpeciesOptions(species).length > 1;
    }

    static isExtraAvailableFor(extra: ExtraType, species: Species) {
        if (extra === ExtraType.BajoranEarring) {
            return species === Species.Bajoran;
        } else if (extra === ExtraType.SimpleEarring || extra === ExtraType.HoopEarring) {
            return species !== Species.Bolian
                && !this.isRubberHeaded(species)
                && species !== Species.Ferengi; // Bolians have weird ears
        } else if (extra === ExtraType.RisanSymbol) {
            return species === Species.Risian;
        } else if (extra === ExtraType.SmallBindi || extra === ExtraType.InuitTattoo) {
            return species === Species.Human;
        } else if (extra === ExtraType.FerengiHeadFlap) {
            return species === Species.Ferengi;
        } else {
            return true;
        }
    }

    static isBald(species: Species) {
        return species === Species.Bolian || species === Species.Ferengi
            || species === Species.Deltan || species === Species.Saurian;
    }

    static isTallForeheaded(species: Species) {
        return species === Species.Klingon
            || species === Species.Tellarite || species === Species.Efrosian
            || species === Species.Ktarian;
            // species === Species.Denobulan ||
    }

    static isRubberHeaded(species: Species) {
        return species === Species.Saurian || species === Species.Caitian;
    }

    static getSpeciesOptions(species: Species) {
        if (species === Species.Bolian) {
            return [SpeciesOption.Option1, SpeciesOption.Option2];
        } else if (species === Species.Ferengi) {
            return [SpeciesOption.Option1, SpeciesOption.Option2, SpeciesOption.Option3];
        } else if (species === Species.Klingon) {
            return [SpeciesOption.Option1, SpeciesOption.Option2, SpeciesOption.Option3, SpeciesOption.Option4, SpeciesOption.Option5];
        } else if (species === Species.Romulan) {
            return [SpeciesOption.Option1, SpeciesOption.Option2];
        } else {
            return [SpeciesOption.Option1];
        }
    }

    static getNoseTypes(species: Species) {
        if (species === Species.Tellarite || species === Species.Ferengi) {
            return [ NoseType.StraightBasic ];
        } else {
            return [NoseType.StraightBasic,
                NoseType.Convex,
                NoseType.SmallBulb,
                NoseType.Broad,
                NoseType.LongNarrow,
                NoseType.HighBridge,
                NoseType.Bulbous,
                NoseType.SmallFlat,
                NoseType.SmallUpTurned,
                NoseType.Hawk];
        }
    }
}

export default SpeciesRestrictions;
