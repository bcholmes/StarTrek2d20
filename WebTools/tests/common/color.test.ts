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

    test('darken', () => {
        expect(SimpleColor.from("#d30000")?.darken()?.asHex()).toBe("#6a0000");
        expect(SimpleColor.from("#ffffff")?.darken()?.asHex()).toBe("#808080");
    });

    test('darken black', () => {
        expect(SimpleColor.from("#000000")?.darken()?.asHex()).toBe("#000000");
    });


});