
export enum Specialization {
    Admiral,
    Admin,
    Counselor,
    FirstContactSpecialist,
    Jag,
    Security,
    MedicalDoctor,
    Nurse,
    HangarDeck,
    Conn,
    ScienceTech,
    StarfleetScientist,
    Engineer,
    IntelligenceOfficer,

    KlingonWarrior,
    KlingonWeaponsOfficer,
    KlingonMedic,
    KlingonShipCaptain,
    KlingonDiplomat,

    FerengiMerchant,
    FerengiDaiMon,

    CardassianSoldier,
    CardassianGul,

    RomulanCenturion,
    RomulanTalShiar,
    RomulanSenator,

    SonaCommandOfficer,
    TalarianWarrior,
    TalarianOfficer,

    Scientist,
    Bureaucrat,
    Colonist,
    FederationAmbassador,

    OrionPirate,
    InformationBroker,
    BruteForHire,
    Bodyguard,
    Smuggler,
}

export const allSpecializations = () => {
    return Object.keys(Specialization).filter((item) => {
        return !isNaN(Number(item));
    }).map(item => Number(item));
}

