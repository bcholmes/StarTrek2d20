import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { spaceframeRandomTable } from '../../../src/solo/table/starshipRandomTable';
import { Era } from '../../../src/helpers/erasEnum';
import { Spaceframe } from '../../../src/helpers/spaceframeEnum';

const enterpriseSpaceframesByRoll: Spaceframe[] = [
  Spaceframe.Daedalus_UP,
  Spaceframe.Daedalus_UP,
  Spaceframe.Daedalus_UP,
  Spaceframe.Daedalus_UP,
  Spaceframe.IntrepidType,
  Spaceframe.IntrepidType,
  Spaceframe.IntrepidType,
  Spaceframe.IntrepidType,
  Spaceframe.JClassYClass,
  Spaceframe.JClassYClass,
  Spaceframe.JClassYClass,
  Spaceframe.JClassYClass,
  Spaceframe.NX_UP,
  Spaceframe.NX_UP,
  Spaceframe.NX_UP,
  Spaceframe.NX_UP,
  Spaceframe.Delta,
  Spaceframe.Delta,
  Spaceframe.Delta,
  Spaceframe.Delta,
];

const originalSeriesSpaceframesByRoll: Spaceframe[] = [
  Spaceframe.Antares,
  Spaceframe.Archer,
  Spaceframe.Cardenas,
  Spaceframe.Constellation_UP,
  Spaceframe.Constitution_UP,
  Spaceframe.Crossfield,
  Spaceframe.Engle,
  Spaceframe.Excelsior_UP,
  Spaceframe.Hiawatha,
  Spaceframe.Hoover,
  Spaceframe.Magee,
  Spaceframe.Malachowski,
  Spaceframe.Miranda_UP,
  Spaceframe.Nimitz,
  Spaceframe.Oberth_UP,
  Spaceframe.ScoutType,
  Spaceframe.Shepard,
  Spaceframe.Soyuz,
  Spaceframe.Sydney,
  Spaceframe.Walker,
];

const nextGenerationSpaceframesByRoll: Spaceframe[] = [
  Spaceframe.Akira_UP,
  Spaceframe.Ambassador_UP,
  Spaceframe.Challenger,
  Spaceframe.Cheyenne,
  Spaceframe.Defiant_UP,
  Spaceframe.Freedom,
  Spaceframe.Freedom,
  Spaceframe.Galaxy,
  Spaceframe.Intrepid_UP,
  Spaceframe.Nebula_UP,
  Spaceframe.NewOrleans,
  Spaceframe.Niagara,
  Spaceframe.Norway_UP,
  Spaceframe.Nova,
  Spaceframe.Olympic_UP,
  Spaceframe.RavenType,
  Spaceframe.Saber,
  Spaceframe.Springfield,
  Spaceframe.Steamrunner_UP,
  Spaceframe.Steamrunner_UP,
];

const picardProdigySpaceframesByRoll: Spaceframe[] = [
  Spaceframe.Gagarin,
  Spaceframe.Gagarin,
  Spaceframe.Inquiry,
  Spaceframe.Inquiry,
  Spaceframe.Inquiry,
  Spaceframe.Luna_UP,
  Spaceframe.Odyssey,
  Spaceframe.Pathfinder,
  Spaceframe.Pathfinder,
  Spaceframe.Pathfinder,
  Spaceframe.Pathfinder,
  Spaceframe.Prometheus,
  Spaceframe.Prometheus,
  Spaceframe.Reliant,
  Spaceframe.Reliant,
  Spaceframe.Ross,
  Spaceframe.Ross,
  Spaceframe.Sovereign_UP,
  Spaceframe.Vesta,
  Spaceframe.Vesta,
];

const discovery32SpaceframesByRoll: Spaceframe[] = [
  Spaceframe.Angelou,
  Spaceframe.Angelou,
  Spaceframe.Angelou,
  Spaceframe.Angelou,
  Spaceframe.Eisenberg,
  Spaceframe.Eisenberg,
  Spaceframe.Eisenberg,
  Spaceframe.Eisenberg,
  Spaceframe.Friendship,
  Spaceframe.Friendship,
  Spaceframe.Friendship,
  Spaceframe.Friendship,
  Spaceframe.Janeway,
  Spaceframe.Janeway,
  Spaceframe.Janeway,
  Spaceframe.Janeway,
  Spaceframe.Kirk,
  Spaceframe.Kirk,
  Spaceframe.Kirk,
  Spaceframe.Kirk,
];

const expectSpaceframeTable = (
  era: Era,
  expected: Spaceframe[],
  fallback: Spaceframe,
) => {
  const spy = jest.spyOn(D20, 'roll');

  expected.forEach((spaceframe, index) => {
    spy.mockReturnValueOnce(index + 1);
    expect(spaceframeRandomTable(era)).toBe(spaceframe);
  });

  spy.mockReturnValueOnce(21);
  expect(spaceframeRandomTable(era)).toBe(fallback);
};

describe('starshipRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns every Enterprise spaceframe for rolls 1-20', () => {
    expectSpaceframeTable(
      Era.Enterprise,
      enterpriseSpaceframesByRoll,
      Spaceframe.Delta,
    );
  });

  test('returns every Original Series spaceframe for rolls 1-20', () => {
    expectSpaceframeTable(
      Era.OriginalSeries,
      originalSeriesSpaceframesByRoll,
      Spaceframe.Walker,
    );
  });

  test('returns every Next Generation spaceframe for rolls 1-20', () => {
    expectSpaceframeTable(
      Era.NextGeneration,
      nextGenerationSpaceframesByRoll,
      Spaceframe.Steamrunner_UP,
    );
  });

  test('returns every Picard/Prodigy spaceframe for rolls 1-20', () => {
    expectSpaceframeTable(
      Era.PicardProdigy,
      picardProdigySpaceframesByRoll,
      Spaceframe.Vesta,
    );
  });

  test('returns every Discovery 32nd century spaceframe for rolls 1-20', () => {
    expectSpaceframeTable(
      Era.Discovery32,
      discovery32SpaceframesByRoll,
      Spaceframe.Kirk,
    );
  });
});
