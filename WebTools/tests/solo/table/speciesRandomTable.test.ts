import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { speciesRandomTable } from '../../../src/solo/table/speciesRandomTable';
import { Era } from '../../../src/helpers/erasEnum';
import { Species } from '../../../src/helpers/speciesEnum';

const enterpriseSpeciesByRoll: Species[] = [
  Species.Aenar,
  Species.Andorian,
  Species.Arbazan,
  Species.Denobulan,
  Species.Gorn,
  Species.Human,
  Species.Illyrian,
  Species.Klingon,
  Species.Klingon,
  Species.Orion,
  Species.Reman,
  Species.Risian,
  Species.Romulan,
  Species.Suliban,
  Species.Tellarite,
  Species.Vulcan,
  Species.XindiArboreal,
  Species.XindiInsectoid,
  Species.XindiPrimate,
  Species.XindiReptilian,
];

const originalSeriesSpeciesByRoll: Species[] = [
  Species.Ardanan,
  Species.Aurelian,
  Species.Barzan,
  Species.Betazoid,
  Species.Bolian,
  Species.Caitian,
  Species.CyberneticallyEnhanced,
  Species.Deltan,
  Species.Edosian,
  Species.Efrosian,
  Species.Horta,
  Species.Human,
  Species.Kelpien,
  Species.Kzinti,
  Species.Osnullus,
  Species.Saurian,
  Species.Tholian,
  Species.Trill,
  Species.Xahean,
  Species.Zaranite,
];

const nextGenerationSpeciesByRoll: Species[] = [
  Species.Bajoran,
  Species.Benzite,
  Species.Bynar,
  Species.Cardassian,
  Species.Changeling,
  Species.Doopler,
  Species.Hologram,
  Species.Human,
  Species.JemHadar,
  Species.Kazon,
  Species.LiberatedBorg,
  Species.Lurian,
  Species.Ocampa,
  Species.Pakled,
  Species.Paradan,
  Species.Sikarian,
  Species.Android,
  Species.Talaxian,
  Species.Tamarian,
  Species.Zakdorn,
];

const expectSpeciesTable = (
  era: Era,
  randomValue: number,
  expected: Species[],
) => {
  jest.spyOn(Math, 'random').mockReturnValue(randomValue);
  const spy = jest.spyOn(D20, 'roll');

  expected.forEach((species, index) => {
    spy.mockReturnValueOnce(index + 1);
    expect(speciesRandomTable(era)).toBe(species);
  });

  spy.mockReturnValueOnce(21);
  expect(speciesRandomTable(era)).toBeUndefined();
};

describe('speciesRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns every Enterprise species for rolls 1-20', () => {
    expectSpeciesTable(Era.Enterprise, 0, enterpriseSpeciesByRoll);
  });

  test('returns every Original Series species for rolls 1-20', () => {
    expectSpeciesTable(Era.OriginalSeries, 0.99, originalSeriesSpeciesByRoll);
  });

  test('returns every Next Generation species for rolls 1-20', () => {
    expectSpeciesTable(Era.NextGeneration, 0.99, nextGenerationSpeciesByRoll);
  });

  test('clamps later eras to the Next Generation table', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
    jest.spyOn(D20, 'roll').mockReturnValue(1);

    expect(speciesRandomTable(Era.Discovery32)).toBe(Species.Bajoran);
  });
});
