import { D20 } from "../common/die"
import { AssetType, AssetTypes } from "./assetType";

export const assetRandomTable = (numberOfCharacter: number) => {
    const roll = D20.roll();
    switch (roll) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            return AssetTypes.instance.getTypes()[AssetType.Resource];
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return AssetTypes.instance.getTypes()[AssetType.Ship];
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return numberOfCharacter <= 2 ? AssetTypes.instance.getTypes()[AssetType.Character] : AssetTypes.instance.getTypes()[AssetType.Ship];
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
            return AssetTypes.instance.getTypes()[AssetType.Character];
    }
}