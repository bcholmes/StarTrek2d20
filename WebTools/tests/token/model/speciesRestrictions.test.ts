import { describe, expect, test } from '@jest/globals';
import { Species } from '../../../src/helpers/speciesEnum';
import { ExtraType } from '../../../src/token/model/extrasTypeEnum';
import { HairType, allHairTypes } from '../../../src/token/model/hairTypeEnum';
import { HeadType, allHeadTypes } from '../../../src/token/model/headTypeEnum';
import {
  MouthType,
  allMouthTypes,
} from '../../../src/token/model/mouthTypeEnum';
import { NoseType, allNoseTypes } from '../../../src/token/model/noseTypeEnum';
import { SpeciesOption } from '../../../src/token/model/speciesOptionEnum';
import { SpeciesRestrictions } from '../../../src/token/model/speciesRestrictions';
import {
  UniformEra,
  allUniformEras,
} from '../../../src/token/model/uniformEra';

const allSpecies = (): Species[] => {
  return Object.keys(Species)
    .filter((item) => !isNaN(Number(item)))
    .map((item) => Number(item));
};

describe('SpeciesRestrictions constants', () => {
  test('default drawing colours are exposed as constants', () => {
    expect(SpeciesRestrictions.DEFAULT_SKIN_COLOR).toEqual('#cd976d');
    expect(SpeciesRestrictions.DEFAULT_HAIR_COLOR).toEqual('#383838');
    expect(SpeciesRestrictions.DEFAULT_LIPSTICK_COLOR).toEqual('#a9777a');
    expect(SpeciesRestrictions.LIP_COLOUR.asHex()).toEqual('#f4b39b');
    expect(SpeciesRestrictions.DARK_LIP_COLOUR.asHex()).toEqual('#aa6778');
  });
});

describe('getUniformTypes', () => {
  test('Cetacean supports only Dominion War and Lower Decks eras', () => {
    expect(SpeciesRestrictions.getUniformTypes(Species.Cetacean)).toEqual([
      UniformEra.DominionWar,
      UniformEra.LowerDecks,
    ]);
  });

  test('Edosian supports only Dominion War, Picard 25th, and Original Series eras', () => {
    expect(SpeciesRestrictions.getUniformTypes(Species.Edosian)).toEqual([
      UniformEra.DominionWar,
      UniformEra.Picard25,
      UniformEra.OriginalSeries,
    ]);
  });

  test('Tholian supports no uniform era', () => {
    expect(SpeciesRestrictions.getUniformTypes(Species.Tholian)).toEqual([
      UniformEra.None,
    ]);
  });

  test('Tzenkethi supports only the None and Tzenkethi eras', () => {
    expect(SpeciesRestrictions.getUniformTypes(Species.Tzenkethi)).toEqual([
      UniformEra.None,
      UniformEra.Tzenkethi,
    ]);
  });

  test('other species support every era except None and Tzenkethi', () => {
    expect(SpeciesRestrictions.getUniformTypes(Species.Human)).toEqual(
      allUniformEras().filter(
        (e) => e !== UniformEra.None && e !== UniformEra.Tzenkethi,
      ),
    );
  });
});

