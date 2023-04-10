import i18next from "i18next";
import { CharacterType } from "../common/characterType";
import { makeKey } from "../common/translationKey";
import { Era } from "./eras";

export enum Quality {
    Area, Calibration, Charge, Dampening, Deadly, Depleting, Devastating, Hidden, HighYield,
    Intense, Jamming, Knockdown, NonLethal, PersistentX, Piercing, Slowing, Versatile, Vicious
}

export class WeaponQuality {
    readonly quality: Quality;
    readonly rank?: number;

    constructor(quality: Quality, rank?: number) {
        this.quality = quality;
        this.rank = rank;
    }

    get localizedDescription() {
        if (this.rank != null) {
            return i18next.t(makeKey("Weapon.quality.", Quality[this.quality], ".name"), {rank: this.rank});
        } else {
            return i18next.t(makeKey("Weapon.quality.", Quality[this.quality], ".name"));
        }
    }
}

export enum WeaponRange {
    Close, Medium, Long
}

export enum UsageCategory {
    Character, Starship
}

export enum WeaponType {
    MELEE, ENERGY, TORPEDO, MINE, CAPTURE
}

export class WeaponTypeModel {
    static readonly TYPES = [
        new WeaponTypeModel(WeaponType.MELEE, "Melee"),
        new WeaponTypeModel(WeaponType.ENERGY, "Energy Weapon"),
        new WeaponTypeModel(WeaponType.TORPEDO, "Torpedo"),
        new WeaponTypeModel(WeaponType.MINE, "Mine"),
        new WeaponTypeModel(WeaponType.CAPTURE, "Tractor/Grappler")
    ];

    readonly type: WeaponType;
    readonly description: string;

    constructor(type: WeaponType, description: string) {
        this.type = type;
        this.description = description;
    }

    static allStarshipTypes() {
        return [ WeaponTypeModel.TYPES[WeaponType.ENERGY],
            WeaponTypeModel.TYPES[WeaponType.TORPEDO],
            WeaponTypeModel.TYPES[WeaponType.CAPTURE] ];
    }
}

export enum CaptureType {
    Tractor, Grappler
}

export class CaptureTypeModel {
    static readonly TYPES = [
        new CaptureTypeModel(CaptureType.Tractor, "Tractor Beam"),
        new CaptureTypeModel(CaptureType.Grappler, "Grappler Cables")
    ]

    readonly type: CaptureType;
    readonly description: string;

    constructor(type: CaptureType, description: string) {
        this.type = type;
        this.description = description;
    }

    static allTypes() {
        return CaptureTypeModel.TYPES;
    }
}

export enum EnergyLoadType {
    AntiProton, Disruptor, ElectroMagneticIonic, FreeElectron, Graviton,
    PhasedPolaron, Phaser, PhasePulse, Proton, Tetryon
}

export class EnergyLoadTypeModel {
    static readonly TYPES = [
        new EnergyLoadTypeModel(EnergyLoadType.AntiProton,           "Antiproton Beam",        [],                                                    [new WeaponQuality(Quality.HighYield)],  25),
        new EnergyLoadTypeModel(EnergyLoadType.Disruptor,            "Disruptor",              [new WeaponQuality(Quality.Vicious, 1)],               [],            23),
        new EnergyLoadTypeModel(EnergyLoadType.ElectroMagneticIonic, "Electro-Magnetic/Ionic", [new WeaponQuality(Quality.Dampening), new WeaponQuality(Quality.Piercing, 1)], [],            22),
        new EnergyLoadTypeModel(EnergyLoadType.FreeElectron,         "Free Electron Laser",    [],                                                    [],            21),
        new EnergyLoadTypeModel(EnergyLoadType.Graviton,             "Graviton",               [new WeaponQuality(Quality.Piercing, 1)],              [new WeaponQuality(Quality.Devastating)], 23),
        new EnergyLoadTypeModel(EnergyLoadType.PhasedPolaron,        "Phased Polaron Beam",    [new WeaponQuality(Quality.Piercing, 2)],              [],            24),
        new EnergyLoadTypeModel(EnergyLoadType.Phaser,               "Phaser",                 [],                                                    [new WeaponQuality(Quality.Versatile, 2)], 23),
        new EnergyLoadTypeModel(EnergyLoadType.PhasePulse,           "Phase / Pulse",          [],                                                    [new WeaponQuality(Quality.Versatile, 1)], 22),
        new EnergyLoadTypeModel(EnergyLoadType.Proton,               "Proton Beam",            [new WeaponQuality(Quality.PersistentX)],              [],            25),
        new EnergyLoadTypeModel(EnergyLoadType.Tetryon,              "Tetryon",                [new WeaponQuality(Quality.Depleting)],                [],            25)
    ];

