import { Rank } from "../../helpers/ranks";

export const isEnlistedRank = (rank: Rank) => {
    switch (rank) {
        case Rank.Crewman3rdClass:
        case Rank.Crewman2ndClass:
        case Rank.Crewman1stClass:
        case Rank.PettyOfficer3rdClass:
        case Rank.PettyOfficer2ndClass:
        case Rank.PettyOfficer1stClass:
        case Rank.ChiefPettyOfficer:
        case Rank.SeniorChiefPettyOfficer:
        case Rank.MasterChiefPettyOfficer:
            return true;
        default:
            return false;
    }
}