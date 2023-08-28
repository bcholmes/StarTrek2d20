import { D20 } from "../../common/die"
import { Era } from "../../helpers/eras";
import { Species } from "../../helpers/speciesEnum";

export const SpeciesRandomTable = (era: Era) => {

    let tables = [EnterpriseSpeciesRandomTable, OriginalSeriesSpeciesRandomTable, NextGenerationSpeciesRandomTable];
    let table = tables[Math.min(tables.length - 1, Math.floor(Math.random() * (era + 1)))];

    return table();
}

const EnterpriseSpeciesRandomTable = () => {
    const roll = D20.roll();

    switch (roll) {
    case 1:
        return Species.Aenar;
    case 2:
        return Species.Andorian;
    case 3:
        return Species.Arbazan;
    case 4:
        return Species.Denobulan;
    case 5:
        return Species.Gorn;
    case 6:
        return Species.Human;
    case 7:
        return Species.Illyrian;
    case 8:
        return Species.Klingon;
    case 9:
        return Species.Klingon;
    case 10:
        return Species.Orion;
    case 11:
        return Species.Reman;
    case 12:
        return Species.Risian;
    case 13:
        return Species.Romulan;
    case 14:
        return Species.Suliban;
    case 15:
        return Species.Tellarite;
    case 16:
        return Species.Vulcan;
    case 17:
        return Species.XindiArboreal;
    case 18:
        return Species.XindiInsectoid;
    case 19:
        return Species.XindiPrimate;
    case 20:
        return Species.XindiReptilian;

    }
}

const OriginalSeriesSpeciesRandomTable = () => {
    const roll = D20.roll();

    switch (roll) {
    case 1:
        return Species.Ardanan;
    case 2:
        return Species.Aurelian;
    case 3:
        return Species.Barzan;
    case 4:
        return Species.Betazoid;
    case 5:
        return Species.Bolian;
    case 6:
        return Species.Caitian;
    case 7:
        return Species.CyberneticallyEnhanced;
    case 8:
        return Species.Deltan;
    case 9:
        return Species.Edosian;
    case 10:
        return Species.Efrosian;
    case 11:
        return Species.Horta;
    case 12:
        return Species.Human;
    case 13:
        return Species.Kelpien;
    case 14:
        return Species.Kzinti;
    case 15:
        return Species.Osnullus;
    case 16:
        return Species.Saurian;
    case 17:
        return Species.Tholian;
    case 18:
        return Species.Trill;
    case 19:
        return Species.Xahean;
    case 20:
        return Species.Zaranite;

    }
}

const NextGenerationSpeciesRandomTable = () => {
    const roll = D20.roll();

    switch (roll) {
    case 1:
        return Species.Bajoran;
    case 2:
        return Species.Benzite;
    case 3:
        return Species.Bynar;
    case 4:
        return Species.Cardassian;
    case 5:
        return Species.Changeling;
    case 6:
        return Species.Doopler;
    case 7:
        return Species.Hologram;
    case 8:
        return Species.Human;
    case 9:
        return Species.JemHadar;
    case 10:
        return Species.Kazon;
    case 11:
        return Species.LiberatedBorg;
    case 12:
        return Species.Lurian;
    case 13:
        return Species.Ocampa;
    case 14:
        return Species.Pakled;
    case 15:
        return Species.Paradan;
    case 16:
        return Species.Sikarian;
    case 17:
        return Species.Android;
    case 18:
        return Species.Talaxian;
    case 19:
        return Species.Tamarian;
    case 20:
        return Species.Zakdorn;

    }
}