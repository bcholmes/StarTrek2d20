import { test, expect, describe } from '@jest/globals';
import '../../src/common/character';
import { cyrb53 } from '../../src/common/cyrb53';
import { Rank } from '../../src/helpers/ranks';
import { Species } from '../../src/helpers/speciesEnum';
import { BodyType } from '../../src/token/model/bodyTypeEnum';
import { DivisionColors } from '../../src/token/model/divisionColors';
import { ExtraType } from '../../src/token/model/extrasTypeEnum';
import { EyeType } from '../../src/token/model/eyeTypeEnum';
import { FacialHairType } from '../../src/token/model/facialHairEnum';
import { HairType } from '../../src/token/model/hairTypeEnum';
import { HeadType } from '../../src/token/model/headTypeEnum';
import { MouthType } from '../../src/token/model/mouthTypeEnum';
import { NasoLabialFoldType } from '../../src/token/model/nasoLabialFoldTypeEnum';
import { NoseType } from '../../src/token/model/noseTypeEnum';
import { SpeciesOption } from '../../src/token/model/speciesOptionEnum';
import { SpeciesRestrictions } from '../../src/token/model/speciesRestrictions';
import { TokenModel } from '../../src/token/model/tokenModel';
import { UniformEra } from '../../src/token/model/uniformEra';
import { UniformVariantRestrictions } from '../../src/token/model/uniformVariantRestrictions';
import { UniformVariantType } from '../../src/token/model/uniformVariantTypeEnum';
import { token } from '../../src/state/tokenReducer';
import {
  createNewToken,
  setTokenBordered,
  setTokenBodyType,
  setTokenDivisionColor,
  setTokenEyeColor,
  setTokenEyeType,
  setTokenExtrasTypes,
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
} from '../../src/state/tokenActions';

function baseState() {
  return token(undefined, { type: 'UNKNOWN' });
}

