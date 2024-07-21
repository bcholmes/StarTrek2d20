import { D20 } from "../common/die";
import { Asset, AssetStat } from "./asset";
import { AssetType } from "./assetType";

export const assetRandomTable = (type: AssetType) => {
    return characterAssetRandomTable();
}


const characterAssetRandomTable = () => {

    const roll = D20.roll();
    switch (roll) {
        case 1:
            return new Asset(AssetType.Character, "Lieutenant James T. Kirk",
                    [new AssetStat(10, 1), new AssetStat(13, 3), new AssetStat(12, 3), new AssetStat(10, 2), new AssetStat(12, 3)]);
        case 2:
            return new Asset(AssetType.Character, "Doctor Joseph M'Benga",
                    [new AssetStat(15, 4), new AssetStat(8, 1), new AssetStat(10, 2), new AssetStat(10, 2), new AssetStat(12, 3)]);
        case 3:
            return new Asset(AssetType.Character, "MACO Squad Leader",
                    [new AssetStat(10, 2), new AssetStat(15, 4), new AssetStat(4, 4), new AssetStat(8, 1), new AssetStat(10, 2)]);
        case 4:
            return new Asset(AssetType.Character, "Carol Marcus",
                    [new AssetStat(10, 2), new AssetStat(8, 1), new AssetStat(12, 2), new AssetStat(14, 4), new AssetStat(9, 1)]);
        case 5:
            return new Asset(AssetType.Character, "Janet Wallace",
                    [new AssetStat(14, 4), new AssetStat(7, 1), new AssetStat(11, 1), new AssetStat(13, 3), new AssetStat(11, 2)]);
        case 6:
            return new Asset(AssetType.Character, "Ensign J.T. Esteban",
                    [new AssetStat(8, 1), new AssetStat(12, 3), new AssetStat(15, 3), new AssetStat(14, 4), new AssetStat(10, 2)]);
        case 7:
            return new Asset(AssetType.Character, "Lieutenant Lawrence Styles",
                    [new AssetStat(8, 1), new AssetStat(13, 2), new AssetStat(12, 2), new AssetStat(8, 1), new AssetStat(12, 2)]);
        case 8:
            return new Asset(AssetType.Character, "Consul St. John Talbot",
                    [new AssetStat(12, 2), new AssetStat(11, 3), new AssetStat(12, 3), new AssetStat(8, 1), new AssetStat(14, 3)]);
        case 9:
            return new Asset(AssetType.Character, "Ambassador Robert Fox",
                    [new AssetStat(11, 1), new AssetStat(10, 2), new AssetStat(12, 2), new AssetStat(10, 2), new AssetStat(14, 3)]);
        case 10:
            return new Asset(AssetType.Character, "Doctor Leonard McCoy",
                    [new AssetStat(16, 5), new AssetStat(10, 2), new AssetStat(11, 2), new AssetStat(14, 4), new AssetStat(11, 2)]);
        case 11:
            return new Asset(AssetType.Character, "Lieutenant Montgomery Scott",
                    [new AssetStat(10, 2), new AssetStat(11, 2), new AssetStat(13, 2), new AssetStat(14, 3), new AssetStat(12, 2)]);
        case 12:
            return new Asset(AssetType.Character, "Captain Matt Decker",
                    [new AssetStat(12, 2), new AssetStat(14, 3), new AssetStat(12, 3), new AssetStat(10, 2), new AssetStat(15, 5)]);
        case 13:
            return new Asset(AssetType.Character, "Admiral Terral",
                    [new AssetStat(11, 1), new AssetStat(10, 2), new AssetStat(14, 2), new AssetStat(15, 5), new AssetStat(16, 4)]);
        case 14:
            return new Asset(AssetType.Character, "Admiral Shukar",
                    [new AssetStat(8, 1), new AssetStat(14, 4), new AssetStat(13, 3), new AssetStat(10, 1), new AssetStat(16, 5)]);
        case 15:
            return new Asset(AssetType.Character, "Commodore James Kormack",
                    [new AssetStat(12, 1), new AssetStat(11, 3), new AssetStat(13, 3), new AssetStat(10, 1), new AssetStat(16, 5)]);
        case 16:
            return new Asset(AssetType.Character, "Commodore Robert April",
                    [new AssetStat(10, 1), new AssetStat(12, 2), new AssetStat(12, 2), new AssetStat(10, 1), new AssetStat(17, 5)]);
        case 17:
            return new Asset(AssetType.Character, "Vice Admiral Cornwell",
                    [new AssetStat(13, 3), new AssetStat(11, 2), new AssetStat(11, 3), new AssetStat(9, 1), new AssetStat(13, 3)]);
        case 18:
            return new Asset(AssetType.Character, "Administrator Nancy Hedford",
                    [new AssetStat(12, 2), new AssetStat(9, 2), new AssetStat(9, 1), new AssetStat(9, 1), new AssetStat(12, 2)]);
        case 19:
            return new Asset(AssetType.Character, "Sarek",
                    [new AssetStat(10, 2), new AssetStat(11, 2), new AssetStat(17, 5), new AssetStat(14, 3), new AssetStat(15, 5)]);
        case 20:
            return new Asset(AssetType.Character, "Operative Leland",
                    [new AssetStat(8, 3), new AssetStat(10, 3), new AssetStat(12, 2), new AssetStat(10, 1), new AssetStat(11, 2)]);
    }
}