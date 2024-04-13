
export enum EquipmentType {
    Uniform,
    Clothing,
    Armor,

    Communicator,
    Tricorder,
    MedKit,
    EngineeringKit,
    OrionMultiKey,

    UshaanTor,
}

export class EquipmentModel {
    type: EquipmentType;
    name: string;
    description?: string;

    constructor(type: EquipmentType, name: string, description?: string) {
        this.type = type;
        this.name = name;
        this.description = description;
    }
}

export class EquipmentHelper {
    static _instance: EquipmentHelper;

    static get instance() {
        if (EquipmentHelper._instance == null) {
            EquipmentHelper._instance = new EquipmentHelper();
        }
        return EquipmentHelper._instance;
    }

    public items = [
        new EquipmentModel(EquipmentType.Uniform, "Uniform"),
        new EquipmentModel(EquipmentType.Clothing, "Clothing"),
        new EquipmentModel(EquipmentType.Armor, "Armor"),
        new EquipmentModel(EquipmentType.Communicator, "Communicator", "A communicator was a communications device used by many species for person-to-person, inter-ship communications."),
        new EquipmentModel(EquipmentType.Tricorder, "Tricorder", "A tricorder was an advanced multi-function hand held computing and scanning device used to gather, analyze, and record data, with many specialized abilities which made it an asset to crews aboard starships and space stations as well as on away missions."),
        new EquipmentModel(EquipmentType.MedKit, "MedKit",
            "Medkits, also known as medikits or medical kits, are pouches used by Starfleet medical practitioners and officers that contained medical equipment for landing parties and away teams. "),
        new EquipmentModel(EquipmentType.EngineeringKit, "Engineering Kit",
            "An engineering kit is a collection of tools used in engineering."),
        new EquipmentModel(EquipmentType.OrionMultiKey, "Orion Multi-Key",
            "The Orion multi-key is a traditional tool of Orion pirates. A short truncheon with a heavy head bearing four extendable prongs, it had a variety of functions including weapon, lock pick, and bottle opener."),
        new EquipmentModel(EquipmentType.UshaanTor, "Ushaan-Tor ice pick"),
    ]

    public findByType(type: EquipmentType): EquipmentModel|undefined {
        let results = this.items.filter(e => e.type === type);
        return results.length > 0 ? results[0] : undefined;
    }
}