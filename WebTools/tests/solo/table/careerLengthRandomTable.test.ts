import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import { careerLengthRandomTable } from '../../../src/solo/table/careerLengthRandomTable';
import { Career } from '../../../src/helpers/careerEnum';

describe('careerLengthRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns Young for rolls 1-6', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(6);
    expect(careerLengthRandomTable()).toBe(Career.Young);
    spy.mockRestore();
  });

  test('returns Experienced for rolls 7-13', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(13);
    expect(careerLengthRandomTable()).toBe(Career.Experienced);
    spy.mockRestore();
  });

  test('returns Veteran for rolls 14-20', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(20);
    expect(careerLengthRandomTable()).toBe(Career.Veteran);
    spy.mockRestore();
  });
});
