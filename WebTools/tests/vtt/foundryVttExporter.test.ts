import {
  test,
  expect,
  describe,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import '../../src/helpers/species';
import {
  Character,
  EducationStep,
  SpeciesStep,
} from '../../src/common/character';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { CharacterType } from '../../src/common/characterType';
import { Department } from '../../src/helpers/department';
import { EquipmentModel, EquipmentType } from '../../src/helpers/equipment';
import { Era } from '../../src/helpers/erasEnum';
import { Role, RoleModel, RolesHelper } from '../../src/helpers/roles';
import { Species } from '../../src/helpers/speciesEnum';
import { SpeciesAbility } from '../../src/helpers/speciesAbility';
import {
  TalentCategory,
  TalentCategorization,
} from '../../src/helpers/talentCategory';
import { TalentModel } from '../../src/helpers/talentModel';
import { TALENT_NAME_UNTAPPED_POTENTIAL } from '../../src/helpers/talents';
import { Track } from '../../src/helpers/trackEnum';
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

describe('FoundryVTT exporter helpers', () => {
  const exporter = FoundryVttExporter.instance;

  const newCharacter = () => {
    const character = Character.createMainCharacter(
      CharacterType.Starfleet,
      Era.NextGeneration,
      2,
    );
    character.speciesStep = new SpeciesStep(Species.Human);
    return character;
  };

  describe('determineItemIcon', () => {
    const cases: Array<[string, string]> = [
      ['Communicator', 'communicator.webp'],
      ['Tricorder', 'tricorder.webp'],
      ['MedKit', 'medkit.webp'],
      ['Engineering Kit', 'engineering_kit.webp'],
      ['Unknown Device', 'placeholder.webp'],
    ];

    test.each(cases)('maps %s to %s', (item, icon) => {
      expect(exporter.determineItemIcon(item)).toBe(
        'systems/sta/assets/compendia/icons/items-core/' + icon,
      );
    });
  });

  describe('determineRoleIcon', () => {
    const cases: Array<[Role, string]> = [
      [Role.CommandingOfficer, 'role-commanding-officer.svg'],
      [Role.ExecutiveOfficer, 'role-executive-officer.svg'],
      [Role.OperationsManager, 'role-operations-manager.svg'],
      [Role.ChiefEngineer, 'role-chief-engineer.svg'],
      [Role.ChiefOfSecurity, 'role-chief-of-security.svg'],
      [Role.ShipsCounselor, 'role-ships-counsellor.svg'],
      [Role.ChiefMedicalOfficer, 'role-chief-medical-officer.svg'],
      [Role.ScienceOfficer, 'role-science-officer.svg'],
      [Role.FlightController, 'role-flight-controller.svg'],
      [Role.CommunicationsOfficer, 'role-communications-officer.svg'],
      [Role.Admiral, 'voyagercombadgeicon.svg'],
    ];

    test.each(cases)('maps role %s to %s', (role, icon) => {
      const model = new RoleModel(
        role,
        'Role name',
        'Role description',
        Department.Command,
        'ability',
      );
      expect(exporter.determineRoleIcon(model)).toContain(icon);
    });
  });

  describe('determineTalentIcon', () => {
    const talentWith = (category: TalentCategorization) =>
      new TalentModel('Talent name', 'Talent description', [], 1, category);

    const departmentCases: Array<[Department, string]> = [
      [Department.Command, 'talent-command.svg'],
      [Department.Conn, 'talent-conn.svg'],
      [Department.Security, 'talent-security.svg'],
      [Department.Science, 'talent-science.svg'],
      [Department.Medicine, 'talent-medical.svg'],
    ];

    test.each(departmentCases)(
      'maps department %s to %s',
      (department, icon) => {
        const talent = talentWith(
          new TalentCategorization(TalentCategory.Department, department),
        );
        expect(exporter.determineTalentIcon(talent)).toContain(icon);
      },
    );

    const speciesCases: Array<[Species, string]> = [
      [Species.Vulcan, 'talent-vulcan.svg'],
      [Species.Human, 'talent-human.svg'],
      [Species.Klingon, 'talent-klingon.svg'],
    ];

    test.each(speciesCases)('maps species %s to %s', (species, icon) => {
      const talent = talentWith(
        new TalentCategorization(TalentCategory.Species, species),
      );
      expect(exporter.determineTalentIcon(talent)).toContain(icon);
    });

    test('maps starship talents to the ship icon', () => {
      const talent = talentWith(
        new TalentCategorization(TalentCategory.Starship),
      );
      expect(exporter.determineTalentIcon(talent)).toContain('talent-ship.svg');
    });

    test('maps Untapped Potential to the career-young icon', () => {
      const talent = new TalentModel(
        TALENT_NAME_UNTAPPED_POTENTIAL,
        'Talent description',
        [],
        1,
        new TalentCategorization(TalentCategory.General),
      );
      expect(exporter.determineTalentIcon(talent)).toContain(
        'talent-career-young.svg',
      );
    });

    test('maps Veteran to the veteran icon', () => {
      const talent = new TalentModel(
        'Veteran',
        'Talent description',
        [],
        1,
        new TalentCategorization(TalentCategory.General),
      );
      expect(exporter.determineTalentIcon(talent)).toContain(
        'talent-veteran.svg',
      );
    });

    test('uses the core icon for a general talent', () => {
      const talent = talentWith(
        new TalentCategorization(TalentCategory.General),
      );
      expect(exporter.determineTalentIcon(talent)).toContain('talent-core.svg');
    });

    test('uses the core icon for an engineering talent', () => {
      const talent = talentWith(
        new TalentCategorization(
          TalentCategory.Department,
          Department.Engineering,
        ),
      );
      expect(exporter.determineTalentIcon(talent)).toContain('talent-core.svg');
    });

    const abilityCases: Array<[Species, string]> = [
      [Species.Vulcan, 'talent-vulcan.svg'],
      [Species.Borg, 'talent-core.svg'],
    ];

    test.each(abilityCases)(
      'maps species ability %s to %s',
      (species, icon) => {
        expect(
          exporter.determineTalentIcon(new SpeciesAbility(species)),
        ).toContain(icon);
      },
    );
  });

  describe('talent type and requirement', () => {
    test('maps a department talent to discipline and its department name', () => {
      const talent = new TalentModel(
        'Talent name',
        'Talent description',
        [],
        1,
        new TalentCategorization(TalentCategory.Department, Department.Command),
      );
      expect(exporter.determineTalentType(talent)).toBe('discipline');
      expect(exporter.determineTalentRequirement(talent)).toBe('Command');
    });

    test('maps a species talent to species and its categorization object', () => {
      const category = new TalentCategorization(
        TalentCategory.Species,
        Species.Vulcan,
      );
      const talent = new TalentModel(
        'Talent name',
        'Talent description',
        [],
        1,
        category,
      );
      expect(exporter.determineTalentType(talent)).toBe('species');
      expect(exporter.determineTalentRequirement(talent)).toBe(category);
    });

    test('maps a general talent to general with no requirement', () => {
      const talent = new TalentModel(
        'Talent name',
        'Talent description',
        [],
        1,
        new TalentCategorization(TalentCategory.General),
      );
      expect(exporter.determineTalentType(talent)).toBe('general');
      expect(exporter.determineTalentRequirement(talent)).toBe('');
    });
  });

  describe('description and career path', () => {
    test('always includes the original sheet link', () => {
      expect(exporter.convertCharacterDescription(newCharacter())).toContain(
        'https://sta.bcholmes.org/view?s=',
      );
    });

    test('includes the character description as markup', () => {
      const character = newCharacter();
      character.description = 'Bold and daring';
      expect(exporter.convertCharacterDescription(character)).toContain(
        'Bold and daring',
      );
    });

    test('returns only the character type without an education step', () => {
      expect(exporter.convertCareerPath(newCharacter())).toBe(
        'CharacterType.name.starfleet',
      );
    });

    test('appends the education track to the career path', () => {
      const character = newCharacter();
      character.educationStep = new EducationStep(Track.Sciences);
      const path = exporter.convertCareerPath(character);
      expect(path.startsWith('CharacterType.name.starfleet')).toBe(true);
      expect(path).toContain(' / ');
    });
  });
});

describe('FoundryVTT character item export', () => {
  const exporter = FoundryVttExporter.instance;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const exportWith = (
    configure: (character: Character) => void,
    type: FoundryPluginType = FoundryPluginType.Standard,
  ) => {
    const character = Character.createMainCharacter(
      CharacterType.Starfleet,
      Era.NextGeneration,
      2,
    );
    character.speciesStep = new SpeciesStep(Species.Human);
    configure(character);
    return exporter.exportCharacter(character, type);
  };

  test('exports raw traits as trait items in the Standard plugin', () => {
    const result = exportWith((character) => {
      character.traits.push('Bold', 'Curious');
    });
    const traits = (result.items as any[]).filter(
      (item) => item.type === 'trait',
    );
    expect(traits.map((item) => item.name)).toEqual(['Bold', 'Curious']);
    expect(
      traits.every(
        (item) => item.system.description === '' && item.system.quantity === 1,
      ),
    ).toBe(true);
  });

  test('keeps traits in system.traits in the ELH plugin', () => {
    const result = exportWith(
      (character) => character.traits.push('Bold'),
      FoundryPluginType.ELH,
    );
    expect(result.system.traits).toContain('Bold');
    expect((result.items as any[]).some((item) => item.type === 'trait')).toBe(
      false,
    );
  });

  test('exports armour models as armor items with protection', () => {
    const result = exportWith((character) => {
      jest
        .spyOn(character, 'equipmentAndImplants', 'get')
        .mockReturnValue([
          new EquipmentModel(EquipmentType.BodyArmour, 'Body Armour'),
          new EquipmentModel(EquipmentType.ArmouredVest, 'Armoured Vest'),
        ] as any);
    });
    const armor = (result.items as any[]).filter(
      (item) => item.type === 'armor',
    );
    expect(armor.map((item) => item.name)).toEqual([
      'Body Armour',
      'Armoured Vest',
    ]);
    expect(armor.every((item) => item.system.protection === 1)).toBe(true);
  });

  test('exports non-armour equipment as items without protection', () => {
    const result = exportWith((character) => {
      jest
        .spyOn(character, 'equipmentAndImplants', 'get')
        .mockReturnValue([
          new EquipmentModel(EquipmentType.Communicator, 'Communicator'),
        ] as any);
    });
    const item = (result.items as any[]).find(
      (candidate) => candidate.name === 'Communicator',
    );
    expect(item?.type).toBe('item');
    expect(item?.system.protection).toBeUndefined();
    expect(item?.img).toContain('communicator.webp');
  });

  test('does not treat bare equipment types as armour models', () => {
    const result = exportWith((character) => {
      jest
        .spyOn(character, 'equipmentAndImplants', 'get')
        .mockReturnValue([EquipmentType.BodyArmour] as any);
    });
    expect((result.items as any[]).some((item) => item.type === 'armor')).toBe(
      false,
    );
  });

  test('exports a resolved role as a talent item', () => {
    const result = exportWith((character) => {
      (character as any).role = 'Chief Engineer';
    });
    const roleItem = (result.items as any[]).find(
      (item) => item.name === 'Chief Engineer',
    );
    expect(roleItem).toBeDefined();
    expect(roleItem?.type).toBe('talent');
    expect(roleItem?.img).toContain('role-chief-engineer.svg');
    expect(roleItem?.system.description).toContain('<p>');
    expect(roleItem?.system.talenttype).toEqual({
      typeenum: 'general',
      description: '',
      minimum: 0,
    });
  });

  test('omits the role item when the role name does not resolve', () => {
    const result = exportWith((character) => {
      (character as any).role = 'Nonexistent Role';
    });
    expect(
      (result.items as any[]).some((item) => item.name === 'Nonexistent Role'),
    ).toBe(false);
  });

  test('exports ranked talents as talent items', () => {
    const result = exportWith((character) => {
      jest
        .spyOn(character, 'rankedTalents', 'get')
        .mockReturnValue([new SelectedTalent('Bold')]);
    });
    const talentItem = (result.items as any[]).find(
      (item) => item.type === 'talent',
    );
    expect(talentItem).toBeDefined();
    expect(talentItem?.name).toBe(
      new SelectedTalent('Bold').displayNameWithMultiple,
    );
    expect(talentItem?.system.talenttype.minimum).toBe(0);
  });

  test('exports species abilities with the Species type and name suffix', () => {
    const result = exportWith((character) => {
      character.speciesStep.ability = new SpeciesAbility(Species.Human);
    });
    const abilityItem = (result.items as any[]).find((item) =>
      String(item.name).endsWith('(Species Ability)'),
    );
    expect(abilityItem).toBeDefined();
    expect(abilityItem?.img).toContain('talent-human.svg');
    expect(abilityItem?.system.talenttype.typeenum).toBe('Species');
  });
});
