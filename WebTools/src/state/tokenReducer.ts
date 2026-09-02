import { createSlice } from '@reduxjs/toolkit';
import { Rank } from '../helpers/ranks';
import { Species } from '../helpers/speciesEnum';
import { BodyType } from '../token/model/bodyTypeEnum';
import { DivisionColors } from '../token/model/divisionColors';
import { EyeType } from '../token/model/eyeTypeEnum';
import { HairType } from '../token/model/hairTypeEnum';
import { HeadType } from '../token/model/headTypeEnum';
import { MouthType } from '../token/model/mouthTypeEnum';
import { NasoLabialFoldType } from '../token/model/nasoLabialFoldTypeEnum';
import { NoseType } from '../token/model/noseTypeEnum';
import { SpeciesOption } from '../token/model/speciesOptionEnum';
import { SpeciesRestrictions } from '../token/model/speciesRestrictions';
import type { Token } from '../token/model/token';
import { UniformEra } from '../token/model/uniformEra';
import { UniformVariantRestrictions } from '../token/model/uniformVariantRestrictions';
import { UniformVariantType } from '../token/model/uniformVariantTypeEnum';
import {
  createNewToken,
  setTokenBordered,
  setTokenBodyType,
  setTokenDivisionColor,
  setTokenExtrasTypes,
  setTokenEyeColor,
  setTokenEyeType,
  setTokenFacialHairTypes,
  setTokenHairColor,
  setTokenHairType,
  setTokenHeadType,
  setTokenLipstickColor,
  setTokenMouthType,
  setTokenNasoLabialFoldType,
  setTokenNoseType,
  setTokenRank,
  setTokenRounded,
  setTokenSecondarySpecies,
  setTokenSkinColor,
  setTokenSpecies,
  setTokenSpeciesOption,
  setTokenUniformVariantType,
  setUniformEra,
  SET_TOKEN_SECONDARY_SPECIES,
} from './tokenActions';

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
  variant: UniformVariantType.Base,
};

interface TokenState {
  token?: Token;
  marshalledCharacter?: string;
  characterName?: string;
  replacementHash?: number;
  rounded?: boolean;
  bordered?: boolean;
}

