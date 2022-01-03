import { CharacterType } from "../common/characterType";
import { Era } from "./eras";


export class Weapon {
    name: string;
    dice: number;
    qualities: string;
    scaleApplies: boolean;
    eras: Era[][];
    requiresTalent: boolean;
    
    constructor(name: string, dice: number, qualities: string, scaleApplies: boolean = false, 
            eras: Era[][] = [[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ],[ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]], requiresTalent: boolean = false) {
        this.name = name;
        this.dice = dice;
        this.qualities = qualities;
        this.scaleApplies = scaleApplies;
        this.eras = eras;
        this.requiresTalent = requiresTalent;
    }

    get description() {
        if (this.isTractorOrGrappler && this.dice) {
            return this.name + " (Strength " + this.dice + ")";
        } else {
            return this.name;
        }
    }

    get isTractorOrGrappler() {
        return this.name === 'Tractor Beam' || this.name === 'Grappler Cables';
    }
}

class StarshipWeaponList {
    readonly list: Weapon[] = [
        new Weapon('Phase Cannons', 2, "Versatile 2", true, [[ Era.Enterprise ],[]]),
        new Weapon('Phaser Cannons', 2, "Versatile 2", true, [[ Era.OriginalSeries, Era.NextGeneration ], []]),
        new Weapon('Phaser Banks', 1, "Versatile 2", true, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Phaser Arrays', 0, "Versatile 2, Area or Spread", true, [[ Era.NextGeneration ], []]),
        new Weapon('Disruptor Cannons', 2, "Versatile 1", true, [[], [Era.Enterprise, Era.OriginalSeries, Era.NextGeneration]]),
        new Weapon('Disruptor Banks', 1, "Versatile 1", true, [[], [Era.NextGeneration]]),
        new Weapon('Spatial Torpedoes', 2, "", false, [[ Era.Enterprise ], []]),
        new Weapon('Nuclear Warheads', 3, "Vicious 1, Calibration", false, [[ Era.Enterprise ], []], true),
        new Weapon('Photon Torpedoes', 3, "High Yield", false, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Plasma Torpedoes', 3, "Persistent, Calibration", false, [[], []]),
        new Weapon('Quantum Torpedoes', 4, "Vicious 1, Calibration, High Yield", false, [[ Era.NextGeneration ], []], true),
        new Weapon('Grappler Cables', 2, "", false, [[ Era.Enterprise ], []]),
        new Weapon('Tractor Beam', 2, "", false, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.Enterprise, Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Tractor Beam', 3, "", false, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Tractor Beam', 4, "", false, [[ Era.OriginalSeries, Era.NextGeneration ], [ Era.OriginalSeries, Era.NextGeneration ]]),
        new Weapon('Tractor Beam', 5, "", false, [[ Era.NextGeneration ], []])
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
