import { D20 } from "../common/die";
import { Spaceframe } from "../helpers/spaceframeEnum";
import { Asset, AssetStat } from "./asset";
import { AssetType } from "./assetType";

export const assetRandomTable = (type: AssetType) => {
    if (type === AssetType.Ship) {
        return starshipAssetRandomTable();
    } else if (type === AssetType.Resource) {
        return resourceAssetRandomTable();
    } else {
        return characterAssetRandomTable();
    }
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

const starshipAssetRandomTable = () => {

    const roll = D20.roll();
    switch (roll) {
        case 1:
            return new Asset(AssetType.Ship, "USS Thunderbird",
                    [new AssetStat(9, 2), new AssetStat(8, 2), new AssetStat(11, 3), new AssetStat(13, 3), new AssetStat(10, 2)],
                    Spaceframe.Walker);
        case 2:
            return new Asset(AssetType.Ship, "USS Laika",
                    [new AssetStat(10, 2), new AssetStat(9, 3), new AssetStat(8, 2), new AssetStat(12, 3), new AssetStat(9, 2)],
                    Spaceframe.Shepard);
        case 3:
            return new Asset(AssetType.Ship, "USS Olds",
                    [new AssetStat(10, 2), new AssetStat(7, 1), new AssetStat(10, 2), new AssetStat(12, 3), new AssetStat(9, 2)],
                    Spaceframe.Cardenas);
        case 4:
            return new Asset(AssetType.Ship, "USS Jervis",
                    [new AssetStat(8, 1), new AssetStat(12, 4), new AssetStat(13, 3), new AssetStat(10, 3), new AssetStat(9, 2)],
                    Spaceframe.Cardenas);
        case 5:
            return new Asset(AssetType.Ship, "USS Negrelli",
                    [new AssetStat(9, 2), new AssetStat(11, 3), new AssetStat(10, 2), new AssetStat(11, 3), new AssetStat(9, 2)],
                    Spaceframe.Hoover);
        case 6:
            return new Asset(AssetType.Ship, "USS Raskova",
                    [new AssetStat(8, 2), new AssetStat(14, 5), new AssetStat(9, 3), new AssetStat(9, 2), new AssetStat(9, 2)],
                    Spaceframe.Malachowski);
        case 7:
            return new Asset(AssetType.Ship, "USS Rickenbacker",
                    [new AssetStat(12, 4), new AssetStat(8, 2), new AssetStat(12, 3), new AssetStat(9, 2), new AssetStat(9, 2)],
                    Spaceframe.Engle);
        case 8:
            return new Asset(AssetType.Ship, "USS Fletcher",
                    [new AssetStat(8, 1), new AssetStat(10, 3), new AssetStat(10, 2), new AssetStat(10, 3), new AssetStat(12, 4)],
                    Spaceframe.Nimitz);
        case 9:
            return new Asset(AssetType.Ship, "USS Dove's Dream",
                    [new AssetStat(14, 5), new AssetStat(7, 1), new AssetStat(7, 1), new AssetStat(12, 4), new AssetStat(10, 2)],
                    Spaceframe.Hiawatha);
        case 10:
            return new Asset(AssetType.Ship, "USS Cygnus",
                    [new AssetStat(7, 1), new AssetStat(8, 2), new AssetStat(15, 5), new AssetStat(11, 3), new AssetStat(10, 2)],
                    Spaceframe.ScoutType);
        case 11:
            return new Asset(AssetType.Ship, "USS Merimac",
                    [new AssetStat(10, 2), new AssetStat(11, 2), new AssetStat(13, 2), new AssetStat(14, 3), new AssetStat(12, 2)],
                    Spaceframe.Constitution);
        case 12:
            return new Asset(AssetType.Ship, "USS Kae Nemoto",
                    [new AssetStat(12, 2), new AssetStat(8, 1), new AssetStat(11, 3), new AssetStat(15, 5), new AssetStat(11, 2)],
                    Spaceframe.Oberth);
        case 13:
            return new Asset(AssetType.Ship, "USS Crossfield",
                    [new AssetStat(10, 2), new AssetStat(11, 2), new AssetStat(10, 2), new AssetStat(12, 4), new AssetStat(9, 2)],
                    Spaceframe.Crossfield);
        case 14:
            return new Asset(AssetType.Ship, "USS Wallaby",
                    [new AssetStat(9, 2), new AssetStat(10, 4), new AssetStat(12, 2), new AssetStat(9, 2), new AssetStat(9, 2)],
                    Spaceframe.IntrepidType);
        case 15:
            return new Asset(AssetType.Ship, "USS San Juan",
                    [new AssetStat(10, 3), new AssetStat(9, 2), new AssetStat(10, 2), new AssetStat(11, 3), new AssetStat(9, 2)],
                    Spaceframe.Daedalus);
        case 16:
            return new Asset(AssetType.Ship, "USS Montana",
                    [new AssetStat(10, 2), new AssetStat(12, 3), new AssetStat(12, 4), new AssetStat(10, 2), new AssetStat(10, 3)],
                    Spaceframe.Archer);
        case 17:
            return new Asset(AssetType.Ship, "USS Republic",
                    [new AssetStat(10, 2), new AssetStat(10, 2), new AssetStat(11, 3), new AssetStat(12, 3), new AssetStat(10, 3)],
                    Spaceframe.Constitution);
        case 18:
            return new Asset(AssetType.Ship, "USS Antares",
                    [new AssetStat(11, 2), new AssetStat(8, 2), new AssetStat(9, 2), new AssetStat(11, 3), new AssetStat(10, 2)],
                    Spaceframe.Antares);
        case 19:
            return new Asset(AssetType.Ship, "Classified",
                    [new AssetStat(9, 2), new AssetStat(12, 4), new AssetStat(11, 3), new AssetStat(11, 4), new AssetStat(10, 3)],
                    Spaceframe.HouYi);
        case 20:
            return new Asset(AssetType.Ship, "Classified",
                    [new AssetStat(11, 2), new AssetStat(10, 3), new AssetStat(12, 5), new AssetStat(9, 2), new AssetStat(12, 4)],
                    Spaceframe.Shiva);
    }
}

const resourceAssetRandomTable = () => {

    const roll = D20.roll();
    switch (roll) {
        case 1:
            return new Asset(AssetType.Resource, "Federation Diplomatic Pressure",
                    [new AssetStat(10, 1), new AssetStat(13, 3), new AssetStat(12, 3), new AssetStat(10, 2), new AssetStat(12, 3)]);
        case 2:
            return new Asset(AssetType.Resource, "Federation Military Supplies",
                    [new AssetStat(15, 4), new AssetStat(8, 1), new AssetStat(10, 2), new AssetStat(10, 2), new AssetStat(12, 3)]);
        case 3:
            return new Asset(AssetType.Resource, "Cunning Ploy",
                    [new AssetStat(10, 2), new AssetStat(15, 4), new AssetStat(4, 4), new AssetStat(8, 1), new AssetStat(10, 2)]);
        case 4:
            return new Asset(AssetType.Resource, "Local Resistance Group",
                    [new AssetStat(10, 2), new AssetStat(8, 1), new AssetStat(12, 2), new AssetStat(14, 4), new AssetStat(9, 1)]);
        case 5:
            return new Asset(AssetType.Resource, "Diplomatic Aid from Allies",
                    [new AssetStat(14, 4), new AssetStat(7, 1), new AssetStat(11, 1), new AssetStat(13, 3), new AssetStat(11, 2)]);
        case 6:
            return new Asset(AssetType.Resource, "Allied Military Expedition",
                    [new AssetStat(11, 1), new AssetStat(10, 2), new AssetStat(12, 2), new AssetStat(10, 2), new AssetStat(14, 3)]);
        case 7:
            return new Asset(AssetType.Resource, "Prototype Technology",
                    [new AssetStat(8, 1), new AssetStat(12, 3), new AssetStat(15, 3), new AssetStat(14, 4), new AssetStat(10, 2)]);
        case 8:
            return new Asset(AssetType.Resource, "Secret Operations Team",
                    [new AssetStat(8, 1), new AssetStat(13, 2), new AssetStat(12, 2), new AssetStat(8, 1), new AssetStat(12, 2)]);
        case 9:
            return new Asset(AssetType.Resource, "Criminal Contacts",
                    [new AssetStat(12, 2), new AssetStat(11, 3), new AssetStat(12, 3), new AssetStat(8, 1), new AssetStat(14, 3)]);
        case 10:
            return new Asset(AssetType.Resource, "Cutting Edge Scientific Theory",
                    [new AssetStat(16, 5), new AssetStat(10, 2), new AssetStat(11, 2), new AssetStat(14, 4), new AssetStat(11, 2)]);
        case 11:
            return new Asset(AssetType.Resource, "Enterprising Freelancer",
                    [new AssetStat(10, 2), new AssetStat(11, 2), new AssetStat(13, 2), new AssetStat(14, 3), new AssetStat(12, 2)]);
        case 12:
            return new Asset(AssetType.Resource, "Federation Stockpiles",
                    [new AssetStat(12, 2), new AssetStat(14, 3), new AssetStat(12, 3), new AssetStat(10, 2), new AssetStat(15, 5)]);
        case 13:
            return new Asset(AssetType.Resource, "Unexpected Local Hero",
                    [new AssetStat(11, 1), new AssetStat(10, 2), new AssetStat(14, 2), new AssetStat(15, 5), new AssetStat(16, 4)]);
        case 14:
            return new Asset(AssetType.Resource, "Federation Agents",
                    [new AssetStat(8, 1), new AssetStat(14, 4), new AssetStat(13, 3), new AssetStat(10, 1), new AssetStat(16, 5)]);
        case 15:
            return new Asset(AssetType.Resource, "Retired Federation Ship",
                    [new AssetStat(12, 1), new AssetStat(11, 3), new AssetStat(13, 3), new AssetStat(10, 1), new AssetStat(16, 5)]);
        case 16:
            return new Asset(AssetType.Resource, "Federation Diplomatic Talent",
                    [new AssetStat(10, 1), new AssetStat(12, 2), new AssetStat(12, 2), new AssetStat(10, 1), new AssetStat(17, 5)]);
        case 17:
            return new Asset(AssetType.Resource, "Federation Supply Chain",
                    [new AssetStat(13, 3), new AssetStat(11, 2), new AssetStat(11, 3), new AssetStat(9, 1), new AssetStat(13, 3)]);
        case 18:
            return new Asset(AssetType.Resource, "Federation Diplomatic Maneuvers",
                    [new AssetStat(12, 2), new AssetStat(9, 2), new AssetStat(9, 1), new AssetStat(9, 1), new AssetStat(12, 2)]);
        case 19:
            return new Asset(AssetType.Resource, "Surprising Crew Member",
                    [new AssetStat(10, 2), new AssetStat(11, 2), new AssetStat(17, 5), new AssetStat(14, 3), new AssetStat(15, 5)]);
        case 20:
            return new Asset(AssetType.Resource, "Celebrated Officer Out of Retirement for One Last Mission",
                    [new AssetStat(8, 3), new AssetStat(10, 3), new AssetStat(12, 2), new AssetStat(10, 1), new AssetStat(11, 2)]);
    }
}