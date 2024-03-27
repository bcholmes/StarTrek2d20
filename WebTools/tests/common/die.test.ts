import { test, expect, describe } from '@jest/globals'
import { D20 } from '../../src/common/die';

describe('testing D20 rolls', () => {
    test('should always be between 1 and 20', () => {
        let min = 999, max = 0;
        for (let i = 0; i < 100; i++) {
            const roll = D20.roll();
            min = Math.min(min, roll);
            max = Math.max(max, roll);
        }

        expect(min >= 1).toBeTruthy();
        expect(max <= 20).toBeTruthy();
    });
});