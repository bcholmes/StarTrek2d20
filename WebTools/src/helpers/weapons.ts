import i18next from 'i18next';
import { CharacterType } from '../common/characterType';
import { makeKey } from '../common/translationKey';
import { Era } from './erasEnum';

export enum Quality {
  Area,
  Calibration,
  Charge,
  Dampening,
  Deadly,
  Depleting,
  Devastating,
  Hidden,
  HighYield,
  Intense,
  Jamming,
  Knockdown,
  NonLethal,
  PersistentX,
  Piercing,
  Slowing,
  Versatile,
  Vicious,
  Debilitating,
  Accurate,
  AreaOrSpread,
  Spread,

  Grenade,
  Cumbersome,
}

export enum InjuryType {
  Stun,
  Deadly,
  StunOrDeadly,
}

export class WeaponQuality {
  readonly quality: Quality;
  readonly rank?: number;

  constructor(quality: Quality, rank?: number) {
    this.quality = quality;
    this.rank = rank;
  }

  // Non-localized, to use in export to vtt
  get qualityName() {
    switch (this.quality) {
      case Quality.NonLethal:
        return 'Non-Lethal';

      case Quality.HighYield:
        return 'High Yield';

      case Quality.PersistentX:
        return 'Persistent X';

      default:
        return Quality[this.quality];
    }
  }

  get description() {
    if (this.rank != null) {
      return this.qualityName + ' ' + this.rank;
    } else {
      return this.qualityName;
    }
  }

  get localizedDescription() {
    if (this.rank != null) {
      return i18next.t(
        makeKey('Weapon.quality.', Quality[this.quality], '.name'),
        { rank: this.rank },
      );
    } else {
      const key = makeKey('Weapon.quality.', Quality[this.quality], '.name');
      return i18next.t(key, { rank: '' }) === key
        ? Quality[this.quality]
        : i18next.t(key, { rank: '' });
    }
  }
}

export enum WeaponRange {
  Close,
  Medium,
  Long,
}

export enum UsageCategory {
  Character,
  Starship,
}

export enum WeaponType {
  MELEE,
  ENERGY,
  TORPEDO,
  MINE,
  CAPTURE,
}

export class WeaponTypeModel {
  static readonly TYPES = [
    new WeaponTypeModel(WeaponType.MELEE, 'Melee'),
    new WeaponTypeModel(WeaponType.ENERGY, 'Energy Weapon'),
    new WeaponTypeModel(WeaponType.TORPEDO, 'Torpedo'),
    new WeaponTypeModel(WeaponType.MINE, 'Mine'),
    new WeaponTypeModel(WeaponType.CAPTURE, 'Tractor/Grappler'),
  ];

  readonly type: WeaponType;
  readonly description: string;

  constructor(type: WeaponType, description: string) {
    this.type = type;
    this.description = description;
  }

  static getWeaponTypeModelByType(type: WeaponType): WeaponTypeModel {
    return this.TYPES.filter((m) => m.type === type)[0];
  }

  static allStarshipTypes() {
    return [
      WeaponTypeModel.TYPES[WeaponType.ENERGY],
      WeaponTypeModel.TYPES[WeaponType.TORPEDO],
      WeaponTypeModel.TYPES[WeaponType.MINE],
      WeaponTypeModel.TYPES[WeaponType.CAPTURE],
    ];
  }
}

export enum CaptureType {
  Tractor,
  Grappler,
}

export class CaptureTypeModel {
  static readonly TYPES = [
    new CaptureTypeModel(CaptureType.Tractor, 'Tractor Beam'),
    new CaptureTypeModel(CaptureType.Grappler, 'Grappler Cables'),
  ];

  readonly type: CaptureType;
  readonly description: string;

  constructor(type: CaptureType, description: string) {
    this.type = type;
    this.description = description;
  }

  static allTypes() {
    return CaptureTypeModel.TYPES;
  }

  static getCaptureTypeModelByType(type: CaptureType) {
    return this.allTypes().filter((c) => c.type === type)[0];
  }
}

export enum EnergyLoadType {
  AntiProton,
  Disruptor,
  ElectroMagneticIonic,
  FreeElectron,
  Graviton,
  PhasedPolaron,
  Phaser,
  PhasePulse,
  Proton,
  Tetryon,
  PulsePhaser,
}

export class EnergyLoadTypeModel {
  static readonly TYPES = [
    new EnergyLoadTypeModel(
      EnergyLoadType.AntiProton,
      'Antiproton Beam',
      [],
      [new WeaponQuality(Quality.HighYield)],
      25,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Disruptor,
      'Disruptor',
      [new WeaponQuality(Quality.Vicious, 1)],
      [],
      23,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.ElectroMagneticIonic,
      'Electro-Magnetic/Ionic',
      [
        new WeaponQuality(Quality.Dampening),
        new WeaponQuality(Quality.Piercing, 1),
      ],
      [],
      22,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.FreeElectron,
      'Free Electron Laser',
      [],
      [],
      21,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Graviton,
      'Graviton',
      [new WeaponQuality(Quality.Piercing, 1)],
      [new WeaponQuality(Quality.Devastating)],
      23,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.PhasedPolaron,
      'Phased Polaron Beam',
      [new WeaponQuality(Quality.Piercing, 2)],
      [],
      24,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Phaser,
      'Phaser',
      [],
      [new WeaponQuality(Quality.Versatile, 2)],
      23,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.PhasePulse,
      'Phase / Pulse',
      [],
      [new WeaponQuality(Quality.Versatile, 1)],
      22,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Proton,
      'Proton Beam',
      [new WeaponQuality(Quality.PersistentX)],
      [],
      25,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Tetryon,
      'Tetryon',
      [new WeaponQuality(Quality.Depleting)],
      [],
      25,
    ),
  ];

  static readonly TYPES_2E = [
    new EnergyLoadTypeModel(
      EnergyLoadType.AntiProton,
      'Antiproton Beam',
      [],
      [new WeaponQuality(Quality.HighYield)],
      25,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Disruptor,
      'Disruptor',
      [],
      [new WeaponQuality(Quality.Intense)],
      23,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.ElectroMagneticIonic,
      'Electro-Magnetic/Ionic',
      [],
      [
        new WeaponQuality(Quality.Dampening),
        new WeaponQuality(Quality.Piercing),
      ],
      22,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.FreeElectron,
      'Free Electron Laser',
      [],
      [],
      21,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Graviton,
      'Graviton',
      [],
      [
        new WeaponQuality(Quality.Devastating),
        new WeaponQuality(Quality.Piercing),
      ],
      23,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.PhasedPolaron,
      'Phased Polaron Beam',
      [],
      [new WeaponQuality(Quality.Piercing), new WeaponQuality(Quality.Intense)],
      24,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Phaser,
      'Phaser',
      [],
      [new WeaponQuality(Quality.Versatile, 2)],
      23,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.PhasePulse,
      'Phase / Pulse',
      [],
      [new WeaponQuality(Quality.Versatile, 1)],
      22,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Proton,
      'Proton Beam',
      [],
      [new WeaponQuality(Quality.PersistentX)],
      25,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.Tetryon,
      'Tetryon',
      [],
      [new WeaponQuality(Quality.Depleting)],
      25,
    ),
    new EnergyLoadTypeModel(
      EnergyLoadType.PulsePhaser,
      'Pulse Phaser',
      [],
      [
        new WeaponQuality(Quality.Versatile, 2),
        new WeaponQuality(Quality.Spread),
      ],
      24,
    ),
  ];

