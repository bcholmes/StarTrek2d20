import { test, expect, describe } from '@jest/globals';
import { SystemGenerationTable } from '../../../src/mapping/table/systemGenerator';
import { SpecialSectors } from '../../../src/mapping/table/star';
import { store } from '../../../src/state/store';
import {
  SpaceRegion,
  SpaceRegionModel,
} from '../../../src/mapping/spaceRegion';

const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
Object.defineProperty(global, 'window', {
  value: { localStorage: localStorageMock },
  writable: true,
});

describe('Shackleton Expanse sector features (#199)', () => {
  test('at least one planet in generated sectors has features', () => {
    let worldsWithFeatures = 0;
    for (let i = 0; i < 20; i++) {
      SystemGenerationTable.generateSector(
        SpaceRegionModel.for(SpaceRegion.ShackletonExpanse),
        SpecialSectors.GeneralExpanse,
      );
      const sector = store.getState().star.sector;
      if (sector == null) {
        throw new Error('expected a generated sector');
      }
      const worlds = sector.systems.flatMap((s) => s.worlds);
      worldsWithFeatures += worlds.filter((w) => w.features.length > 0).length;
    }
    expect(worldsWithFeatures).toBeGreaterThan(0);
  });
});
