import { test, expect, describe } from '@jest/globals';
import '../../../src/common/character';
import { Rank } from '../../../src/helpers/ranks';
import { Species } from '../../../src/helpers/speciesEnum';
import { BodyType } from '../../../src/token/model/bodyTypeEnum';
import { DivisionColors } from '../../../src/token/model/divisionColors';
import { TokenModel } from '../../../src/token/model/tokenModel';
import {
  UniformEra,
  allUniformEras,
} from '../../../src/token/model/uniformEra';
import { UniformVariantRestrictions } from '../../../src/token/model/uniformVariantRestrictions';
import { UniformVariantType } from '../../../src/token/model/uniformVariantTypeEnum';

const variantsFromBaseThrough = (last: UniformVariantType) => {
  const result: UniformVariantType[] = [];
  for (let variant = UniformVariantType.Base; variant <= last; variant += 1) {
    result.push(variant);
  }
  return result;
};

type AvailableVariantsCase = {
  label: string;
  era: UniformEra;
  bodyType?: BodyType;
  species?: Species;
  divisionIndex?: number;
  rank?: Rank;
  expected: UniformVariantType[];
};

const availableVariantsCases: AvailableVariantsCase[] = [
  {
    label: 'NextGeneration has only the base variant',
    era: UniformEra.NextGeneration,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'MonsterMaroon medical adds medical whites',
    era: UniformEra.MonsterMaroon,
    divisionIndex: 3,
    expected: [
      UniformVariantType.Base,
      UniformVariantType.Variant1,
      UniformVariantType.Variant2,
    ],
  },
  {
    label:
      'MonsterMaroon helm engineering on an average female adds the engineering suit',
    era: UniformEra.MonsterMaroon,
    bodyType: BodyType.AverageFemale,
    divisionIndex: 2,
    expected: [
      UniformVariantType.Base,
      UniformVariantType.Variant1,
      UniformVariantType.Variant2,
    ],
  },
  {
    label:
      'MonsterMaroon helm engineering on an average male omits the engineering suit',
    era: UniformEra.MonsterMaroon,
    bodyType: BodyType.AverageMale,
    divisionIndex: 2,
    expected: [UniformVariantType.Base, UniformVariantType.Variant2],
  },
  {
    label: 'MonsterMaroon command adds only the standard alternate',
    era: UniformEra.MonsterMaroon,
    divisionIndex: 0,
    expected: [UniformVariantType.Base, UniformVariantType.Variant2],
  },
  {
    label: 'OriginalSeriesKlingon male captain adds the sash',
    era: UniformEra.OriginalSeriesKlingon,
    bodyType: BodyType.AverageMale,
    rank: Rank.Captain,
    expected: [UniformVariantType.Base, UniformVariantType.Variant1],
  },
  {
    label: 'OriginalSeriesKlingon female captain has no sash',
    era: UniformEra.OriginalSeriesKlingon,
    bodyType: BodyType.AverageFemale,
    rank: Rank.Captain,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'OriginalSeriesKlingon male commander has no sash',
    era: UniformEra.OriginalSeriesKlingon,
    bodyType: BodyType.AverageMale,
    rank: Rank.Commander,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'Klingon male captain adds the sash and the Kruge variant',
    era: UniformEra.Klingon,
    bodyType: BodyType.AverageMale,
    rank: Rank.Captain,
    expected: [
      UniformVariantType.Base,
      UniformVariantType.Variant1,
      UniformVariantType.Variant3,
      UniformVariantType.Variant2,
    ],
  },
  {
    label: 'Klingon male commander adds only the vest',
    era: UniformEra.Klingon,
    bodyType: BodyType.AverageMale,
    rank: Rank.Commander,
    expected: [UniformVariantType.Base, UniformVariantType.Variant2],
  },
  {
    label: 'Klingon female captain adds only the vest',
    era: UniformEra.Klingon,
    bodyType: BodyType.AverageFemale,
    rank: Rank.Captain,
    expected: [UniformVariantType.Base, UniformVariantType.Variant2],
  },
  {
    label: 'Discovery32 non-cadet adds variant one',
    era: UniformEra.Discovery32,
    rank: Rank.Lieutenant,
    expected: [UniformVariantType.Base, UniformVariantType.Variant1],
  },
  {
    label: 'Discovery32 cadet has only the base variant',
    era: UniformEra.Discovery32,
    rank: Rank.CadetFirstClass,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'StarfleetAcademy non-cadet adds two variants',
    era: UniformEra.StarfleetAcademy,
    rank: Rank.Lieutenant,
    expected: [
      UniformVariantType.Base,
      UniformVariantType.Variant1,
      UniformVariantType.Variant2,
    ],
  },
  {
    label: 'StarfleetAcademy cadet has only the base variant',
    era: UniformEra.StarfleetAcademy,
    rank: Rank.CadetFirstClass,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'Prodigy adds variant one',
    era: UniformEra.Prodigy,
    expected: [UniformVariantType.Base, UniformVariantType.Variant1],
  },
  {
    label: 'StrangeNewWorlds medical adds variant two',
    era: UniformEra.StrangeNewWorlds,
    divisionIndex: 2,
    expected: [UniformVariantType.Base, UniformVariantType.Variant2],
  },
  {
    label: 'StrangeNewWorlds command has only the base variant',
    era: UniformEra.StrangeNewWorlds,
    divisionIndex: 0,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'StarTrekOnline command captain adds variant one',
    era: UniformEra.StarTrekOnline,
    divisionIndex: 0,
    rank: Rank.Captain,
    expected: [UniformVariantType.Base, UniformVariantType.Variant1],
  },
  {
    label: 'StarTrekOnline command commander has only the base variant',
    era: UniformEra.StarTrekOnline,
    divisionIndex: 0,
    rank: Rank.Commander,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'StarTrekOnline science lieutenant adds variant one',
    era: UniformEra.StarTrekOnline,
    divisionIndex: 1,
    rank: Rank.Lieutenant,
    expected: [UniformVariantType.Base, UniformVariantType.Variant1],
  },
  {
    label: 'StarTrekOnline science enlisted has only the base variant',
    era: UniformEra.StarTrekOnline,
    divisionIndex: 1,
    rank: Rank.Crewman3rdClass,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'StarTrekOnline science flag officer has only the base variant',
    era: UniformEra.StarTrekOnline,
    divisionIndex: 1,
    rank: Rank.Admiral,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'Civilian non-binary has only the base variant',
    era: UniformEra.Civilian,
    bodyType: BodyType.AverageNonBinary,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'Civilian female has variants one through fourteen',
    era: UniformEra.Civilian,
    bodyType: BodyType.AverageFemale,
    expected: variantsFromBaseThrough(UniformVariantType.Variant14),
  },
  {
    label: 'Civilian male has variants one through fifteen',
    era: UniformEra.Civilian,
    bodyType: BodyType.AverageMale,
    expected: variantsFromBaseThrough(UniformVariantType.Variant15),
  },
  {
    label: 'TheMotionPicture security adds variant two',
    era: UniformEra.TheMotionPicture,
    divisionIndex: 5,
    expected: [
      UniformVariantType.Base,
      UniformVariantType.Variant1,
      UniformVariantType.Variant2,
      UniformVariantType.Variant3,
      UniformVariantType.Variant4,
    ],
  },
  {
    label: 'TheMotionPicture command omits variant two',
    era: UniformEra.TheMotionPicture,
    divisionIndex: 0,
    expected: [
      UniformVariantType.Base,
      UniformVariantType.Variant1,
      UniformVariantType.Variant3,
      UniformVariantType.Variant4,
    ],
  },
  {
    label: 'OriginalSeries Edosian has only the base variant',
    era: UniformEra.OriginalSeries,
    bodyType: BodyType.AverageMale,
    species: Species.Edosian,
    divisionIndex: 0,
    rank: Rank.Captain,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'OriginalSeries male command captain adds variants one and two',
    era: UniformEra.OriginalSeries,
    bodyType: BodyType.AverageMale,
    divisionIndex: 0,
    rank: Rank.Captain,
    expected: [
      UniformVariantType.Base,
      UniformVariantType.Variant1,
      UniformVariantType.Variant2,
    ],
  },
  {
    label: 'OriginalSeries female command commodore adds variant one',
    era: UniformEra.OriginalSeries,
    bodyType: BodyType.AverageFemale,
    divisionIndex: 0,
    rank: Rank.Commodore,
    expected: [UniformVariantType.Base, UniformVariantType.Variant1],
  },
  {
    label:
      'OriginalSeries non-binary command captain has only the base variant',
    era: UniformEra.OriginalSeries,
    bodyType: BodyType.AverageNonBinary,
    divisionIndex: 0,
    rank: Rank.Captain,
    expected: [UniformVariantType.Base],
  },
  {
    label: 'OriginalSeries male science captain adds only variant two',
    era: UniformEra.OriginalSeries,
    bodyType: BodyType.AverageMale,
    divisionIndex: 1,
    rank: Rank.Captain,
    expected: [UniformVariantType.Base, UniformVariantType.Variant2],
  },
  {
    label: 'OriginalSeries male command commander adds only variant two',
    era: UniformEra.OriginalSeries,
    bodyType: BodyType.AverageMale,
    divisionIndex: 0,
    rank: Rank.Commander,
    expected: [UniformVariantType.Base, UniformVariantType.Variant2],
  },
];

