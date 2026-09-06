import {
  test,
  expect,
  describe,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import '../../src/helpers/species';
import { Character } from '../../src/common/character';
import { CharacterType } from '../../src/common/characterType';
import { Era } from '../../src/helpers/erasEnum';
import { Role, RolesHelper } from '../../src/helpers/roles';
import { FoundryVttExporter } from '../../src/vtt/foundryVttExporter';
import { FoundryPluginType } from '../../src/vtt/foundryPluginType';
import {
  makePopulatedMainCharacter,
  makePopulatedStarship,
  makePopulatedStation,
} from './vttFixtures';

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

const characterWeapons = (result: any) =>
  result.items.filter(
    (item: any) =>
      item.type === 'characterweapon' || item.type === 'characterweapon2e',
  );

function exportedCharacter(version: 1 | 2) {
  const character = Character.createMainCharacter(
    CharacterType.Starfleet,
    Era.NextGeneration,
    version,
  );
  return FoundryVttExporter.instance.exportCharacter(
    character,
    FoundryPluginType.Standard,
  );
}

describe('FoundryVTT character export (#257)', () => {
  test('exports 2e character weapons as characterweapon2e', () => {
    const result = exportedCharacter(2);
    const weapons = characterWeapons(result);

    expect(weapons.length).toBeGreaterThan(0);
    expect(weapons.every((w) => w.type === 'characterweapon2e')).toBe(true);
  });

  test('exports 1e character weapons as characterweapon', () => {
    const result = exportedCharacter(1);
    const weapons = characterWeapons(result);

    expect(weapons.length).toBeGreaterThan(0);
    expect(weapons.every((w) => w.type === 'characterweapon')).toBe(true);
  });

  test('exports the role only in characterrole and the ship only in assignment', () => {
    const character = Character.createMainCharacter(
      CharacterType.Starfleet,
      Era.NextGeneration,
      2,
    );
    character.role = Role.ChiefEngineer;
    character.assignedShip = 'USS Enterprise';

    const result = FoundryVttExporter.instance.exportCharacter(
      character,
      FoundryPluginType.Standard,
    );

    const expectedRole = RolesHelper.instance.getRole(
      Role.ChiefEngineer,
      CharacterType.Starfleet,
    )?.name;
    expect(result.system.assignment).toBe('USS Enterprise');
    expect(result.system.characterrole).toBe(expectedRole);
    expect(result.system.assignment).not.toContain('Chief');
    expect(result.system.characterrole).not.toContain('Enterprise');
  });
});

describe('FoundryVTT export golden output', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('exports a fully-populated 2e character', () => {
    const result = FoundryVttExporter.instance.exportCharacter(
      makePopulatedMainCharacter(2),
      FoundryPluginType.Standard,
    );
    expect(JSON.stringify(result, null, 4)).toMatchSnapshot();
  });

  test('exports a fully-populated 1e character', () => {
    const result = FoundryVttExporter.instance.exportCharacter(
      makePopulatedMainCharacter(1),
      FoundryPluginType.Standard,
    );
    expect(JSON.stringify(result, null, 4)).toMatchSnapshot();
  });

  test('exports a fully-populated 2e starship', () => {
    const result = FoundryVttExporter.instance.exportStarship(
      makePopulatedStarship(),
      FoundryPluginType.Standard,
    );
    expect(JSON.stringify(result, null, 4)).toMatchSnapshot();
  });

  test('exports a fully-populated station', () => {
    const result = FoundryVttExporter.instance.exportStation(
      makePopulatedStation(),
      FoundryPluginType.Standard,
    );
    expect(JSON.stringify(result, null, 4)).toMatchSnapshot();
  });
});