describe('getSkinColors', () => {
  test('Orion', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Orion)).toEqual([
      '#a2b152',
      '#8e932f',
      '#8f8f0b',
      '#838218',
      '#7a863a',
      '#6f7f36',
      '#6b764c',
      '#697543',
      '#5d6937',
      '#5a6135',
      '#4c4c1a',
      '#414b26',
    ]);
  });

  test('Aenar', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Aenar)).toEqual([
      '#F1F0F4',
      '#E4E2E9',
      '#DDDBE3',
      '#bcbcc4',
      '#bbb6c7',
    ]);
  });

  test('Andorian', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Andorian)).toEqual([
      '#bbb6c7',
      '#b0c2cc',
      '#a9d8f4',
      '#7ca9e0',
      '#919bd5',
      '#6e87bf',
      '#3e8fb8',
      '#0068a5',
    ]);
  });

  test('Ariolo', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Ariolo)).toEqual([
      '#7c6a61',
      '#626163',
      '#603f31',
    ]);
  });

  test('Aurelian', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Aurelian)).toEqual([
      '#fbebb7',
      '#f7d66f',
      '#e0c167',
      '#b7d562',
      '#b6b456',
      '#b49249',
      '#87622a',
    ]);
  });

  test('Benzite', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Benzite)).toEqual([
      '#b0c2cc',
      '#a9d8f4',
      '#7ca9e0',
      '#919bd5',
      '#6e87bf',
      '#3e8fb8',
    ]);
  });

  test('BlueOrion', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.BlueOrion)).toEqual([
      '#b0c2cc',
      '#a8dad1',
      '#a9d8f4',
      '#6ed8ce',
      '#7ca9e0',
      '#919bd5',
      '#6e87bf',
      '#3e8fb8',
      '#03a6a1',
    ]);
  });

  test('Bynar has a single skin colour', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Bynar)).toEqual([
      '#cda3ce',
    ]);
  });

  test('Cardassian', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Cardassian)).toEqual([
      '#dcd5d0',
      '#c4bab1',
      '#b4a8a8',
      '#998679',
      '#a88872',
    ]);
  });

  test('Bolian', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Bolian)).toEqual([
      '#97c3f2',
      '#87acda',
      '#5883a6',
      '#5772b7',
      '#0665b3',
      '#385f8d',
    ]);
  });

  test('Edosian and Ferengi share a single skin colour', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Edosian)).toEqual([
      '#d18352',
    ]);
    expect(SpeciesRestrictions.getSkinColors(Species.Ferengi)).toEqual([
      '#d18352',
    ]);
  });

  test('Caitian includes the default hair colour constant in its palette', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Caitian)).toEqual([
      '#fdf2dc',
      '#fae9b5',
      '#f0c882',
      '#f9c861',
      '#e9a63d',
      '#e38732',
      '#913c13',
      '#430c05',
      '#4e0300',
      '#811002',
      '#391201',
      '#722707',
      SpeciesRestrictions.DEFAULT_HAIR_COLOR,
      '#37261e',
      '#706f74',
      '#a78c6f',
      '#f1eae4',
      '#f4f3f1',
      '#e1ddda',
    ]);
  });

  test('Efrosian', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Efrosian)).toEqual([
      '#ffd9c6',
      '#d8b092',
      '#e1ad88',
      '#d69972',
      '#d18352',
      '#b06e46',
      '#9e603b',
      '#834b2b',
      '#70432c',
    ]);
  });

  test('Jelna', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Jelna)).toEqual([
      '#f5e5d3',
      '#f0dcca',
      '#decbbe',
      '#d5cbd4',
      '#756352',
    ]);
  });

  test('JemHadar', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.JemHadar)).toEqual([
      '#b7b7b1',
      '#a59f95',
      '#86828a',
      '#7c7972',
    ]);
  });

  test('Reman', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Reman)).toEqual([
      '#ccc9be',
      '#c8d9d6',
      '#b4bdb8',
      '#96a09c',
    ]);
  });

  test('Saurian', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Saurian)).toEqual([
      '#de898a',
      '#ca7882',
      '#b6677a',
      '#a77e86',
      '#989591',
      '#626163',
      '#7c6a61',
      '#603f31',
    ]);
  });

  test('Suliban', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Suliban)).toEqual([
      '#c7b799',
      '#d1ba77',
      '#bea55f',
      '#c6b923',
    ]);
  });

  test('Tzenkethi', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.Tzenkethi)).toEqual([
      '#6d5830',
      '#7b4344',
      '#344453',
      '#504c74',
      '#777398',
      '#524035',
      '#594a3d',
      '#6ca4ab',
    ]);
  });

  test('XindiReptilian', () => {
    expect(SpeciesRestrictions.getSkinColors(Species.XindiReptilian)).toEqual([
      '#bbb895',
      '#aea433',
      '#bba326',
      '#898558',
    ]);
  });

  test('every other species shares the human-like default palette', () => {
    const expected = [
      '#F8E0DE',
      '#F4D5CA',
      '#F2C8B8',
      '#E1BA93',
      '#dcbda1',
      '#CEB29C',
      '#CAA18B',
      SpeciesRestrictions.DEFAULT_SKIN_COLOR,
      '#AB7D5C',
      '#9B7A57',
      '#9b6b43',
      '#8C644A',
      '#704A35',
      '#53382D',
      '#473028',
    ];
    [Species.Human, Species.Vulcan, Species.Bajoran].forEach((species) => {
      expect(SpeciesRestrictions.getSkinColors(species)).toEqual(expected);
    });
  });

  test('every species returns a non-empty palette', () => {
    allSpecies().forEach((species) => {
      const colours = SpeciesRestrictions.getSkinColors(species);
      expect(colours.length).toBeGreaterThan(0);
      colours.forEach((c) => expect(c).toMatch(/^#[0-9a-fA-F]{6}$/));
    });
  });
});

