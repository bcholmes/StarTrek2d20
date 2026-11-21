import type { SpaceRegionModel } from './spaceRegion';
import type { SpecialSectors } from './table/star';
import type { WorldClass } from './table/worldClass';

export class GenerationSettings {
  readonly region: SpaceRegionModel;
  readonly sectorType?: SpecialSectors;
  ecosphereWorldClass?: WorldClass;

  constructor(region: SpaceRegionModel, sectorType?: SpecialSectors) {
    this.region = region;
    this.sectorType = sectorType;
  }
}
