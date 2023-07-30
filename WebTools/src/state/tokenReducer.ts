import { Rank } from "../helpers/ranks";
import { Species } from "../helpers/speciesEnum";
import { BodyType } from "../token/model/bodyTypeEnum";
import { DivisionColors } from "../token/model/divisionColors";
import { EyeType } from "../token/model/eyeTypeEnum";
import { HairType } from "../token/model/hairTypeEnum";
import { HeadType } from "../token/model/headTypeEnum";
import { MouthType } from "../token/model/mouthTypeEnum";
import { NasoLabialFoldType } from "../token/model/nasoLabialFoldTypeEnum";
import { NoseType } from "../token/model/noseTypeEnum";
import { isEnlistedRank } from "../token/model/rankHelper";
import { SpeciesOption } from "../token/model/speciesOptionEnum";
import SpeciesRestrictions from "../token/model/speciesRestrictions";
import { Token } from "../token/model/token";
import { UniformEra } from "../token/model/uniformEra";
import UniformVariantRestrictions from "../token/model/uniformVariantRestrictions";
import { UniformVariantType } from "../token/model/uniformVariantTypeEnum";
import { SET_TOKEN_BODY_TYPE, SET_TOKEN_DIVISION_COLOR, SET_TOKEN_EXTRAS_TYPE, SET_TOKEN_EYE_COLOR, SET_TOKEN_EYE_TYPE, SET_TOKEN_FACIAL_HAIR_TYPE, SET_TOKEN_HAIR_COLOR, SET_TOKEN_HAIR_TYPE, SET_TOKEN_HEAD_TYPE, SET_TOKEN_LIPSTICK_COLOR, SET_TOKEN_MOUTH_TYPE, SET_TOKEN_NASO_LABIAL_FOLD_TYPE, SET_TOKEN_NOSE_TYPE, SET_TOKEN_RANK, SET_TOKEN_SKIN_COLOR, SET_TOKEN_SPECIES, SET_TOKEN_SPECIES_OPTION, SET_TOKEN_UNIFORM_ERA, SET_TOKEN_UNIFORM_VARIANT_TYPE } from "./tokenActions";

const initialState = {
    species: Species.Human,
    divisionColor: DivisionColors.getColors(UniformEra.DominionWar)[0].color,
    skinColor: SpeciesRestrictions.DEFAULT_SKIN_COLOR,
    headType: HeadType.SofterNarrow,
    rankIndicator: Rank.None,
    hairType: HairType.DeLeve,
    hairColor: SpeciesRestrictions.DEFAULT_HAIR_COLOR,
    eyeColor: SpeciesRestrictions.getDefaultEyeColor(Species.Human),
    eyeType: EyeType.Eye3,
    noseType: NoseType.StraightBasic,
    mouthType: MouthType.Mouth2,
    uniformEra: UniformEra.DominionWar,
    bodyType: BodyType.AverageMale,
    nasoLabialFold: NasoLabialFoldType.None,
    lipstickColor: SpeciesRestrictions.DEFAULT_LIPSTICK_COLOR,
    facialHairType: [],
    speciesOption: SpeciesOption.Option1,
    extras: [],
    variant: UniformVariantType.Base
}

