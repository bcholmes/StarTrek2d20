import { CharacterType } from "../../common/characterType";
import { ShipBuildType } from "../../common/starship";

export class BuildPoints {

    static systemPointsForType(buildType: ShipBuildType, serviceYear: number, characterType: CharacterType, scale: number) {
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
            let improvement = Math.floor((serviceYear - 2150) / 10);
            return base + improvement;
        } else {
            let base = 40;
            let improvement = Math.floor((serviceYear - 2200) / 10);
            if (scale === 2) {
                improvement -= 2;
            } else if (scale === 3) {
                improvement -= 1
            } else if (scale === 5) {
                improvement += 1
            } else if (scale === 6) {
                improvement += 2;
            } else if (scale === 7) {
                // this isn't clearly spelled out in the rules, but Odyssey is a scale 7 ship
                improvement += 3;
            }

            return base + improvement;
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
            return 3;
        }
    }

    static allocatePointsEvenly(points: number) {
        let base = (points < 0) ? Math.ceil(points / 6) : Math.floor(points / 6);
        let remainder = points - (base * 6);
        let result = [base, base, base, base, base, base];
        for (let i = 0; i < Math.min(Math.abs(remainder), 6); i++) {
            result[i] += (points < 0 ? -1 : 1);
        }
        return result;
    }
}