describe('getHeadTypes', () => {
  test('Caitian cannot use the angular or heavy head shapes', () => {
    expect(SpeciesRestrictions.getHeadTypes(Species.Caitian)).toEqual([
      HeadType.SquareJawed,
      HeadType.RoundedAverage,
      HeadType.PointedDelicate,
    ]);
  });

  test('Kelpien, Suliban, and Jelna support only two head shapes', () => {
    [Species.Kelpien, Species.Suliban, Species.Jelna].forEach((species) => {
      expect(SpeciesRestrictions.getHeadTypes(species)).toEqual([
        HeadType.SquareJawed,
        HeadType.RoundedAverage,
      ]);
    });
  });

  test('rubber-headed species other than Benzite get only RoundedAverage', () => {
    [Species.Ariolo, Species.Tholian].forEach((species) => {
      expect(SpeciesRestrictions.getHeadTypes(species)).toEqual([
        HeadType.RoundedAverage,
      ]);
    });
  });

  test('Benzite is rubber-headed but keeps the full default head list', () => {
    expect(SpeciesRestrictions.getHeadTypes(Species.Benzite)).toEqual(
      allHeadTypes(),
    );
  });

  test('Zakdorn supports only the narrow head shapes', () => {
    expect(SpeciesRestrictions.getHeadTypes(Species.Zakdorn)).toEqual([
      HeadType.RoundedNarrow,
      HeadType.SofterNarrow,
      HeadType.PointedDelicate,
      HeadType.Elfin,
    ]);
  });

  test('other species get every head shape', () => {
    [Species.Human, Species.Vulcan].forEach((species) => {
      expect(SpeciesRestrictions.getHeadTypes(species)).toEqual(allHeadTypes());
    });
  });

  test('every species returns a non-empty list', () => {
    allSpecies().forEach((species) => {
      expect(SpeciesRestrictions.getHeadTypes(species).length).toBeGreaterThan(
        0,
      );
    });
  });
});

describe('getEyeColors', () => {
  test('Betazoid and Saurian have only black eyes', () => {
    expect(SpeciesRestrictions.getEyeColors(Species.Betazoid)).toEqual([
      '#111111',
    ]);
    expect(SpeciesRestrictions.getEyeColors(Species.Saurian)).toEqual([
      '#111111',
    ]);
  });

  test('Aenar has only white eyes', () => {
    expect(SpeciesRestrictions.getEyeColors(Species.Aenar)).toEqual([
      '#dddddd',
    ]);
  });

  test('every other species gets the full palette', () => {
    expect(SpeciesRestrictions.getEyeColors(Species.Human)).toEqual([
      '#dddddd',
      '#e1bbc3',
      '#8bb5db',
      '#4079c0',
      '#b4b8b9',
      '#8e9796',
      '#758a9d',
      '#88967d',
      '#6e9d4d',
      '#fdd089',
      '#fbb03b',
      '#aa6925',
      '#863603',
      '#56220c',
      '#3f0c08',
      '#280000',
    ]);
  });

  test('every species returns a non-empty palette', () => {
    allSpecies().forEach((species) => {
      expect(SpeciesRestrictions.getEyeColors(species).length).toBeGreaterThan(
        0,
      );
    });
  });
});

describe('getMouthTypes', () => {
  test('Pakled also supports Mouth7 and Mouth8', () => {
    expect(SpeciesRestrictions.getMouthTypes(Species.Pakled)).toEqual(
      allMouthTypes(),
    );
  });

  test('Zakdorn gets only Mouth1', () => {
    expect(SpeciesRestrictions.getMouthTypes(Species.Zakdorn)).toEqual([
      MouthType.Mouth1,
    ]);
  });

  test('other species get Mouth1 through Mouth6 plus lipstick variants', () => {
    expect(SpeciesRestrictions.getMouthTypes(Species.Human)).toEqual([
      MouthType.Mouth1,
      MouthType.Mouth2,
      MouthType.Mouth3,
      MouthType.Mouth4,
      MouthType.Mouth5,
      MouthType.Mouth6,
      MouthType.Mouth1Lipstick,
      MouthType.Mouth2Lipstick,
      MouthType.Mouth3Lipstick,
      MouthType.Mouth4Lipstick,
      MouthType.Mouth5Lipstick,
      MouthType.Mouth6Lipstick,
    ]);
  });

  test('every species returns a non-empty list', () => {
    allSpecies().forEach((species) => {
      expect(SpeciesRestrictions.getMouthTypes(species).length).toBeGreaterThan(
        0,
      );
    });
  });
});

