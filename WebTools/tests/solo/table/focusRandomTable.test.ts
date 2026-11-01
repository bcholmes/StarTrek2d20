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

  test('covers every department, table roll, and focus roll', () => {
    const departments = [
      Department.Command,
      Department.Conn,
      Department.Security,
      Department.Engineering,
      Department.Science,
      Department.Medicine,
    ];
    const spy = jest.spyOn(D20, 'roll');

    for (const department of departments) {
      for (const tableRoll of [1, 11]) {
        for (let roll = 1; roll <= 20; roll++) {
          spy.mockReturnValueOnce(tableRoll).mockReturnValueOnce(roll);
          const result = focusRandomTable(department);
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test('selects a department when no skill is provided', () => {
    const spy = jest.spyOn(D20, 'roll');
    spy.mockReturnValueOnce(1).mockReturnValueOnce(1).mockReturnValueOnce(1);

    const result = focusRandomTable();
    expect(typeof result).toBe('string');
  });

  test('focusDivisionRandomTable covers every division roll', () => {
    const expectedDepartments = [
      Department.Command,
      Department.Command,
      Department.Command,
      Department.Conn,
      Department.Conn,
      Department.Conn,
      Department.Security,
      Department.Security,
      Department.Security,
      Department.Engineering,
      Department.Engineering,
      Department.Engineering,
      Department.Science,
      Department.Science,
      Department.Science,
      Department.Medicine,
      Department.Medicine,
      Department.Medicine,
    ];
    const spy = jest.spyOn(D20, 'roll');

    expectedDepartments.forEach((expected, index) => {
      spy.mockReturnValueOnce(index + 1);
      expect(focusDivisionRandomTable()).toBe(expected);
    });
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