const handleSpeciesChange = (
  state: TokenState,
  action: { type: string; payload: any },
): TokenState => {
  const token = state.token as Token;
  let newSpecies = action.payload.species;
  let skinColor = token.skinColor;
  const palette = SpeciesRestrictions.getSkinColors(newSpecies);
  if (palette.indexOf(skinColor) < 0) {
    skinColor = palette[Math.floor(palette.length / 2)];
  }
  let hairColour = token.hairColor;
  const hairColours = SpeciesRestrictions.getHairColors(newSpecies);
  if (hairColours.indexOf(hairColour) < 0) {
    hairColour = hairColours[0];
  }

  let hairType = token.hairType;
  const hairTypes = SpeciesRestrictions.getHairTypes(newSpecies);
  if (hairTypes.indexOf(hairType) < 0) {
    hairType = SpeciesRestrictions.getDefaultHairType(newSpecies);
  }

  let noseType = token.noseType;
  const noseTypes = SpeciesRestrictions.getNoseTypes(newSpecies);
  if (noseTypes.indexOf(noseType) < 0) {
    noseType = noseTypes[0];
  }

  let headType = token.headType;
  const headTypes = SpeciesRestrictions.getHeadTypes(newSpecies);
  if (headTypes.indexOf(headType) < 0) {
    headType = headTypes[0];
  }

  let mouthType = token.mouthType;
  const mouthTypes = SpeciesRestrictions.getMouthTypes(newSpecies);
  if (mouthTypes.indexOf(mouthType) < 0) {
    mouthType = mouthTypes[0];
  }

  let facialHairType = token.facialHairType;
  if (!SpeciesRestrictions.isFacialHairSupportedFor(newSpecies)) {
    facialHairType = [];
  }

  let eyeColor = token.eyeColor;
  const speciesEyeColours = SpeciesRestrictions.getEyeColors(
    action.payload.species,
  );
  if (speciesEyeColours.indexOf(eyeColor) < 0) {
    eyeColor = speciesEyeColours[Math.floor(speciesEyeColours.length / 2)];
  }
  let option = token.speciesOption;
  const options = SpeciesRestrictions.getSpeciesOptions(newSpecies);
  if (options.indexOf(option) < 0) {
    option = SpeciesOption.Option1;
  }
  const extras = token.extras.filter((e) =>
    action.type === SET_TOKEN_SECONDARY_SPECIES
      ? SpeciesRestrictions.isExtraAvailableFor(
          e,
          Species.LiberatedBorg,
          newSpecies,
          token.uniformEra,
        )
      : SpeciesRestrictions.isExtraAvailableFor(
          e,
          newSpecies,
          token.secondarySpecies,
          token.uniformEra,
        ),
  );

  let uniformEra = token.uniformEra;
  let colour = token.divisionColor;
  let rank = token.rankIndicator;
  const uniforms = SpeciesRestrictions.getUniformTypes(newSpecies);
  if (uniforms.indexOf(uniformEra) < 0) {
    uniformEra = uniforms[0];

    const newColourOptions = DivisionColors.getColors(action.payload.era, rank);
    const index = DivisionColors.indexOf(token.uniformEra, colour);
    if (index >= 0 && index < newColourOptions.length) {
      colour = newColourOptions[index].color;
    } else {
      colour = newColourOptions[0].color;
    }
    if (!UniformVariantRestrictions.isRankSupported(rank, action.payload.era)) {
      rank = Rank.None;
    }
  }

  let variant = token.variant;
  const variants = UniformVariantRestrictions.getAvailableVariants(
    uniformEra,
    token.bodyType,
    newSpecies,
    token.divisionColor,
    token.rankIndicator,
  );
  if (variants.indexOf(variant) < 0) {
    variant = UniformVariantType.Base;
  }

  let secondarySpecies = token.secondarySpecies;
  if (action.type === SET_TOKEN_SECONDARY_SPECIES) {
    secondarySpecies = newSpecies;
    if (secondarySpecies == null) {
      secondarySpecies = Species.Human;
    }
    newSpecies = token.species;
  } else if (newSpecies === Species.LiberatedBorg && secondarySpecies == null) {
    secondarySpecies = Species.Human;
  }

  return {
    ...state,
    token: {
      ...token,
      eyeColor: eyeColor,
      hairType: hairType,
      hairColor: hairColour,
      headType: headType,
      noseType: noseType,
      mouthType: mouthType,
      skinColor: skinColor,
      facialHairType: facialHairType,
      species: newSpecies,
      secondarySpecies: secondarySpecies,
      speciesOption: option,
      extras: extras,
      uniformEra: uniformEra,
      rankIndicator: rank,
      divisionColor: colour,
      variant: variant,
    },
  };
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState: { token: initialState } as TokenState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setTokenSpecies, handleSpeciesChange)
      .addCase(setTokenSecondarySpecies, handleSpeciesChange);
    builder.addCase(setUniformEra, (state, action) => {
      const token = state.token as Token;
      let colour = token.divisionColor;
      const newColourOptions = DivisionColors.getColors(
        action.payload.era,
        token.rankIndicator,
      );
      const index = DivisionColors.indexOf(token.uniformEra, colour);
      if (index >= 0 && index < newColourOptions.length) {
        colour = newColourOptions[index].color;
      } else {
        colour = newColourOptions[0].color;
      }
      let rank = token.rankIndicator;
      if (
        !UniformVariantRestrictions.isRankSupported(rank, action.payload.era)
      ) {
        rank = Rank.None;
      }
      let bodyType = token.bodyType;
      if (
        !UniformVariantRestrictions.getSupportedBodyTypes(
          action.payload.era,
        ).includes(bodyType)
      ) {
        bodyType = UniformVariantRestrictions.getSupportedBodyTypes(
          action.payload.era,
        )[0];
      }
      let variant = token.variant;
      const variants = UniformVariantRestrictions.getAvailableVariants(
        action.payload.era,
        bodyType,
        token.species,
        colour,
        rank,
      );
      if (variants.indexOf(variant) < 0) {
        variant = UniformVariantType.Base;
      }
      const extras = token.extras.filter((e) =>
        SpeciesRestrictions.isExtraAvailableFor(
          e,
          token.species,
          token.secondarySpecies,
          action.payload.era,
        ),
      );

      return {
        ...state,
        token: {
          ...token,
          rankIndicator: rank,
          divisionColor: colour,
          uniformEra: action.payload.era,
          variant: variant,
          bodyType: bodyType,
          extras: extras,
        },
      };
    });
    builder.addCase(setTokenDivisionColor, (state, action) => {
      const token = state.token as Token;
      let variant = token.variant;
      const variants = UniformVariantRestrictions.getAvailableVariants(
        token.uniformEra,
        token.bodyType,
        token.species,
        action.payload.color,
        token.rankIndicator,
      );
      if (variants.indexOf(variant) < 0) {
        variant = UniformVariantType.Base;
      }

      return {
        ...state,
        token: {
          ...token,
          divisionColor: action.payload.color,
          variant: variant,
        },
      };
    });
    builder.addCase(setTokenRank, (state, action) => {
      const token = { ...(state.token as Token) };
      const variant = token.variant;
      const variants = UniformVariantRestrictions.getAvailableVariants(
        token.uniformEra,
        token.bodyType,
        token.species,
        token.divisionColor,
        action.payload.rank,
      );
      if (variants.indexOf(variant) < 0) {
        token.variant = UniformVariantType.Base;
      }
      token.rankIndicator = action.payload.rank;
      const colours = DivisionColors.getColors(
        token.uniformEra,
        token.rankIndicator,
      );
      if (
        colours.length &&
        !colours.map((c) => c.color).includes(token.divisionColor)
      ) {
        token.divisionColor = colours[0].color;
      }

      return {
        ...state,
        token: token,
      };
    });
    builder.addCase(setTokenHairType, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          hairType: action.payload.hairType,
        },
      };
    });
    builder.addCase(setTokenHeadType, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          headType: action.payload.headType,
        },
      };
    });
    builder.addCase(setTokenNoseType, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          noseType: action.payload.noseType,
        },
      };
    });
    builder.addCase(setTokenNasoLabialFoldType, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          nasoLabialFold: action.payload.type,
        },
      };
    });
    builder.addCase(setTokenBodyType, (state, action) => {
      const token = state.token as Token;
      let variant = token.variant;
      const variants = UniformVariantRestrictions.getAvailableVariants(
        token.uniformEra,
        action.payload.type,
        token.species,
        token.divisionColor,
        token.rankIndicator,
      );
      if (variants.indexOf(variant) < 0) {
        variant = UniformVariantType.Base;
      }
      return {
        ...state,
        token: {
          ...token,
          bodyType: action.payload.type,
          variant: variant,
        },
      };
    });
    builder.addCase(setTokenUniformVariantType, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          variant: action.payload.type,
        },
      };
    });
    builder.addCase(setTokenEyeType, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          eyeType: action.payload.eyeType,
        },
      };
    });
    builder.addCase(setTokenMouthType, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          mouthType: action.payload.mouthType,
        },
      };
    });
    builder.addCase(setTokenFacialHairTypes, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          facialHairType: action.payload.types,
        },
      };
    });
    builder.addCase(setTokenExtrasTypes, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          extras: action.payload.types,
        },
      };
    });
    builder.addCase(setTokenEyeColor, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          eyeColor: action.payload.color,
        },
      };
    });
    builder.addCase(setTokenHairColor, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          hairColor: action.payload.color,
        },
      };
    });
    builder.addCase(setTokenLipstickColor, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          lipstickColor: action.payload.color,
        },
      };
    });
    builder.addCase(setTokenSkinColor, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          skinColor: action.payload.color,
        },
      };
    });
    builder.addCase(setTokenSpeciesOption, (state, action) => {
      const token = state.token as Token;
      return {
        ...state,
        token: {
          ...token,
          speciesOption: action.payload.option,
        },
      };
    });
    builder.addCase(createNewToken, (state, action) => {
      const newToken = action.payload.token;
      const token: Token = { ...initialState };
      if (newToken) {
        token.species = newToken.primarySpecies;
        token.secondarySpecies = newToken.secondarySpecies;
        token.speciesOption = newToken.speciesOption;
        token.bodyType = newToken.bodyType;
        token.uniformEra = newToken.uniformEra;
        token.variant = newToken.variant;
        token.rankIndicator = newToken.rankIndicator;
        token.divisionColor = newToken.divisionColor;
        token.skinColor = newToken.skinColor;
        token.headType = newToken.headType;
        token.hairType = newToken.hairType;
        token.hairColor = newToken.hairColor;
        token.eyeType = newToken.eyeType;
        token.eyeColor = newToken.eyeColor;
        token.noseType = newToken.noseType;
        token.nasoLabialFold = newToken.nasoLabialFold;
        token.lipstickColor = newToken.lipstickColor;
        token.mouthType = newToken.mouthType;
        token.facialHairType = [...(newToken?.facialHairType ?? [])];
        token.extras = [...(newToken.extras ?? [])];
      }
      return {
        ...state,
        token: token,
        rounded: action.payload.rounded,
        bordered: action.payload.bordered,
        marshalledCharacter: action.payload.marshalledCharacter,
        characterName: action.payload.characterName,
        replacementHash: action.payload.hash,
      };
    });
    builder.addCase(setTokenRounded, (state, action) => {
      return {
        ...state,
        rounded: action.payload.rounded,
      };
    });
    builder.addCase(setTokenBordered, (state, action) => {
      return {
        ...state,
        bordered: action.payload.bordered,
      };
    });
  },
});

export const token = tokenSlice.reducer;
