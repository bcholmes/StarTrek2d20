import { test, expect, describe, jest } from '@jest/globals';
import '../../src/helpers/species';
import { RanksHelper, Rank } from '../../src/helpers/ranks';
import { CharacterType } from '../../src/common/characterType';
import { Era } from '../../src/helpers/erasEnum';
import { SpeciesHelper } from '../../src/helpers/species';
import { Species } from '../../src/helpers/speciesEnum';
import { NpcType } from '../../src/npc/model/npcType';
import { NpcCharacterType } from '../../src/npc/model/npcCharacterType';
import { Specializations } from '../../src/npc/model/specializations';
import { Specialization } from '../../src/common/specializationEnum';
import { NpcGenerator } from '../../src/npc/model/npcGenerator';

jest.mock('i18next', () => {
  const mockI18n: any = (key: string) => key;
  mockI18n.t = (key: string) => key;
  mockI18n.use = function () {
    return this;
  };
  mockI18n.init = function () {
    return this;
  };
  mockI18n.on = function () {
    return this;
  };
  mockI18n.changeLanguage = function () {
    return Promise.resolve();
  };
  return mockI18n;
});

jest.mock('../../src/state/store', () => {
  const core2ndEdition = 1; // Source.Core2ndEdition
  return {
    store: {
      getState: () => ({ context: { sources: [core2ndEdition] } }),
      dispatch: () => undefined,
    },
  };
});

describe('Starfleet Captain rank (#325)', () => {
  test('getRanksByType(Starfleet) includes a Captain rank for 1e', () => {
    const ranks = RanksHelper.instance().getRanksByType(
      CharacterType.Starfleet,
      1,
    );
    const captain = ranks.find((r) => r.id === Rank.Captain);

    expect(captain).toBeDefined();
    expect(captain.name).toBe('Captain');
  });

  test('getRanksByType(Starfleet) includes a Captain rank for 2e', () => {
    const ranks = RanksHelper.instance().getRanksByType(
      CharacterType.Starfleet,
      2,
    );
    const captain = ranks.find((r) => r.id === Rank.Captain);

    expect(captain).toBeDefined();
    expect(captain.name).toBe('Captain');
  });

  test('getRank(Rank.Captain) resolves to a non-null rank', () => {
    const captain = RanksHelper.instance().getRank(Rank.Captain);

    expect(captain).not.toBeNull();
    expect(captain.name).toBe('Captain');
  });

  test('a Starfleet NPC with the Captain specialization gets a Captain rank', async () => {
    const species = SpeciesHelper.getSpeciesByType(Species.Human);
    const npc = await NpcGenerator.createNpc(
      NpcType.Major,
      NpcCharacterType.Starfleet,
      species,
      Specializations.instance.getSpecialization(Specialization.Captain),
      Era.NextGeneration,
      false,
    );

    expect(npc.rank).toBeDefined();
    expect(npc.rank.name).toBe('Captain');
  });
});
