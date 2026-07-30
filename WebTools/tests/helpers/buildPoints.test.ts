import { test, expect, describe } from '@jest/globals'
import { BuildPoints } from '../../src/starship/model/buildPoints';
import { ShipBuildType } from '../../src/common/shipBuildType';
import { CharacterType } from '../../src/common/characterType';

describe('BuildPoints', () => {
    describe('systemPointsForType', () => {
        test('starship base points for 2200-2400 era', () => {
            const points = BuildPoints.systemPointsForType(ShipBuildType.Starship, 2250, CharacterType.Starfleet, 4);
            expect(points).toBe(45);
        });

        test('starship after 2400 uses higher base', () => {
            const points = BuildPoints.systemPointsForType(ShipBuildType.Starship, 2410, CharacterType.Starfleet, 4);
            expect(points).toBe(61);
        });

        test('starship scale adjustments', () => {
            const scale2 = BuildPoints.systemPointsForType(ShipBuildType.Starship, 2250, CharacterType.Starfleet, 2);
            const scale4 = BuildPoints.systemPointsForType(ShipBuildType.Starship, 2250, CharacterType.Starfleet, 4);
            expect(scale2).toBe(scale4 - 2);
        });

        test('pod returns base 16 plus improvement', () => {
            const points = BuildPoints.systemPointsForType(ShipBuildType.Pod, 2225, CharacterType.Starfleet, 1);
            expect(points).toBe(17);
        });

        test('shuttlecraft returns base 19 plus improvement', () => {
            const points = BuildPoints.systemPointsForType(ShipBuildType.Shuttlecraft, 2210, CharacterType.Starfleet, 1);
            expect(points).toBe(20);
        });

        test('runabout returns base 29 plus improvement', () => {
            const points = BuildPoints.systemPointsForType(ShipBuildType.Runabout, 2160, CharacterType.Starfleet, 1);
            expect(points).toBe(30);
        });
    });

    describe('departmentPointsForType', () => {
        test('pod returns 2', () => {
            expect(BuildPoints.departmentPointsForType(ShipBuildType.Pod)).toBe(2);
        });

        test('shuttlecraft returns 3', () => {
            expect(BuildPoints.departmentPointsForType(ShipBuildType.Shuttlecraft)).toBe(3);
        });

        test('runabout returns 4', () => {
            expect(BuildPoints.departmentPointsForType(ShipBuildType.Runabout)).toBe(4);
        });

        test('starship returns 3', () => {
            expect(BuildPoints.departmentPointsForType(ShipBuildType.Starship)).toBe(3);
        });
    });
});
