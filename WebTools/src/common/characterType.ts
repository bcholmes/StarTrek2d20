import { Source } from '../helpers/sources';
import i18next from 'i18next';
import { makeKey } from './translationKey';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';

export enum CharacterType {
  Starfleet = 0,
  Federation,
  KlingonWarrior,
  AlliedMilitary,
  AmbassadorDiplomat,
  Civilian,
  Cadet,
  Child,

  Romulan,
  Cardassian,
  Ferengi,
  Orion,

  Tribble,

  Creature,

  Other,
}

export class CharacterTypeModel {
  private static TYPES: CharacterTypeModel[] = [
    new CharacterTypeModel('Starfleet', CharacterType.Starfleet),
    new CharacterTypeModel('Federation', CharacterType.Federation),
    new CharacterTypeModel(
      'Klingon Defense Force',
      CharacterType.KlingonWarrior,
    ),
    new CharacterTypeModel('Allied Military', CharacterType.AlliedMilitary),
    new CharacterTypeModel(
      'Ambassador / Diplomat',
      CharacterType.AmbassadorDiplomat,
    ),
    new CharacterTypeModel('Civilian', CharacterType.Civilian),
    new CharacterTypeModel('Cadet', CharacterType.Cadet),
    new CharacterTypeModel('Child', CharacterType.Child),

    new CharacterTypeModel('Romulan', CharacterType.Romulan),
    new CharacterTypeModel('Cardassian', CharacterType.Cardassian),
    new CharacterTypeModel('Ferengi', CharacterType.Ferengi),
    new CharacterTypeModel('Orion', CharacterType.Orion),

    new CharacterTypeModel('Tribble', CharacterType.Tribble),
    new CharacterTypeModel('Creature', CharacterType.Creature),

    new CharacterTypeModel('Other', CharacterType.Other),
  ];

  private static MAIN_CHARACTER_TYPES: CharacterTypeModel[] =
    CharacterTypeModel.TYPES.filter(
      (t) =>
        t.type !== CharacterType.Other &&
        t.type !== CharacterType.Tribble &&
        t.type !== CharacterType.Federation,
    );

  name: string;
  type: CharacterType;

  constructor(name: string, type: CharacterType) {
    this.name = name;
    this.type = type;
  }

  get localizedName() {
    return i18next.t(makeKey('CharacterType.name.', CharacterType[this.type]));
  }

  public static getAllTypes() {
    return CharacterTypeModel.TYPES;
  }

  public static getByType(type: CharacterType) {
    return CharacterTypeModel.TYPES.filter((t) => t.type === type)[0];
  }

  public static getCharacterTypesForCharacter(sources: Source[]) {
    return this.filterBySources(this.MAIN_CHARACTER_TYPES, sources);
  }

  private static filterBySources(
    types: CharacterTypeModel[],
    sources: Source[],
  ) {
    return types.filter((t) => {
      if (isKlingonWarriorType(t.type)) {
        return sources.indexOf(Source.KlingonCore) >= 0;
      } else if (t.type === CharacterType.Starfleet) {
        return true;
      } else if (
        t.type === CharacterType.Civilian ||
        t.type === CharacterType.AmbassadorDiplomat
      ) {
        return (
          sources.indexOf(Source.PlayersGuide) ||
          sources.indexOf(Source.Core2ndEdition)
        );
      } else if (
        t.type === CharacterType.Romulan ||
        t.type === CharacterType.Ferengi ||
        t.type === CharacterType.Cardassian ||
        t.type === CharacterType.Orion
      ) {
        return false;
      } else if (t.type === CharacterType.Creature) {
        return false;
      } else {
        return sources.indexOf(Source.PlayersGuide) >= 0;
      }
    });
  }

  public static getCharacterTypeByTypeName(name: string) {
    const matches = CharacterTypeModel.TYPES.filter(
      (t) => CharacterType[t.type] === name,
    );
    return matches.length === 0 ? undefined : matches[0];
  }

  public static getSupportingCharacterTypes() {
    return CharacterTypeModel.MAIN_CHARACTER_TYPES;
  }

  public static getNpcTypes(sources: Source[]) {
    return CharacterTypeModel.TYPES.filter(
      (t) =>
        ![
          CharacterType.Tribble,
          CharacterType.Federation,
          CharacterType.AmbassadorDiplomat,
          CharacterType.AlliedMilitary,
        ].includes(t.type),
    );
  }

  public static getSoloCharacterTypes() {
    return [
      CharacterTypeModel.TYPES[CharacterType.Starfleet],
      CharacterTypeModel.TYPES[CharacterType.AlliedMilitary],
      CharacterTypeModel.TYPES[CharacterType.AmbassadorDiplomat],
      CharacterTypeModel.TYPES[CharacterType.Civilian],
    ].sort((c1, c2) => c1.localizedName.localeCompare(c2.localizedName));
  }

  public static getStarshipTypes(version: number) {
    if (version === 1) {
      return [
        CharacterTypeModel.TYPES[CharacterType.Starfleet],
        CharacterTypeModel.TYPES[CharacterType.KlingonWarrior],
      ];
    } else {
      return this.TYPES.filter((t) =>
        [
          CharacterType.Starfleet,
          CharacterType.KlingonWarrior,
          CharacterType.Romulan,
          CharacterType.Cardassian,
          CharacterType.Ferengi,
          CharacterType.Orion,
          CharacterType.Civilian,
        ].includes(t.type),
      );
    }
  }
}