  readonly type: EnergyLoadType;
  readonly description: string;
  readonly qualities: WeaponQuality[];
  readonly effects: WeaponQuality[];
  readonly century: number;

  constructor(
    type: EnergyLoadType,
    description: string,
    effect: WeaponQuality[],
    quality: WeaponQuality[],
    century: number,
  ) {
    this.type = type;
    this.description = description;
    this.qualities = quality;
    this.effects = effect;
    this.century = century;
  }

  static allTypes(version: number) {
    return version === 1
      ? EnergyLoadTypeModel.TYPES
      : EnergyLoadTypeModel.TYPES_2E;
  }

  static allTypesByYear(year: number, version: number) {
    return this.allTypes(version).filter(
      (e) => year > centuryToYear(e.century),
    );
  }

  get effectsAndQualities() {
    return [...this.qualities].concat(this.effects);
  }

  static getEnergyLoadTypeModelByType(type: EnergyLoadType, version: number) {
    const result = this.allTypes(version).filter((e) => e.type === type)[0];
    return result;
  }
}

export const centuryToYear = (century: number) => {
  return (century - 1) * 100;
};

export enum TorpedoLoadType {
  Chroniton,
  Gravimetric,
  Neutronic,
  Nuclear,
  Photon,
  Photonic,
  Plasma,
  Polaron,
  Positron,
  Quantum,
  Spatial,
  Tetryonic,
  Transphasic,
  Tricobolt,
}

export class TorpedoLoadTypeModel {
  static readonly TYPES = [
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Chroniton,
      'Chroniton',
      3,
      [],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.Slowing),
      ],
      25,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Gravimetric,
      'Gravimetric',
      3,
      [new WeaponQuality(Quality.Piercing, 1)],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.HighYield),
      ],
      24,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Neutronic,
      'Neutronic',
      4,
      [new WeaponQuality(Quality.Dampening)],
      [new WeaponQuality(Quality.Calibration)],
      25,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Nuclear,
      'Nuclear',
      3,
      [new WeaponQuality(Quality.Vicious, 1)],
      [new WeaponQuality(Quality.Calibration)],
      20,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Photon,
      'Photon',
      3,
      [],
      [new WeaponQuality(Quality.HighYield)],
      23,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Photonic,
      'Photonic',
      2,
      [],
      [new WeaponQuality(Quality.HighYield)],
      22,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Plasma,
      'Plasma',
      3,
      [new WeaponQuality(Quality.PersistentX, 8)],
      [new WeaponQuality(Quality.Calibration)],
      23,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Polaron,
      'Polaron',
      3,
      [new WeaponQuality(Quality.Piercing, 2)],
      [new WeaponQuality(Quality.Calibration)],
      24,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Positron,
      'Positron',
      3,
      [new WeaponQuality(Quality.Dampening)],
      [new WeaponQuality(Quality.Calibration)],
      24,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Quantum,
      'Quantum',
      4,
      [new WeaponQuality(Quality.Vicious, 1)],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.HighYield),
      ],
      24,
    ),
    new TorpedoLoadTypeModel(TorpedoLoadType.Spatial, 'Spatial', 2, [], [], 22),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Tetryonic,
      'Tetryonic',
      2,
      [new WeaponQuality(Quality.Depleting)],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.HighYield),
      ],
      25,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Transphasic,
      'Transphasic',
      3,
      [new WeaponQuality(Quality.Piercing, 2)],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.Devastating),
      ],
      25,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Tricobolt,
      'Tricobolt',
      3,
      [new WeaponQuality(Quality.Area)],
      [new WeaponQuality(Quality.Calibration)],
      25,
    ),
  ];

  static readonly TYPES_2E = [
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Chroniton,
      'Chroniton',
      3,
      [],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.Slowing),
      ],
      25,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Gravimetric,
      'Gravimetric',
      5,
      [],
      [
        new WeaponQuality(Quality.Cumbersome),
        new WeaponQuality(Quality.Piercing, 1),
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.HighYield),
      ],
      24,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Neutronic,
      'Neutronic',
      4,
      [],
      [
        new WeaponQuality(Quality.Dampening),
        new WeaponQuality(Quality.Calibration),
      ],
      25,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Nuclear,
      'Nuclear',
      3,
      [],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.Intense),
      ],
      20,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Photon,
      'Photon',
      3,
      [],
      [new WeaponQuality(Quality.HighYield)],
      23,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Photonic,
      'Photonic',
      2,
      [],
      [new WeaponQuality(Quality.HighYield)],
      22,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Plasma,
      'Plasma',
      5,
      [],
      [
        new WeaponQuality(Quality.Calibration, 8),
        new WeaponQuality(Quality.Cumbersome),
        new WeaponQuality(Quality.PersistentX),
      ],
      23,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Polaron,
      'Polaron',
      3,
      [],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.Piercing, 2),
      ],
      24,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Positron,
      'Positron',
      5,
      [],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.Cumbersome),
        new WeaponQuality(Quality.Dampening),
      ],
      24,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Quantum,
      'Quantum',
      4,
      [],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.HighYield),
        new WeaponQuality(Quality.Intense),
      ],
      24,
    ),
    new TorpedoLoadTypeModel(TorpedoLoadType.Spatial, 'Spatial', 2, [], [], 22),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Tetryonic,
      'Tetryonic',
      2,
      [],
      [
        new WeaponQuality(Quality.Depleting),
        new WeaponQuality(Quality.HighYield),
      ],
      25,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Transphasic,
      'Transphasic',
      4,
      [],
      [
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.Devastating),
        new WeaponQuality(Quality.Piercing),
      ],
      25,
    ),
    new TorpedoLoadTypeModel(
      TorpedoLoadType.Tricobolt,
      'Tricobolt',
      6,
      [],
      [
        new WeaponQuality(Quality.Area),
        new WeaponQuality(Quality.Calibration),
        new WeaponQuality(Quality.Cumbersome),
      ],
      25,
    ),
  ];

  readonly type: TorpedoLoadType;
  readonly description: string;
  readonly dice: number;
  readonly weaponEffects: WeaponQuality[];
  readonly weaponQualities: WeaponQuality[];
  readonly century: number;

  constructor(
    type: TorpedoLoadType,
    description: string,
    dice: number,
    effect: WeaponQuality[],
    quality: WeaponQuality[],
    century: number,
  ) {
    this.type = type;
    this.description = description;
    this.dice = dice;
    this.weaponEffects = effect;
    this.weaponQualities = quality;
    this.century = century;
  }

  static allTypes(version: number) {
    return version === 1
      ? TorpedoLoadTypeModel.TYPES
      : TorpedoLoadTypeModel.TYPES_2E;
  }

  static allTypesByYear(year: number, version: number) {
    return this.allTypes(version).filter(
      (l) => year > centuryToYear(l.century),
    );
  }

  get effectAndQualities() {
    const result = [];
    this.weaponEffects.forEach((e) => result.push(e));
    this.weaponQualities.forEach((q) => result.push(q));
    return result;
  }

  static getTorpedoLoadTypeModelByType(type: TorpedoLoadType, version: number) {
    const result = this.allTypes(version).filter((e) => e.type === type)[0];
    return result;
  }
}