describe('getAvailableVariants', () => {
  test.each(availableVariantsCases)('$label', (testCase) => {
    const {
      era,
      bodyType = BodyType.AverageMale,
      species = Species.Human,
      divisionIndex = 0,
      rank = Rank.None,
      expected,
    } = testCase;
    const divisionColor = DivisionColors.getColors(era)[divisionIndex].color;

    expect(
      UniformVariantRestrictions.getAvailableVariants(
        era,
        bodyType,
        species,
        divisionColor,
        rank,
      ),
    ).toEqual(expected);
  });
});

describe('isVariantOptionsAvailable', () => {
  test('returns true when the era and inputs expose more than the base variant', () => {
    const token = TokenModel.createDefault();
    token.uniformEra = UniformEra.Civilian;
    token.bodyType = BodyType.AverageMale;

    expect(UniformVariantRestrictions.isVariantOptionsAvailable(token)).toBe(
      true,
    );
  });

  test('returns false when only the base variant is available', () => {
    const token = TokenModel.createDefault();
    token.uniformEra = UniformEra.NextGeneration;
    token.bodyType = BodyType.AverageMale;

    expect(UniformVariantRestrictions.isVariantOptionsAvailable(token)).toBe(
      false,
    );
  });
});

type RankSupportCase = {
  label: string;
  era: UniformEra;
  supported: Rank;
  unsupported: Rank;
};