describe('getDefaultEyeColor', () => {
  test('picks the middle colour of the palette', () => {
    expect(SpeciesRestrictions.getDefaultEyeColor(Species.Human)).toEqual(
      '#6e9d4d',
    );
  });

  test('a single-colour palette picks its only colour', () => {
    expect(SpeciesRestrictions.getDefaultEyeColor(Species.Betazoid)).toEqual(
      '#111111',
    );
  });
});

describe('getHairColors', () => {
  test('Aenar, Andorian, and Efrosian share a pale palette', () => {
    [Species.Aenar, Species.Andorian, Species.Efrosian].forEach((species) => {
      expect(SpeciesRestrictions.getHairColors(species)).toEqual([
        '#fdf2dc',
        '#f8edf3',
        '#bbbbbb',
        '#dddddd',
      ]);
    });
  });

  test('every other species gets the full palette including the default hair colour', () => {
    expect(SpeciesRestrictions.getHairColors(Species.Human)).toContain(
      SpeciesRestrictions.DEFAULT_HAIR_COLOR,
    );
    expect(SpeciesRestrictions.getHairColors(Species.Human)).toHaveLength(45);
  });

  test('every species returns a non-empty palette', () => {
    allSpecies().forEach((species) => {
      expect(SpeciesRestrictions.getHairColors(species).length).toBeGreaterThan(
        0,
      );
    });
  });
});

describe('getLipstickColors', () => {
  test('is species-independent', () => {
    const lipstick = [
      '#a9777a',
      '#8f575a',
      '#783d53',
      '#852d67',
      '#81152b',
      '#e1272a',
      '#c5232e',
      '#e02d40',
      '#9e2632',
      '#95242a',
      '#c77f70',
      '#e45e69',
      '#ce5c56',
      '#c24853',
      '#e92154',
      '#e595bf',
      '#ef4b8c',
      '#e856bb',
      '#ac4f7e',
      '#be2d70',
      '#c36f93',
      '#ca6a85',
      '#cd5d89',
      '#a63f5c',
      '#ad4f5d',
      '#de928f',
      '#ec909b',
      '#e2889e',
      '#d67788',
      '#c89898',
    ];
    expect(SpeciesRestrictions.getLipstickColors(Species.Human)).toEqual(
      lipstick,
    );
    expect(SpeciesRestrictions.getLipstickColors(Species.Cetacean)).toEqual(
      lipstick,
    );
  });
});

describe('getHairTypes', () => {
  test('Jelna is rubber-headed but still allows every hair type', () => {
    expect(SpeciesRestrictions.getHairTypes(Species.Jelna)).toEqual(
      allHairTypes(),
    );
  });

  test('bald species can only be bald', () => {
    [
      Species.Benzite,
      Species.Bolian,
      Species.Deltan,
      Species.Ferengi,
      Species.Saurian,
      Species.Talaxian,
      Species.XindiReptilian,
    ].forEach((species) => {
      expect(SpeciesRestrictions.getHairTypes(species)).toEqual([
        HairType.Bald,
      ]);
    });
  });

  test('rubber-headed species can only be bald', () => {
    expect(SpeciesRestrictions.getHairTypes(Species.Ariolo)).toEqual([
      HairType.Bald,
    ]);
  });

  test('Andorian cannot use corn rows', () => {
    expect(SpeciesRestrictions.getHairTypes(Species.Andorian)).toEqual(
      allHairTypes().filter((h) => h !== HairType.CornRows),
    );
  });

  test('Cardassian excludes four hair types', () => {
    expect(SpeciesRestrictions.getHairTypes(Species.Cardassian)).toEqual(
      allHairTypes().filter(
        (h) =>
          ![
            HairType.CornRows,
            HairType.ChinLengthCombBack,
            HairType.RomulanPeakedHair,
            HairType.ShoulderLengthBob,
          ].includes(h),
      ),
    );
  });

  test('tall-foreheaded species can only use tall-forehead hair', () => {
    [
      Species.Efrosian,
      Species.Klingon,
      Species.Ktarian,
      Species.Napean,
      Species.Tellarite,
      Species.XindiPrimate,
    ].forEach((species) => {
      expect(SpeciesRestrictions.getHairTypes(species)).toEqual([
        HairType.Bald,
        HairType.Balding,
        HairType.Receding,
        HairType.HighForeheadEfrosianStyle,
        HairType.KlingonHair1,
        HairType.KlingonHair2,
        HairType.KlingonHair3,
        HairType.Mature,
        HairType.StraightCombedBackShort,
        HairType.StraightCombedBackMedium,
        HairType.SidePartSweptBack,
      ]);
    });
  });

  test('other species get every hair type', () => {
    expect(SpeciesRestrictions.getHairTypes(Species.Human)).toEqual(
      allHairTypes(),
    );
  });
});

