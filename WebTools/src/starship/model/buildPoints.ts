import { CharacterType } from "../../common/characterType";
import { ShipBuildType } from "../../common/starship";

export class BuildPoints {

    static systemPointsForType(buildType: ShipBuildType, serviceYear: number, characterType: CharacterType) {
        if (buildType === ShipBuildType.Pod) {
            let base = 16;
            let improvement = Math.floor((serviceYear - 2200) / 25);
            return base + improvement;
        } else if (buildType === ShipBuildType.Shuttlecraft) {
            let base = 19;
            let improvement = Math.floor((serviceYear - 2200) / 10);
            return base + improvement;
        } else if (buildType === ShipBuildType.Runabout) {
            let base = 29;
            let improvement = Math.floor((serviceYear - 2200) / 10);
            return base + improvement;
        } else {
            return 0; // figure this out later
        }
    }

    static departmentPointsForType(buildType: ShipBuildType) {
        if (buildType === ShipBuildType.Pod) {
            return 2;
        } else if (buildType === ShipBuildType.Shuttlecraft) {
            return 3;
        } else if (buildType === ShipBuildType.Runabout) {
            return 4;
        } else {
            return 0; // figure this out later
        }
    }

    static allocatePointsEvenly(points: number) {
        let base = Math.floor(points / 6);
        let remainder = points - (base * 6);
        let result = [base, base, base, base, base, base];
        for (let i = 0; i < Math.min(remainder, 6); i++) {
            result[i] += 1;
        }
        return result;
    }
}