export enum MineType {
  Blackout,
  Blade,
  Chroniton,
  Gravimetric,
  Neutronic,
  Nuclear,
  Photon,
  Photonic,
  Plasma,
  Polaron,
  Positron,
  Quantum,
  Tetryonic,
  Transphasic,
}

export class MineTypeModel {
  readonly type: MineType;
  readonly description: string;
  readonly dice: number;
  readonly weaponEffects: WeaponQuality[];
  readonly weaponQualities: WeaponQuality[];
  readonly century: number;

  static readonly TYPES = [
    new MineTypeModel(
      MineType.Blackout,
      'Blackout',
      1,
      [],
      [new WeaponQuality(Quality.Jamming)],
      23,
    ),
    new MineTypeModel(
      MineType.Blade,
      'Blade',
      2,
      [new WeaponQuality(Quality.Piercing, 2)],
      [],
      22,
    ),
    new MineTypeModel(
      MineType.Chroniton,
      'Chroniton',
      2,
      [],
      [new WeaponQuality(Quality.Slowing)],
      25,
    ),
    new MineTypeModel(
      MineType.Gravimetric,
      'Gravimetric',
      2,
      [new WeaponQuality(Quality.Piercing, 1)],
      [new WeaponQuality(Quality.HighYield)],
      24,
    ),
    new MineTypeModel(
      MineType.Neutronic,
      'Neutronic',
      3,
      [new WeaponQuality(Quality.Dampening)],
      [],
      25,
    ),
    new MineTypeModel(
      MineType.Nuclear,
      'Nuclear',
      2,
      [new WeaponQuality(Quality.Vicious, 1)],
      [],
      20,
    ),
    new MineTypeModel(
      MineType.Photon,
      'Photon',
      2,
      [],
      [new WeaponQuality(Quality.HighYield)],
      23,
    ),
    new MineTypeModel(
      MineType.Photonic,
      'Photonic',
      1,
      [],
      [new WeaponQuality(Quality.HighYield)],
      22,
    ),
    new MineTypeModel(
      MineType.Plasma,
      'Plasma',
      2,
      [new WeaponQuality(Quality.PersistentX, 4)],
      [],
      23,
    ),
    new MineTypeModel(
      MineType.Polaron,
      'Polaron',
      2,
      [new WeaponQuality(Quality.Piercing, 2)],
      [],
      24,
    ),
    new MineTypeModel(
      MineType.Positron,
      'Positron',
      2,
      [new WeaponQuality(Quality.Piercing, 2)],
      [],
      24,
    ),
    new MineTypeModel(
      MineType.Quantum,
      'Quantum',
      3,
      [new WeaponQuality(Quality.Vicious, 1)],
      [new WeaponQuality(Quality.HighYield)],
      24,
    ),
    new MineTypeModel(
      MineType.Tetryonic,
      'Tetryonic',
      1,
      [new WeaponQuality(Quality.Depleting)],
      [new WeaponQuality(Quality.HighYield)],
      24,
    ),
  ];

  static readonly TYPES_2E = [
    new MineTypeModel(
      MineType.Blackout,
      'Blackout',
      2,
      [],
      [new WeaponQuality(Quality.Jamming)],
      23,
    ),
    new MineTypeModel(
      MineType.Blade,
      'Blade',
      3,
      [new WeaponQuality(Quality.Piercing)],
      [],
      22,
    ),
    new MineTypeModel(
      MineType.Chroniton,
      'Chroniton',
      4,
      [],
      [new WeaponQuality(Quality.Slowing)],
      25,
    ),
    new MineTypeModel(
      MineType.Gravimetric,
      'Gravimetric',
      6,
      [new WeaponQuality(Quality.Cumbersome)],
      [
        new WeaponQuality(Quality.HighYield),
        new WeaponQuality(Quality.Piercing),
      ],
      24,
    ),
    new MineTypeModel(
      MineType.Neutronic,
      'Neutronic',
      5,
      [new WeaponQuality(Quality.Dampening)],
      [],
      25,
    ),
    new MineTypeModel(
      MineType.Nuclear,
      'Nuclear',
      4,
      [new WeaponQuality(Quality.Intense)],
      [],
      20,
    ),
    new MineTypeModel(
      MineType.Photon,
      'Photon',
      4,
      [],
      [new WeaponQuality(Quality.HighYield)],
      23,
    ),
    new MineTypeModel(
      MineType.Photonic,
      'Photonic',
      3,
      [],
      [new WeaponQuality(Quality.HighYield)],
      22,
    ),
    new MineTypeModel(
      MineType.Plasma,
      'Plasma',
      6,
      [
        new WeaponQuality(Quality.Cumbersome),
        new WeaponQuality(Quality.PersistentX),
      ],
      [],
      23,
    ),
    new MineTypeModel(
      MineType.Polaron,
      'Polaron',
      4,
      [new WeaponQuality(Quality.Piercing)],
      [],
      24,
    ),
    new MineTypeModel(
      MineType.Positron,
      'Positron',
      6,
      [
        new WeaponQuality(Quality.Cumbersome),
        new WeaponQuality(Quality.Dampening),
      ],
      [],
      24,
    ),
    new MineTypeModel(
      MineType.Quantum,
      'Quantum',
      5,
      [new WeaponQuality(Quality.Intense)],
      [new WeaponQuality(Quality.HighYield)],
      24,
    ),
    new MineTypeModel(
      MineType.Tetryonic,
      'Tetryonic',
      3,
      [new WeaponQuality(Quality.Depleting)],
      [new WeaponQuality(Quality.HighYield)],
      24,
    ),
    new MineTypeModel(
      MineType.Transphasic,
      'Transphasic',
      3,
      [new WeaponQuality(Quality.Devastating)],
      [new WeaponQuality(Quality.Piercing)],
      24,
    ),
  ];