describe('getDefaultHairType', () => {
  test('Efrosian defaults to its signature style', () => {
    expect(SpeciesRestrictions.getDefaultHairType(Species.Efrosian)).toEqual(
      HairType.HighForeheadEfrosianStyle,
    );
  });

  test('Cardassian defaults to straight combed back', () => {
    expect(SpeciesRestrictions.getDefaultHairType(Species.Cardassian)).toEqual(
      HairType.StraightCombedBackShort,
    );
  });

  test('other species default to the first available hair type', () => {
    expect(SpeciesRestrictions.getDefaultHairType(Species.Human)).toEqual(
      HairType.Bald,
    );
  });
});

describe('isFacialHairSupportedFor', () => {
  test('is false for every bald species', () => {
    [
      Species.Benzite,
      Species.Bolian,
      Species.Deltan,
      Species.Ferengi,
      Species.Saurian,
      Species.Talaxian,
      Species.XindiReptilian,
    ].forEach((species) => {
      expect(SpeciesRestrictions.isFacialHairSupportedFor(species)).toBe(false);
    });
  });

  test('is false for rubber-headed species', () => {
    expect(SpeciesRestrictions.isFacialHairSupportedFor(Species.Ariolo)).toBe(
      false,
    );
  });

  test('is true for other species', () => {
    expect(SpeciesRestrictions.isFacialHairSupportedFor(Species.Human)).toBe(
      true,
    );
  });
});

describe('isHairCoveringForehead', () => {
  test.each([
    HairType.BowlCutHair,
    HairType.TousledSidePart,
    HairType.MediumLengthFemaleSidePart,
    HairType.ShoulderLengthBob,
    HairType.ShortTeasedOverEyeStyle,
    HairType.FeminineDreadStyle,
    HairType.RomulanPeakedHair,
  ])('is true for %s', (hair) => {
    expect(SpeciesRestrictions.isHairCoveringForehead(hair)).toBe(true);
  });

  test('is false for bald and other exposed-forehead styles', () => {
    expect(SpeciesRestrictions.isHairCoveringForehead(HairType.Bald)).toBe(
      false,
    );
    expect(SpeciesRestrictions.isHairCoveringForehead(HairType.SidePart)).toBe(
      false,
    );
  });
});

describe('isOptionsSupportedFor', () => {
  test('is true for species with multiple drawing options', () => {
    [
      Species.Bolian,
      Species.Ferengi,
      Species.Klingon,
      Species.Romulan,
      Species.Talaxian,
      Species.Tellarite,
    ].forEach((species) => {
      expect(SpeciesRestrictions.isOptionsSupportedFor(species)).toBe(true);
    });
  });

  test('is false for species with a single drawing option', () => {
    expect(SpeciesRestrictions.isOptionsSupportedFor(Species.Human)).toBe(
      false,
    );
  });
});

