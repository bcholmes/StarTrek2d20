import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { spaceframeRandomTable } from '../../../src/solo/table/starshipRandomTable';
import { Era } from '../../../src/helpers/erasEnum';

describe('starshipRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns a spaceframe for each era', () => {
    jest.spyOn(D20, 'roll').mockReturnValue(1);
    expect(spaceframeRandomTable(Era.Enterprise)).toBeDefined();
    jest.restoreAllMocks();
    jest.spyOn(D20, 'roll').mockReturnValue(1);
    expect(spaceframeRandomTable(Era.OriginalSeries)).toBeDefined();
    jest.restoreAllMocks();
    jest.spyOn(D20, 'roll').mockReturnValue(1);
    expect(spaceframeRandomTable(Era.NextGeneration)).toBeDefined();
    jest.restoreAllMocks();
    jest.spyOn(D20, 'roll').mockReturnValue(1);
    expect(spaceframeRandomTable(Era.PicardProdigy)).toBeDefined();
    jest.restoreAllMocks();
    jest.spyOn(D20, 'roll').mockReturnValue(1);
    expect(spaceframeRandomTable(Era.Discovery32)).toBeDefined();
  });
});
