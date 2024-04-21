
export class Implant {
    name: string;
    type: BorgImplantType;
    description: string;

    constructor(name: string, type: BorgImplantType, description: string) {
        this.name = name;
        this.type = type;
        this.description = description;
    }

    get localizedName() {
        return this.name;
    }
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
        new Implant("Adaptive shielding", BorgImplantType.AdaptiveShielding, "Each time the character is Injured by an energy-based weapon, roll 1[D]. If an Effect is rolled, the character becomes immune to that type of weapon for the remainder of the scene." ),
        new Implant("Cardiopulmonary strengthener", BorgImplantType.CardiopulmonaryStrengthener, "The character reduces the Difficulty of any Fitness Task relating to fatigue and endurance by two." ),
        new Implant("Cortical array (bio-synthetic gland)", BorgImplantType.CorticalArrayBioSyntheticGland, "The character becomes resistant to diseases and poisons, reducing the Difficulty of any Task related to overcoming their effects by 1." ),
        new Implant("Cortical array (cortical node)", BorgImplantType.CorticalArrayCorticalNode, "The character becomes Immune to Pain and Fear, gaining +3 Resistance to non-lethal attacks and immunity to being intimidated or threatened." ),
        new Implant("Cortical array (interlink node)", BorgImplantType.CorticalArrayInterlinkNode, "Allows the character to interface directly with technology. When the character gains assistance from a ship, they may reroll the ship’s d20." ),
        new Implant("Cortical array (neural subspace transciever)", BorgImplantType.CorticalArrayNeuralSubspaceTranceiver, "Provides the character with a built-in short-range subspace communications device that cannot be removed without surgery. If the character also has the Ocular Sensory Enhancer, the character can “see” data transmissions as well as the entire EM spectrum." ),
        new Implant("Cybernetic arm (tactical)", BorgImplantType.CyberneticArmTactical, "The character gains the Assimilation Tubules weapon (Melee, 5[D] Intense, Size 1H, Deadly, Debilitation)." ),
        new Implant("Cybernetic arm (medical)", BorgImplantType.CyberneticArmMedical, "The character gains the Assimilation Tubules weapon (Melee, 5[D] Intense, Size 1H, Deadly, Debilitation). The character also has built-in medical equipment, equivalent to a medkit." ),
        new Implant("Cybernetic arm (engineering)", BorgImplantType.CyberneticArmEngineering, "The character gains the Assimilation Tubes weapon (Melee, 5[D] Intense, Size 1H, Deadly, Debilitation). The character also has built-in engineering equipment, equivalent to an engineer’s toolkit." ),
        new Implant("Exo-plating", BorgImplantType.ExoPlating, "Grants the character Resistance 2." ),
        new Implant("Ocular sensory enhancer", BorgImplantType.OcularSensoryEnhancer, "The character can scan the environment, like a tricorder, and Tasks do not suffer an increase in Difficulty due to darkness." )
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