describe('isExtraAvailableFor', () => {
  type ExtraCase = {
    label: string;
    extra: ExtraType;
    primary: Species;
    secondary?: Species;
    era?: UniformEra;
    expected: boolean;
  };

  const cases: ExtraCase[] = [
    {
      label: 'Bajoran earring is for Bajorans',
      extra: ExtraType.BajoranEarring,
      primary: Species.Bajoran,
      expected: true,
    },
    {
      label: 'Bajoran earring is not for Humans',
      extra: ExtraType.BajoranEarring,
      primary: Species.Human,
      expected: false,
    },
    {
      label: 'Bajoran earring follows the secondary species for Liberated Borg',
      extra: ExtraType.BajoranEarring,
      primary: Species.LiberatedBorg,
      secondary: Species.Bajoran,
      expected: true,
    },
    {
      label: 'Bynar headpiece 1 is for Bynars',
      extra: ExtraType.BynarHeadpiece1,
      primary: Species.Bynar,
      expected: true,
    },
    {
      label: 'Bynar headpiece 2 is for Bynars',
      extra: ExtraType.BynarHeadpiece2,
      primary: Species.Bynar,
      expected: true,
    },
    {
      label: 'Bynar headpieces are not for Humans',
      extra: ExtraType.BynarHeadpiece1,
      primary: Species.Human,
      expected: false,
    },
    {
      label: 'simple earring is fine for Humans',
      extra: ExtraType.SimpleEarring,
      primary: Species.Human,
      expected: true,
    },
    {
      label: 'simple earring is not for Bolians',
      extra: ExtraType.SimpleEarring,
      primary: Species.Bolian,
      expected: false,
    },
    {
      label: 'simple earring is not for Ferengi',
      extra: ExtraType.SimpleEarring,
      primary: Species.Ferengi,
      expected: false,
    },
    {
      label: 'simple earring is not for rubber-headed species',
      extra: ExtraType.SimpleEarring,
      primary: Species.Ariolo,
      expected: false,
    },
    {
      label: 'hoop earring is fine for Humans',
      extra: ExtraType.HoopEarring,
      primary: Species.Human,
      expected: true,
    },
    {
      label: 'Risan symbol is for Risians',
      extra: ExtraType.RisanSymbol,
      primary: Species.Risian,
      expected: true,
    },
    {
      label: 'Risan symbol is not for Humans',
      extra: ExtraType.RisanSymbol,
      primary: Species.Human,
      expected: false,
    },
    {
      label: 'small bindi is for Humans',
      extra: ExtraType.SmallBindi,
      primary: Species.Human,
      expected: true,
    },
    {
      label: 'Inuit tattoo is for Humans',
      extra: ExtraType.InuitTattoo,
      primary: Species.Human,
      expected: true,
    },
    {
      label: 'small bindi is not for Vulcans',
      extra: ExtraType.SmallBindi,
      primary: Species.Vulcan,
      expected: false,
    },
    {
      label: 'Ferengi head flap is for Ferengi',
      extra: ExtraType.FerengiHeadFlap,
      primary: Species.Ferengi,
      expected: true,
    },
    {
      label: 'Ferengi head flap is not for Humans',
      extra: ExtraType.FerengiHeadFlap,
      primary: Species.Human,
      expected: false,
    },
    {
      label: 'Ferengi rank tattoo requires the Ferengi era',
      extra: ExtraType.FerengiRankTattoo,
      primary: Species.Ferengi,
      era: UniformEra.Ferengi,
      expected: true,
    },
    {
      label: 'Ferengi rank tattoo is unavailable in other eras',
      extra: ExtraType.FerengiRankTattoo,
      primary: Species.Ferengi,
      era: UniformEra.NextGeneration,
      expected: false,
    },
    {
      label: 'Orion pieces are for Orions',
      extra: ExtraType.OrionPiece1,
      primary: Species.Orion,
      expected: true,
    },
    {
      label: 'Orion piece 2 is for Orions',
      extra: ExtraType.OrionPiece2,
      primary: Species.Orion,
      expected: true,
    },
    {
      label: 'Orion piece 3 is for Orions',
      extra: ExtraType.OrionPiece3,
      primary: Species.Orion,
      expected: true,
    },
    {
      label: 'Orion pieces are not for Humans',
      extra: ExtraType.OrionPiece1,
      primary: Species.Human,
      expected: false,
    },
    {
      label: 'Vulcan headdress requires the Civilian era',
      extra: ExtraType.VulcanHeaddress,
      primary: Species.Vulcan,
      era: UniformEra.Civilian,
      expected: true,
    },
    {
      label: 'Vulcan headdress is unavailable in other eras',
      extra: ExtraType.VulcanHeaddress,
      primary: Species.Vulcan,
      era: UniformEra.NextGeneration,
      expected: false,
    },
    {
      label: 'Zaranite mask is for Zaranites',
      extra: ExtraType.ZaraniteMask,
      primary: Species.Zaranite,
      expected: true,
    },
    {
      label: 'Zaranite mask is not for Humans',
      extra: ExtraType.ZaraniteMask,
      primary: Species.Human,
      expected: false,
    },
    {
      label: 'freckles are for Humans',
      extra: ExtraType.Freckles,
      primary: Species.Human,
      expected: true,
    },
    {
      label: 'freckles are for Hailiians',
      extra: ExtraType.Freckles,
      primary: Species.Haliian,
      expected: true,
    },
    {
      label: 'freckles are for Ardanans',
      extra: ExtraType.Freckles,
      primary: Species.Ardanan,
      expected: true,
    },
    {
      label: 'freckles are for Andorians',
      extra: ExtraType.Freckles,
      primary: Species.Andorian,
      expected: true,
    },
    {
      label: 'freckles are not for Vulcans',
      extra: ExtraType.Freckles,
      primary: Species.Vulcan,
      expected: false,
    },
    {
      label: 'security helmet is available in the Monster Maroon era',
      extra: ExtraType.SecurityHelmet,
      primary: Species.Human,
      era: UniformEra.MonsterMaroon,
      expected: true,
    },
    {
      label: 'security helmet is available in the Motion Picture era',
      extra: ExtraType.SecurityHelmet,
      primary: Species.Human,
      era: UniformEra.TheMotionPicture,
      expected: true,
    },
    {
      label: 'security helmet is unavailable in other eras',
      extra: ExtraType.SecurityHelmet,
      primary: Species.Human,
      era: UniformEra.NextGeneration,
      expected: false,
    },
    {
      label: 'security helmet is unavailable for rubber-headed species',
      extra: ExtraType.SecurityHelmet,
      primary: Species.Ariolo,
      era: UniformEra.MonsterMaroon,
      expected: false,
    },
    {
      label: 'visor is fine for Humans',
      extra: ExtraType.Visor,
      primary: Species.Human,
      expected: true,
    },
    {
      label: 'visor is not for Cetaceans',
      extra: ExtraType.Visor,
      primary: Species.Cetacean,
      expected: false,
    },
    {
      label: 'visor is not for Tholians',
      extra: ExtraType.Visor,
      primary: Species.Tholian,
      expected: false,
    },
    {
      label: 'visor is not for Tzenkethi',
      extra: ExtraType.Visor,
      primary: Species.Tzenkethi,
      expected: false,
    },
    {
      label: 'visor is not for Liberated Borg regardless of secondary species',
      extra: ExtraType.Visor,
      primary: Species.LiberatedBorg,
      secondary: Species.Human,
      expected: false,
    },
    {
      label: 'Borg cheek implant is for Liberated Borg',
      extra: ExtraType.BorgCheekImplant1,
      primary: Species.LiberatedBorg,
      secondary: Species.Human,
      expected: true,
    },
    {
      label: 'Borg jaw implant is for Liberated Borg',
      extra: ExtraType.BorgJawImplant2,
      primary: Species.LiberatedBorg,
      secondary: Species.Human,
      expected: true,
    },
    {
      label: 'Borg eyebrow implant is for Liberated Borg',
      extra: ExtraType.BorgEyebrowImplant3,
      primary: Species.LiberatedBorg,
      secondary: Species.Human,
      expected: true,
    },
    {
      label: 'Borg eye implant 4 is for Liberated Borg',
      extra: ExtraType.BorgEyeImplant4,
      primary: Species.LiberatedBorg,
      secondary: Species.Human,
      expected: true,
    },
    {
      label: 'Borg eye implant 5 is for Liberated Borg',
      extra: ExtraType.BorgEyeImplant5,
      primary: Species.LiberatedBorg,
      secondary: Species.Human,
      expected: true,
    },
    {
      label: 'Borg eye implant 6 is for Liberated Borg',
      extra: ExtraType.BorgEyeImplant6,
      primary: Species.LiberatedBorg,
      secondary: Species.Human,
      expected: true,
    },
    {
      label: 'Borg implants are not for plain Humans',
      extra: ExtraType.BorgCheekImplant1,
      primary: Species.Human,
      secondary: Species.LiberatedBorg,
      expected: false,
    },
    {
      label: 'unhandled extras fall back to available',
      extra: ExtraType.None,
      primary: Species.Human,
      expected: true,
    },
  ];

  test.each(cases)('$label', (c) => {
    expect(
      SpeciesRestrictions.isExtraAvailableFor(
        c.extra,
        c.primary,
        c.secondary ?? Species.Human,
        c.era ?? UniformEra.NextGeneration,
      ),
    ).toBe(c.expected);
  });
});