  constructor(
    type: MineType,
    description: string,
    dice: number,
    effect: WeaponQuality[],
    quality: WeaponQuality[],
    century: number,
  ) {
    this.type = type;
    this.description = description;
    this.dice = dice;
    this.weaponEffects = effect;
    this.weaponQualities = quality;
    this.century = century;
  }

  static allTypes(version: number) {
    return version === 1 ? MineTypeModel.TYPES : MineTypeModel.TYPES_2E;
  }

  static allTypesByYear(version: number, year: number) {
    return this.allTypes(version).filter(
      (l) => year > centuryToYear(l.century),
    );
  }

  get effectAndQualities(): WeaponQuality[] {
    const result = [];
    result.push(...this.weaponEffects);
    result.push(...this.weaponQualities);
    return result;
  }

  get effectAndQualitiesAsString(): string {
    const result: string[] = [];
    if (this.effect) {
      result.push(this.effect);
    }
    const qualities = this.qualities;
    if (qualities) {
      result.push(qualities);
    }
    return result.join(', ');
  }

  get effect() {
    const result = this.weaponEffects.map((q) => q.localizedDescription);
    return result.join(', ');
  }

  get qualities() {
    const result = this.weaponQualities.map((q) => q.localizedDescription);
    return result.join(', ');
  }

  static getMineTypeById(type: MineType, version: number) {
    const types = MineTypeModel.allTypes(version).filter(
      (t) => t.type === type,
    );
    return types?.length ? types[0] : null;
  }
}

export enum DeliverySystem {
  Cannons,
  Banks,
  Arrays,
  SpinalLances,
}

export class DeliverySystemModel {
  static readonly TYPES = [
    new DeliverySystemModel(DeliverySystem.Cannons, 'Cannons', 2, 21),
    new DeliverySystemModel(DeliverySystem.Banks, 'Banks', 1, 23),
    new DeliverySystemModel(
      DeliverySystem.Arrays,
      'Arrays',
      0,
      24,
      new WeaponQuality(Quality.AreaOrSpread),
    ),
    new DeliverySystemModel(DeliverySystem.SpinalLances, 'Spinal Lance', 3, 25),
  ];

  type: DeliverySystem;
  description: string;
  diceBonus: number;
  century: number;
  additionalQuality: WeaponQuality;

  constructor(
    type: DeliverySystem,
    description: string,
    diceBonus: number,
    century: number,
    additionalQuality?: WeaponQuality,
  ) {
    this.type = type;
    this.description = description;
    this.diceBonus = diceBonus;
    this.century = century;
    this.additionalQuality = additionalQuality;
  }

  static allTypes() {
    return DeliverySystemModel.TYPES;
  }

  static allTypesByYear(year: number) {
    return this.allTypes().filter((d) => year > centuryToYear(d.century));
  }
}

export class Weapon {
  usageCategory: UsageCategory;
  nameValue: string;
  readonly baseDice: number;
  type: WeaponType;
  eras: Era[][];
  requiresTalent: boolean;
  loadType?:
    | EnergyLoadTypeModel
    | CaptureTypeModel
    | TorpedoLoadTypeModel
    | MineTypeModel;
  deliveryType?: DeliverySystemModel;
  qualityValues: WeaponQuality[];
  effectValues: WeaponQuality[];
  hands?: number;
  injuryType?: InjuryType;
  personalWeaponType?: PersonalWeaponType;

  constructor(
    usage: UsageCategory,
    name: string,
    dice: number,
    type: WeaponType,
    loadType?:
      | EnergyLoadTypeModel
      | CaptureTypeModel
      | TorpedoLoadTypeModel
      | MineTypeModel,
    deliveryType?: DeliverySystemModel,
    eras: Era[][] = [
      [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration],
      [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration],
    ],
    requiresTalent: boolean = false,
  ) {
    this.usageCategory = usage;
    this.nameValue = name;
    this.baseDice = dice;
    this.type = type;
    this.eras = eras;
    this.requiresTalent = requiresTalent;
    this.loadType = loadType;
    this.deliveryType = deliveryType;
  }

  copy() {
    const result = new Weapon(
      this.usageCategory,
      this.nameValue,
      this.baseDice,
      this.type,
      this.loadType,
      this.deliveryType,
      this.eras,
      this.requiresTalent,
    );
    result.qualityValues = this.qualityValues;
    result.effectValues = this.effectValues;
    result.hands = this.hands;
    result.injuryType = this.injuryType;
    result.personalWeaponType = this.personalWeaponType;
    return result;
  }

  get range() {
    if (this.usageCategory === UsageCategory.Character) {
      return null;
    } else if (this.type === WeaponType.ENERGY && this.deliveryType != null) {
      if (this.deliveryType.type === DeliverySystem.Cannons) {
        return WeaponRange.Close;
      } else if (this.deliveryType.type === DeliverySystem.SpinalLances) {
        return WeaponRange.Long;
      } else {
        return WeaponRange.Medium;
      }
    } else if (
      this.type === WeaponType.TORPEDO &&
      this.loadType instanceof TorpedoLoadTypeModel
    ) {
      const torpedoLoad = this.loadType as TorpedoLoadTypeModel;
      if (
        torpedoLoad.type === TorpedoLoadType.Nuclear ||
        torpedoLoad.type === TorpedoLoadType.Spatial
      ) {
        return WeaponRange.Medium;
      } else {
        return WeaponRange.Long;
      }
    } else {
      return null;
    }
  }

  get weaponQualities() {
    if (this.usageCategory === UsageCategory.Character) {
      return this.effects.concat(this.qualities);
    } else if (this.loadType instanceof EnergyLoadTypeModel) {
      const quality = [
        ...(this.loadType as EnergyLoadTypeModel).effectsAndQualities,
      ];
      if (this.deliveryType?.additionalQuality != null) {
        quality.push(this.deliveryType.additionalQuality);
      }
      return quality;
    } else if (this.loadType instanceof TorpedoLoadTypeModel) {
      return (this.loadType as TorpedoLoadTypeModel).weaponQualities;
    } else {
      return [];
    }
  }

  isQualityPresent(quality: Quality) {
    let result = false;
    this.weaponQualities.forEach((q) => {
      if (q.quality === quality) {
        result = true;
      }
    });
    return result;
  }

  getRankForQuality(quality: Quality) {
    let result = 0;
    this.weaponQualities.forEach((q) => {
      if (q.quality === quality) {
        result = q.rank || 0;
      }
    });
    return result;
  }