    readonly type: EnergyLoadType;
    readonly description: string;
    readonly _weaponQualities: WeaponQuality[];
    readonly century: number;

    constructor(type: EnergyLoadType, description: string, effect: WeaponQuality[], quality: WeaponQuality[], century: number) {
        this.type = type;
        this.description = description;
        this._weaponQualities = quality.concat(effect);
        this.century = century;
    }

    static allTypes() {
        return EnergyLoadTypeModel.TYPES;
    }

    static allTypesByYear(year: number) {
        return this.allTypes().filter(e => year > centuryToYear(e.century));
    }

    get qualities() {
        let result = this._weaponQualities.map(q => q.localizedDescription);
        return result.join(", ");
    }
}

export const centuryToYear = (century: number) => {
    return (century - 1) * 100;
}

export enum TorpedoLoadType {
    Chroniton, Gravimetric, Neutronic, Nuclear, Photon, Photonic, Plasma, Polaron,
    Positron, Quantum, Spatial, Tetryonic, Transphasic, Tricobolt
}

export class TorpedoLoadTypeModel {
    static readonly TYPES = [
        new TorpedoLoadTypeModel(TorpedoLoadType.Chroniton,   "Chroniton",   3, "",             [new WeaponQuality(Quality.Calibration), new WeaponQuality(Quality.Slowing)],    25),
        new TorpedoLoadTypeModel(TorpedoLoadType.Gravimetric, "Gravimetric", 3, "Piercing 1",   [new WeaponQuality(Quality.Calibration), new WeaponQuality(Quality.HighYield)],  24),
        new TorpedoLoadTypeModel(TorpedoLoadType.Neutronic,   "Neutronic",   4, "Dampening",    [new WeaponQuality(Quality.Calibration)],                                        25),
        new TorpedoLoadTypeModel(TorpedoLoadType.Nuclear,     "Nuclear",     3, "Vicious 1",    [new WeaponQuality(Quality.Calibration)],                                        20),
        new TorpedoLoadTypeModel(TorpedoLoadType.Photon,      "Photon",      3, "",             [new WeaponQuality(Quality.HighYield)],                                          23),
        new TorpedoLoadTypeModel(TorpedoLoadType.Photonic,    "Photonic",    2, "",             [new WeaponQuality(Quality.HighYield)],                                          22),
        new TorpedoLoadTypeModel(TorpedoLoadType.Plasma,      "Plasma",      3, "Persistent 8", [new WeaponQuality(Quality.Calibration)],                                        23),
        new TorpedoLoadTypeModel(TorpedoLoadType.Polaron,     "Polaron",     3, "Piercing 2",   [new WeaponQuality(Quality.Calibration)],                                        24),
        new TorpedoLoadTypeModel(TorpedoLoadType.Positron,    "Positron",    3, "Dampening",    [new WeaponQuality(Quality.Calibration)],                                        24),
        new TorpedoLoadTypeModel(TorpedoLoadType.Quantum,     "Quantum",     4, "Vicious 1",    [new WeaponQuality(Quality.Calibration), new WeaponQuality(Quality.HighYield)],  24),
        new TorpedoLoadTypeModel(TorpedoLoadType.Spatial,     "Spatial",     2, "",             [],                                                                              22),
        new TorpedoLoadTypeModel(TorpedoLoadType.Tetryonic,   "Tetryonic",   2, "Depleting",    [new WeaponQuality(Quality.Calibration), new WeaponQuality(Quality.HighYield)],  25),
        new TorpedoLoadTypeModel(TorpedoLoadType.Transphasic, "Transphasic", 3, "Piercing 2",   [new WeaponQuality(Quality.Calibration), new WeaponQuality(Quality.Devastating)],25),
        new TorpedoLoadTypeModel(TorpedoLoadType.Tricobolt,   "Tricobolt",   3, "Area",         [new WeaponQuality(Quality.Calibration)],                                        25),

    ];

