
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
    Captain,
    StationCommander,

    KlingonWarrior,
    KlingonWeaponsOfficer,
    KlingonMedic,
    KlingonShipCaptain,
    KlingonDiplomat,

    FerengiMerchant,
    FerengiDaiMon,
    FerengiLiquidator,
    FerengiEliminator,

    CardassianSoldier,
    CardassianGul,

    RomulanCenturion,
    RomulanTalShiar,
    RomulanSenator,

    SonaCommandOfficer,
    TalarianWarrior,
    TalarianOfficer,
    TzenkethiSoldier,
    TholianWarrior,

    Scientist,
    Bureaucrat,
    Colonist,
    FederationAmbassador,
    IndependentTraderCaptain,
    Child,
    CivilianDoctor,

    OrionPirate,
    InformationBroker,
    BruteForHire,
    Bodyguard,
    Smuggler,
    SketchyTraderCaptain,
}

export const allSpecializations = () => {
    return Object.keys(Specialization).filter((item) => {
        return !isNaN(Number(item));
    }).map(item => Number(item));
}

