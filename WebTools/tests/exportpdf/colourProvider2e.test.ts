import { describe, expect, test } from '@jest/globals';
import { Division } from '../../src/common/character';
import { Era } from '../../src/helpers/erasEnum';
import {
  blueColour2e,
  divisionColour2e,
  goldColour2e,
  labelColourProvider,
  redColour2e,
  tealColour2e,
} from '../../src/exportpdf/colourProvider2e';

describe('colourProvider2e', () => {
  test('returns era-specific command/conn colours', () => {
    expect(
      labelColourProvider(Era.NextGeneration, 'Construct.discipline.command'),
    ).toBe(redColour2e);
    expect(
      labelColourProvider(Era.NextGeneration, 'Construct.department.conn'),
    ).toBe(redColour2e);
    expect(
      labelColourProvider(Era.Enterprise, 'Construct.discipline.command'),
    ).toBe(goldColour2e);
    expect(
      labelColourProvider(Era.OriginalSeries, 'Construct.department.conn'),
    ).toBe(goldColour2e);
  });

  test('returns era-specific engineering/security colours', () => {
    expect(
      labelColourProvider(
        Era.PicardProdigy,
        'Construct.discipline.engineering',
      ),
    ).toBe(goldColour2e);
    expect(
      labelColourProvider(Era.Discovery32, 'Construct.department.security'),
    ).toBe(goldColour2e);
    expect(
      labelColourProvider(Era.Enterprise, 'Construct.discipline.security'),
    ).toBe(redColour2e);
    expect(
      labelColourProvider(
        Era.OriginalSeries,
        'Construct.department.engineering',
      ),
    ).toBe(redColour2e);
  });

  test('returns blue for medicine/science and teal for others', () => {
    expect(
      labelColourProvider(Era.NextGeneration, 'Construct.discipline.medicine'),
    ).toBe(blueColour2e);
    expect(
      labelColourProvider(Era.Enterprise, 'Construct.department.science'),
    ).toBe(blueColour2e);
    expect(
      labelColourProvider(Era.NextGeneration, 'Construct.other.departments'),
    ).toBe(tealColour2e);
  });

  test('returns division colours by era', () => {
    expect(divisionColour2e(Era.NextGeneration, Division.Command)).toBe(
      redColour2e,
    );
    expect(divisionColour2e(Era.NextGeneration, Division.Operations)).toBe(
      goldColour2e,
    );
    expect(divisionColour2e(Era.NextGeneration, Division.Science)).toBe(
      blueColour2e,
    );
    expect(divisionColour2e(Era.NextGeneration, undefined)).toBe(tealColour2e);

    expect(divisionColour2e(Era.Enterprise, Division.Command)).toBe(
      goldColour2e,
    );
    expect(divisionColour2e(Era.Enterprise, Division.Operations)).toBe(
      redColour2e,
    );
    expect(divisionColour2e(Era.Enterprise, Division.Science)).toBe(
      blueColour2e,
    );
    expect(divisionColour2e(Era.Enterprise, undefined)).toBe(tealColour2e);
  });
});
