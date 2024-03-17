import { test, expect, describe } from '@jest/globals'
import { SimpleColor } from '../../src/common/colour';

describe('testing simple color', () => {
    test('from hex', () => {
        expect(SimpleColor.from("#f37824")?.asHex()).toBe("#f37824");
    });

    test('is dark', () => {
        expect(SimpleColor.from("#f37824")?.isDark).toBeFalsy();
        expect(SimpleColor.from("#333333")?.isDark).toBeTruthy();
    });

    test('darker', () => {
        expect(SimpleColor.from("#d30000")?.darker()?.asHex()).toBe("#6a0000");
    });


});