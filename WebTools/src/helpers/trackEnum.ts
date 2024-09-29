
export enum Track {
    // Core
    Command,
    Operations,
    Sciences,

    // Operations
    EnlistedSecurityTraining,
    ShipOperations,

    // Sciences
    UniversityAlumni,
    ResearchInternship,

    // Klingon Core
    Technical,
    EnlistedWarrior,
    Laborer,

    // Player's Guide - Allied Militaries
    RankAndFile,
    Officer,
    IntelligenceTraining,
    MilitiaAndGuerillas,

    // Player's Guide - Ambassador / Diplomat
    DiplomaticCorps,
    HonoraryStatus,

    // Player's Guide - Civilian
    FreightAndTransport,
    LawEnforcement,
    Physician,
    PoliticianOrBureaucrat,
    ScientificOrTechnicalExpert,
    TraderOrMerchant,

    // Core 2nd Edition
    Enlisted,
}

export const getAllTracks = (): Track[] => {
    return Object.keys(Track).filter((item) => {
        return !isNaN(Number(item));
    }).map(item => Number(item));
}