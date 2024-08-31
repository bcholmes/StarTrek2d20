import { test, expect, describe } from '@jest/globals';
import { IWeaponDiceProvider } from '../../src/common/iWeaponDiceProvider';
import { PersonalWeapons, Weapon } from '../../src/helpers/weapons';
import { WeaponDescriber } from '../../src/exportpdf/weaponDescriber';
import '../../src/i18n/config';

class MockWeaponDiceProvider implements IWeaponDiceProvider {
    getDiceForWeapon(weapon: Weapon): number {
        return weapon.dice + 3;
    }
}

describe('weapon describer', () => {
    test('should describe standard weapon version 1', async () => {

        const phaser = PersonalWeapons.instance(1).phaser2;
        const describer = new WeaponDescriber(1, true);

        expect(describer.describeFully(phaser, new MockWeaponDiceProvider())).toMatch(/Weapon.common.ranged/);

    });

    test('should describe standard weapon version 2', async () => {

        const phaser = PersonalWeapons.instance(2).phaser2;
        const describer = new WeaponDescriber(2, true);

        expect(describer.describeFully(phaser, new MockWeaponDiceProvider())).toMatch(/Weapon.common.ranged/);
        expect(describer.describeFully(phaser, new MockWeaponDiceProvider())).toMatch(/InjuryType.stunOrDeadly/);

    });

});