    readonly type: TorpedoLoadType;
    readonly description: string;
    readonly dice: number;
    readonly effect: string;
    readonly _weaponQualities: WeaponQuality[];
    readonly century: number;

    constructor(type: TorpedoLoadType, description: string, dice: number, effect: string, quality: WeaponQuality[], century: number) {
        this.type = type;
        this.description = description;
        this.dice = dice;
        this.effect = effect;
        this._weaponQualities = quality;
        this.century = century;
    }

    static allTypes() {
        return TorpedoLoadTypeModel.TYPES;
    }

    static allTypesByYear(year: number) {
        return this.allTypes().filter(l => year > centuryToYear(l.century));
    }

    get qualities() {
        let result = this._weaponQualities.map(q => q.localizedDescription);
        return result.join(", ");
    }
}

export enum DeliverySystem {
    Cannons, Banks, Arrays, SpinalLances
}

export class DeliverySystemModel {

    static readonly TYPES = [
        new DeliverySystemModel(DeliverySystem.Cannons, "Cannons", 2, 21),
        new DeliverySystemModel(DeliverySystem.Banks, "Banks", 1, 23),
        new DeliverySystemModel(DeliverySystem.Arrays, "Arrays", 0, 24, "Area or Spread"),
        new DeliverySystemModel(DeliverySystem.SpinalLances, "Spinal Lance", 3, 25),
    ];

    type: DeliverySystem;
    description: string;
    diceBonus: number;
    century: number;
    additionalQualities: string

    constructor(type: DeliverySystem, description: string, diceBonus: number, century: number, additionalQualities: string = "") {
        this.type = type;
        this.description = description;
        this.diceBonus = diceBonus;
        this.century = century;
        this.additionalQualities = additionalQualities;
    }

    static allTypes() {
        return DeliverySystemModel.TYPES;
    }

    static allTypesByYear(year: number) {
        return this.allTypes().filter(d => year > centuryToYear(d.century));
    }
}

export class Weapon {
    usageCategory: UsageCategory;
    name: string;
    readonly baseDice: number;
    type: WeaponType;
    eras: Era[][];
    requiresTalent: boolean;
    loadType?: EnergyLoadTypeModel|CaptureTypeModel|TorpedoLoadTypeModel;
    deliveryType?: DeliverySystemModel;
    qualities: WeaponQuality[];
    effects: WeaponQuality[];
    _weaponQualities: WeaponQuality[];
    hands?: number;

    constructor(usage: UsageCategory, name: string, dice: number, type: WeaponType,
            loadType?: EnergyLoadTypeModel|CaptureTypeModel|TorpedoLoadTypeModel,
            deliveryType?: DeliverySystemModel,
            eras: Era[][] = [[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ],[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]],
            requiresTalent: boolean = false) {
        this.usageCategory = usage;
        this.name = name;
        this.baseDice = dice;
        this.type = type;
        this.eras = eras;
        this.requiresTalent = requiresTalent;
        this.loadType = loadType;
        this.deliveryType = deliveryType;
        this._weaponQualities = [];
    }

