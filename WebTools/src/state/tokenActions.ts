import { createAction } from '@reduxjs/toolkit';
import { cyrb53 } from '../common/cyrb53';
import type { Rank } from '../helpers/ranks';
import type { Species } from '../helpers/speciesEnum';
import type { BodyType } from '../token/model/bodyTypeEnum';
import type { ExtraType } from '../token/model/extrasTypeEnum';
import type { EyeType } from '../token/model/eyeTypeEnum';
import type { FacialHairType } from '../token/model/facialHairEnum';
import type { HairType } from '../token/model/hairTypeEnum';
import type { HeadType } from '../token/model/headTypeEnum';
import type { MouthType } from '../token/model/mouthTypeEnum';
import type { NasoLabialFoldType } from '../token/model/nasoLabialFoldTypeEnum';
import type { NoseType } from '../token/model/noseTypeEnum';
import type { SpeciesOption } from '../token/model/speciesOptionEnum';
import type { TokenModel } from '../token/model/tokenModel';
import type { UniformEra } from '../token/model/uniformEra';
import type { UniformVariantType } from '../token/model/uniformVariantTypeEnum';

export const SET_TOKEN_SPECIES = 'SET_TOKEN_SPECIES';
export const SET_TOKEN_SPECIES_OPTION = 'SET_TOKEN_SPECIES_OPTION';
export const SET_TOKEN_UNIFORM_ERA = 'SET_TOKEN_UNIFORM_ERA';
export const SET_TOKEN_DIVISION_COLOR = 'SET_TOKEN_DIVISION_COLOR';
export const SET_TOKEN_SKIN_COLOR = 'SET_TOKEN_SKIN_COLOR';
export const SET_TOKEN_RANK = 'SET_TOKEN_RANK';
export const SET_TOKEN_HAIR_TYPE = 'SET_TOKEN_HAIR_TYPE';
export const SET_TOKEN_HAIR_COLOR = 'SET_TOKEN_HAIR_COLOR';
export const SET_TOKEN_HEAD_TYPE = 'SET_TOKEN_HEAD_TYPE';
export const SET_TOKEN_EYE_COLOR = 'SET_TOKEN_EYE_COLOR';
export const SET_TOKEN_NASO_LABIAL_FOLD_TYPE =
  'SET_TOKEN_NASO_LABIAL_FOLD_TYPE';
export const SET_TOKEN_NOSE_TYPE = 'SET_TOKEN_NOSE_TYPE';
export const SET_TOKEN_MOUTH_TYPE = 'SET_TOKEN_MOUTH_TYPE';
export const SET_TOKEN_BODY_TYPE = 'SET_TOKEN_BODY_TYPE';
export const SET_TOKEN_UNIFORM_VARIANT_TYPE = 'SET_TOKEN_UNIFORM_VARIANT_TYPE';
export const SET_TOKEN_EYE_TYPE = 'SET_TOKEN_EYE_TYPE';
export const SET_TOKEN_LIPSTICK_COLOR = 'SET_TOKEN_LIPSTICK_COLOR';
export const SET_TOKEN_FACIAL_HAIR_TYPE = 'SET_TOKEN_FACIAL_HAIR_TYPE';
export const SET_TOKEN_EXTRAS_TYPE = 'SET_TOKEN_EXTRAS_TYPE';
export const SET_TOKEN_SECONDARY_SPECIES = 'SET_TOKEN_SECONDARY_SPECIES';
export const CREATE_NEW_TOKEN = 'CREATE_NEW_TOKEN';
export const SET_TOKEN_ROUNDED = 'SET_TOKEN_ROUNDED';
export const SET_TOKEN_BORDERED = 'SET_TOKEN_BORDERED';

export const createNewToken = createAction(
  CREATE_NEW_TOKEN,
  (
    token?: TokenModel,
    marshalledCharacter?: string,
    characterName?: string,
    rounded: boolean = false,
    bordered: boolean = false,
  ) => {
    const hash = marshalledCharacter?.length
      ? cyrb53(marshalledCharacter)
      : undefined;
    return {
      payload: {
        token: token,
        marshalledCharacter: marshalledCharacter,
        characterName: characterName,
        hash: hash,
        rounded: rounded,
        bordered: bordered,
      },
    };
  },
);