describe('tokenReducer', () => {
  test('returns the default token for an unknown action', () => {
    const result = token(undefined, { type: 'UNKNOWN' });
    expect(result.token?.species).toBe(Species.Human);
    expect(result.token?.uniformEra).toBe(UniformEra.DominionWar);
    expect(result.token?.rankIndicator).toBe(Rank.None);
    expect(result.token?.variant).toBe(UniformVariantType.Base);
    expect(result.token?.secondarySpecies).toBeUndefined();
    expect(result.rounded).toBeUndefined();
    expect(result.bordered).toBeUndefined();
  });

  test('CREATE_NEW_TOKEN maps the model and computes the replacement hash', () => {
    const model = TokenModel.createDefault();
    model.primarySpecies = Species.Vulcan;
    const result = token(
      baseState(),
      createNewToken(model, 'marshalled-data', 'Spock', true, true),
    );
    expect(result.token?.species).toBe(Species.Vulcan);
    expect(result.characterName).toBe('Spock');
    expect(result.marshalledCharacter).toBe('marshalled-data');
    expect(result.replacementHash).toBe(cyrb53('marshalled-data'));
    expect(result.rounded).toBe(true);
    expect(result.bordered).toBe(true);
  });

  test('CREATE_NEW_TOKEN without a model falls back to defaults', () => {
    const result = token(baseState(), createNewToken());
    expect(result.token?.species).toBe(Species.Human);
    expect(result.rounded).toBe(false);
    expect(result.bordered).toBe(false);
    expect(result.marshalledCharacter).toBeUndefined();
    expect(result.replacementHash).toBeUndefined();
  });

  test('SET_TOKEN_SPECIES recalibrates features for the new species', () => {
    const result = token(baseState(), setTokenSpecies(Species.Vulcan));
    const t = result.token as any;
    expect(t.species).toBe(Species.Vulcan);
    expect(SpeciesRestrictions.getSkinColors(Species.Vulcan)).toContain(
      t.skinColor,
    );
    expect(SpeciesRestrictions.getHairColors(Species.Vulcan)).toContain(
      t.hairColor,
    );
    expect(SpeciesRestrictions.getHairTypes(Species.Vulcan)).toContain(
      t.hairType,
    );
    expect(SpeciesRestrictions.getNoseTypes(Species.Vulcan)).toContain(
      t.noseType,
    );
    expect(SpeciesRestrictions.getHeadTypes(Species.Vulcan)).toContain(
      t.headType,
    );
    expect(SpeciesRestrictions.getMouthTypes(Species.Vulcan)).toContain(
      t.mouthType,
    );
    expect(SpeciesRestrictions.getEyeColors(Species.Vulcan)).toContain(
      t.eyeColor,
    );
    expect(SpeciesRestrictions.getSpeciesOptions(Species.Vulcan)).toContain(
      t.speciesOption,
    );
  });

  test('SET_TOKEN_SPECIES to LiberatedBorg defaults the secondary species to Human', () => {
    const result = token(baseState(), setTokenSpecies(Species.LiberatedBorg));
    expect(result.token?.species).toBe(Species.LiberatedBorg);
    expect(result.token?.secondarySpecies).toBe(Species.Human);
  });

  test('SET_TOKEN_SECONDARY_SPECIES stores the secondary species without swapping the primary', () => {
    const result = token(
      baseState(),
      setTokenSecondarySpecies(Species.KlingonExt),
    );
    expect(result.token?.species).toBe(Species.Human);
    expect(result.token?.secondarySpecies).toBe(Species.KlingonExt);
  });

  test('SET_TOKEN_UNIFORM_ERA updates the era and rebalances body, color, and variant', () => {
    const result = token(baseState(), setUniformEra(UniformEra.NextGeneration));
    const t = result.token as any;
    expect(t.uniformEra).toBe(UniformEra.NextGeneration);
    expect(
      UniformVariantRestrictions.getSupportedBodyTypes(
        UniformEra.NextGeneration,
      ),
    ).toContain(t.bodyType);
    expect(
      UniformVariantRestrictions.getAvailableVariants(
        t.uniformEra,
        t.bodyType,
        t.species,
        t.divisionColor,
        t.rankIndicator,
      ),
    ).toContain(t.variant);
    expect(
      DivisionColors.getColors(t.uniformEra, t.rankIndicator).map(
        (c: any) => c.color,
      ),
    ).toContain(t.divisionColor);
  });

  test('SET_TOKEN_RANK updates the rank and keeps color and variant supported', () => {
    const result = token(baseState(), setTokenRank(Rank.Lieutenant));
    const t = result.token as any;
    expect(t.rankIndicator).toBe(Rank.Lieutenant);
    expect(
      UniformVariantRestrictions.getAvailableVariants(
        t.uniformEra,
        t.bodyType,
        t.species,
        t.divisionColor,
        t.rankIndicator,
      ),
    ).toContain(t.variant);
    const colors = DivisionColors.getColors(t.uniformEra, t.rankIndicator).map(
      (c: any) => c.color,
    );
    if (colors.length) {
      expect(colors).toContain(t.divisionColor);
    }
  });

  test.each([
    ['SET_TOKEN_BODY_TYPE', setTokenBodyType(BodyType.AverageFemale)],
    ['SET_TOKEN_HAIR_TYPE', setTokenHairType(HairType.Bald)],
    ['SET_TOKEN_HEAD_TYPE', setTokenHeadType(HeadType.AverageAngular)],
    ['SET_TOKEN_NOSE_TYPE', setTokenNoseType(NoseType.Convex)],
    ['SET_TOKEN_MOUTH_TYPE', setTokenMouthType(MouthType.Mouth1)],
    ['SET_TOKEN_EYE_TYPE', setTokenEyeType(EyeType.Eye1)],
    [
      'SET_TOKEN_NASO_LABIAL_FOLD_TYPE',
      setTokenNasoLabialFoldType(NasoLabialFoldType.Subtle),
    ],
    ['SET_TOKEN_HAIR_COLOR', setTokenHairColor('#00bb00')],
    ['SET_TOKEN_EYE_COLOR', setTokenEyeColor('#aa0000')],
    ['SET_TOKEN_LIPSTICK_COLOR', setTokenLipstickColor('#cc00ee')],
    ['SET_TOKEN_SKIN_COLOR', setTokenSkinColor('#dd9966')],
    [
      'SET_TOKEN_FACIAL_HAIR_TYPE',
      setTokenFacialHairTypes([FacialHairType.SoulPatch]),
    ],
    ['SET_TOKEN_EXTRAS_TYPE', setTokenExtrasTypes([ExtraType.Visor])],
    ['SET_TOKEN_SPECIES_OPTION', setTokenSpeciesOption(SpeciesOption.Option2)],
    [
      'SET_TOKEN_UNIFORM_VARIANT_TYPE',
      setTokenUniformVariantType(UniformVariantType.Variant1),
    ],
    ['SET_TOKEN_ROUNDED', setTokenRounded(true)],
    ['SET_TOKEN_BORDERED', setTokenBordered(true)],
  ])('%s stores its payload', (_name, action) => {
    const expected = token(undefined, action);
    const actual = token(baseState(), action);
    expect(actual).toEqual(expected);
  });

  test('SET_TOKEN_DIVISION_COLOR updates the color and rechecks the variant', () => {
    const result = token(baseState(), setTokenDivisionColor('#123456'));
    const t = result.token as any;
    expect(t.divisionColor).toBe('#123456');
    expect(
      UniformVariantRestrictions.getAvailableVariants(
        t.uniformEra,
        t.bodyType,
        t.species,
        t.divisionColor,
        t.rankIndicator,
      ),
    ).toContain(t.variant);
  });

  test('SET_TOKEN_BODY_TYPE updates the body type and rechecks the variant', () => {
    const result = token(baseState(), setTokenBodyType(BodyType.AverageFemale));
    const t = result.token as any;
    expect(t.bodyType).toBe(BodyType.AverageFemale);
    expect(
      UniformVariantRestrictions.getAvailableVariants(
        t.uniformEra,
        t.bodyType,
        t.species,
        t.divisionColor,
        t.rankIndicator,
      ),
    ).toContain(t.variant);
  });
});
