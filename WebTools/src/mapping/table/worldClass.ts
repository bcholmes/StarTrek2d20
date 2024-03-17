export enum WorldClass {
    AsteroidBelt,
    B,
    C,
    D,
    E,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    T,
    Y,
    ArtificialPlanet,
}

export class WorldClassModel {
    public id: WorldClass;
    public description: string;

    constructor(id: WorldClass, description: string) {
        this.id = id;
        this.description = description;
    }

    get isGasGiant() {
        return this.id === WorldClass.J || this.id === WorldClass.I || this.id === WorldClass.T;
    }
}

export const worldClasses: WorldClassModel[] = [
    new WorldClassModel(WorldClass.AsteroidBelt, "Asteroid Belt"),
    new WorldClassModel(WorldClass.B, "Geomorphic"),
    new WorldClassModel(WorldClass.C, "Icy Geoinactive"),
    new WorldClassModel(WorldClass.D, "Icy/Rocky Barren"),
    new WorldClassModel(WorldClass.E, "Geoplastic"),
    new WorldClassModel(WorldClass.H, "Desert"),
    new WorldClassModel(WorldClass.I, "Ammonia Clouds/Gas Supergiant"),
    new WorldClassModel(WorldClass.J, "Jovian Gas Giant"),
    new WorldClassModel(WorldClass.K, "Adaptable"),
    new WorldClassModel(WorldClass.L, "Marginal"),
    new WorldClassModel(WorldClass.M, "Terrestrial"),
    new WorldClassModel(WorldClass.N, "Reducing"),
    new WorldClassModel(WorldClass.O, "Pelagic/Ocean"),
    new WorldClassModel(WorldClass.P, "Glaciated"),
    new WorldClassModel(WorldClass.T, "Gas Ultragiants"),
    new WorldClassModel(WorldClass.Y, "Demon"),
    new WorldClassModel(WorldClass.ArtificialPlanet, "Artificial Planet"),
];