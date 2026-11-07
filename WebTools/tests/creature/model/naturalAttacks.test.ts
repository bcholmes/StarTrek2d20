import { test, expect, describe, jest, afterEach } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { DietType } from '../../../src/creature/model/diet';
import {
  NaturalAttacks,
  NaturalAttacksHelper,
  generateRandomNaturalAttacks,
} from '../../../src/creature/model/naturalAttacks';
import type { Weapon } from '../../../src/helpers/weapons';
import { InjuryType, Quality, WeaponType } from '../../../src/helpers/weapons';

const allAttacks: [NaturalAttacks, string][] = [
  [NaturalAttacks.Teeth, 'Teeth'],
  [NaturalAttacks.Claws, 'Claws'],
  [NaturalAttacks.TeethAndClaws, 'TeethAndClaws'],
  [NaturalAttacks.LargeFangs, 'LargeFangs'],
  [NaturalAttacks.SharpBeak, 'SharpBeak'],
  [NaturalAttacks.Horns, 'Horns'],
  [NaturalAttacks.Trample, 'Trample'],
  [NaturalAttacks.Bludgeoning, 'Bludgeoning'],
  [NaturalAttacks.SpikesOrSpines, 'SpikesOrSpines'],
];

const expectWeapon = (
  weapon: Weapon | undefined,
  name: string,
  injuryType: InjuryType,
  dice: number,
  effects: Quality[],
  qualities: Quality[],
  type: WeaponType,
) => {
  expect(weapon?.nameValue).toBe(name);
  expect(weapon?.injuryType).toBe(injuryType);
  expect(weapon?.baseDice).toBe(dice);
  expect(weapon?.effectValues.map((quality) => quality.quality)).toEqual(
    effects,
  );
  expect(weapon?.qualityValues.map((quality) => quality.quality)).toEqual(
    qualities,
  );
  expect(weapon?.type).toBe(type);
  expect(weapon?.hands).toBe(1);
};

describe('NaturalAttacksHelper', () => {
  test('returns a cached singleton', () => {
    expect(NaturalAttacksHelper.instance).toBe(NaturalAttacksHelper.instance);
  });

  test('returns every natural attack type', () => {
    expect(NaturalAttacksHelper.instance.allAttackTypes()).toEqual(
      allAttacks.map(([id]) => id),
    );
  });

  test.each(allAttacks)('finds attack %s by enum name', (id, name) => {
    expect(NaturalAttacksHelper.instance.getTypeByIdName(name)).toBe(id);
  });

  test('returns undefined for an unknown enum name', () => {
    expect(
      NaturalAttacksHelper.instance.getTypeByIdName('Dragon'),
    ).toBeUndefined();
  });

  const attackCases: [
    NaturalAttacks,
    string,
    InjuryType,
    number,
    Quality[],
    Quality[],
    WeaponType,
  ][] = [
    [
      NaturalAttacks.Teeth,
      'Bite',
      InjuryType.Deadly,
      3,
      [],
      [Quality.Piercing, Quality.Intense],
      WeaponType.MELEE,
    ],
    [
      NaturalAttacks.Claws,
      'Claw',
      InjuryType.Deadly,
      3,
      [],
      [Quality.Intense],
      WeaponType.MELEE,
    ],
    [
      NaturalAttacks.TeethAndClaws,
      'Teeth and Claws',
      InjuryType.Deadly,
      4,
      [],
      [Quality.Intense, Quality.Debilitating],
      WeaponType.MELEE,
    ],
    [
      NaturalAttacks.LargeFangs,
      'Large Fangs',
      InjuryType.Deadly,
      3,
      [],
      [Quality.Piercing, Quality.Intense, Quality.Cumbersome],
      WeaponType.MELEE,
    ],
    [
      NaturalAttacks.SharpBeak,
      'Sharp Beak',
      InjuryType.Deadly,
      3,
      [],
      [Quality.Piercing],
      WeaponType.MELEE,
    ],
    [
      NaturalAttacks.Horns,
      'Horns',
      InjuryType.StunOrDeadly,
      3,
      [],
      [Quality.Intense],
      WeaponType.MELEE,
    ],
    [
      NaturalAttacks.Trample,
      'Trample',
      InjuryType.StunOrDeadly,
      4,
      [],
      [],
      WeaponType.MELEE,
    ],
    [
      NaturalAttacks.Bludgeoning,
      'Slam',
      InjuryType.Stun,
      2,
      [],
      [],
      WeaponType.MELEE,
    ],
    [
      NaturalAttacks.SpikesOrSpines,
      'Spikes or Spines',
      InjuryType.StunOrDeadly,
      1,
      [Quality.Debilitating],
      [],
      WeaponType.MELEE,
    ],
  ];

  test.each(attackCases)(
    'builds the weapon for natural attack %s',
    (attack, name, injuryType, dice, effects, qualities, type) => {
      expectWeapon(
        NaturalAttacksHelper.instance.getAttackById(attack),
        name,
        injuryType,
        dice,
        effects,
        qualities,
        type,
      );
    },
  );

  test('returns undefined for an unknown natural attack', () => {
    expect(
      NaturalAttacksHelper.instance.getAttackById(99 as NaturalAttacks),
    ).toBeUndefined();
  });

  test('builds the spiked tail attack', () => {
    expectWeapon(
      NaturalAttacksHelper.instance.getSpikedTailAttack(),
      'Spiked Tail',
      InjuryType.Deadly,
      6,
      [],
      [Quality.Intense, Quality.Debilitating, Quality.Piercing],
      WeaponType.MELEE,
    );
  });

  test('builds the whip-like tail attack', () => {
    expectWeapon(
      NaturalAttacksHelper.instance.getWhipLikeTailAttack(),
      'Whip-like Tail',
      InjuryType.Deadly,
      5,
      [],
      [Quality.Intense],
      WeaponType.MELEE,
    );
  });

  test('builds the corrosive spit attack', () => {
    expectWeapon(
      NaturalAttacksHelper.instance.getCorrosiveSpit(),
      'Corrosive Spit',
      InjuryType.Deadly,
      3,
      [],
      [Quality.Area, Quality.Piercing, Quality.PersistentX],
      WeaponType.ENERGY,
    );
  });
});

