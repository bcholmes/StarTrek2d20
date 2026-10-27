import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { speciesRandomTable } from '../../../src/solo/table/speciesRandomTable';
import { Era } from '../../../src/helpers/erasEnum';

describe('speciesRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns a species for different eras', () => {
    jest.spyOn(D20, 'roll').mockReturnValue(1);
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(speciesRandomTable(Era.Enterprise)).toBeDefined();
    jest.restoreAllMocks();
    jest.spyOn(D20, 'roll').mockReturnValue(1);
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(speciesRandomTable(Era.NextGeneration)).toBeDefined();
  });
});