    get range() {
        if (this.usageCategory === UsageCategory.Character) {
            return null;
        } else if (this.type === WeaponType.ENERGY && this.deliveryType != null) {
            if (this.deliveryType.type === DeliverySystem.Cannons) {
                return WeaponRange.Close;
            } else if (this.deliveryType.type === DeliverySystem.SpinalLances){
                return WeaponRange.Long;
            } else {
                return WeaponRange.Medium;
            }
        } else if (this.type === WeaponType.TORPEDO && this.loadType instanceof TorpedoLoadTypeModel) {
            const torpedoLoad = this.loadType as TorpedoLoadTypeModel;
            if (torpedoLoad.type === TorpedoLoadType.Nuclear || torpedoLoad.type === TorpedoLoadType.Spatial) {
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
            return this._weaponQualities;
        } else if (this.loadType instanceof EnergyLoadTypeModel) {
            return (this.loadType as EnergyLoadTypeModel)._weaponQualities;
        } else if (this.loadType instanceof TorpedoLoadTypeModel) {
            return (this.loadType as TorpedoLoadTypeModel)._weaponQualities;
        } else {
            return [];
        }
    }

    isQualityPresent(quality: Quality) {
        let result = false;
        this.weaponQualities.forEach(q => {
            if (q.quality === quality) {
                result = true;
            }
        });
        return result;
    }

    getRankForQuality(quality: Quality) {
        let result = 0;
        this.weaponQualities.forEach(q => {
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
        } else {
            return 0;
        }
    }

    get description() {
        if (this.name) {
            return this.name;
        } else if (this.deliveryType != null) {
            return this.loadType.description + " " + this.deliveryType.description;
        } else if (this.type === WeaponType.TORPEDO) {
            return this.loadType.description + " Torpedoes";
        } else {
            return this.loadType.description;
        }
    }

    get effectsAndQualities() {
        if (this.usageCategory === UsageCategory.Character) {
            return this.weaponQualities.map(q => q.localizedDescription).join(", ");
        } else {
            let result = "";
            if (this.loadType != null && this.loadType instanceof EnergyLoadTypeModel) {
                result = (this.loadType as EnergyLoadTypeModel).qualities;
            } else if (this.loadType != null && this.loadType instanceof TorpedoLoadTypeModel) {
                let torpedoLoadType = this.loadType as TorpedoLoadTypeModel;
                result = torpedoLoadType.qualities;
            }

            if (this.deliveryType != null) {
                if (this.deliveryType.additionalQualities) {
                    if (result.length > 0) {
                        result += ", ";
                    }
                    result += this.deliveryType.additionalQualities;
                }
            }
            return result;
        }
    }

    get isTractorOrGrappler() {
        return this.type === WeaponType.CAPTURE;
    }

    static createCharacterWeapon(name: string, dice: number, qualities: WeaponQuality[], type: WeaponType, hands: number = 1) {
        let result = new Weapon(UsageCategory.Character, name, dice, type);
        result._weaponQualities = qualities;
        result.hands = hands;
        return result;
    }

    static createStarshipWeapon(name: string, type: WeaponType,
        loadType: EnergyLoadTypeModel|CaptureTypeModel|TorpedoLoadTypeModel,
        deliveryType?: DeliverySystemModel,
        eras: Era[][] = [[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ],[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]],
        requiresTalent: boolean = false) {
        return new Weapon(UsageCategory.Starship, name, 0, type, loadType, deliveryType, eras, requiresTalent);
    }
}

class StarshipWeaponList {
    readonly list: Weapon[] = [
        Weapon.createStarshipWeapon('Phase Cannons', WeaponType.ENERGY,
            EnergyLoadTypeModel.allTypes()[EnergyLoadType.PhasePulse],
            DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
            [[ Era.Enterprise ],[]]),
        Weapon.createStarshipWeapon('Phaser Cannons', WeaponType.ENERGY,
            EnergyLoadTypeModel.allTypes()[EnergyLoadType.Phaser],
            DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
            [[ Era.OriginalSeries, Era.NextGeneration ], []]),
        Weapon.createStarshipWeapon('Phaser Banks', WeaponType.ENERGY,
            EnergyLoadTypeModel.allTypes()[EnergyLoadType.Phaser],
            DeliverySystemModel.allTypes()[DeliverySystem.Banks],
            [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.OriginalSeries, Era.NextGeneration ]]),
        Weapon.createStarshipWeapon('Phaser Arrays', WeaponType.ENERGY,
            EnergyLoadTypeModel.allTypes()[EnergyLoadType.Phaser],
            DeliverySystemModel.allTypes()[DeliverySystem.Arrays],
            [[ Era.NextGeneration ], []]),
        Weapon.createStarshipWeapon('Disruptor Cannons', WeaponType.ENERGY,
            EnergyLoadTypeModel.allTypes()[EnergyLoadType.Disruptor],
            DeliverySystemModel.allTypes()[DeliverySystem.Cannons],
            [[], [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration]]),
        Weapon.createStarshipWeapon('Disruptor Banks', WeaponType.ENERGY,
            EnergyLoadTypeModel.allTypes()[EnergyLoadType.Disruptor],
            DeliverySystemModel.allTypes()[DeliverySystem.Banks],
            [[], [Era.NextGeneration]]),
        Weapon.createStarshipWeapon('Spatial Torpedoes', WeaponType.TORPEDO,
            TorpedoLoadTypeModel.allTypes()[TorpedoLoadType.Spatial],
            undefined,
            [[ Era.Enterprise ], []]),
        Weapon.createStarshipWeapon('Nuclear Warheads', WeaponType.TORPEDO,
            TorpedoLoadTypeModel.allTypes()[TorpedoLoadType.Nuclear],
            undefined,
            [[ Era.Enterprise ], []], true),
        Weapon.createStarshipWeapon('Photon Torpedoes', WeaponType.TORPEDO,
            TorpedoLoadTypeModel.allTypes()[TorpedoLoadType.Photon],
            undefined,
            [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]]),
        Weapon.createStarshipWeapon('Plasma Torpedoes', WeaponType.TORPEDO,
            TorpedoLoadTypeModel.allTypes()[TorpedoLoadType.Plasma],
            undefined,
            [[], []]),
        Weapon.createStarshipWeapon('Quantum Torpedoes', WeaponType.TORPEDO,
            TorpedoLoadTypeModel.allTypes()[TorpedoLoadType.Quantum],
            undefined,
            [[ Era.NextGeneration ], []], true),
        Weapon.createStarshipWeapon('Grappler Cables', WeaponType.CAPTURE,
            CaptureTypeModel.allTypes()[CaptureType.Grappler],
            undefined,
            [[ Era.Enterprise ], []]),
        Weapon.createStarshipWeapon('Tractor Beam', WeaponType.CAPTURE,
            CaptureTypeModel.allTypes()[CaptureType.Tractor],
            undefined,
            [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]]),
    ];

    availableWeapons(type: CharacterType, era: Era) {
        if (type === CharacterType.Other) {
            return Weapon[0];
        } else {
            return this.list.filter(w => {
                const erasForType = w.eras[type];
                return erasForType.indexOf(era) >= 0;
            });
        }
    }
}

