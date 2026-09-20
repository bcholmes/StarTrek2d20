import { Career } from './careerEnum';
import { Role } from './roles';
import { Era } from './erasEnum';
import { Source } from './sources';
import { Track } from './trackEnum';
import type { AlliedMilitaryDetails, Character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { AlliedMilitaryType } from './alliedMilitary';
import { store } from '../state/store';
import { makeKey } from '../common/translationKey';
import i18next from 'i18next';
import { isCadetRank, isEnlistedRank } from '../token/model/rankHelper';
import type { ICharacterPrerequisite } from './characterPrerequisite';
import {
  AllOfCharacterPrerequisite,
  AnyEraCharacterPrerequisite,
  AnyOfCharacterPrerequisite,
  CareersCharacterPrerequisite,
  CharacterTypePrerequisite,
  EnlistedCharacterPrerequisite,
  KlingonCharacterPrerequisite,
  NotCharacterPrerequisite,
  NotRolesCharacterPrerequisite,
  OfficerCharacterPrerequisite,
  SourceCharacterPrerequisite,
} from './characterPrerequisite';

export enum Rank {
  // Core
  Captain,
  Commander,
  LtCommander,
  Lieutenant,
  LieutenantJG,
  Ensign,
  MasterChiefPettyOfficer,
  MasterChiefSpecialist,
  SeniorChiefPettyOfficer,
  SeniorChiefSpecialist,
  ChiefPettyOfficer,
  ChiefSpecialist,
  PettyOfficer1stClass,
  PettyOfficer2ndClass,
  PettyOfficer3rdClass,
  Specialist1stClass,
  Specialist2ndClass,
  Specialist3rdClass,
  Yeoman1stClass,
  Yeoman2ndClass,
  Yeoman3rdClass,
  Crewman1stClass,
  Crewman2ndClass,
  Crewman3rdClass,

  // Command
  RearAdmiral,
  RearAdmiralLower,
  RearAdmiralUpper,
  ViceAdmiral,
  Admiral,
  FleetAdmiral,
  Commodore,
  FleetCaptain,

  Civilian,

  // KlingonCore
  Sergeant,
  Corporal,
  Bekk,

  // Player's Guide
  Colonel,
  Brigadier,
  General,

  MajorGeneral,
  LieutenantGeneral,
  LieutenantColonel,
  Major,
  FirstLieutenant,
  SecondLieutenant,
  MasterSergeant,
  StaffSergeant,
  Private,

  SubCommander,
  SubLieutenant,
  Centurion,
  Uhlan,

  GrandGul,
  Legate,
  Jagul,
  Gul,
  Dal,
  Dalin,
  Glinn,
  Gil,
  Garresh,
  Gorr,

  Trooper,

  Administrator,
  FleetCommander,

  CadetFourthClass,
  CadetThirdClass,
  CadetSecondClass,
  CadetFirstClass,

  // not specified
  Menial,
  Associate,
  Salesman,
  DaiMon,
  Adhar,
  LorC,
  LorBB,
  LorAA,

  HRen,
  OkChed,
  VelSh,
  Chot,
  Thot,

  None,
}

class FerengiPrerequisite implements ICharacterPrerequisite {
  isPrerequisiteFulfilled(character: Character) {
    return (
      character.type === CharacterType.Ferengi ||
      (character.type === CharacterType.AlliedMilitary &&
        character.typeDetails &&
        character.typeDetails.type === AlliedMilitaryType.FerengiMilitary)
    );
  }
}

class AlliedMilitaryCharacterPrerequisite implements ICharacterPrerequisite {
  private types: AlliedMilitaryType[];

  constructor(...alliedMilitary: AlliedMilitaryType[]) {
    this.types = alliedMilitary;
  }

  isPrerequisiteFulfilled(character: Character) {
    return (
      character.type === CharacterType.AlliedMilitary &&
      character.typeDetails &&
      this.types.indexOf(
        (character.typeDetails as AlliedMilitaryDetails)?.alliedMilitary?.type,
      ) >= 0
    );
  }
}

class NoCareerEventsPrerequisite implements ICharacterPrerequisite {
  isPrerequisiteFulfilled(character: Character) {
    return (
      character.careerEvents == null || character.careerEvents.length === 0
    );
  }

  describe(): string {
    return '';
  }
}

class HasCareerEventsPrerequisite implements ICharacterPrerequisite {
  isPrerequisiteFulfilled(character: Character) {
    return character.hasCareerEvents;
  }
}

class TrackPrerequisite implements ICharacterPrerequisite {
  private track: Track;

  constructor(track: Track) {
    this.track = track;
  }

  isPrerequisiteFulfilled(character: Character) {
    return this.track === character.educationStep?.track;
  }
}

class NotTrackPrerequisite implements ICharacterPrerequisite {
  private track: Track;

  constructor(track: Track) {
    this.track = track;
  }

  isPrerequisiteFulfilled(character: Character) {
    return this.track !== character.educationStep?.track;
  }
  describe(): string {
    return '';
  }
}

class RolesPrerequisite implements ICharacterPrerequisite {
  private roles: Role[];
  private noRoleAllowed: boolean;

  constructor(roles: Role[], noRoleAllowed: boolean = false) {
    this.roles = roles;
    this.noRoleAllowed = noRoleAllowed;
  }

  isPrerequisiteFulfilled(character: Character) {
    if (character.role == null) {
      return this.noRoleAllowed;
    } else {
      return (
        this.roles.indexOf(character.role) > -1 ||
        (character.secondaryRole != null &&
          this.roles.indexOf(character.secondaryRole) >= 0)
      );
    }
  }
}

class NotEraPrerequisite implements ICharacterPrerequisite {
  private era: Era;

  constructor(era: Era) {
    this.era = era;
  }

  isPrerequisiteFulfilled(character: Character) {
    return store.getState().context.era !== this.era;
  }
  describe(): string {
    return '';
  }
}

export class RankModel {
  id: Rank | null;
  name: string;
  level: string;
  prerequisites: ICharacterPrerequisite[];
  abbreviation?: string;

  constructor(
    id: Rank | null,
    name: string,
    level: string,
    prerequisites: ICharacterPrerequisite[],
    abbreviation?: string,
  ) {
    this.id = id;
    this.level = level;
    this.abbreviation = abbreviation;
    this.name = name;
    this.prerequisites = prerequisites;
  }

  get isEnlisted() {
    return (
      this.prerequisites.filter(
        (p) => p instanceof EnlistedCharacterPrerequisite,
      ).length > 0
    );
  }

  get levelValue() {
    if (this.level.length > 1) {
      return Number(this.level.substring(1));
    } else {
      return 0;
    }
  }

  get localizedName() {
    const key = makeKey('Rank.', Rank[this.id], '.name');
    const result = i18next.t(key);
    return key === result ? this.name : result;
  }

  get localizedAbbreviation() {
    const key = makeKey('Rank.', Rank[this.id], '.abbrev');
    const result = i18next.t(key);
    return key === result ? this.abbreviation : result;
  }
}

export class RanksHelper {
  private static singleton: RanksHelper;

  static instance(): RanksHelper {
    if (RanksHelper.singleton == null) {
      RanksHelper.singleton = new RanksHelper();
    }
    return RanksHelper.singleton;
  }

  private ranks: RankModel[] = [
    new RankModel(
      Rank.Captain,
      'Captain',
      'O6',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new NotRolesCharacterPrerequisite([Role.Admiral]),
        new AnyOfCharacterPrerequisite(
          new CharacterTypePrerequisite(
            CharacterType.Starfleet,
            CharacterType.KlingonWarrior,
          ),
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.AndorianImperialGuard,
            AlliedMilitaryType.TalarianMilitia,
          ),
        ),
      ],
      'Capt.',
    ),
    new RankModel(
      Rank.Commander,
      'Commander',
      'O5',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new NotRolesCharacterPrerequisite([Role.Admiral]),
        new NotCharacterPrerequisite(
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.Maco,
            AlliedMilitaryType.CardassianUnion,
            AlliedMilitaryType.FerengiMilitary,
          ),
        ),
      ],
      'Cmdr.',
    ),
    new RankModel(
      Rank.LtCommander,
      'Lieutenant Commander',
      'O4',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new NotRolesCharacterPrerequisite([
          Role.Admiral,
          Role.CommandingOfficer,
        ]),
        new AnyOfCharacterPrerequisite(
          new CharacterTypePrerequisite(CharacterType.Starfleet),
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.TalarianMilitia,
          ),
        ),
      ],
      'LCdr.',
    ),
    new RankModel(
      Rank.Lieutenant,
      'Lieutenant',
      'O3',
      [
        new OfficerCharacterPrerequisite(),
        new NotRolesCharacterPrerequisite([
          Role.Admiral,
          Role.CommandingOfficer,
        ]),
        new AnyOfCharacterPrerequisite(
          new AllOfCharacterPrerequisite(
            new CharacterTypePrerequisite(CharacterType.Starfleet),
            new CareersCharacterPrerequisite(Career.Experienced),
          ),
          new CharacterTypePrerequisite(CharacterType.KlingonWarrior),
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.KlingonDefenceForce,
            AlliedMilitaryType.RomulanStarEmpire,
            AlliedMilitaryType.AndorianImperialGuard,
            AlliedMilitaryType.VulcanHighCommand,
            AlliedMilitaryType.BajoranMilitia,
            AlliedMilitaryType.TalarianMilitia,
          ),
        ),
      ],
      'Lt.',
    ),
    new RankModel(
      Rank.LieutenantJG,
      'Lieutenant (Junior Grade)',
      'O2',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new NotRolesCharacterPrerequisite([
          Role.Admiral,
          Role.CommandingOfficer,
        ]),
        new AnyOfCharacterPrerequisite(
          new CharacterTypePrerequisite(CharacterType.Starfleet),
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.TalarianMilitia,
          ),
        ),
      ],
      'Lt. (J.G.)',
    ),
    new RankModel(
      Rank.Ensign,
      'Ensign',
      'O1',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new NotRolesCharacterPrerequisite([
          Role.ExecutiveOfficer,
          Role.ChiefMedicalOfficer,
          Role.ChiefOfSecurity,
          Role.ChiefEngineer,
          Role.CommandingOfficer,
        ]),
        new AnyOfCharacterPrerequisite(
          new CharacterTypePrerequisite(
            CharacterType.Starfleet,
            CharacterType.KlingonWarrior,
          ),
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.KlingonDefenceForce,
            AlliedMilitaryType.TalarianMilitia,
          ),
        ),
      ],
      'Ens.',
    ),
    new RankModel(
      Rank.MasterChiefPettyOfficer,
      'Master Chief Petty Officer',
      'E9',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'MCPO',
    ),
    new RankModel(
      Rank.MasterChiefSpecialist,
      'Master Chief Specialist',
      'E9',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'MCSP',
    ),
    new RankModel(
      Rank.SeniorChiefPettyOfficer,
      'Senior Chief Petty Officer',
      'E8',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'SCPO',
    ),
    new RankModel(
      Rank.SeniorChiefSpecialist,
      'Senior Chief Specialist',
      'E8',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'SCSP',
    ),
    new RankModel(
      Rank.ChiefPettyOfficer,
      'Chief Petty Officer',
      'E7',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Chief',
    ),
    new RankModel(
      Rank.ChiefSpecialist,
      'Chief Specialist',
      'E7',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'Chief',
    ),
    new RankModel(
      Rank.PettyOfficer1stClass,
      'Petty Officer 1st Class',
      'E6',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'P.O.',
    ),
    new RankModel(
      Rank.PettyOfficer2ndClass,
      'Petty Officer 2nd Class',
      'E5',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'P.O.',
    ),
    new RankModel(
      Rank.PettyOfficer3rdClass,
      'Petty Officer 3rd Class',
      'E4',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'P.O.',
    ),
    new RankModel(
      Rank.Specialist1stClass,
      'Specialist 1st Class',
      'E3',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'SP',
    ),
    new RankModel(
      Rank.Specialist2ndClass,
      'Specialist 2nd Class',
      'E2',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'SP',
    ),
    new RankModel(
      Rank.Specialist3rdClass,
      'Specialist 3rd Class',
      'E1',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'SP',
    ),
    new RankModel(
      Rank.Yeoman1stClass,
      'Yeoman 1st Class',
      'E2',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'Yeo',
    ),
    new RankModel(
      Rank.Yeoman2ndClass,
      'Yeoman 2nd Class',
      'E2',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'Yeo',
    ),
    new RankModel(
      Rank.Yeoman3rdClass,
      'Yeoman 3rd Class',
      'E2',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
        new SourceCharacterPrerequisite(Source.Core),
      ],
      'Yeo',
    ),
    new RankModel(
      Rank.Crewman1stClass,
      'Crewman 1st Class',
      'E3',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Crew.',
    ),
    new RankModel(
      Rank.Crewman2ndClass,
      'Crewman 2nd Class',
      'E2',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Crew.',
    ),
    new RankModel(
      Rank.Crewman3rdClass,
      'Crewman 3rd Class',
      'E1',
      [
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Crew.',
    ),
    new RankModel(
      Rank.FleetAdmiral,
      'Fleet Admiral',
      'O11',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Veteran),
        new SourceCharacterPrerequisite(Source.CommandDivision),
        new RolesPrerequisite([Role.Admiral]),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Adm.',
    ),
    new RankModel(
      Rank.Admiral,
      'Admiral',
      'O10',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Veteran),
        new SourceCharacterPrerequisite(
          Source.CommandDivision,
          Source.PlayersGuide,
        ),
        new RolesPrerequisite([Role.Admiral]),
        new AnyOfCharacterPrerequisite(
          new CharacterTypePrerequisite(CharacterType.Starfleet),
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.RomulanStarEmpire,
          ),
        ),
      ],
      'Adm.',
    ),
    new RankModel(
      Rank.ViceAdmiral,
      'Vice-Admiral',
      'O9',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Veteran),
        new SourceCharacterPrerequisite(
          Source.CommandDivision,
          Source.PlayersGuide,
        ),
        new RolesPrerequisite([Role.Admiral]),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Adm.',
    ),
    new RankModel(
      Rank.RearAdmiral,
      'Rear Admiral',
      'O8',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new NotEraPrerequisite(Era.NextGeneration),
        new SourceCharacterPrerequisite(
          Source.CommandDivision,
          Source.PlayersGuide,
        ),
        new RolesPrerequisite([Role.Admiral]),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Adm.',
    ),
    new RankModel(
      Rank.RearAdmiralLower,
      'Rear Admiral, Lower Half',
      'O7',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new AnyEraCharacterPrerequisite(
          Era.NextGeneration,
          Era.PicardProdigy,
          Era.Discovery32,
        ),
        new SourceCharacterPrerequisite(
          Source.CommandDivision,
          Source.PlayersGuide,
        ),
        new RolesPrerequisite([Role.Admiral]),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'RAdm.',
    ),
    new RankModel(
      Rank.RearAdmiralUpper,
      'Rear Admiral, Upper Half',
      'O8',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new AnyEraCharacterPrerequisite(
          Era.NextGeneration,
          Era.PicardProdigy,
          Era.Discovery32,
        ),
        new SourceCharacterPrerequisite(
          Source.CommandDivision,
          Source.PlayersGuide,
        ),
        new RolesPrerequisite([Role.Admiral]),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'RAdm',
    ),
    new RankModel(
      Rank.Commodore,
      'Commodore',
      'O7',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Experienced, Career.Veteran),
        new SourceCharacterPrerequisite(
          Source.CommandDivision,
          Source.PlayersGuide,
        ),
        new RolesPrerequisite([Role.CommandingOfficer]),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Comm',
    ),
    new RankModel(
      Rank.FleetCaptain,
      'Fleet Captain',
      'O7',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.CommandDivision),
        new RolesPrerequisite([Role.CommandingOfficer]),
        new CharacterTypePrerequisite(CharacterType.Starfleet),
      ],
      'Fl. Capt.',
    ),
    new RankModel(Rank.Civilian, 'Civilian', '', [
      new AnyOfCharacterPrerequisite(
        new RolesPrerequisite([Role.DiplomaticAttache]),
        new TrackPrerequisite(Track.Laborer),
      ),
    ]),
    new RankModel(
      Rank.Sergeant,
      "Sergeant (bu')",
      'E5',
      [
        new EnlistedCharacterPrerequisite(),
        new NotTrackPrerequisite(Track.Laborer),
        new KlingonCharacterPrerequisite(),
      ],
      "bu'",
    ),
    new RankModel(
      Rank.Corporal,
      "Corporal (Da')",
      'E4',
      [
        new EnlistedCharacterPrerequisite(),
        new NotTrackPrerequisite(Track.Laborer),
        new KlingonCharacterPrerequisite(),
      ],
      "Da'",
    ),
    new RankModel(
      Rank.Bekk,
      'Bekk (beq)',
      'E1',
      [
        new EnlistedCharacterPrerequisite(),
        new NotTrackPrerequisite(Track.Laborer),
        new KlingonCharacterPrerequisite(),
      ],
      'beq',
    ),
    new RankModel(
      Rank.General,
      'General',
      'O10',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new CareersCharacterPrerequisite(Career.Veteran),
        new AnyOfCharacterPrerequisite(
          new CharacterTypePrerequisite(CharacterType.KlingonWarrior),
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.Maco,
            AlliedMilitaryType.BajoranMilitia,
            AlliedMilitaryType.AndorianImperialGuard,
            AlliedMilitaryType.RomulanStarEmpire,
            AlliedMilitaryType.KlingonDefenceForce,
          ),
        ),
      ],
      'Gen.',
    ),
    new RankModel(
      Rank.LieutenantGeneral,
      'Lieutenant General',
      'O9',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new CareersCharacterPrerequisite(Career.Veteran),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      'Lt.Gen.',
    ),
    new RankModel(
      Rank.MajorGeneral,
      'Major General',
      'O8',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new CareersCharacterPrerequisite(Career.Veteran),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      'Maj.Gen.',
    ),
    new RankModel(
      Rank.Brigadier,
      'Brigadier',
      'O7',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new CareersCharacterPrerequisite(Career.Veteran),
        new KlingonCharacterPrerequisite(),
      ],
      'Brig.',
    ),
    new RankModel(
      Rank.Colonel,
      'Colonel',
      'O6',
      [
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Veteran),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AnyOfCharacterPrerequisite(
          new AlliedMilitaryCharacterPrerequisite(
            AlliedMilitaryType.Maco,
            AlliedMilitaryType.BajoranMilitia,
            AlliedMilitaryType.RomulanStarEmpire,
            AlliedMilitaryType.KlingonDefenceForce,
          ),
          new CharacterTypePrerequisite(CharacterType.KlingonWarrior),
        ),
      ],
      'Col',
    ),
    new RankModel(
      Rank.LieutenantColonel,
      'Lieutenant Colonel',
      'O5',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      'Lt.Col.',
    ),
    new RankModel(
      Rank.Major,
      'Major',
      'O4',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.Maco,
          AlliedMilitaryType.BajoranMilitia,
          AlliedMilitaryType.RomulanStarEmpire,
          AlliedMilitaryType.VulcanHighCommand,
        ),
      ],
      'Maj.',
    ),
    new RankModel(
      Rank.Captain,
      'Captain',
      'O3',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.Maco,
          AlliedMilitaryType.BajoranMilitia,
        ),
      ],
      'Capt.',
    ),
    new RankModel(
      Rank.Lieutenant,
      'Lieutenant',
      'O2',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.BajoranMilitia,
        ),
      ],
      'Lt.',
    ),
    new RankModel(
      Rank.FirstLieutenant,
      'First Lieutenant',
      'O2',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      '1st.Lt.',
    ),
    new RankModel(
      Rank.SecondLieutenant,
      'Second Lieutenant',
      'O1',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      '2nd.Lt.',
    ),
    new RankModel(
      Rank.MasterSergeant,
      'Master Sergeant',
      'E8',
      [
        new EnlistedCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      'Sgt.',
    ),
    new RankModel(
      Rank.Sergeant,
      'Sergeant',
      'E5',
      [
        new EnlistedCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      'Sgt.',
    ),
    new RankModel(
      Rank.Corporal,
      'Corporal',
      'E4',
      [
        new EnlistedCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      'Cpl.',
    ),
    new RankModel(
      Rank.Private,
      'Private',
      'E1',
      [
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new EnlistedCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.Maco),
      ],
      'Pvt.',
    ),

    // Cardassian Ranks
    new RankModel(Rank.GrandGul, 'Grand Gul', 'O10', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new CareersCharacterPrerequisite(Career.Veteran),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),
    new RankModel(Rank.Legate, 'Legate', 'O8', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new CareersCharacterPrerequisite(Career.Veteran),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),
    new RankModel(Rank.Jagul, 'Jagul', 'O6', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),
    new RankModel(
      Rank.Gul,
      'Gul',
      'O5',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.CardassianUnion,
        ),
      ],
      'Gul',
    ),
    new RankModel(Rank.Dal, 'Dal', 'O4', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),
    new RankModel(Rank.Dalin, 'Dalin', 'O3', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),
    new RankModel(Rank.Glinn, 'Glinn', 'O2', [
      new OfficerCharacterPrerequisite(),
      new CareersCharacterPrerequisite(Career.Young, Career.Experienced),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),
    new RankModel(Rank.Gil, 'Gil', 'O1', [
      new OfficerCharacterPrerequisite(),
      new CareersCharacterPrerequisite(Career.Young),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),
    new RankModel(Rank.Garresh, 'Garresh', 'E2', [
      new EnlistedCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),
    new RankModel(Rank.Garresh, 'Gorr', 'E1', [
      new EnlistedCharacterPrerequisite(),
      new CareersCharacterPrerequisite(Career.Young),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.CardassianUnion,
      ),
    ]),

    new RankModel(Rank.Trooper, 'Trooper', 'E1', [
      new EnlistedCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.AndorianImperialGuard,
      ),
    ]),

    // Romulan Star Empire
    new RankModel(Rank.SubCommander, 'Sub-Commander', 'O4', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.RomulanStarEmpire,
        AlliedMilitaryType.VulcanHighCommand,
      ),
    ]),
    new RankModel(Rank.SubLieutenant, 'Sub-Lieutenant', 'O2', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.RomulanStarEmpire,
        AlliedMilitaryType.VulcanHighCommand,
      ),
    ]),
    new RankModel(
      Rank.Centurion, // Junior officer
      'Centurion',
      'O1',
      [
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new OfficerCharacterPrerequisite(),
        new CareersCharacterPrerequisite(Career.Young),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.RomulanStarEmpire,
        ),
      ],
    ),
    new RankModel(
      Rank.Centurion, // Enlisted
      'Centurion',
      'E4',
      [
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new EnlistedCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.RomulanStarEmpire,
        ),
      ],
    ),
    new RankModel(Rank.Uhlan, 'Uhlan', 'E1', [
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new CareersCharacterPrerequisite(Career.Young),
      new EnlistedCharacterPrerequisite(),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.RomulanStarEmpire,
      ),
    ]),

    // Vulcan High Command
    new RankModel(Rank.Administrator, 'Administrator', 'O10', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new CareersCharacterPrerequisite(Career.Veteran),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.VulcanHighCommand,
      ),
    ]),
    new RankModel(Rank.FleetCommander, 'Fleet Commander', 'O6', [
      new OfficerCharacterPrerequisite(),
      new SourceCharacterPrerequisite(Source.PlayersGuide),
      new CareersCharacterPrerequisite(Career.Veteran),
      new AlliedMilitaryCharacterPrerequisite(
        AlliedMilitaryType.VulcanHighCommand,
      ),
    ]),

    // Cadets
    new RankModel(
      Rank.CadetFirstClass, // fourth-year cadet
      'Cadet, first class',
      'C4',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new CharacterTypePrerequisite(CharacterType.Cadet),
        new HasCareerEventsPrerequisite(),
      ],
      'Cdt.',
    ),
    new RankModel(
      Rank.CadetSecondClass, // third-year cadet
      'Cadet, second class',
      'C3',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new CharacterTypePrerequisite(CharacterType.Cadet),
        new HasCareerEventsPrerequisite(),
      ],
      'Cdt.',
    ),
    new RankModel(
      Rank.CadetThirdClass, // second-year cadet
      'Cadet, third class',
      'C2',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new CharacterTypePrerequisite(CharacterType.Cadet),
        new NoCareerEventsPrerequisite(),
      ],
      'Cdt.',
    ),
    new RankModel(
      Rank.CadetFourthClass, // first year cadet
      'Cadet, fourth class',
      'C1',
      [
        new OfficerCharacterPrerequisite(),
        new SourceCharacterPrerequisite(Source.PlayersGuide),
        new CharacterTypePrerequisite(CharacterType.Cadet),
        new NoCareerEventsPrerequisite(),
      ],
      'Cdt.',
    ),

    new RankModel(
      Rank.Menial,
      'Menial',
      'O1',
      [new OfficerCharacterPrerequisite(), new FerengiPrerequisite()],
      'DaiMon',
    ),
    new RankModel(
      Rank.Associate,
      'Associate',
      'O2',
      [new OfficerCharacterPrerequisite(), new FerengiPrerequisite()],
      'DaiMon',
    ),
    new RankModel(
      Rank.Salesman,
      'Salesman',
      'O3',
      [new OfficerCharacterPrerequisite(), new FerengiPrerequisite()],
      'DaiMon',
    ),
    new RankModel(
      Rank.DaiMon,
      'DaiMon',
      'O5',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.FerengiMilitary,
        ),
      ],
      'DaiMon',
    ),
    new RankModel(
      Rank.Adhar,
      'Adhar',
      'O5',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.SonACommand),
      ],
      'Adhar',
    ),
    new RankModel(
      Rank.Adhar,
      'Subadhar',
      'O4',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(AlliedMilitaryType.SonACommand),
      ],
      'Subadhar',
    ),
    new RankModel(
      Rank.LorAA,
      'Lor-AA',
      'O5',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.TzenkethiCoalition,
        ),
      ],
      'Lor-AA',
    ),
    new RankModel(
      Rank.LorBB,
      'Lor-BB',
      'O4',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.TzenkethiCoalition,
        ),
      ],
      'Lor-BB',
    ),
    new RankModel(
      Rank.LorC,
      'Lor-C',
      'O3',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.TzenkethiCoalition,
        ),
      ],
      'Lor-C',
    ),
    new RankModel(
      Rank.Thot,
      'Thot',
      'O8',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.BreenConfederacy,
        ),
      ],
      'Thot',
    ),
    new RankModel(
      Rank.Chot,
      'Chot',
      'O5',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.BreenConfederacy,
        ),
      ],
      'Chot',
    ),
    new RankModel(
      Rank.VelSh,
      "Vel'sh",
      'O4',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.BreenConfederacy,
        ),
      ],
      "Vel'sh",
    ),
    new RankModel(
      Rank.OkChed,
      "Ok'ched",
      'O3',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.BreenConfederacy,
        ),
      ],
      "Ok'ched",
    ),
    new RankModel(
      Rank.HRen,
      "H'ren",
      'O1',
      [
        new OfficerCharacterPrerequisite(),
        new AlliedMilitaryCharacterPrerequisite(
          AlliedMilitaryType.BreenConfederacy,
        ),
      ],
      "H'ren",
    ),
  ];

  getRanks(character: Character, ignorePrerequisites?: boolean) {
    return !ignorePrerequisites
      ? this.ranks.filter((r) =>
          r.prerequisites.every((p) => p.isPrerequisiteFulfilled(character)),
        )
      : [...this.ranks];
  }

  getRanksByType(type: CharacterType, version: number) {
    let ranks = [];
    switch (type) {
      case CharacterType.Starfleet:
        ranks = [
          Rank.FleetAdmiral,
          Rank.Admiral,
          Rank.ViceAdmiral,
          Rank.RearAdmiral,
          Rank.Commodore,
          Rank.Captain,
          Rank.Commander,
          Rank.LtCommander,
          Rank.Lieutenant,
          Rank.LieutenantJG,
          Rank.Ensign,
          Rank.MasterChiefPettyOfficer,
          Rank.SeniorChiefPettyOfficer,
          Rank.ChiefPettyOfficer,
          Rank.PettyOfficer1stClass,
          Rank.PettyOfficer2ndClass,
          Rank.PettyOfficer3rdClass,
          Rank.Crewman1stClass,
          Rank.Crewman2ndClass,
          Rank.Crewman3rdClass,
          Rank.CadetFirstClass,
          Rank.CadetSecondClass,
          Rank.CadetThirdClass,
          Rank.CadetFourthClass,
        ];
        break;
      case CharacterType.KlingonWarrior:
        ranks = [
          Rank.General,
          Rank.Brigadier,
          Rank.Colonel,
          Rank.Captain,
          Rank.Commander,
          Rank.Lieutenant,
          Rank.Ensign,
          Rank.Sergeant,
          Rank.Corporal,
          Rank.Bekk,
        ];
        break;
      case CharacterType.Romulan:
        ranks = [
          Rank.General,
          Rank.Admiral,
          Rank.Colonel,
          Rank.Commander,
          Rank.Major,
          Rank.SubCommander,
          Rank.SubLieutenant,
          Rank.Centurion,
          Rank.Uhlan,
        ];
        break;
      case CharacterType.Cardassian:
        ranks = [
          Rank.GrandGul,
          Rank.Legate,
          Rank.Jagul,
          Rank.Gul,
          Rank.Dal,
          Rank.Dalin,
          Rank.Glinn,
          Rank.Gil,
          Rank.Garresh,
          Rank.Gorr,
        ];
        break;
      case CharacterType.Ferengi:
        ranks = [Rank.Menial, Rank.Associate, Rank.Salesman, Rank.DaiMon];
        break;
      case CharacterType.Cadet:
        ranks = [
          Rank.CadetFirstClass,
          Rank.CadetSecondClass,
          Rank.CadetThirdClass,
          Rank.CadetFourthClass,
        ];
        break;
      default:
        break;
    }
    return ranks.map((r) => this.getRank(r));
  }

  getPromotionRanks(character: Character) {
    if (character.rank) {
      let ranks = this.getRanksByType(character.type, character.version);

      let currentRank = ranks.filter((r) => r.id === character.rank?.id);
      if (currentRank.length === 0) {
        currentRank = [this.getRank(character.rank?.id)];
      }

      if (isCadetRank(character.rank?.id)) {
        ranks = ranks
          .filter((r) => isCadetRank(r.id))
          .filter((r) => r.levelValue > currentRank[0].levelValue);
        return ranks.reverse();
      } else {
        ranks = ranks
          .filter((r) => !isCadetRank(r.id))
          .filter(
            (r) =>
              (isEnlistedRank(character.rank?.id) && isEnlistedRank(r.id)) ||
              (!isEnlistedRank(character.rank?.id) && !isEnlistedRank(r.id)),
          )
          .filter((r) => r.levelValue > currentRank[0].levelValue);
        return ranks.reverse();
      }
    } else {
      return [];
    }
  }

  getDemotionRanks(character: Character) {
    if (character.rank) {
      let ranks = this.getRanksByType(character.type, character.version);

      let currentRank = ranks.filter((r) => r.id === character.rank?.id);
      if (currentRank.length === 0) {
        currentRank = [this.getRank(character.rank?.id)];
      }

      if (isCadetRank(character.rank?.id)) {
        ranks = ranks
          .filter((r) => isCadetRank(r.id))
          .filter((r) => r.levelValue < currentRank[0].levelValue);
        return ranks.reverse();
      } else {
        ranks = ranks
          .filter((r) => !isCadetRank(r.id))
          .filter(
            (r) =>
              (isEnlistedRank(character.rank?.id) && isEnlistedRank(r.id)) ||
              !isEnlistedRank(character.rank?.id),
          )
          .filter(
            (r) =>
              r.levelValue < currentRank[0].levelValue ||
              (!isEnlistedRank(character.rank?.id) && isEnlistedRank(r.id)),
          );
        return ranks.reverse();
      }
    } else {
      return [];
    }
  }

  getSortedRanks(character: Character, ignorePrerequisites?: boolean) {
    const result = this.getRanks(character, ignorePrerequisites);

    result.sort((r1, r2) => {
      return r2.levelValue - r1.levelValue;
    });

    return result;
  }

  getRank(rank: Rank) {
    const ranks = this.ranks.filter((r) => r.id === rank);
    return ranks?.length ? ranks[0] : null;
  }

  getRankByName(name: string) {
    for (const rank in this.ranks) {
      const r = this.ranks[rank];
      if (r.name === name) {
        return r;
      }
    }

    return null;
  }

  getRankByRankName(name: string): Rank | undefined {
    for (const rank in this.ranks) {
      const r = this.ranks[rank];
      if (Rank[r.id] === name) {
        return r.id;
      }
    }

    return undefined;
  }

  getAdmiralRanks() {
    return [
      this.getRank(Rank.Admiral),
      this.getRank(Rank.ViceAdmiral),
      this.getRank(Rank.RearAdmiral),
    ];
  }

  isAdmiralty(rankIndicator: Rank) {
    switch (rankIndicator) {
      case Rank.Admiral:
      case Rank.ViceAdmiral:
      case Rank.RearAdmiral:
      case Rank.Commodore:
        return true;
      default:
        return false;
    }
  }
}

export const getNameAndShortRankOf = (character: Character) => {
  if (character.rank) {
    const rank =
      character.rank.id != null
        ? RanksHelper.instance().getRank(character.rank.id)
        : RanksHelper.instance().getRankByName(character.rank?.name);
    const abbreviation =
      rank && rank.localizedAbbreviation ? rank.localizedAbbreviation : '';
    return abbreviation + ' ' + character.name;
  } else {
    return character.name;
  }
};