describe('isBald', () => {
  test('is true for the bald species', () => {
    [
      Species.Benzite,
      Species.Bolian,
      Species.Deltan,
      Species.Ferengi,
      Species.Saurian,
      Species.Talaxian,
      Species.XindiReptilian,
    ].forEach((species) => {
      expect(SpeciesRestrictions.isBald(species)).toBe(true);
    });
  });

  test('is false for other species', () => {
    expect(SpeciesRestrictions.isBald(Species.Human)).toBe(false);
  });
});

describe('isTallForeheaded', () => {
  test('is true for the tall-foreheaded species', () => {
    [
      Species.Efrosian,
      Species.Klingon,
      Species.Ktarian,
      Species.Napean,
      Species.Tellarite,
      Species.XindiPrimate,
    ].forEach((species) => {
      expect(SpeciesRestrictions.isTallForeheaded(species)).toBe(true);
    });
  });

  test('is false for other species', () => {
    expect(SpeciesRestrictions.isTallForeheaded(Species.Human)).toBe(false);
  });
});

describe('isRubberHeaded', () => {
  test('is true for the rubber-headed species', () => {
    [
      Species.Ariolo,
      Species.Aurelian,
      Species.Bynar,
      Species.Benzite,
      Species.Caitian,
      Species.Cetacean,
      Species.Edosian,
      Species.Grazerite,
      Species.Jelna,
      Species.JemHadar,
      Species.Kelpien,
      Species.Reman,
      Species.Saurian,
      Species.Suliban,
      Species.Tholian,
      Species.Tzenkethi,
      Species.XindiArboreal,
      Species.XindiReptilian,
      Species.Yridian,
      Species.Zaranite,
    ].forEach((species) => {
      expect(SpeciesRestrictions.isRubberHeaded(species)).toBe(true);
    });
  });

  test('is false for other species', () => {
    expect(SpeciesRestrictions.isRubberHeaded(Species.Human)).toBe(false);
  });
});

