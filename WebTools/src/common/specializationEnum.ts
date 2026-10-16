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
  FerengiBartender,

  CardassianSoldier,
  CardassianGul,
  CardassianBureaucrat,
  CardassianExarch,
  ObsidianOrderOperative,

  RomulanCenturion,
  RomulanTalShiar,
  RomulanSenator,
  QowatMilat,

  SonaCommandOfficer,
  TalarianWarrior,
  TalarianOfficer,
  TzenkethiSoldier,
  TholianWarrior,
  TholianEnforcer,
  HirogenHunter,

  BreenThot,
  BreenWarrior,
  BreenEliteGuard,

  Scientist,
  Bureaucrat,
  Colonist,
  FederationAmbassador,
  IndependentTraderCaptain,
  Child,
  CivilianDoctor,
  Journalist,
  IndependentArchaeologist,

  Pirate,
  InformationBroker,
  BruteForHire,
  Bodyguard,
  Smuggler,
  SketchyTraderCaptain,
  Terrorist,
  Assassin,
  OrionSlaver,

  BorgTacticalDrone,
  BorgTechnicalDrone,
  BorgMedicalDrone,
  BorgAdjunctDrone,

  JemHadarGuard,
}

export const allSpecializations = () => {
  return Object.keys(Specialization)
    .filter((item) => {
      return !isNaN(Number(item));
    })
    .map((item) => Number(item));
};