const token = (state: Token = initialState, action) => {
    switch (action.type) {
    case SET_TOKEN_SPECIES: {
        let newSpecies = action.payload.species;
        let skinColor = state.skinColor;
        let palette = SpeciesRestrictions.getSkinColors(newSpecies);
        if (palette.indexOf(skinColor) < 0) {
            skinColor = palette[Math.floor(palette.length / 2)];
        }
        let hairColour = state.hairColor;
        let hairColours = SpeciesRestrictions.getHairColors(newSpecies);
        if (hairColours.indexOf(hairColour) < 0) {
            hairColour = hairColours[0];
        }

        let hairType = state.hairType;
        let hairTypes = SpeciesRestrictions.getHairTypes(newSpecies);
        if (hairTypes.indexOf(hairType) < 0) {
            hairType = SpeciesRestrictions.getDefaultHairType(newSpecies);
        }

        let noseType = state.noseType;
        let noseTypes = SpeciesRestrictions.getNoseTypes(newSpecies);
        if (noseTypes.indexOf(noseType) < 0) {
            noseType = noseTypes[0];
        }

        let facialHairType = state.facialHairType;
        if (!SpeciesRestrictions.isFacialHairSupportedFor(newSpecies)) {
            facialHairType = [];
        }

        let eyeColor = state.eyeColor;
        let speciesEyeColours = SpeciesRestrictions.getEyeColors(action.payload.species);
        if (speciesEyeColours.indexOf(eyeColor) < 0) {
            eyeColor = speciesEyeColours[Math.floor(speciesEyeColours.length / 2)];
        }
        let option = state.speciesOption;
        let options = SpeciesRestrictions.getSpeciesOptions(newSpecies);
        if (options.indexOf(option) < 0) {
            option = SpeciesOption.Option1;
        }
        let extras = state.extras.filter(e => SpeciesRestrictions.isExtraAvailableFor(e, newSpecies));

        let variant = state.variant;
        let variants = UniformVariantRestrictions.getAvailableVariants(state.uniformEra, state.bodyType, newSpecies, state.divisionColor, state.rankIndicator);
        if (variants.indexOf(variant) < 0) {
            variant = UniformVariantType.Base;
        }

        return {
            ...state,
            eyeColor: eyeColor,
            hairType: hairType,
            hairColor: hairColour,
            noseType: noseType,
            skinColor: skinColor,
            facialHairType: facialHairType,
            species: action.payload.species,
            speciesOption: option,
            extras: extras,
            variant: variant
        }
    }
    case SET_TOKEN_UNIFORM_ERA: {
        let colour = state.divisionColor;
        let newColourOptions = DivisionColors.getColors(action.payload.era);
        let index = DivisionColors.indexOf(state.uniformEra, colour);
        if (index >= 0 && index < newColourOptions.length) {
            colour = newColourOptions[index].color;
        } else {
            colour = newColourOptions[0].color;
        }
        let rank = state.rankIndicator;
        if (!UniformVariantRestrictions.isRankSupported(rank, action.payload.era)) {
            rank = Rank.None;
        }
        let variant = state.variant;
        let variants = UniformVariantRestrictions.getAvailableVariants(action.payload.era, state.bodyType, state.species, colour, rank);
        if (variants.indexOf(variant) < 0) {
            variant = UniformVariantType.Base;
        }

        return {
            ...state,
            rankIndicator: rank,
            divisionColor: colour,
            uniformEra: action.payload.era,
            variant: variant
        }
    }
    case SET_TOKEN_DIVISION_COLOR: {
        let variant = state.variant;
        let variants = UniformVariantRestrictions.getAvailableVariants(action.payload.era, state.bodyType, state.species, action.payload.color, state.rankIndicator);
        if (variants.indexOf(variant) < 0) {
            variant = UniformVariantType.Base;
        }

        return {
            ...state,
            divisionColor: action.payload.color,
            variant: variant
        }
    }
    case SET_TOKEN_RANK: {
        let variant = state.variant;
        let variants = UniformVariantRestrictions.getAvailableVariants(action.payload.era, state.bodyType, state.species, state.divisionColor, action.payload.rank);
        if (variants.indexOf(variant) < 0) {
            variant = UniformVariantType.Base;
        }
        return {
            ...state,
            variant: variant,
            rankIndicator: action.payload.rank
        }
    }
    case SET_TOKEN_HAIR_TYPE:
        return {
            ...state,
            hairType: action.payload.hairType
        }
    case SET_TOKEN_HEAD_TYPE:
        return {
            ...state,
            headType: action.payload.headType
        }
    case SET_TOKEN_NOSE_TYPE:
        return {
            ...state,
            noseType: action.payload.noseType
        }
    case SET_TOKEN_NASO_LABIAL_FOLD_TYPE:
        return {
            ...state,
            nasoLabialFold: action.payload.type
        }
    case SET_TOKEN_BODY_TYPE: {
        let variant = state.variant;
        let variants = UniformVariantRestrictions.getAvailableVariants(state.uniformEra, action.payload.type, state.species, state.divisionColor, state.rankIndicator);
        if (variants.indexOf(variant) < 0) {
            variant = UniformVariantType.Base;
        }
        return {
            ...state,
            bodyType: action.payload.type,
            variant: variant
        }
    }
    case SET_TOKEN_UNIFORM_VARIANT_TYPE:
        return {
            ...state,
            variant: action.payload.type
        }
    case SET_TOKEN_EYE_TYPE:
        return {
            ...state,
            eyeType: action.payload.eyeType
        }
    case SET_TOKEN_MOUTH_TYPE:
        return {
            ...state,
            mouthType: action.payload.mouthType
        }
    case SET_TOKEN_FACIAL_HAIR_TYPE:
        return {
            ...state,
            facialHairType: action.payload.types
        }
    case SET_TOKEN_EXTRAS_TYPE:
        return {
            ...state,
            extras: action.payload.types
        }
    case SET_TOKEN_EYE_COLOR:
        return {
            ...state,
            eyeColor: action.payload.color
        }
    case SET_TOKEN_HAIR_COLOR:
        return {
            ...state,
            hairColor: action.payload.color
        }
    case SET_TOKEN_LIPSTICK_COLOR:
        return {
            ...state,
            lipstickColor: action.payload.color
        }
    case SET_TOKEN_SKIN_COLOR:
        return {
            ...state,
            skinColor: action.payload.color
        }
    case SET_TOKEN_SPECIES_OPTION:
        return {
            ...state,
            speciesOption: action.payload.option
        }
    default:
        return state;
    }
}


export default token;