import { test, expect, describe } from '@jest/globals';
import { generatePlanetName } from '../../../src/mapping/util/planetNameGenerator';
import { WorldClass } from '../../../src/mapping/table/worldClass';

describe('testing planet name generation', () => {
  test('should generate name', () => {
    const name = generatePlanetName(WorldClass.M);
    expect(name).toBeDefined();
  });
});
