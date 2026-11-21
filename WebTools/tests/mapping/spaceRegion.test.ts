import { test, expect, describe } from '@jest/globals';
import { SpaceRegion, SpaceRegionModel } from '../../src/mapping/spaceRegion';

describe('Shackleton Expanse sector features (#199)', () => {
  test('at least one planet in generated sectors has features', () => {
    let region = SpaceRegionModel.for(SpaceRegion.ShackletonExpanse);
    expect(region).toBeDefined();
    expect(region.id).toBe(SpaceRegion.ShackletonExpanse);

    region = SpaceRegionModel.for(SpaceRegion.AlphaQuadrant);
    expect(region).toBeDefined();
    expect(region.id).toBe(SpaceRegion.AlphaQuadrant);
  });
});
