import { D20 } from "../../common/die";
import { TableRoll } from "../../common/tableRoll";
import { Era } from "../../helpers/eras";
import { Spaceframe } from "../../helpers/spaceframeEnum";


export const SpaceframeRandomTable = (era: Era) => {

    let tables = [EnterpriseSpaceframeRandomTable, OriginalSeriesSpaceframeRandomTable,
        NextGenerationSpaceframeRandomTable, PicardProdigySpaceframeRandomTable,
        Discovery32SpaceframeRandomTable];

    return tables[era]();
}

const EnterpriseSpaceframeRandomTable: TableRoll<Spaceframe> = () => {

    const roll = D20.roll();

    switch (roll) {
    case 1:
    case 2:
    case 3:
    case 4:
        return Spaceframe.Daedalus_UP;
    case 5:
    case 6:
    case 7:
    case 8:
        return Spaceframe.IntrepidType;
    case 9:
    case 10:
    case 11:
    case 12:
        return Spaceframe.JClassYClass;
    case 13:
    case 14:
    case 15:
    case 16:
        return Spaceframe.NX_UP;
    case 17:
    case 18:
    case 19:
    case 20:
    default:
        return Spaceframe.Delta;
    }
}

const OriginalSeriesSpaceframeRandomTable: TableRoll<Spaceframe> = () => {

    const roll = D20.roll();

    switch (roll) {
    case 1:
        return Spaceframe.Antares;
    case 2:
        return Spaceframe.Archer;
    case 3:
        return Spaceframe.Cardenas;
    case 4:
        return Spaceframe.Constellation_UP;
    case 5:
        return Spaceframe.Constitution_UP;
    case 6:
        return Spaceframe.Crossfield;
    case 7:
        return Spaceframe.Engle;
    case 8:
        return Spaceframe.Excelsior_UP;
    case 9:
        return Spaceframe.Hiawatha;
    case 10:
        return Spaceframe.Hoover;
    case 11:
        return Spaceframe.Magee;
    case 12:
        return Spaceframe.Malachowski;
    case 13:
        return Spaceframe.Miranda_UP;
    case 14:
        return Spaceframe.Nimitz;
    case 15:
        return Spaceframe.Oberth_UP;
    case 16:
        return Spaceframe.ScoutType;
    case 17:
        return Spaceframe.Shepard;
    case 18:
        return Spaceframe.Soyuz;
    case 19:
        return Spaceframe.Sydney;
    case 20:
    default:
        return Spaceframe.Walker;
    }
}

const NextGenerationSpaceframeRandomTable: TableRoll<Spaceframe> = () => {

    const roll = D20.roll();

    switch (roll) {
    case 1:
        return Spaceframe.Akira_UP;
    case 2:
        return Spaceframe.Ambassador_UP;
    case 3:
        return Spaceframe.Challenger;
    case 4:
        return Spaceframe.Cheyenne;
    case 5:
        return Spaceframe.Defiant_UP;
    case 6:
    case 7:
        return Spaceframe.Freedom;
    case 8:
        return Spaceframe.Galaxy;
    case 9:
        return Spaceframe.Intrepid_UP;
    case 10:
        return Spaceframe.Nebula_UP;
    case 11:
        return Spaceframe.NewOrleans;
    case 12:
        return Spaceframe.Niagara;
    case 13:
        return Spaceframe.Norway_UP;
    case 14:
        return Spaceframe.Nova;
    case 15:
        return Spaceframe.Olympic_UP;
    case 16:
        return Spaceframe.RavenType;
    case 17:
        return Spaceframe.Saber;
    case 18:
        return Spaceframe.Springfield;
    case 20:
    default:
        return Spaceframe.Steamrunner_UP;
    }
}

const PicardProdigySpaceframeRandomTable: TableRoll<Spaceframe> = () => {

    const roll = D20.roll();

    switch (roll) {
    case 1:
    case 2:
        return Spaceframe.Gagarin;
    case 3:
    case 4:
    case 5:
        return Spaceframe.Inquiry;
    case 6:
        return Spaceframe.Luna_UP;
    case 7:
        return Spaceframe.Odyssey;
    case 8:
    case 9:
    case 10:
    case 11:
        return Spaceframe.Pathfinder;
    case 12:
    case 13:
        return Spaceframe.Prometheus;
    case 14:
    case 15:
        return Spaceframe.Reliant;
    case 16:
    case 17:
        return Spaceframe.Ross;
    case 18:
        return Spaceframe.Sovereign_UP;
    case 20:
    default:
        return Spaceframe.Vesta;
    }
}

const Discovery32SpaceframeRandomTable: TableRoll<Spaceframe> = () => {

    const roll = D20.roll();

    switch (roll) {
    case 1:
    case 2:
    case 3:
    case 4:
        return Spaceframe.Angelou;
    case 5:
    case 6:
    case 7:
    case 8:
        return Spaceframe.Eisenberg;
    case 9:
    case 10:
    case 11:
    case 12:
        return Spaceframe.Friendship;
    case 13:
    case 14:
    case 15:
    case 16:
        return Spaceframe.Janeway;
    case 17:
    case 18:
    case 19:
    case 20:
    default:
        return Spaceframe.Kirk;
    }
}