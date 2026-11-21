import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import i18next from 'i18next';
import '../../src/helpers/species';
import { AttackType } from '../../src/common/attackType';
import {
  OtherSelection,
  SelectedTalent,
} from '../../src/common/selectedTalent';
import { SpecialWeapon } from '../../src/common/specialWeapon';
import { Attribute } from '../../src/helpers/attributes';
import { BorgImplantType } from '../../src/helpers/borgImplant';
import { Department } from '../../src/helpers/department';
import { marshaller } from '../../src/helpers/marshaller';
import { PropulsionSystemType } from '../../src/helpers/propulsionSystem';
import { System } from '../../src/helpers/systems';
import {
  TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_CAUTIOUS,
  TALENT_NAME_COLLABORATION,
  TALENT_NAME_CUSTOM_TALENT,
  TALENT_NAME_DEFENSIVE_TRAINING,
  TALENT_NAME_DEFENSIVE_TRAINING_FED_KLINGON_WAR,
  TALENT_NAME_DEDICATED_PERSONNEL,
  TALENT_NAME_IM_A_DOCTOR_NOT_A,
  TALENT_NAME_MINELAYER,
  TALENT_NAME_WARRIORS_SPIRIT,
} from '../../src/helpers/talents';
import { UsageCategory, Weapon, WeaponType } from '../../src/helpers/weapons';
import translations from '../../src/i18n/locales/en/translations.json';

jest.mock('../../src/state/store', () => ({
  store: {
    getState: jest.fn(() => ({
      context: {
        sources: [1],
      },
    })),
  },
}));

beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: { en: { translation: translations } },
  });
});

