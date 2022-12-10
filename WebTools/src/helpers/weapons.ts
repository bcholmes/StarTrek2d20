import { CharacterType } from "../common/characterType";
import { Era } from "./eras";

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
        new EnergyLoadTypeModel(EnergyLoadType.AntiProton,           "Antiproton Beam",        "",                      "High Yield",  25),
        new EnergyLoadTypeModel(EnergyLoadType.Disruptor,            "Disruptor",              "Viscious",              "",            23),
        new EnergyLoadTypeModel(EnergyLoadType.ElectroMagneticIonic, "Electro-Magnetic/Ionic", "Dampening, Piercing 1", "",            22),
        new EnergyLoadTypeModel(EnergyLoadType.FreeElectron,         "Free Electron Laser",    "",                      "",            21),
        new EnergyLoadTypeModel(EnergyLoadType.Graviton,             "Graviton",               "Piercing 1",            "Devastating", 23),
        new EnergyLoadTypeModel(EnergyLoadType.PhasedPolaron,        "Phased Polaron Beam",    "Piercing 2",            "",            24),
        new EnergyLoadTypeModel(EnergyLoadType.Phaser,               "Phaser",                 "",                      "Versatile 2", 23),
        new EnergyLoadTypeModel(EnergyLoadType.PhasePulse,           "Phase / Pulse",          "",                      "Versatile 1", 22),
        new EnergyLoadTypeModel(EnergyLoadType.Proton,               "Proton Beam",            "Persistent X",          "",            25),
        new EnergyLoadTypeModel(EnergyLoadType.Tetryon,              "Tetryon",                "Depleting",             "",            25)
    ];

    readonly type: EnergyLoadType;
    readonly description: string;
    readonly effect: string;
    readonly quality: string;
    readonly century: number;

    constructor(type: EnergyLoadType, description: string, effect: string, quality: string, century: number) {
        this.type = type;
        this.description = description;
        this.effect = effect;
        this.quality = quality;
        this.century = century;
    }

    static allTypes() {
        return EnergyLoadTypeModel.TYPES;
    }

    static allTypesByYear(year: number) {
        return this.allTypes().filter(e => year > centuryToYear(e.century));
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
        new TorpedoLoadTypeModel(TorpedoLoadType.Chroniton,   "Chroniton",   3, "",             "Calibration, Slowing",     25),
        new TorpedoLoadTypeModel(TorpedoLoadType.Gravimetric, "Gravimetric", 3, "Piercing 1",   "Calibration, High Yield",  24),
        new TorpedoLoadTypeModel(TorpedoLoadType.Neutronic,   "Neutronic",   4, "Dampening",    "Calibration",              25),
        new TorpedoLoadTypeModel(TorpedoLoadType.Nuclear,     "Nuclear",     3, "Vicious 1",    "Calibration",              20),
        new TorpedoLoadTypeModel(TorpedoLoadType.Photon,      "Photon",      3, "",             "High Yield",               23),
        new TorpedoLoadTypeModel(TorpedoLoadType.Photonic,    "Photonic",    2, "",             "High Yield",               22),
        new TorpedoLoadTypeModel(TorpedoLoadType.Plasma,      "Plasma",      3, "Persistent 8", "Calibration",              23),
        new TorpedoLoadTypeModel(TorpedoLoadType.Polaron,     "Polaron",     3, "Piercing 2",   "Calibration",              24),
        new TorpedoLoadTypeModel(TorpedoLoadType.Positron,    "Positron",    3, "Dampening",    "Calibration",              24),
        new TorpedoLoadTypeModel(TorpedoLoadType.Quantum,     "Quantum",     4, "Vicious 1",    "Calibration, High Yield",  24),
        new TorpedoLoadTypeModel(TorpedoLoadType.Spatial,     "Spatial",     2, "",             "",                         22),
        new TorpedoLoadTypeModel(TorpedoLoadType.Tetryonic,   "Tetryonic",   2, "Depleting",    "Calibration, High Yield",  25),
        new TorpedoLoadTypeModel(TorpedoLoadType.Transphasic, "Transphasic", 3, "Piercing 2",   "Calibration, Devastating", 25),
        new TorpedoLoadTypeModel(TorpedoLoadType.Tricobolt,   "Tricobolt",   3, "Area",         "Calibration",              25),

    ];

    readonly type: TorpedoLoadType;
    readonly description: string;
    readonly dice: number;
    readonly effect: string;
    readonly quality: string;
    readonly century: number;

    constructor(type: TorpedoLoadType, description: string, dice: number, effect: string, quality: string, century: number) {
        this.type = type;
        this.description = description;
        this.dice = dice;
        this.effect = effect;
        this.quality = quality;
        this.century = century;
    }

    static allTypes() {
        return TorpedoLoadTypeModel.TYPES;
    }

    static allTypesByYear(year: number) {
        return this.allTypes().filter(l => year > centuryToYear(l.century));
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
    hardCodedQualities: string;
    type: WeaponType;
    eras: Era[][];
    requiresTalent: boolean;
    loadType?: EnergyLoadTypeModel|CaptureTypeModel|TorpedoLoadTypeModel;
    deliveryType?: DeliverySystemModel;

    constructor(usage: UsageCategory, name: string, dice: number, qualities: string, type: WeaponType,
            loadType?: EnergyLoadTypeModel|CaptureTypeModel|TorpedoLoadTypeModel,
            deliveryType?: DeliverySystemModel,
            eras: Era[][] = [[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ],[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]],
            requiresTalent: boolean = false) {
        this.usageCategory = usage;
        this.name = name;
        this.baseDice = dice;
        this.hardCodedQualities = qualities;
        this.type = type;
        this.eras = eras;
        this.requiresTalent = requiresTalent;
        this.loadType = loadType;
        this.deliveryType = deliveryType;
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

    get qualities() {
        if (this.usageCategory === UsageCategory.Character) {
            return this.hardCodedQualities;
        } else {
            let result = "";
            if (this.loadType != null && this.loadType instanceof EnergyLoadTypeModel) {
                let energyLoadType = this.loadType as EnergyLoadTypeModel;
                if (energyLoadType.effect) {
                    result += energyLoadType.effect;
                }
                if (energyLoadType.quality) {
                    if (result.length > 0) {
                        result += ", ";
                    }
                    result += energyLoadType.quality;
                }
            } else if (this.loadType != null && this.loadType instanceof TorpedoLoadTypeModel) {
                let torpedoLoadType = this.loadType as TorpedoLoadTypeModel;
                if (torpedoLoadType.effect) {
                    if (result.length > 0) {
                        result += ", ";
                    }
                    result += torpedoLoadType.effect;
                }
                if (torpedoLoadType.quality) {
                    if (result.length > 0) {
                        result += ", ";
                    }
                    result += torpedoLoadType.quality;
                }
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

    static createCharacterWeapon(name: string, dice: number, qualities: string, type: WeaponType) {
        return new Weapon(UsageCategory.Character, name, dice, qualities, type);
    }

    static createStarshipWeapon(name: string, type: WeaponType,
        loadType: EnergyLoadTypeModel|CaptureTypeModel|TorpedoLoadTypeModel,
        deliveryType?: DeliverySystemModel,
        eras: Era[][] = [[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ],[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]],
        requiresTalent: boolean = false) {
        return new Weapon(UsageCategory.Starship, name, 0, "", type, loadType, deliveryType, eras, requiresTalent);
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