const rankSupportCases: RankSupportCase[] = [
  {
    label: 'DominionWar supports captain and rejects commodore',
    era: UniformEra.DominionWar,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'NextGeneration supports captain and rejects commodore',
    era: UniformEra.NextGeneration,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'VoyagerDS9 supports captain and rejects commodore',
    era: UniformEra.VoyagerDS9,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'StarTrekOnline supports captain and rejects cadet first class',
    era: UniformEra.StarTrekOnline,
    supported: Rank.Captain,
    unsupported: Rank.CadetFirstClass,
  },
  {
    label: 'Prodigy supports cadet first class and rejects crewman',
    era: UniformEra.Prodigy,
    supported: Rank.CadetFirstClass,
    unsupported: Rank.Crewman3rdClass,
  },
  {
    label: 'Picard25 supports captain and rejects cadet first class',
    era: UniformEra.Picard25,
    supported: Rank.Captain,
    unsupported: Rank.CadetFirstClass,
  },
  {
    label: 'LowerDecks supports captain and rejects cadet first class',
    era: UniformEra.LowerDecks,
    supported: Rank.Captain,
    unsupported: Rank.CadetFirstClass,
  },
  {
    label: 'MonsterMaroon supports captain and rejects cadet first class',
    era: UniformEra.MonsterMaroon,
    supported: Rank.Captain,
    unsupported: Rank.CadetFirstClass,
  },
  {
    label: 'Enterprise supports captain and rejects petty officer first class',
    era: UniformEra.Enterprise,
    supported: Rank.Captain,
    unsupported: Rank.PettyOfficer1stClass,
  },
  {
    label: 'Maco supports colonel and rejects ensign',
    era: UniformEra.Maco,
    supported: Rank.Colonel,
    unsupported: Rank.Ensign,
  },
  {
    label: 'Bynar supports only rank none',
    era: UniformEra.Bynar,
    supported: Rank.None,
    unsupported: Rank.Captain,
  },
  {
    label: 'Civilian supports only rank none',
    era: UniformEra.Civilian,
    supported: Rank.None,
    unsupported: Rank.Captain,
  },
  {
    label: 'Ferengi supports only rank none',
    era: UniformEra.Ferengi,
    supported: Rank.None,
    unsupported: Rank.Captain,
  },
  {
    label: 'Cardassian supports only rank none',
    era: UniformEra.Cardassian,
    supported: Rank.None,
    unsupported: Rank.Captain,
  },
  {
    label: 'Suliban supports only rank none',
    era: UniformEra.Suliban,
    supported: Rank.None,
    unsupported: Rank.Captain,
  },
  {
    label: 'Romulan supports only rank none',
    era: UniformEra.Romulan,
    supported: Rank.None,
    unsupported: Rank.Captain,
  },
  {
    label: 'None supports only rank none',
    era: UniformEra.None,
    supported: Rank.None,
    unsupported: Rank.Captain,
  },
  {
    label: 'Tzenkethi supports only rank none',
    era: UniformEra.Tzenkethi,
    supported: Rank.None,
    unsupported: Rank.Captain,
  },
  {
    label: 'Discovery23 supports captain and rejects commodore',
    era: UniformEra.Discovery23,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'StrangeNewWorlds supports commodore and rejects cadet first class',
    era: UniformEra.StrangeNewWorlds,
    supported: Rank.Commodore,
    unsupported: Rank.CadetFirstClass,
  },
  {
    label: 'OriginalSeries supports commodore and rejects cadet first class',
    era: UniformEra.OriginalSeries,
    supported: Rank.Commodore,
    unsupported: Rank.CadetFirstClass,
  },
  {
    label: 'StarfleetAcademy supports cadet first class and rejects commodore',
    era: UniformEra.StarfleetAcademy,
    supported: Rank.CadetFirstClass,
    unsupported: Rank.Commodore,
  },
  {
    label: 'Klingon falls through to the default rank list',
    era: UniformEra.Klingon,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'OriginalSeriesKlingon falls through to the default rank list',
    era: UniformEra.OriginalSeriesKlingon,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'TheMotionPicture falls through to the default rank list',
    era: UniformEra.TheMotionPicture,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'RomulanNemesis falls through to the default rank list',
    era: UniformEra.RomulanNemesis,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'PicardRomulanEvacuation falls through to the default rank list',
    era: UniformEra.PicardRomulanEvacuation,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'Discovery32 falls through to the default rank list',
    era: UniformEra.Discovery32,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
  {
    label: 'JemHadar falls through to the default rank list',
    era: UniformEra.JemHadar,
    supported: Rank.Captain,
    unsupported: Rank.Commodore,
  },
];

describe('isRankSupported', () => {
  test.each(rankSupportCases)('$label', (testCase) => {
    const { era, supported, unsupported } = testCase;

    expect(UniformVariantRestrictions.isRankSupported(supported, era)).toBe(
      true,
    );
    expect(UniformVariantRestrictions.isRankSupported(unsupported, era)).toBe(
      false,
    );
  });

  test('rank support cases cover every uniform era', () => {
    const testedEras = rankSupportCases.map((testCase) => testCase.era).sort();

    expect(testedEras).toEqual(allUniformEras().sort());
  });
});

describe('getSupportedBodyTypes', () => {
  const erasWithNonBinaryBodyType = [
    UniformEra.Civilian,
    UniformEra.DominionWar,
    UniformEra.Picard25,
    UniformEra.OriginalSeries,
  ];

  test.each(allUniformEras())(
    'returns the expected body types for era %i',
    (era) => {
      const expected = erasWithNonBinaryBodyType.includes(era)
        ? [
            BodyType.AverageMale,
            BodyType.AverageFemale,
            BodyType.AverageNonBinary,
          ]
        : [BodyType.AverageMale, BodyType.AverageFemale];

      expect(UniformVariantRestrictions.getSupportedBodyTypes(era)).toEqual(
        expected,
      );
    },
  );
});
