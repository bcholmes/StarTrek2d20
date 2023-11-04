
export interface Implant {
    name: string;
    type: BorgImplantType;
    description: string;
}

export enum BorgImplantType {
    AdaptiveShielding,
    CardiopulmonaryStrengthener,
    CorticalArrayBioSyntheticGland,
    CorticalArrayCorticalNode,
    CorticalArrayInterlinkNode,
    CorticalArrayNeuralSubspaceTranceiver,
    CyberneticArmTactical,
    CyberneticArmMedical,
    CyberneticArmEngineering,
    ExoPlating,
    OcularSensoryEnhancer
}


export class  BorgImplants {
    static _instance: BorgImplants;

    static get instance() {
        if (BorgImplants._instance == null) {
            BorgImplants._instance = new BorgImplants();
        }
        return BorgImplants._instance;
    }

    readonly implants: Implant[] = [
        { name: "Adaptive shielding", type: BorgImplantType.AdaptiveShielding, description: "Each time the character is Injured by an energy-based weapon, roll 1[D]. If an Effect is rolled, the character becomes immune to that type of weapon for the remainder of the scene." },
        { name: "Cardiopulmonary strengthener", type: BorgImplantType.CardiopulmonaryStrengthener, description: "The character reduces the Difficulty of any Fitness Task relating to fatigue and endurance by two." },
        { name: "Cortical array (bio-synthetic gland)", type: BorgImplantType.CorticalArrayBioSyntheticGland, description: "The character becomes resistant to diseases and poisons, reducing the Difficulty of any Task related to overcoming their effects by 1." },
        { name: "Cortical array (cortical node)", type: BorgImplantType.CorticalArrayCorticalNode, description: "The character becomes Immune to Pain and Fear, gaining +3 Resistance to non-lethal attacks and immunity to being intimidated or threatened." },
        { name: "Cortical array (interlink node)", type: BorgImplantType.CorticalArrayInterlinkNode, description: "Allows the character to interface directly with technology. When the character gains assistance from a ship, they may reroll the ship’s d20." },
        { name: "Cortical array (neural subspace transciever", type: BorgImplantType.CorticalArrayNeuralSubspaceTranceiver, description: "Provides the character with a built-in short-range subspace communications device that cannot be removed without surgery. If the character also has the Ocular Sensory Enhancer, the character can “see” data transmissions as well as the entire EM spectrum." },
        { name: "Cybernetic arm (tactical)", type: BorgImplantType.CyberneticArmTactical, description: "The character gains the Assimilation Tubules weapon (Melee, 5[D] Intense, Size 1H, Deadly, Debilitation)." },
        { name: "Cybernetic arm (medical)", type: BorgImplantType.CyberneticArmMedical, description: "The character gains the Assimilation Tubules weapon (Melee, 5[D] Intense, Size 1H, Deadly, Debilitation). The character also has built-in medical equipment, equivalent to a medkit." },
        { name: "Cybernetic arm (engineering)", type: BorgImplantType.CyberneticArmEngineering, description: "The character gains the Assimilation Tubes weapon (Melee, 5[D] Intense, Size 1H, Deadly, Debilitation). The character also has built-in engineering equipment, equivalent to an engineer’s toolkit." },
        { name: "Exo-plating", type: BorgImplantType.ExoPlating, description: "Grants the character Resistance 2." },
        { name: "Ocular sensory enhancer", type: BorgImplantType.OcularSensoryEnhancer, description: "The character can scan the environment, like a tricorder, and Tasks do not suffer an increase in Difficulty due to darkness." }
    ];

    getImplantByTypeName(name: string): Implant|undefined {
        let i = this.implants.filter(i => BorgImplantType[i.type] === name);
        if (i.length === 0) {
            i = this.implants.filter(i => i.name === name);
        }
        return i.length > 0 ? i[0] : undefined;
    }

    getImplantByType(type: BorgImplantType): Implant|undefined {
        let i = this.implants.filter(i => i.type === type);
        return i.length > 0 ? i[0] : undefined;
    }
}