describe('marshaller talent selection coverage', () => {
  test('round-trips optional talent fields', () => {
    const talent = new SelectedTalent(TALENT_NAME_CUSTOM_TALENT);
    talent.customTalentName = 'Field Engineer';
    talent.customTalentDescription = 'Repairs things under pressure.';
    talent.focuses = ['Engineering', 'Stress'];
    talent.implants = [
      BorgImplantType.CorticalArrayCorticalNode,
      BorgImplantType.ExoPlating,
    ];
    talent.value = 'Duty';
    talent.attribute = Attribute.Control;
    talent.department = Department.Engineering;
    talent.system = System.Engines;
    talent.x = 3;
    talent.multiple = 2;
    talent.additionalInformation = 'core rulebook';

    const json = marshaller.talentToJson(talent);

    expect(json).toMatchObject({
      name: TALENT_NAME_CUSTOM_TALENT,
      customTalentName: 'Field Engineer',
      customTalentDescription: 'Repairs things under pressure.',
      focuses: ['Engineering', 'Stress'],
      implants: ['CorticalArrayCorticalNode', 'ExoPlating'],
      value: 'Duty',
      attribute: 'Control',
      department: 'Engineering',
      system: 'Engines',
      x: 3,
      multiple: 2,
      additionalInformation: 'core rulebook',
    });

    const restored = marshaller.hydrateTalent(json, 2);

    expect(restored.talent).toBe(TALENT_NAME_CUSTOM_TALENT);
    expect(restored.customTalentName).toBe('Field Engineer');
    expect(restored.customTalentDescription).toBe(
      'Repairs things under pressure.',
    );
    expect(restored.focuses).toEqual(['Engineering', 'Stress']);
    expect(restored.implants).toEqual([
      BorgImplantType.CorticalArrayCorticalNode,
      BorgImplantType.ExoPlating,
    ]);
    expect(restored.value).toBe('Duty');
    expect(restored.attribute).toBe(Attribute.Control);
    expect(restored.department).toBe(Department.Engineering);
    expect(restored.system).toBe(System.Engines);
    expect(restored.x).toBe(3);
    expect(restored.additionalInformation).toBe('core rulebook');
  });

  test.each([
    [SpecialWeapon.BatLeth, 'BatLeth'],
    [SpecialWeapon.MekLeth, 'MekLeth'],
  ] as const)(
    'round-trips Warrior’s Spirit selection %s',
    (selection, name) => {
      const talent = new SelectedTalent(TALENT_NAME_WARRIORS_SPIRIT);
      talent.selection = selection;

      expect(marshaller.talentToJson(talent)).toMatchObject({
        selection: name,
      });
      expect(
        marshaller.hydrateTalent(
          { name: TALENT_NAME_WARRIORS_SPIRIT, selection: name },
          2,
        ).selection,
      ).toBe(selection);
    },
  );

  test('round-trips Defensive Training selection', () => {
    const talent = new SelectedTalent(TALENT_NAME_DEFENSIVE_TRAINING);
    talent.selection = AttackType.Melee;

    expect(marshaller.talentToJson(talent)).toMatchObject({
      selection: 'Melee',
    });
    expect(
      marshaller.hydrateTalent(
        { name: TALENT_NAME_DEFENSIVE_TRAINING, selection: 'Melee' },
        2,
      ).selection,
    ).toBe(AttackType.Melee);
  });

  test('round-trips a standard Additional Propulsion System selection', () => {
    const talent = new SelectedTalent(TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM);
    talent.selection = PropulsionSystemType.Transwarp;

    expect(marshaller.talentToJson(talent)).toMatchObject({
      selection: 'Transwarp',
    });
    expect(
      marshaller.hydrateTalent(
        {
          name: TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
          selection: 'Transwarp',
        },
        2,
      ).selection,
    ).toBe(PropulsionSystemType.Transwarp);
  });

  test('encodes OtherSelection as a typed object for Additional Propulsion System', () => {
    const talent = new SelectedTalent(TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM);
    talent.selection = new OtherSelection('Experimental warp drive');

    expect(marshaller.talentToJson(talent)).toMatchObject({
      name: TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
      selection: { type: 'Other', name: 'Experimental warp drive' },
    });
  });

  test('round-trips a custom Additional Propulsion System selection', () => {
    const talent = new SelectedTalent(TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM);
    talent.selection = new OtherSelection('Custom Drive');

    const json = marshaller.talentToJson(talent);
    const restored = marshaller.hydrateTalent(json, 2);

    expect(restored.selection).toBeInstanceOf(OtherSelection);
    expect((restored.selection as OtherSelection).name).toBe('Custom Drive');
    expect(
      marshaller.hydrateTalent(
        {
          name: TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
          selection: { type: 'Other', name: 'Custom Drive' },
        },
        2,
      ).selection,
    ).toMatchObject({ name: 'Custom Drive' });
  });

  test('encodes a Weapon and decodes both weapon representations', () => {
    const talent = new SelectedTalent(TALENT_NAME_MINELAYER);
    talent.weapon = new Weapon(
      UsageCategory.Character,
      'Phaser',
      6,
      WeaponType.ENERGY,
    );

    expect(marshaller.talentToJson(talent)).toMatchObject({
      weapon: {
        usageCategory: 'Character',
        type: 'ENERGY',
        name: 'Phaser',
        baseDice: 6,
        loadType: null,
        deliverySystem: null,
      },
    });
    expect(
      marshaller.hydrateTalent(
        { name: TALENT_NAME_MINELAYER, weapon: 'Phaser Banks' },
        2,
      ).weapon,
    ).toBe('Phaser Banks');
    expect(
      marshaller.hydrateTalent(
        {
          name: TALENT_NAME_MINELAYER,
          weapon: {
            usageCategory: 'Character',
            type: 'MELEE',
            name: 'Knife',
            baseDice: 5,
          },
        },
        2,
      ).weapon,
    ).toMatchObject({ name: 'Knife' });
  });

  test('returns undefined for an unknown talent', () => {
    expect(
      marshaller.hydrateTalent({ name: 'Talent That Does Not Exist' }, 2),
    ).toBeUndefined();
  });

  test.each([
    [
      'Augmented Ability (Control)',
      TALENT_NAME_AUGMENTED_ABILITY,
      { attribute: Attribute.Control },
    ],
    [
      'Collaboration: Command',
      TALENT_NAME_COLLABORATION,
      { department: Department.Command },
    ],
    [
      'Bold: Engineering',
      TALENT_NAME_BOLD,
      { department: Department.Engineering },
    ],
    [
      'Cautious: Science',
      TALENT_NAME_CAUTIOUS,
      { department: Department.Science },
    ],
    [
      'I’m a Doctor, Not a Starship Captain!',
      TALENT_NAME_IM_A_DOCTOR_NOT_A,
      { department: Department.Command },
    ],
    [
      'Defensive Training: Melee',
      TALENT_NAME_DEFENSIVE_TRAINING_FED_KLINGON_WAR,
      { selection: AttackType.Melee },
    ],
    [
      'Dedicated Personnel (Science)',
      TALENT_NAME_DEDICATED_PERSONNEL,
      { department: Department.Science },
    ],
    ['Brute Force (Special Rule)', 'Brute Force', {}],
  ])('hydrates legacy name %s to %s', (legacyName, canonicalName, expected) => {
    const restored = marshaller.hydrateTalent({ name: legacyName }, 2);

    expect(restored.talent).toBe(canonicalName);
    expect(restored).toMatchObject(expected);
  });
});