  get scaleApplies() {
    if (this.usageCategory === UsageCategory.Character) {
      return false;
    } else {
      return this.type === WeaponType.ENERGY;
    }
  }

  get dice() {
    if (this.usageCategory === UsageCategory.Character) {
      return this.baseDice;
    } else if (this.type === WeaponType.ENERGY && this.deliveryType != null) {
      return this.deliveryType.diceBonus;
    } else if (this.type === WeaponType.TORPEDO) {
      return (this.loadType as TorpedoLoadTypeModel).dice;
    } else if (this.type === WeaponType.MINE) {
      return (this.loadType as MineTypeModel).dice;
    } else {
      return 0;
    }
  }

  get name() {
    if (
      this.usageCategory === UsageCategory.Character &&
      this.nameValue?.length
    ) {
      return this.nameValue;
    } else if (this.nameValue?.length) {
      return this.nameValue;
    } else if (this.deliveryType != null) {
      return this.loadType.description + ' ' + this.deliveryType.description;
    } else if (this.type === WeaponType.TORPEDO) {
      return this.loadType.description + ' Torpedoes';
    } else if (this.type === WeaponType.MINE) {
      return this.loadType.description + ' Mines';
    } else {
      return this.loadType.description;
    }
  }

  // returns qualities without effects
  get qualities() {
    if (this.usageCategory === UsageCategory.Character) {
      return this.qualityValues;
    } else if (
      this.loadType != null &&
      this.loadType instanceof EnergyLoadTypeModel
    ) {
      return (this.loadType as EnergyLoadTypeModel).qualities;
    } else {
      let result = [];
      if (
        this.loadType != null &&
        this.loadType instanceof TorpedoLoadTypeModel
      ) {
        const torpedoLoadType = this.loadType as TorpedoLoadTypeModel;
        result = [...torpedoLoadType.weaponQualities];
      } else if (
        this.loadType != null &&
        this.loadType instanceof MineTypeModel
      ) {
        const mineType = this.loadType as MineTypeModel;
        result = [...mineType.weaponQualities];
      }

      return result;
    }
  }

  get effects() {
    if (this.usageCategory === UsageCategory.Character) {
      return this.effectValues;
    } else {
      let result = [];
      if (
        this.loadType != null &&
        this.loadType instanceof EnergyLoadTypeModel
      ) {
        result = [...(this.loadType as EnergyLoadTypeModel).effects];
      } else if (
        this.loadType != null &&
        this.loadType instanceof TorpedoLoadTypeModel
      ) {
        const torpedoLoadType = this.loadType as TorpedoLoadTypeModel;
        result = [...torpedoLoadType.weaponEffects];
      } else if (
        this.loadType != null &&
        this.loadType instanceof MineTypeModel
      ) {
        const mineType = this.loadType as MineTypeModel;
        result = [...mineType.weaponEffects];
      }

      if (this.deliveryType?.additionalQuality != null) {
        result.push(this.deliveryType.additionalQuality);
      }

      return result;
    }
  }
  get injuryTypeEffectsAndQualities() {
    const result = [];
    if (this.injuryType != null) {
      result.push(
        i18next.t(makeKey('InjuryType.', InjuryType[this.injuryType])),
      );
    }
    const temp = this.effectsAndQualitiesAsString;
    if (temp.length) {
      result.push(temp);
    }
    return result.join(', ');
  }

  get effectsAndQualities(): WeaponQuality[] {
    if (this.usageCategory === UsageCategory.Character) {
      return [...this.weaponQualities];
    } else {
      const result = [];
      if (
        this.loadType != null &&
        this.loadType instanceof EnergyLoadTypeModel
      ) {
        result.push(
          ...(this.loadType as EnergyLoadTypeModel).effectsAndQualities,
        );
      } else if (
        this.loadType != null &&
        this.loadType instanceof TorpedoLoadTypeModel
      ) {
        const torpedoLoadType = this.loadType as TorpedoLoadTypeModel;
        result.push(...torpedoLoadType.effectAndQualities);
      } else if (
        this.loadType != null &&
        this.loadType instanceof MineTypeModel
      ) {
        const torpedoLoadType = this.loadType as MineTypeModel;
        result.push(...torpedoLoadType.effectAndQualities);
      }

      if (this.deliveryType?.additionalQuality != null) {
        result.push(this.deliveryType.additionalQuality);
      }
      return result;
    }
  }

  get effectsAndQualitiesAsString() {
    return this.effectsAndQualities
      .filter((q) => q != null)
      .map((q) => q.localizedDescription?.trim())
      .join(', ');
  }

  get isTractorOrGrappler() {
    return this.type === WeaponType.CAPTURE;
  }

  static createCharacterWeapon(
    name: string,
    injuryType: InjuryType,
    dice: number,
    effects: WeaponQuality[],
    qualities: WeaponQuality[],
    type: WeaponType,
    hands: number = 1,
    personalWeaponType?: PersonalWeaponType,
  ) {
    const result = new Weapon(UsageCategory.Character, name, dice, type);
    result.qualityValues = qualities;
    result.effectValues = effects;
    result.hands = hands;
    result.injuryType = injuryType;
    result.personalWeaponType = personalWeaponType;
    return result;
  }

  static createStarshipWeapon(
    name: string,
    type: WeaponType,
    loadType:
      | EnergyLoadTypeModel
      | CaptureTypeModel
      | TorpedoLoadTypeModel
      | MineTypeModel,
    deliveryType?: DeliverySystemModel,
    eras: Era[][] = [
      [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration],
      [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration],
    ],
    requiresTalent: boolean = false,
  ) {
    return new Weapon(
      UsageCategory.Starship,
      name,
      0,
      type,
      loadType,
      deliveryType,
      eras,
      requiresTalent,
    );
  }
}

