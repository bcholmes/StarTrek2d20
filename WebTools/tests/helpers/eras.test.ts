import { test, expect, describe } from '@jest/globals'
import { Era, ErasHelper } from '../../src/helpers/eras';

describe('testing era helper', () => {
    test('should find era by name', () => {
        let era = ErasHelper.getEraByName("NextGeneration");
        expect(era).toBe(Era.NextGeneration);

        let era2 = ErasHelper.getEraByName("Enterprise");
        expect(era2).toBe(Era.Enterprise);
    });
});