const StarshipWeaponRegistry = new StarshipWeaponList();

export default StarshipWeaponRegistry;

export class PersonalWeapons {
    private static _instance;

    get unarmedStrike() {
        return Weapon.createCharacterWeapon(i18next.t('Weapon.personal.strike.name'), 1, [new WeaponQuality(Quality.Knockdown), new WeaponQuality(Quality.NonLethal)], WeaponType.MELEE);
    }

    get unarmedStrikeMean() {
        return Weapon.createCharacterWeapon(i18next.t('Weapon.personal.strike.name'), 1, [new WeaponQuality(Quality.Knockdown), new WeaponQuality(Quality.NonLethal), new WeaponQuality(Quality.Vicious, 1)], WeaponType.MELEE);
    }

    get phaser1() {
        return Weapon.createCharacterWeapon(i18next.t('Weapon.personal.phaser1.name'), 2, [new WeaponQuality(Quality.Charge), new WeaponQuality(Quality.Hidden, 1)], WeaponType.ENERGY);
    }

    get phaser2() {
        return Weapon.createCharacterWeapon(i18next.t('Weapon.personal.phaser2.name'), 3, [new WeaponQuality(Quality.Charge)], WeaponType.ENERGY);
    }

    get ushaanTor() {
        return Weapon.createCharacterWeapon(i18next.t('Weapon.personal.ushaantor.name'), 1, [new WeaponQuality(Quality.Vicious, 1)], WeaponType.MELEE);
    }

    get batLeth() {
        return Weapon.createCharacterWeapon(i18next.t('Weapon.personal.batleth.name'), 3, [new WeaponQuality(Quality.Vicious, 1)], WeaponType.MELEE, 2);
    }

    get dkTagh() {
        return Weapon.createCharacterWeapon(i18next.t('Weapon.personal.dktahg.name'), 1,
            [new WeaponQuality(Quality.Vicious, 1), new WeaponQuality(Quality.Deadly), new WeaponQuality(Quality.Hidden, 1)],
            WeaponType.MELEE);
    }

    get disruptorPistol() {
        return Weapon.createCharacterWeapon(i18next.t('Weapon.personal.disruptor.name'), 3, [new WeaponQuality(Quality.Vicious, 1)], WeaponType.ENERGY);
    }

    static get instance() {
        if (PersonalWeapons._instance == null) {
            PersonalWeapons._instance = new PersonalWeapons();
        }
        return PersonalWeapons._instance;
    }
}