describe('generateRandomNaturalAttacks', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const carnivoreCases: [number, NaturalAttacks][] = [
    [1, NaturalAttacks.Teeth],
    [5, NaturalAttacks.Teeth],
    [6, NaturalAttacks.TeethAndClaws],
    [10, NaturalAttacks.TeethAndClaws],
    [11, NaturalAttacks.LargeFangs],
    [15, NaturalAttacks.LargeFangs],
    [16, NaturalAttacks.SharpBeak],
    [20, NaturalAttacks.SharpBeak],
  ];

  test.each(carnivoreCases)(
    'maps carnivore roll %i to %s',
    (roll, expectedAttack) => {
      const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

      expect(generateRandomNaturalAttacks(DietType.Carnivore)).toBe(
        expectedAttack,
      );
      expect(d20).toHaveBeenCalledTimes(1);
    },
  );

  const herbivoreCases: [number, NaturalAttacks][] = [
    [1, NaturalAttacks.Claws],
    [4, NaturalAttacks.Claws],
    [5, NaturalAttacks.Horns],
    [8, NaturalAttacks.Horns],
    [9, NaturalAttacks.Trample],
    [12, NaturalAttacks.Trample],
    [13, NaturalAttacks.SharpBeak],
    [16, NaturalAttacks.SharpBeak],
    [17, NaturalAttacks.Bludgeoning],
    [20, NaturalAttacks.Bludgeoning],
  ];

  test.each([
    DietType.Herbivore,
    DietType.Energy,
    DietType.PsychicEnergy,
    DietType.MineralsOrMetal,
  ])('uses the herbivore table for diet %s', (diet) => {
    for (const [roll, expectedAttack] of herbivoreCases) {
      jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

      expect(generateRandomNaturalAttacks(diet)).toBe(expectedAttack);
      jest.restoreAllMocks();
    }
  });

  const omnivoreCases: [number, NaturalAttacks][] = [
    [1, NaturalAttacks.Teeth],
    [4, NaturalAttacks.Teeth],
    [5, NaturalAttacks.TeethAndClaws],
    [8, NaturalAttacks.TeethAndClaws],
    [9, NaturalAttacks.Claws],
    [12, NaturalAttacks.Claws],
    [13, NaturalAttacks.SharpBeak],
    [16, NaturalAttacks.SharpBeak],
    [17, NaturalAttacks.Bludgeoning],
    [20, NaturalAttacks.Bludgeoning],
  ];

  test.each(omnivoreCases)(
    'maps omnivore roll %i to %s',
    (roll, expectedAttack) => {
      const d20 = jest.spyOn(D20, 'roll').mockReturnValueOnce(roll);

      expect(generateRandomNaturalAttacks(DietType.Omnivore)).toBe(
        expectedAttack,
      );
      expect(d20).toHaveBeenCalledTimes(1);
    },
  );

  test.each([DietType.Carnivore, DietType.Herbivore, DietType.Omnivore])(
    'returns undefined for out-of-range rolls for diet %s',
    (diet) => {
      jest.spyOn(D20, 'roll').mockReturnValueOnce(0);

      expect(generateRandomNaturalAttacks(diet)).toBeUndefined();
    },
  );

  test('returns undefined for an unknown diet', () => {
    expect(generateRandomNaturalAttacks(99 as DietType)).toBeUndefined();
  });
});