export const setTokenSpecies = createAction(
  SET_TOKEN_SPECIES,
  (species: Species) => ({
    payload: { species: species },
  }),
);

export const setTokenSecondarySpecies = createAction(
  SET_TOKEN_SECONDARY_SPECIES,
  (species: Species) => ({
    payload: { species: species },
  }),
);

export const setUniformEra = createAction(
  SET_TOKEN_UNIFORM_ERA,
  (era: UniformEra) => ({
    payload: { era: era },
  }),
);

export const setTokenDivisionColor = createAction(
  SET_TOKEN_DIVISION_COLOR,
  (color: string) => ({
    payload: { color: color },
  }),
);

export const setTokenRank = createAction(SET_TOKEN_RANK, (rank: Rank) => ({
  payload: { rank: rank },
}));

export const setTokenSkinColor = createAction(
  SET_TOKEN_SKIN_COLOR,
  (color: string) => ({
    payload: { color: color },
  }),
);

export const setTokenEyeColor = createAction(
  SET_TOKEN_EYE_COLOR,
  (color: string) => ({
    payload: { color: color },
  }),
);

export const setTokenHairColor = createAction(
  SET_TOKEN_HAIR_COLOR,
  (color: string) => ({
    payload: { color: color },
  }),
);

export const setTokenLipstickColor = createAction(
  SET_TOKEN_LIPSTICK_COLOR,
  (color: string) => ({
    payload: { color: color },
  }),
);

export const setTokenHairType = createAction(
  SET_TOKEN_HAIR_TYPE,
  (hairType: HairType) => ({
    payload: { hairType: hairType },
  }),
);

export const setTokenHeadType = createAction(
  SET_TOKEN_HEAD_TYPE,
  (headType: HeadType) => ({
    payload: { headType: headType },
  }),
);

export const setTokenMouthType = createAction(
  SET_TOKEN_MOUTH_TYPE,
  (mouthType: MouthType) => ({
    payload: { mouthType: mouthType },
  }),
);

export const setTokenEyeType = createAction(
  SET_TOKEN_EYE_TYPE,
  (eyeType: EyeType) => ({
    payload: { eyeType: eyeType },
  }),
);

export const setTokenNoseType = createAction(
  SET_TOKEN_NOSE_TYPE,
  (noseType: NoseType) => ({
    payload: { noseType: noseType },
  }),
);

export const setTokenBodyType = createAction(
  SET_TOKEN_BODY_TYPE,
  (type: BodyType) => ({
    payload: { type: type },
  }),
);

export const setTokenUniformVariantType = createAction(
  SET_TOKEN_UNIFORM_VARIANT_TYPE,
  (type: UniformVariantType) => ({
    payload: { type: type },
  }),
);

export const setTokenFacialHairTypes = createAction(
  SET_TOKEN_FACIAL_HAIR_TYPE,
  (types: FacialHairType[]) => ({
    payload: { types: types },
  }),
);

export const setTokenExtrasTypes = createAction(
  SET_TOKEN_EXTRAS_TYPE,
  (types: ExtraType[]) => ({
    payload: { types: types },
  }),
);

export const setTokenNasoLabialFoldType = createAction(
  SET_TOKEN_NASO_LABIAL_FOLD_TYPE,
  (type: NasoLabialFoldType) => ({
    payload: { type: type },
  }),
);

export const setTokenSpeciesOption = createAction(
  SET_TOKEN_SPECIES_OPTION,
  (option: SpeciesOption) => ({
    payload: { option: option },
  }),
);

export const setTokenRounded = createAction(
  SET_TOKEN_ROUNDED,
  (rounded: boolean) => ({
    payload: { rounded: rounded },
  }),
);

export const setTokenBordered = createAction(
  SET_TOKEN_BORDERED,
  (bordered: boolean) => ({
    payload: { bordered: bordered },
  }),
);