class StarshipWeaponList {
  readonly list: Weapon[] = [
    Weapon.createStarshipWeapon(
      'Phase Cannons',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(1)[EnergyLoadType.PhasePulse],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[Era.Enterprise], []],
    ),
    Weapon.createStarshipWeapon(
      'Phaser Cannons',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(1)[EnergyLoadType.Phaser],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[Era.OriginalSeries, Era.NextGeneration], []],
    ),
    Weapon.createStarshipWeapon(
      'Phaser Banks',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(1)[EnergyLoadType.Phaser],
      DeliverySystemModel.allTypes()[DeliverySystem.Banks],
      [
        [Era.OriginalSeries, Era.NextGeneration],
        [Era.OriginalSeries, Era.NextGeneration],
      ],
    ),
    Weapon.createStarshipWeapon(
      'Phaser Arrays',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(1)[EnergyLoadType.Phaser],
      DeliverySystemModel.allTypes()[DeliverySystem.Arrays],
      [[Era.NextGeneration], []],
    ),
    Weapon.createStarshipWeapon(
      'Disruptor Cannons',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(1)[EnergyLoadType.Disruptor],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[], [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration]],
    ),
    Weapon.createStarshipWeapon(
      'Disruptor Banks',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(1)[EnergyLoadType.Disruptor],
      DeliverySystemModel.allTypes()[DeliverySystem.Banks],
      [[], [Era.NextGeneration]],
    ),
    Weapon.createStarshipWeapon(
      'Disruptor Spinal Lance',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(1)[EnergyLoadType.Disruptor],
      DeliverySystemModel.allTypes()[DeliverySystem.SpinalLances],
      [[], [Era.NextGeneration]],
    ),
    Weapon.createStarshipWeapon(
      'Electromagnetic Cannon',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(1)[EnergyLoadType.ElectroMagneticIonic],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[], [Era.NextGeneration]],
    ),
    Weapon.createStarshipWeapon(
      'Spatial Torpedoes',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(1)[TorpedoLoadType.Spatial],
      undefined,
      [[Era.Enterprise], []],
    ),
    Weapon.createStarshipWeapon(
      'Nuclear Warheads',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(1)[TorpedoLoadType.Nuclear],
      undefined,
      [[Era.Enterprise], []],
      true,
    ),
    Weapon.createStarshipWeapon(
      'Photon Torpedoes',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(1)[TorpedoLoadType.Photon],
      undefined,
      [
        [Era.OriginalSeries, Era.NextGeneration],
        [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration],
      ],
    ),
    Weapon.createStarshipWeapon(
      'Plasma Torpedoes',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(1)[TorpedoLoadType.Plasma],
      undefined,
      [[], []],
    ),
    Weapon.createStarshipWeapon(
      'Quantum Torpedoes',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(1)[TorpedoLoadType.Quantum],
      undefined,
      [[Era.NextGeneration], []],
      true,
    ),
    Weapon.createStarshipWeapon(
      'Grappler Cables',
      WeaponType.CAPTURE,
      CaptureTypeModel.allTypes()[CaptureType.Grappler],
      undefined,
      [[Era.Enterprise], []],
    ),
    Weapon.createStarshipWeapon(
      'Tractor Beam',
      WeaponType.CAPTURE,
      CaptureTypeModel.allTypes()[CaptureType.Tractor],
      undefined,
      [
        [Era.OriginalSeries, Era.NextGeneration],
        [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration],
      ],
    ),
  ];

  readonly list2e: Weapon[] = [
    Weapon.createStarshipWeapon(
      'Phase Cannons',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.PhasePulse],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[Era.Enterprise], []],
    ),
    Weapon.createStarshipWeapon(
      'Phaser Cannons',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.Phaser],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[Era.OriginalSeries, Era.NextGeneration], []],
    ),
    Weapon.createStarshipWeapon(
      'Pulse Phaser Cannons',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.PulsePhaser],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[Era.OriginalSeries, Era.NextGeneration], []],
    ),
    Weapon.createStarshipWeapon(
      'Phaser Banks',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.Phaser],
      DeliverySystemModel.allTypes()[DeliverySystem.Banks],
      [
        [Era.OriginalSeries, Era.NextGeneration],
        [Era.OriginalSeries, Era.NextGeneration],
      ],
    ),
    Weapon.createStarshipWeapon(
      'Phaser Arrays',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.Phaser],
      DeliverySystemModel.allTypes()[DeliverySystem.Arrays],
      [[Era.NextGeneration], []],
    ),
    Weapon.createStarshipWeapon(
      'Disruptor Cannons',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.Disruptor],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[], [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration]],
    ),
    Weapon.createStarshipWeapon(
      'Disruptor Banks',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.Disruptor],
      DeliverySystemModel.allTypes()[DeliverySystem.Banks],
      [[], [Era.NextGeneration]],
    ),
    Weapon.createStarshipWeapon(
      'Disruptor Spinal Lance',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.Disruptor],
      DeliverySystemModel.allTypes()[DeliverySystem.SpinalLances],
      [[], [Era.NextGeneration]],
    ),
    Weapon.createStarshipWeapon(
      'Electromagnetic Cannon',
      WeaponType.ENERGY,
      EnergyLoadTypeModel.allTypes(2)[EnergyLoadType.ElectroMagneticIonic],
      DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
      [[], [Era.NextGeneration]],
    ),
    Weapon.createStarshipWeapon(
      'Spatial Torpedoes',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(2)[TorpedoLoadType.Spatial],
      undefined,
      [[Era.Enterprise], []],
    ),
    Weapon.createStarshipWeapon(
      'Nuclear Warheads',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(2)[TorpedoLoadType.Nuclear],
      undefined,
      [[Era.Enterprise], []],
      true,
    ),
    Weapon.createStarshipWeapon(
      'Photon Torpedoes',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(2)[TorpedoLoadType.Photon],
      undefined,
      [
        [Era.OriginalSeries, Era.NextGeneration],
        [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration],
      ],
    ),
    Weapon.createStarshipWeapon(
      'Plasma Torpedoes',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(2)[TorpedoLoadType.Plasma],
      undefined,
      [[], []],
    ),
    Weapon.createStarshipWeapon(
      'Quantum Torpedoes',
      WeaponType.TORPEDO,
      TorpedoLoadTypeModel.allTypes(2)[TorpedoLoadType.Quantum],
      undefined,
      [[Era.NextGeneration], []],
      true,
    ),
    Weapon.createStarshipWeapon(
      'Grappler Cables',
      WeaponType.CAPTURE,
      CaptureTypeModel.allTypes()[CaptureType.Grappler],
      undefined,
      [[Era.Enterprise], []],
    ),
    Weapon.createStarshipWeapon(
      'Tractor Beam',
      WeaponType.CAPTURE,
      CaptureTypeModel.allTypes()[CaptureType.Tractor],
      undefined,
      [
        [Era.OriginalSeries, Era.NextGeneration],
        [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration],
      ],
    ),
  ];
  availableWeapons(type: CharacterType, era: Era) {
    if (type === CharacterType.Other) {
      return Weapon[0];
    } else {
      return this.list.filter((w) => {
        const erasForType = w.eras[type];
        return erasForType.indexOf(era) >= 0;
      });
    }
  }

  getWeaponByName(name: string, version: number) {
    const list = version === 1 ? this.list : this.list2e;
    const filteredList = list.filter((w) => w.name === name);
    return filteredList?.length ? filteredList[0] : undefined;
  }
}

export const StarshipWeaponRegistry = new StarshipWeaponList();