describe('getSpeciesOptions', () => {
  test('Bolian has two drawing options', () => {
    expect(SpeciesRestrictions.getSpeciesOptions(Species.Bolian)).toEqual([
      SpeciesOption.Option1,
      SpeciesOption.Option2,
    ]);
  });

  test('Ferengi has three drawing options', () => {
    expect(SpeciesRestrictions.getSpeciesOptions(Species.Ferengi)).toEqual([
      SpeciesOption.Option1,
      SpeciesOption.Option2,
      SpeciesOption.Option3,
    ]);
  });

  test('Klingon has seven drawing options', () => {
    expect(SpeciesRestrictions.getSpeciesOptions(Species.Klingon)).toEqual([
      SpeciesOption.Option1,
      SpeciesOption.Option2,
      SpeciesOption.Option3,
      SpeciesOption.Option4,
      SpeciesOption.Option5,
      SpeciesOption.Option6,
      SpeciesOption.Option7,
    ]);
  });

  test('Romulan, Talaxian, and Tellarite have two drawing options', () => {
    [Species.Romulan, Species.Talaxian, Species.Tellarite].forEach(
      (species) => {
        expect(SpeciesRestrictions.getSpeciesOptions(species)).toEqual([
          SpeciesOption.Option1,
          SpeciesOption.Option2,
        ]);
      },
    );
  });

  test('other species have a single drawing option', () => {
    expect(SpeciesRestrictions.getSpeciesOptions(Species.Human)).toEqual([
      SpeciesOption.Option1,
    ]);
  });
});

describe('getNoseTypes', () => {
  test('Cardassian, Ferengi, Talaxian, Tellarite, and Zakdorn get only the straight basic nose', () => {
    [
      Species.Cardassian,
      Species.Ferengi,
      Species.Talaxian,
      Species.Tellarite,
      Species.Zakdorn,
    ].forEach((species) => {
      expect(SpeciesRestrictions.getNoseTypes(species)).toEqual([
        NoseType.StraightBasic,
      ]);
    });
  });

  test('other species get every nose shape', () => {
    expect(SpeciesRestrictions.getNoseTypes(Species.Human)).toEqual(
      allNoseTypes(),
    );
  });
});

describe('isHumanLikeSkinColouring', () => {
  test('is true for Humans', () => {
    expect(SpeciesRestrictions.isHumanLikeSkinColouring(Species.Human)).toBe(
      true,
    );
  });

  test('is true for species sharing the default palette', () => {
    expect(SpeciesRestrictions.isHumanLikeSkinColouring(Species.Vulcan)).toBe(
      true,
    );
  });

  test('is false for species with their own palette', () => {
    expect(SpeciesRestrictions.isHumanLikeSkinColouring(Species.Orion)).toBe(
      false,
    );
  });
});

describe('isDarkSkinned', () => {
  test('uses the middle of the human-like palette as the threshold', () => {
    const humanColours = SpeciesRestrictions.getSkinColors(Species.Human);
    expect(
      SpeciesRestrictions.isDarkSkinned(
        Species.Human,
        humanColours[humanColours.length - 1],
      ),
    ).toBe(true);
    expect(SpeciesRestrictions.isDarkSkinned(Species.Human, '#cd976d')).toBe(
      true,
    );
    expect(SpeciesRestrictions.isDarkSkinned(Species.Human, '#CAA18B')).toBe(
      false,
    );
    expect(
      SpeciesRestrictions.isDarkSkinned(Species.Human, humanColours[0]),
    ).toBe(false);
  });

  test('is false for species without human-like colouring', () => {
    expect(SpeciesRestrictions.isDarkSkinned(Species.Orion, '#a2b152')).toBe(
      false,
    );
  });

  test('is false for colours outside the palette', () => {
    expect(SpeciesRestrictions.isDarkSkinned(Species.Human, '#000000')).toBe(
      false,
    );
  });
});
