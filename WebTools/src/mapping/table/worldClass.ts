import i18next from 'i18next';

export enum WorldClass {
  AsteroidBelt,
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
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

  get fullDescription() {
    return i18next.t('World.class.fullDescription', {
      class: WorldClass[this.id],
      definition: this.description,
      interpolation: { escapeValue: false },
    });
  }

  get isGasGiant() {
    return (
      this.id === WorldClass.J ||
      this.id === WorldClass.I ||
      this.id === WorldClass.T
    );
  }
}

export const worldClasses: WorldClassModel[] = [
  new WorldClassModel(WorldClass.AsteroidBelt, 'Asteroid Belt'),
  new WorldClassModel(WorldClass.A, 'Geothermal'),
  new WorldClassModel(WorldClass.B, 'Geomorteus'),
  new WorldClassModel(WorldClass.C, 'Icy Geoinactive'),
  new WorldClassModel(WorldClass.D, 'Icy/Rocky Barren'),
  new WorldClassModel(WorldClass.E, 'Geoplastic'),
  new WorldClassModel(WorldClass.F, 'Geometallic'),
  new WorldClassModel(WorldClass.G, 'Geocrystalline'),
  new WorldClassModel(WorldClass.H, 'Desert'),
  new WorldClassModel(WorldClass.I, 'Hot Jovian Gas Giant'),
  new WorldClassModel(WorldClass.J, 'Jovian Gas Giant'),
  new WorldClassModel(WorldClass.K, 'Adaptable'),
  new WorldClassModel(WorldClass.L, 'Marginal'),
  new WorldClassModel(WorldClass.M, 'Terrestrial'),
  new WorldClassModel(WorldClass.N, 'Reducing'),
  new WorldClassModel(WorldClass.O, 'Pelagic/Ocean'),
  new WorldClassModel(WorldClass.P, 'Glaciated'),
  new WorldClassModel(WorldClass.Q, 'Variable'),
  new WorldClassModel(WorldClass.R, 'Rogue'),
  new WorldClassModel(WorldClass.S, 'Gas Ultragiant'),
  new WorldClassModel(WorldClass.T, 'Super Jovian'),
  new WorldClassModel(WorldClass.U, 'Chthonian'),
  new WorldClassModel(WorldClass.Y, 'Demon'),
  new WorldClassModel(WorldClass.ArtificialPlanet, 'Artificial Planet'),
];
