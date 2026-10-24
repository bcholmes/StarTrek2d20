import { D20 } from '../../common/die';

export enum CreatureSize {
  Microscopic,
  Tiny,
  Swarm, // deprecated
  Small,
  Average,
  Large,
  Huge,
  Gigantic, // deprecated
  Cosmozoan,
}

export class CreatureSizeModel {
  id: CreatureSize;
  private name: string;

  constructor(id: CreatureSize, name: string) {
    this.id = id;
    this.name = name;
  }

  get localizedName() {
    return this.name;
  }
}

export class CreatureSizeHelper {
  private static singleton: CreatureSizeHelper;

  private items = [
    new CreatureSizeModel(CreatureSize.Swarm, 'Swarm'),
    new CreatureSizeModel(CreatureSize.Small, 'Small'),
    new CreatureSizeModel(CreatureSize.Average, 'Average'),
    new CreatureSizeModel(CreatureSize.Large, 'Large'),
    new CreatureSizeModel(CreatureSize.Huge, 'Huge'),
    new CreatureSizeModel(CreatureSize.Gigantic, 'Gigantic'),
  ];

  static get instance() {
    if (CreatureSizeHelper.singleton == null) {
      CreatureSizeHelper.singleton = new CreatureSizeHelper();
    }
    return CreatureSizeHelper.singleton;
  }

  getTypes() {
    return this.items;
  }

  getTypeById(id: CreatureSize) {
    const items = this.items.filter((h) => h.id === id);
    return items?.length ? items[0] : undefined;
  }

  getTypeByIdName(name: string) {
    const items = this.items.filter((h) => CreatureSize[h.id] === name);
    return items?.length ? items[0] : undefined;
  }
}

export const generateRandomCreatureSize = () => {
  switch (D20.roll()) {
    case 1:
    case 2:
    case 3:
      return CreatureSize.Swarm;
    case 4:
    case 5:
    case 6:
      return CreatureSize.Small;
    case 7:
    case 8:
    case 9:
    case 10:
      return CreatureSize.Average;
    case 11:
    case 12:
    case 13:
    case 14:
      return CreatureSize.Large;
    case 15:
    case 16:
    case 17:
      return CreatureSize.Huge;
    case 18:
    case 19:
    case 20:
      return CreatureSize.Gigantic;
    default:
      break;
  }
};
