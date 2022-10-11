import { CharacterType } from "../common/characterType";
import { Era } from "./eras";

export enum WeaponType {
    MELEE, ENERGY, TORPEDO, MINE, ENTANGLE
}

export class Weapon {
    name: string;
    dice: number;
    qualities: string;
    type: WeaponType;
    eras: Era[][];
    requiresTalent: boolean;

    constructor(name: string, dice: number, qualities: string, type: WeaponType,
            eras: Era[][] = [[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ],[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]],
            requiresTalent: boolean = false) {
        this.name = name;
        this.dice = dice;
        this.qualities = qualities;
        this.type = type;
        this.eras = eras;
        this.requiresTalent = requiresTalent;
    }

    get scaleApplies() {
        return this.type === WeaponType.ENERGY;
    }

    get description() {
        if (this.isTractorOrGrappler && this.dice) {
            return this.name + " (Strength " + this.dice + ")";
        } else {
            return this.name;
        }
    }

    get isTractorOrGrappler() {
        return this.type === WeaponType.ENTANGLE;
    }
}

class StarshipWeaponList {
    readonly list: Weapon[] = [
        new Weapon('Phase Cannons', 2, "Versatile 2", WeaponType.ENERGY, [[ Era.Enterprise ],[]]),
        new Weapon('Phaser Cannons', 2, "Versatile 2", WeaponType.ENERGY, [[ Era.OriginalSeries, Era.NextGeneration ], []]),
        new Weapon('Phaser Banks', 1, "Versatile 2", WeaponType.ENERGY, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Phaser Arrays', 0, "Versatile 2, Area or Spread", WeaponType.ENERGY, [[ Era.NextGeneration ], []]),
        new Weapon('Disruptor Cannons', 2, "Versatile 1", WeaponType.ENERGY, [[], [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration]]),
        new Weapon('Disruptor Banks', 1, "Versatile 1", WeaponType.ENERGY, [[], [Era.NextGeneration]]),
        new Weapon('Spatial Torpedoes', 2, "", WeaponType.TORPEDO, [[ Era.Enterprise ], []]),
        new Weapon('Nuclear Warheads', 3, "Vicious 1, Calibration", WeaponType.TORPEDO, [[ Era.Enterprise ], []], true),
        new Weapon('Photon Torpedoes', 3, "High Yield", WeaponType.TORPEDO, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Plasma Torpedoes', 3, "Persistent, Calibration", WeaponType.TORPEDO, [[], []]),
        new Weapon('Quantum Torpedoes', 4, "Vicious 1, Calibration, High Yield", WeaponType.TORPEDO, [[ Era.NextGeneration ], []], true),
        new Weapon('Grappler Cables', 2, "", WeaponType.ENTANGLE, [[ Era.Enterprise ], []]),
        new Weapon('Tractor Beam', 2, "", WeaponType.ENTANGLE, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Tractor Beam', 3, "", WeaponType.ENTANGLE, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Tractor Beam', 4, "", WeaponType.ENTANGLE, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Tractor Beam', 5, "", WeaponType.ENTANGLE, [[ Era.NextGeneration ], []])
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
