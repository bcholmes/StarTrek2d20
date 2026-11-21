import i18next from 'i18next';
import { makeKey } from '../../common/translationKey';
import type { SpectralClassModel } from './spectralClass';
import { SpectralClass } from './spectralClass';
import { SpaceRegion } from '../spaceRegion';

export enum SpecialSectors {
  PinwheelSector,
  EnduranceDivide,
  EmberSector,
  TKalNursery,
  GeneralExpanse,
}

export class SpecialSectorTypeModel {
  id: SpecialSectors;
  name: string;

  constructor(id: SpecialSectors, name: string) {
    this.id = id;
    this.name = name;
  }

  public static allSpecialSectorTypes() {
    return sectorsTypes;
  }
}

const sectorsTypes = [
  new SpecialSectorTypeModel(SpecialSectors.PinwheelSector, 'Pinwheel Sector'),
  new SpecialSectorTypeModel(
    SpecialSectors.EnduranceDivide,
    'Endurance Divide',
  ),
  new SpecialSectorTypeModel(SpecialSectors.EmberSector, 'Ember Sector'),
  new SpecialSectorTypeModel(SpecialSectors.TKalNursery, "T'Kal Nursery"),
  new SpecialSectorTypeModel(SpecialSectors.GeneralExpanse, 'General Expanse'),
];

/**
 * Symbol    Class of Star                  Example
 * 0 	     Extreme, luminous supergiants
 * Ia        Luminous supergiants           Betelgeuse
 * Ib        Less luminous supergiants      Antares
 * II        Bright giants                  Canopus
 * III       Normal giants                  Aldebaran
 * IV        Subgiants                      Procyon
 * V         Main sequence                  Sun
 * VI or sd  Subdwarfs                      Kapteyn's Star (HD 33793)
 * wd or D   White dwarfs                   Sirius B
 */
export enum LuminosityClass {
  VI,
  V,
  IV,
  III,
  II,
  Ib,
  Ia,
}

export class LuminosityClassModel {
  public id: LuminosityClass;
  public description: string;

  constructor(id: LuminosityClass, description: string) {
    this.id = id;
    this.description = description;
  }
}

export class Star {
  public spectralClass: SpectralClassModel;
  public subClass: number;
  public luminosityClass: LuminosityClassModel | null;
  public mass: number;
  public luminosityValue: number | null = null;

  constructor(
    spectralClass: SpectralClassModel,
    subClass: number,
    luminosity: LuminosityClassModel | null,
    mass: number,
  ) {
    this.spectralClass = spectralClass;
    this.subClass = subClass;
    this.luminosityClass = luminosity;
    this.mass = mass;
  }

  get massInKgs() {
    // times 10^30
    return 1.98847 * this.mass;
  }

  get designation() {
    if (
      this.spectralClass.id === SpectralClass.WhiteDwarf ||
      this.spectralClass.id === SpectralClass.BrownDwarf
    ) {
      return this.spectralClass.description;
    } else {
      return (
        this.spectralClass.description +
        this.subClass +
        (this.luminosityClass != null
          ? LuminosityClass[this.luminosityClass.id]
          : '')
      );
    }
  }

  get description() {
    if (
      this.spectralClass.id === SpectralClass.WhiteDwarf ||
      this.spectralClass.id === SpectralClass.BrownDwarf
    ) {
      return this.spectralClass.description;
    } else {
      const designation =
        this.spectralClass.description +
        this.subClass +
        (this.luminosityClass != null
          ? LuminosityClass[this.luminosityClass.id]
          : '');
      const description =
        this.spectralClass.colourDescription +
        (this.luminosityClass != null
          ? ' / ' + this.luminosityClass.description
          : '');
      return designation + ' (' + description + ')';
    }
  }
  get plainText() {
    return (
      this.description +
      '\nMass: ' +
      this.mass.toFixed(2) +
      ' Sols' +
      '\nMass: ' +
      this.massInKgs.toFixed(4) +
      ' x10^30 kg' +
      (this.luminosityValue
        ? '\nLuminosity: ' +
          (this.luminosityValue > 100
            ? this.luminosityValue.toFixed(0)
            : this.luminosityValue.toFixed(4)) +
          ' Sols'
        : '')
    );
  }
}
