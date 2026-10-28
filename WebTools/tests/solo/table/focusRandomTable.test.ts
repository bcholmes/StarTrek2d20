import { test, expect, describe, jest } from '@jest/globals';
import { D20 } from '../../../src/common/die';
import {
  focusRandomTable,
  focusDivisionRandomTable,
  focusRandomTableWithHints,
} from '../../../src/solo/table/focusRandomTable';
import { Department } from '../../../src/helpers/department';

describe('focusRandomTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('focusDivisionRandomTable returns a department', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(1);
    const result = focusDivisionRandomTable();
    expect(Object.values(Department)).toContain(result);
    spy.mockRestore();
  });

  test('focusDivisionRandomTable rerolls on default', () => {
    const values = [19, 5];
    const spy = jest
      .spyOn(D20, 'roll')
      .mockImplementation(() => values.shift() as number);
    const result = focusDivisionRandomTable();
    expect(result).toBe(Department.Conn);
    spy.mockRestore();
  });

  test('focusRandomTable with skill Command returns string', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(1);
    const result = focusRandomTable(Department.Command);
    expect(typeof result).toBe('string');
    spy.mockRestore();
  });

  test('focusRandomTable with skill Medicine returns string', () => {
    const spy = jest.spyOn(D20, 'roll').mockReturnValue(1);
    const result = focusRandomTable(Department.Medicine);
    expect(typeof result).toBe('string');
    spy.mockRestore();
  });

  test('focusRandomTableWithHints uses hints when roll <= 10', () => {
    const d20Spy = jest.spyOn(D20, 'roll').mockReturnValue(5);
    const randSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const result = focusRandomTableWithHints(Department.Command, [
      'CustomFocus',
    ]);
    expect(result).toBe('CustomFocus');
    d20Spy.mockRestore();
    randSpy.mockRestore();
  });

  test('focusRandomTableWithHints falls back when no hints', () => {
    const d20Spy = jest.spyOn(D20, 'roll').mockReturnValue(5);
    const result = focusRandomTableWithHints(Department.Engineering, []);
    expect(typeof result).toBe('string');
    d20Spy.mockRestore();
  });
});
