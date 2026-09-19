import { Era } from './erasEnum';
import { Species } from './speciesEnum';
import i18next from 'i18next';
import { makeKey } from '../common/translationKey';

export enum AlliedMilitaryType {
  Maco,
  AndorianImperialGuard,
  VulcanHighCommand,
  KlingonDefenceForce,
  RomulanStarEmpire,
  BajoranMilitia,
  CardassianUnion,
  Dominion,
  FerengiMilitary,
  SonACommand,
  TalarianMilitia,
  TzenkethiCoalition,
  TholianAssembly,
  BreenConfederacy,
  Borg,
  Other,
}

export const allAlliedMilitaryTypes = (): AlliedMilitaryType[] => {
  return Object.keys(AlliedMilitaryType)
    .filter((item) => {
      return !isNaN(Number(item));
    })
    .map((item) => Number(item));
};

export class AlliedMilitary {
  name: string;
  species: Species[];
  type: AlliedMilitaryType;
  eras: Era[];

  constructor(
    name: string,
    type: AlliedMilitaryType,
    species: Species[],
    ...era: Era[]
  ) {
    this.name = name;
    this.species = species || [];
    this.type = type;
    this.eras = era;
  }

  get localizedName() {
    return i18next.t(
      makeKey('AlliedMilitaryType.name.', AlliedMilitaryType[this.type]),
    );
  }
}

export class AllyHelper {
  static singleton: AllyHelper;

  static get instance() {
    if (AllyHelper.singleton == null) {
      AllyHelper.singleton = new AllyHelper();
    }
    return AllyHelper.singleton;
  }

  options: AlliedMilitary[] = [
    new AlliedMilitary(
      'Andorian Imperial Guard',
      AlliedMilitaryType.AndorianImperialGuard,
      [Species.Andorian],
      Era.Enterprise,
    ),
    new AlliedMilitary(
      'Bajoran Militia',
      AlliedMilitaryType.BajoranMilitia,
      [Species.Bajoran],
      Era.NextGeneration,
      Era.PicardProdigy,
    ),
    new AlliedMilitary(
      'Cardassian Union',
      AlliedMilitaryType.CardassianUnion,
      [Species.Cardassian],
      Era.NextGeneration,
      Era.PicardProdigy,
    ),
    new AlliedMilitary(
      'Dominion',
      AlliedMilitaryType.Dominion,
      [Species.JemHadar],
      Era.NextGeneration,
      Era.PicardProdigy,
    ),
    new AlliedMilitary(
      'Ferengi',
      AlliedMilitaryType.FerengiMilitary,
      [Species.Ferengi],
      Era.NextGeneration,
      Era.PicardProdigy,
    ),
    new AlliedMilitary(
      'Klingon Defence Force',
      AlliedMilitaryType.KlingonDefenceForce,
      [
        Species.KlingonExt,
        Species.Klingon,
        Species.KlingonQuchHa,
        Species.KlingonQuchHa_2E,
      ],
      Era.Enterprise,
      Era.OriginalSeries,
      Era.NextGeneration,
      Era.PicardProdigy,
      Era.Discovery32,
    ),
    new AlliedMilitary(
      'MACO',
      AlliedMilitaryType.Maco,
      [Species.Human],
      Era.Enterprise,
    ),
    new AlliedMilitary(
      'Romulan Star Empire',
      AlliedMilitaryType.RomulanStarEmpire,
      [Species.RomulanExt, Species.Romulan, Species.Reman],
      Era.OriginalSeries,
      Era.NextGeneration,
    ),
    new AlliedMilitary(
      'Vulcan High Command',
      AlliedMilitaryType.VulcanHighCommand,
      [Species.Vulcan],
      Era.Enterprise,
    ),

    new AlliedMilitary(
      'Other',
      AlliedMilitaryType.Other,
      [],
      Era.Enterprise,
      Era.OriginalSeries,
      Era.NextGeneration,
      Era.PicardProdigy,
      Era.Discovery32,
    ),
  ];

  selectOptions(era: Era, includeKlingon: boolean) {
    return this.options.filter(
      (o) =>
        o.eras.indexOf(era) >= 0 &&
        (o.type !== AlliedMilitaryType.KlingonDefenceForce || includeKlingon),
    );
  }

  findOption(type: AlliedMilitaryType) {
    const temp = this.options.filter((o) => o.type === type);
    return temp ? temp[0] : null;
  }

  findTypeByName(name: string): AlliedMilitaryType | undefined {
    let result = undefined;
    allAlliedMilitaryTypes().forEach((t) => {
      if (AlliedMilitaryType[t] === name) {
        result = t;
      }
    });
    return result;
  }
}
