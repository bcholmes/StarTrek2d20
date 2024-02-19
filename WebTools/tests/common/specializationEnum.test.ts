import { test, expect, describe } from '@jest/globals'
import { Specialization, allSpecializations } from '../../src/common/specializationEnum';

describe('all specializations', () => {
    test('includes all specializations', () => {
        expect(allSpecializations().indexOf(Specialization.Counselor)).toBeGreaterThanOrEqual(0);
        expect(allSpecializations().indexOf(Specialization.Smuggler)).toBeGreaterThanOrEqual(0);
    });
});