export enum PersonalWeaponType {
  Phaser1,
  Phaser2,
  PhaserRifle,
  PhasePistol,
  Blade,
  HeavyBlade,
  UshaanTor,
  MekLeth,
  BatLeth,
  TzenkethiHeavyBlade,
  ParticleRifle,
  PulseGrenade,
  DisruptorPistol,
  DisruptorRifle,
  DkTagh,
  SonaPlasmaDisruptorShotgun,
  JemHadarPlasmaPistol,
  JemHadarPlasmaRifle,
  EnergyWhip,
  Dagger,
  KeratinDart,
  PolaronDisruptorPistol,
  PolaronDisruptorRifle,
  NeuralTruncheon,
  CryogenicGrenade,
}

export class PersonalWeapons {
  private static instanceVersion1: PersonalWeaponsVersion1;
  private static singleton: PersonalWeapons;

  allTypes(): PersonalWeaponType[] {
    return Object.keys(PersonalWeaponType)
      .filter((item) => {
        return !isNaN(Number(item));
      })
      .map((item) => Number(item));
  }

  get unarmedStrike() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.strike.name'),
      InjuryType.Stun,
      2,
      [],
      [],
      WeaponType.MELEE,
    );
  }

  get unarmedStrikeMean() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.strike.name'),
      InjuryType.Stun,
      2,
      [],
      [new WeaponQuality(Quality.Intense)],
      WeaponType.MELEE,
    );
  }

  get unarmedStrikeMartialArtist() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.strike.name'),
      InjuryType.StunOrDeadly,
      2,
      [],
      [],
      WeaponType.MELEE,
    );
  }

  // TODO: is this right?
  get unarmedStrikeBruteForce() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.strike.name'),
      InjuryType.Stun,
      2,
      [new WeaponQuality(Quality.Debilitating)],
      [],
      WeaponType.MELEE,
    );
  }

  get phasePistol() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.phasePistol.name'),
      InjuryType.StunOrDeadly,
      3,
      [],
      [],
      WeaponType.ENERGY,
      1,
      PersonalWeaponType.PhasePistol,
    );
  }

  get phaser1() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.phaser1.name'),
      InjuryType.StunOrDeadly,
      3,
      [],
      [new WeaponQuality(Quality.Charge), new WeaponQuality(Quality.Hidden, 1)],
      WeaponType.ENERGY,
      1,
      PersonalWeaponType.Phaser1,
    );
  }

  get phaser2() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.phaser2.name'),
      InjuryType.StunOrDeadly,
      4,
      [],
      [new WeaponQuality(Quality.Charge)],
      WeaponType.ENERGY,
      1,
      PersonalWeaponType.Phaser2,
    );
  }

  get phaserRifle() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.phaserRifle.name'),
      InjuryType.StunOrDeadly,
      5,
      [],
      [new WeaponQuality(Quality.Accurate), new WeaponQuality(Quality.Charge)],
      WeaponType.ENERGY,
      2,
      PersonalWeaponType.PhaserRifle,
    );
  }

  get pulseGrenade() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.pulseGrenade.name'),
      InjuryType.StunOrDeadly,
      5,
      [],
      [new WeaponQuality(Quality.Grenade), new WeaponQuality(Quality.Area)],
      WeaponType.ENERGY,
      1,
      PersonalWeaponType.PulseGrenade,
    );
  }

  get ushaanTor() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.ushaantor.name'),
      InjuryType.Deadly,
      3,
      [],
      [],
      WeaponType.MELEE,
      1,
      PersonalWeaponType.UshaanTor,
    );
  }

  get blade() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.blade.name'),
      InjuryType.Deadly,
      3,
      [],
      [],
      WeaponType.MELEE,
      1,
      PersonalWeaponType.Blade,
    );
  }

  get mekLeth() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.mekleth.name'),
      InjuryType.Deadly,
      3,
      [],
      [],
      WeaponType.MELEE,
      1,
      PersonalWeaponType.MekLeth,
    );
  }

  get heavyBlade() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.heavyBlade.name'),
      InjuryType.Deadly,
      3,
      [new WeaponQuality(Quality.Intense)],
      [],
      WeaponType.MELEE,
      2,
      PersonalWeaponType.HeavyBlade,
    );
  }

  get batLeth() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.batleth.name'),
      InjuryType.Deadly,
      3,
      [new WeaponQuality(Quality.Intense)],
      [],
      WeaponType.MELEE,
      2,
      PersonalWeaponType.BatLeth,
    );
  }

  get tzenkethiHeavyBlade() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.tzenkethiHeavyBlade.name'),
      InjuryType.Deadly,
      3,
      [new WeaponQuality(Quality.Intense)],
      [],
      WeaponType.MELEE,
      2,
      PersonalWeaponType.TzenkethiHeavyBlade,
    );
  }

  get particleRifle() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.particleRifle.name'),
      InjuryType.StunOrDeadly,
      4,
      [],
      [new WeaponQuality(Quality.Accurate)],
      WeaponType.ENERGY,
      2,
      PersonalWeaponType.ParticleRifle,
    );
  }

  get dkTagh() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.dktahg.name'),
      InjuryType.Deadly,
      2,
      [],
      [new WeaponQuality(Quality.Hidden, 1)],
      WeaponType.MELEE,
      1,
      PersonalWeaponType.DkTagh,
    );
  }

  get disruptorPistol() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.disruptor.name'),
      InjuryType.Deadly,
      4,
      [new WeaponQuality(Quality.Intense)],
      [],
      WeaponType.ENERGY,
      1,
      PersonalWeaponType.DisruptorPistol,
    );
  }

  get disruptorRifle() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.disruptorRifle.name'),
      InjuryType.Deadly,
      4,
      [new WeaponQuality(Quality.Accurate), new WeaponQuality(Quality.Intense)],
      [],
      WeaponType.ENERGY,
      1,
      PersonalWeaponType.DisruptorRifle,
    );
  }

  get sonaPlasmaDisruptorShotgun() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.sonaPlasmaDisruptorShotgun.name'),
      InjuryType.Deadly,
      5,
      [
        new WeaponQuality(Quality.Intense),
        new WeaponQuality(Quality.Debilitating),
        new WeaponQuality(Quality.Piercing, 1),
      ],
      [],
      WeaponType.ENERGY,
      2,
      PersonalWeaponType.SonaPlasmaDisruptorShotgun,
    );
  }

  get energyWhip() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.energyWhip.name'),
      InjuryType.Stun,
      4,
      [new WeaponQuality(Quality.Intense)],
      [],
      WeaponType.ENERGY,
      1,
      PersonalWeaponType.EnergyWhip,
    );
  }

  get dagger() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.dagger.name'),
      InjuryType.Deadly,
      2,
      [],
      [new WeaponQuality(Quality.Hidden, 1)],
      WeaponType.MELEE,
      1,
      PersonalWeaponType.Dagger,
    );
  }

  get keratinDart() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.keratinDart.name'),
      InjuryType.StunOrDeadly,
      2,
      [],
      [],
      WeaponType.MELEE,
      1,
      PersonalWeaponType.KeratinDart,
    );
  }

  getWeaponByType(type: PersonalWeaponType) {
    switch (type) {
      case PersonalWeaponType.PhasePistol:
        return this.phasePistol;
      case PersonalWeaponType.Phaser1:
        return this.phaser1;
      case PersonalWeaponType.Phaser2:
        return this.phaser2;
      case PersonalWeaponType.PhaserRifle:
        return this.phaserRifle;
      case PersonalWeaponType.PulseGrenade:
        return this.pulseGrenade;
      case PersonalWeaponType.UshaanTor:
        return this.ushaanTor;
      case PersonalWeaponType.HeavyBlade:
        return this.heavyBlade;
      case PersonalWeaponType.Blade:
        return this.blade;
      case PersonalWeaponType.MekLeth:
        return this.mekLeth;
      case PersonalWeaponType.BatLeth:
        return this.batLeth;
      case PersonalWeaponType.TzenkethiHeavyBlade:
        return this.tzenkethiHeavyBlade;
      case PersonalWeaponType.ParticleRifle:
        return this.particleRifle;
      case PersonalWeaponType.DisruptorPistol:
        return this.disruptorPistol;
      case PersonalWeaponType.DisruptorRifle:
        return this.disruptorRifle;
      case PersonalWeaponType.DkTagh:
        return this.dkTagh;
      case PersonalWeaponType.SonaPlasmaDisruptorShotgun:
        return this.sonaPlasmaDisruptorShotgun;
      case PersonalWeaponType.Dagger:
        return this.dagger;
      case PersonalWeaponType.EnergyWhip:
        return this.energyWhip;
      case PersonalWeaponType.KeratinDart:
        return this.keratinDart;
      default:
        return undefined;
    }
  }

  static instance(version: number) {
    if (version === 1) {
      if (PersonalWeapons.instanceVersion1 == null) {
        PersonalWeapons.instanceVersion1 = new PersonalWeaponsVersion1();
      }
      return PersonalWeapons.instanceVersion1;
    } else {
      if (PersonalWeapons.singleton == null) {
        PersonalWeapons.singleton = new PersonalWeapons();
      }
      return PersonalWeapons.singleton;
    }
  }
}

