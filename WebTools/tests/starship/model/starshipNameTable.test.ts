import { test, expect, describe } from '@jest/globals'
import { Era } from '../../../src/helpers/eras';
import { StarshipRandomNameTable } from '../../../src/starship/model/starshipNameTable';

describe('testing name generator', () => {
    test('should produce name', () => {
        for (let i = 0; i < 100; i++) {
            let name = StarshipRandomNameTable(Era.NextGeneration);
            expect(name).toBeDefined();
        }
    });
});