export enum RankIndicator {
    None,
    Ensign,
    LieutenantJG,
    Lieutenant,
    LtCommander,
    Commander,
    Captain,

    Crewman3rdClass,
    Crewman2ndClass,
    Crewman1stClass,
    PettyOfficer3rdClass,
    PettyOfficer2ndClass,
    PettyOfficer1stClass,
    ChiefPettyOfficer,
    SeniorChiefPettyOfficer,
    MasterChiefPettyOfficer,
}

export const isEnlistedRank = (rank: RankIndicator) => {
    switch (rank) {
        case RankIndicator.Crewman3rdClass:
        case RankIndicator.Crewman2ndClass:
        case RankIndicator.Crewman1stClass:
        case RankIndicator.PettyOfficer3rdClass:
        case RankIndicator.PettyOfficer2ndClass:
        case RankIndicator.PettyOfficer1stClass:
        case RankIndicator.ChiefPettyOfficer:
        case RankIndicator.SeniorChiefPettyOfficer:
        case RankIndicator.MasterChiefPettyOfficer:
            return true;
        default:
            return false;
    }
}