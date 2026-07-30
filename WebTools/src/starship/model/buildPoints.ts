import { CharacterType } from "../../common/characterType";
import { ShipBuildType } from "../../common/shipBuildType";

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
            let base = (serviceYear > 2400) ? 60 : 40;
            let improvement = (serviceYear > 2400) ? Math.floor((serviceYear - 2400) / 10) :  Math.floor((serviceYear - 2200) / 10);
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
}