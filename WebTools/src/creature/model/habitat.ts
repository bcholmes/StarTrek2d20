
export enum Habitat {

    Caves,
    Desert,
    Forest,
    Hills,
    Jungle,
    Mountains,
    Ocean,
    Plains,
    River,
    Swamp,
    UpperAtmosphere
}

export class HabitatModel {

    id: Habitat;
    name: string;

    constructor(id: Habitat, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class HabitatHelper {
    private static _instance: HabitatHelper;

    static get instance() {
        if (HabitatHelper._instance == null) {
            HabitatHelper._instance = new HabitatHelper();
        }
        return HabitatHelper._instance;
    }
}