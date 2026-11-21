import i18next from 'i18next';
import { makeKey } from '../common/translationKey';

export enum SpaceRegion {
  AlphaQuadrant,
  BetaQuadrant,
  GammaQuadrant,
  DeltaQuadrant,
  ShackletonExpanse,
}

export class SpaceRegionModel {
  id: SpaceRegion;
  name: string;
  prefix: string;

  static regions = undefined;

  constructor(id: SpaceRegion, name: string, prefix: string) {
    this.id = id;
    this.name = name;
    this.prefix = prefix;
  }

  public static allRegions(): SpaceRegionModel[] {
    if (SpaceRegionModel.regions == null) {
      SpaceRegionModel.regions = [
        new SpaceRegionModel(SpaceRegion.AlphaQuadrant, 'Alpha Quadrant', 'AL'),
        new SpaceRegionModel(SpaceRegion.BetaQuadrant, 'Beta Quadrant', 'BE'),
        new SpaceRegionModel(SpaceRegion.GammaQuadrant, 'Gamma Quadrant', 'GA'),
        new SpaceRegionModel(SpaceRegion.DeltaQuadrant, 'Delta Quadrant', 'DE'),
        new SpaceRegionModel(
          SpaceRegion.ShackletonExpanse,
          'Shackleton Expanse',
          'SE',
        ),
      ];
    }
    return SpaceRegionModel.regions;
  }

  public static for(id: SpaceRegion): SpaceRegionModel {
    return SpaceRegionModel.allRegions()[id];
  }

  get localizedName() {
    const key = makeKey('SpaceRegion.', SpaceRegion[this.id]);
    const localName = i18next.t(key);
    return localName === key ? this.name : localName;
  }
}