class PersonalWeaponsVersion1 extends PersonalWeapons {
  get unarmedStrike() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.strike.name'),
      InjuryType.Stun,
      1,
      [new WeaponQuality(Quality.Knockdown)],
      [new WeaponQuality(Quality.NonLethal)],
      WeaponType.MELEE,
    );
  }

  get unarmedStrikeMean() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.strike.name'),
      InjuryType.Stun,
      1,
      [
        new WeaponQuality(Quality.Knockdown),
        new WeaponQuality(Quality.Vicious, 1),
      ],
      [new WeaponQuality(Quality.NonLethal)],
      WeaponType.MELEE,
    );
  }

  get unarmedStrikeMartialArtist() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.strike.name'),
      InjuryType.Stun,
      1,
      [
        new WeaponQuality(Quality.Knockdown),
        new WeaponQuality(Quality.Intense),
      ],
      [new WeaponQuality(Quality.NonLethal)],
      WeaponType.MELEE,
    );
  }

  get unarmedStrikeBruteForce() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.strike.name'),
      InjuryType.Stun,
      1,
      [
        new WeaponQuality(Quality.Knockdown),
        new WeaponQuality(Quality.Vicious, 1),
      ],
      [],
      WeaponType.MELEE,
    );
  }

  get phaser1() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.phaser1.name'),
      InjuryType.StunOrDeadly,
      2,
      [],
      [new WeaponQuality(Quality.Charge), new WeaponQuality(Quality.Hidden, 1)],
      WeaponType.ENERGY,
    );
  }
  get disruptorPistol() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.disruptor.name'),
      InjuryType.Deadly,
      3,
      [new WeaponQuality(Quality.Vicious, 1)],
      [],
      WeaponType.ENERGY,
    );
  }

  get phaser2() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.phaser2.name'),
      InjuryType.StunOrDeadly,
      3,
      [],
      [new WeaponQuality(Quality.Charge)],
      WeaponType.ENERGY,
    );
  }

  get sonaPlasmaDisruptorShotgun() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.sonaPlasmaDisruptorShotgun.name'),
      InjuryType.Deadly,
      4,
      [
        new WeaponQuality(Quality.Vicious, 1),
        new WeaponQuality(Quality.Debilitating),
        new WeaponQuality(Quality.Piercing, 1),
      ],
      [],
      WeaponType.ENERGY,
    );
  }
  get dkTagh() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.dktahg.name'),
      InjuryType.Deadly,
      1,
      [new WeaponQuality(Quality.Vicious, 1)],
      [new WeaponQuality(Quality.Deadly), new WeaponQuality(Quality.Hidden, 1)],
      WeaponType.MELEE,
    );
  }

  get energyWhip() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.energyWhip.name'),
      InjuryType.Stun,
      3,
      [new WeaponQuality(Quality.Intense)],
      [new WeaponQuality(Quality.NonLethal)],
      WeaponType.ENERGY,
    );
  }

  get dagger() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.dagger.name'),
      InjuryType.Deadly,
      1,
      [new WeaponQuality(Quality.Vicious, 1)],
      [new WeaponQuality(Quality.Deadly), new WeaponQuality(Quality.Hidden, 1)],
      WeaponType.MELEE,
    );
  }

  get particleRifle() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.particleRifle.name'),
      InjuryType.StunOrDeadly,
      3,
      [],
      [new WeaponQuality(Quality.Accurate)],
      WeaponType.ENERGY,
      2,
    );
  }

  get mekLeth() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.mekleth.name'),
      InjuryType.Deadly,
      2,
      [new WeaponQuality(Quality.Vicious, 1)],
      [],
      WeaponType.MELEE,
      1,
    );
  }

  get batLeth() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.batleth.name'),
      InjuryType.Deadly,
      3,
      [new WeaponQuality(Quality.Vicious, 1)],
      [],
      WeaponType.MELEE,
      2,
    );
  }

  get tzenkethiHeavyBlade() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.tzenkethiHeavyBlade.name'),
      InjuryType.Deadly,
      3,
      [new WeaponQuality(Quality.Vicious, 1)],
      [],
      WeaponType.MELEE,
      2,
    );
  }

  get ushaanTor() {
    return Weapon.createCharacterWeapon(
      i18next.t('Weapon.personal.ushaantor.name'),
      InjuryType.Deadly,
      2,
      [],
      [],
      WeaponType.MELEE,
    );
  }
}
