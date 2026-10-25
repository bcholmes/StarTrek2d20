import { D20 } from '../../common/die';
import {
  InjuryType,
  Quality,
  Weapon,
  WeaponQuality,
  WeaponType,
} from '../../helpers/weapons';
import { DietType } from './diet';

export enum NaturalAttacks {
  Teeth,
  Claws,
  TeethAndClaws,
  LargeFangs,
  SharpBeak,
  Horns,
  Trample,
  Bludgeoning,
  SpikesOrSpines,
}

export class NaturalAttacksHelper {
  private static singleton: NaturalAttacksHelper;

  static get instance() {
    if (NaturalAttacksHelper.singleton == null) {
      NaturalAttacksHelper.singleton = new NaturalAttacksHelper();
    }
    return NaturalAttacksHelper.singleton;
  }

  allAttackTypes(): NaturalAttacks[] {
    return Object.keys(NaturalAttacks)
      .filter((item) => {
        return !isNaN(Number(item));
      })
      .map((item) => Number(item));
  }

  getAttackById(id: NaturalAttacks) {
    switch (id) {
      case NaturalAttacks.Teeth:
        return Weapon.createCharacterWeapon(
          'Bite',
          InjuryType.Deadly,
          3,
          [],
          [
            new WeaponQuality(Quality.Piercing),
            new WeaponQuality(Quality.Intense),
          ],
          WeaponType.MELEE,
          1,
        );
      case NaturalAttacks.Claws:
        return Weapon.createCharacterWeapon(
          'Claw',
          InjuryType.Deadly,
          3,
          [],
          [new WeaponQuality(Quality.Intense)],
          WeaponType.MELEE,
          1,
        );
      case NaturalAttacks.TeethAndClaws:
        return Weapon.createCharacterWeapon(
          'Teeth and Claws',
          InjuryType.Deadly,
          4,
          [],
          [
            new WeaponQuality(Quality.Intense),
            new WeaponQuality(Quality.Debilitating),
          ],
          WeaponType.MELEE,
          1,
        );
      case NaturalAttacks.LargeFangs:
        return Weapon.createCharacterWeapon(
          'Large Fangs',
          InjuryType.Deadly,
          3,
          [],
          [
            new WeaponQuality(Quality.Piercing),
            new WeaponQuality(Quality.Intense),
            new WeaponQuality(Quality.Cumbersome),
          ],
          WeaponType.MELEE,
          1,
        );
      case NaturalAttacks.SharpBeak:
        return Weapon.createCharacterWeapon(
          'Sharp Beak',
          InjuryType.Deadly,
          3,
          [],
          [new WeaponQuality(Quality.Piercing)],
          WeaponType.MELEE,
          1,
        );
      case NaturalAttacks.Horns:
        return Weapon.createCharacterWeapon(
          'Horns',
          InjuryType.StunOrDeadly,
          3,
          [],
          [new WeaponQuality(Quality.Intense)],
          WeaponType.MELEE,
          1,
        );
      case NaturalAttacks.Trample:
        return Weapon.createCharacterWeapon(
          'Trample',
          InjuryType.StunOrDeadly,
          4,
          [],
          [],
          WeaponType.MELEE,
          1,
        );
      case NaturalAttacks.Bludgeoning:
        return Weapon.createCharacterWeapon(
          'Slam',
          InjuryType.Stun,
          2,
          [],
          [],
          WeaponType.MELEE,
          1,
        );
      case NaturalAttacks.SpikesOrSpines:
        return Weapon.createCharacterWeapon(
          'Spikes or Spines',
          InjuryType.StunOrDeadly,
          1,
          [new WeaponQuality(Quality.Debilitating)],
          [],
          WeaponType.MELEE,
          1,
        );
      default:
        break;
    }
  }

  getSpikedTailAttack() {
    return Weapon.createCharacterWeapon(
      'Spiked Tail',
      InjuryType.Deadly,
      6,
      [],
      [
        new WeaponQuality(Quality.Intense),
        new WeaponQuality(Quality.Debilitating),
        new WeaponQuality(Quality.Piercing),
      ],
      WeaponType.MELEE,
      1,
    );
  }

  getWhipLikeTailAttack() {
    return Weapon.createCharacterWeapon(
      'Whip-like Tail',
      InjuryType.Deadly,
      5,
      [],
      [new WeaponQuality(Quality.Intense)],
      WeaponType.MELEE,
      1,
    );
  }

  getCorrosiveSpit() {
    return Weapon.createCharacterWeapon(
      'Corrosive Spit',
      InjuryType.Deadly,
      3,
      [],
      [
        new WeaponQuality(Quality.Area),
        new WeaponQuality(Quality.Piercing),
        new WeaponQuality(Quality.PersistentX),
      ],
      WeaponType.ENERGY,
      1,
    );
  }

  getTypeByIdName(name: string) {
    const item = this.allAttackTypes().filter(
      (a) => NaturalAttacks[a] === name,
    );
    return item?.length ? item[0] : undefined;
  }
}

export const generateRandomNaturalAttacks = (diet: DietType) => {
  switch (diet) {
    case DietType.Carnivore:
      switch (D20.roll()) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          return NaturalAttacks.Teeth;
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
          return NaturalAttacks.TeethAndClaws;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
          return NaturalAttacks.LargeFangs;
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
          return NaturalAttacks.SharpBeak;
        default:
          break;
      }
      break;

    case DietType.Herbivore:
    case DietType.Energy:
    case DietType.PsychicEnergy:
    case DietType.MineralsOrMetal:
      switch (D20.roll()) {
        case 1:
        case 2:
        case 3:
        case 4:
          return NaturalAttacks.Claws;
        case 5:
        case 6:
        case 7:
        case 8:
          return NaturalAttacks.Horns;
        case 9:
        case 10:
        case 11:
        case 12:
          return NaturalAttacks.Trample;
        case 13:
        case 14:
        case 15:
        case 16:
          return NaturalAttacks.SharpBeak;
        case 17:
        case 18:
        case 19:
        case 20:
          return NaturalAttacks.Bludgeoning;
        default:
          break;
      }
      break;

    case DietType.Omnivore:
      switch (D20.roll()) {
        case 1:
        case 2:
        case 3:
        case 4:
          return NaturalAttacks.Teeth;
        case 5:
        case 6:
        case 7:
        case 8:
          return NaturalAttacks.TeethAndClaws;
        case 9:
        case 10:
        case 11:
        case 12:
          return NaturalAttacks.Claws;
        case 13:
        case 14:
        case 15:
        case 16:
          return NaturalAttacks.SharpBeak;
        case 17:
        case 18:
        case 19:
        case 20:
          return NaturalAttacks.Bludgeoning;
        default:
          break;
      }
      break;
    default:
      break;
  }
};
