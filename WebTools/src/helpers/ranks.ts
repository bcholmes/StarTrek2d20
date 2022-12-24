import {Career} from './careers';
import {Role, RolesHelper} from './roles';
import {Era} from './eras';
import {Source} from './sources';
import {Track} from './trackEnum';
import {AlliedMilitaryDetails, character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { AlliedMilitaryType } from './alliedMilitary';
import { AllOfPrerequisite, AnyOfPrerequisite, CharacterTypePrerequisite, EnlistedPrerequisite, EraPrerequisite, IPrerequisite, NotPrerequisite, SourcePrerequisite, TypePrerequisite } from './prerequisite';
import store from '../state/store';

export enum Rank {
    // Core
    Captain,
    Commander,
    LieutenantCommander,
    Lieutenant,
    LieutenantJunior,
    Ensign,
    MasterChiefPettyOfficer,
    MasterChiefSpecialist,
    SeniorChiefPettyOfficer,
    SeniorChiefSpecialist,
    ChiefPettyOfficer,
    ChiefSpecialist,
    PettyOfficer,
    Specialist,
    Yeoman,
    Crewman,

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
    Glinn,
    Gil,
    Garresh,

    Trooper,

    Administrator,
    FleetCommander,

    CadetFourthClass,
    CadetThirdClass,
    CadetSecondClass,
    CadetFirstClass,
}


class AlliedMilitaryPrerequisite implements IPrerequisite {

    private types: AlliedMilitaryType[];

    constructor(...alliedMilitary: AlliedMilitaryType[]) {
        this.types = alliedMilitary;
    }

    isPrerequisiteFulfilled() {
        return character.type === CharacterType.AlliedMilitary
            && character.typeDetails
            &&  this.types.indexOf((character.typeDetails as AlliedMilitaryDetails).alliedMilitary.type) >= 0;
    }
}


class OfficerPrerequisite implements IPrerequisite {
    isPrerequisiteFulfilled() {
        return !character.enlisted;
    }
}

class CareersPrerequisite implements IPrerequisite {
    private _careers: Career[];

    constructor(careers: Career[]) {
        this._careers = careers;
    }

    isPrerequisiteFulfilled() {
        return this._careers.indexOf(character.career) > -1;
    }
}

class NoCareerEventsPrerequisite implements IPrerequisite {

    isPrerequisiteFulfilled() {
        return character.careerEvents == null ||  character.careerEvents.length === 0;
    }
}

class HasCareerEventsPrerequisite implements IPrerequisite {

    isPrerequisiteFulfilled() {
        return character.careerEvents != null && character.careerEvents.length > 0;
    }
}


class TrackPrerequisite implements IPrerequisite {
    private _track: Track;

    constructor(track: Track) {
        this._track = track;
    }

    isPrerequisiteFulfilled() {
        return this._track === character.track;
    }
}

class NotTrackPrerequisite implements IPrerequisite {
    private _track: Track;

    constructor(track: Track) {
        this._track = track;
    }

    isPrerequisiteFulfilled() {
        return this._track !== character.track;
    }
}

class RolesPrerequisite implements IPrerequisite {
    private _roles: Role[];

    constructor(roles: Role[]) {
        this._roles = roles;
    }

    isPrerequisiteFulfilled() {
        const role = RolesHelper.getRoleByName(character.role);
        return this._roles.indexOf(role) > -1;
    }
}

class NotRolesPrerequisite implements IPrerequisite {
    private _roles: Role[];

    constructor(roles: Role[]) {
        this._roles = roles;
    }

    isPrerequisiteFulfilled() {
        const role = RolesHelper.getRoleByName(character.role);
        return this._roles.indexOf(role) === -1;
    }
}

class NotEraPrerequisite implements IPrerequisite {
    private _era: Era;

    constructor(era: Era) {
        this._era = era;
    }

    isPrerequisiteFulfilled() {
        return store.getState().context.era !== this._era;
    }
}

class RankModel {
    id: Rank;
    name: string;
    prerequisites: IPrerequisite[];
    tiers: number;
    abbreviation?: string;

    constructor(id: Rank, name: string, prerequisites: IPrerequisite[], abbreviation?: string, tiers: number = 1) {
        this.id = id;
        this.abbreviation = abbreviation;
        this.name = name;
        this.prerequisites = prerequisites;
        this.tiers = tiers;
    }
}

class Ranks {
    private _ranks: RankModel[] = [
        new RankModel(
            Rank.Captain,
            "Captain",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new RolesPrerequisite([Role.CommandingOfficer, Role.Adjutant])
            ],
            "Capt.",
            1),
        new RankModel(
            Rank.Commander,
            "Commander",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new NotRolesPrerequisite([Role.Admiral]),
                new NotPrerequisite(new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO, AlliedMilitaryType.CARDASSIAN_UNION))
            ],
            "Cmdr.",
            1),
        new RankModel(
            Rank.LieutenantCommander,
            "Lieutenant Commander",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new NotRolesPrerequisite([Role.Admiral, Role.CommandingOfficer]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "LCdr.",
            1),
        new RankModel(
            Rank.Lieutenant,
            "Lieutenant",
            [
                new OfficerPrerequisite(),
                new NotRolesPrerequisite([Role.Admiral, Role.CommandingOfficer]),
                new AnyOfPrerequisite(
                    new AllOfPrerequisite(
                        new TypePrerequisite(CharacterType.Starfleet),
                        new CareersPrerequisite([Career.Experienced])
                    ),
                    new TypePrerequisite(CharacterType.KlingonWarrior),
                    new AlliedMilitaryPrerequisite(AlliedMilitaryType.KLINGON_DEFENCE_FORCE, AlliedMilitaryType.ROMULAN_STAR_EMPIRE,
                        AlliedMilitaryType.ANDORIAN_IMPERIAL_GUARD, AlliedMilitaryType.VULCAN_HIGH_COMMAND, AlliedMilitaryType.BAJORAN_MILITIA)),
            ],
            "Lt."),
        new RankModel(
            Rank.LieutenantJunior,
            "Lieutenant (Junior Grade)",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new NotRolesPrerequisite([Role.Admiral, Role.CommandingOfficer]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Lt. (J.G.)",
            1),
        new RankModel(
            Rank.Ensign,
            "Ensign",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new RolesPrerequisite([Role.CommunicationsOfficer, Role.FlightController, Role.OperationsManager, Role.ScienceOfficer, Role.ShipsCounselor, Role.WeaponsOfficer]),
                new AnyOfPrerequisite(new TypePrerequisite(CharacterType.Starfleet, CharacterType.KlingonWarrior),
                    new AlliedMilitaryPrerequisite(AlliedMilitaryType.KLINGON_DEFENCE_FORCE)),
            ],
            "Ens.",
            1),
        new RankModel(
            Rank.MasterChiefPettyOfficer,
            "Master Chief Petty Officer",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "MCPO",
            1),
        new RankModel(
            Rank.MasterChiefSpecialist,
            "Master Chief Specialist",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "MCSP",
            1),
        new RankModel(
            Rank.SeniorChiefPettyOfficer,
            "Senior Chief Petty Officer",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "SCPO",
            1),
        new RankModel(
            Rank.SeniorChiefSpecialist,
            "Senior Chief Specialist",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "SCSP",
            1),
        new RankModel(
            Rank.ChiefPettyOfficer,
            "Chief Petty Officer",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Chief",
            1),
        new RankModel(
            Rank.ChiefSpecialist,
            "Chief Specialist",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Chief",
            1),
        new RankModel(
            Rank.PettyOfficer,
            "Petty Officer",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "P.O.",
            3),
        new RankModel(
            Rank.Specialist,
            "Specialist",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "SP",
            3),
        new RankModel(
            Rank.Yeoman,
            "Yeoman",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Yeo",
            3),
        new RankModel(
            Rank.Crewman,
            "Crewman",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Crew.",
            3),
        new RankModel(
            Rank.RearAdmiral,
            "Rear Admiral",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new NotEraPrerequisite(Era.NextGeneration),
                new SourcePrerequisite(Source.CommandDivision, Source.PlayersGuide),
                new RolesPrerequisite([Role.Admiral]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Adm.",
            1),
        new RankModel(
            Rank.RearAdmiralLower,
            "Rear Admiral, Lower Half",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new EraPrerequisite(Era.NextGeneration),
                new SourcePrerequisite(Source.CommandDivision, Source.PlayersGuide),
                new RolesPrerequisite([Role.Admiral]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Adm.",
            1),
        new RankModel(
            Rank.RearAdmiral,
            "Rear Admiral, Upper Half",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new EraPrerequisite(Era.NextGeneration),
                new SourcePrerequisite(Source.CommandDivision, Source.PlayersGuide),
                new RolesPrerequisite([Role.Admiral]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Adm",
            1),
        new RankModel(
            Rank.ViceAdmiral,
            "Vice-Admiral",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new SourcePrerequisite(Source.CommandDivision, Source.PlayersGuide),
                new RolesPrerequisite([Role.Admiral]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Adm",
            1),
        new RankModel(
            Rank.ViceAdmiral,
            "Admiral",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new SourcePrerequisite(Source.CommandDivision, Source.PlayersGuide),
                new RolesPrerequisite([Role.Admiral]),
                new AnyOfPrerequisite(
                    new TypePrerequisite(CharacterType.Starfleet),
                    new AlliedMilitaryPrerequisite(AlliedMilitaryType.ROMULAN_STAR_EMPIRE)
                )
            ],
            "Adm",
            1),
        new RankModel(
            Rank.ViceAdmiral,
            "Fleet Admiral",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.Admiral]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Adm",
            1),
        new RankModel(
            Rank.Commodore,
            "Commodore",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new SourcePrerequisite(Source.CommandDivision, Source.PlayersGuide),
                new RolesPrerequisite([Role.CommandingOfficer]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Comm",
            1),
        new RankModel(
            Rank.FleetCaptain,
            "Fleet Captain",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.CommandingOfficer]),
                new TypePrerequisite(CharacterType.Starfleet)
            ],
            "Fl. Capt.",
            1),
        new RankModel(
            Rank.Civilian,
            "Civilian",
            [
                new AnyOfPrerequisite(new RolesPrerequisite([Role.DiplomaticAttache]), new TrackPrerequisite(Track.Laborer))
            ]),
        new RankModel(
            Rank.Sergeant,
            "Sergeant (bu')",
            [
                new EnlistedPrerequisite(),
                new NotTrackPrerequisite(Track.Laborer),
                new TypePrerequisite(CharacterType.KlingonWarrior)
            ],
            "bu'"),
        new RankModel(
            Rank.Corporal,
            "Corporal (Da')",
            [
                new EnlistedPrerequisite(),
                new NotTrackPrerequisite(Track.Laborer),
                new TypePrerequisite(CharacterType.KlingonWarrior)
            ],
            "Da'"),
        new RankModel(
            Rank.Bekk,
            "Bekk (beq)",
            [
                new EnlistedPrerequisite(),
                new NotTrackPrerequisite(Track.Laborer),
                new TypePrerequisite(CharacterType.KlingonWarrior)
            ],
            "beq"),
        new RankModel(
            Rank.General,
            "General",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Veteran]),
                new AnyOfPrerequisite(
                    new TypePrerequisite(CharacterType.KlingonWarrior),
                    new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO, AlliedMilitaryType.BAJORAN_MILITIA,
                        AlliedMilitaryType.ANDORIAN_IMPERIAL_GUARD,
                        AlliedMilitaryType.ROMULAN_STAR_EMPIRE,
                        AlliedMilitaryType.KLINGON_DEFENCE_FORCE)
                )
            ],
            "Gen."),
        new RankModel(
            Rank.LieutenantGeneral,
            "Lieutenant General",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Veteran]),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "Lt.Gen."),
        new RankModel(
            Rank.MajorGeneral,
            "Major General",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Veteran]),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "Maj.Gen."),
        new RankModel(
            Rank.Brigadier,
            "Brigadier",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Veteran]),
                new AnyOfPrerequisite(
                    new TypePrerequisite(CharacterType.KlingonWarrior),
                    new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO, AlliedMilitaryType.KLINGON_DEFENCE_FORCE)
                )
            ],
            "Brig."),
        new RankModel(
            Rank.Colonel,
            "Colonel",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AnyOfPrerequisite(
                    new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO, AlliedMilitaryType.BAJORAN_MILITIA,
                        AlliedMilitaryType.ROMULAN_STAR_EMPIRE, AlliedMilitaryType.KLINGON_DEFENCE_FORCE),
                    new TypePrerequisite(CharacterType.KlingonWarrior)
                )
            ],
            "Col"),
        new RankModel(
            Rank.LieutenantColonel,
            "Lieutenant Colonel",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "Lt.Col."),
        new RankModel(
            Rank.Major,
            "Major",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO, AlliedMilitaryType.BAJORAN_MILITIA,
                    AlliedMilitaryType.ROMULAN_STAR_EMPIRE, AlliedMilitaryType.VULCAN_HIGH_COMMAND)
            ],
            "Maj."),
        new RankModel(
            Rank.Captain,
            "Captain",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO, AlliedMilitaryType.BAJORAN_MILITIA)
            ],
            "Capt."),
        new RankModel(
            Rank.Lieutenant,
            "Lieutenant",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.BAJORAN_MILITIA)
            ],
            "Lt."),
        new RankModel(
            Rank.FirstLieutenant,
            "First Lieutenant",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "1st.Lt."),
        new RankModel(
            Rank.SecondLieutenant,
            "Second Lieutenant",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "2nd.Lt."),
        new RankModel(
            Rank.MasterSergeant,
            "Master Sergeant",
            [
                new EnlistedPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "Sgt."),
        new RankModel(
            Rank.Sergeant,
            "Sergeant",
            [
                new EnlistedPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "Sgt."),
        new RankModel(
            Rank.Corporal,
            "Corporal",
            [
                new EnlistedPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "Cpl."),
        new RankModel(
            Rank.Private,
            "Private",
            [
                new SourcePrerequisite(Source.PlayersGuide),
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young]),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.MACO)
            ],
            "Pvt."),

        // Cardassian Ranks
        new RankModel(
            Rank.GrandGul,
            "Grand Gul",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Veteran]),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ]),
        new RankModel(
            Rank.Legate,
            "Legate",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Veteran]),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ]),
        new RankModel(
            Rank.Jagul,
            "Jagul",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ]),
        new RankModel(
            Rank.Gul,
            "Gul",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ],
            "Gul"),
        new RankModel(
            Rank.Dal,
            "Dal / Dalin",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ]),
        new RankModel(
            Rank.Glinn,
            "Glinn / Gil",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ]),
        new RankModel(
            Rank.Gil,
            "Gil",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Young]),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ]),
        new RankModel(
            Rank.Gil,
            "Gil",
            [
                new EnlistedPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ]),
        new RankModel(
            Rank.Garresh,
            "Garresh / Gorr",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young]),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.CARDASSIAN_UNION)
            ]),

        new RankModel(
            Rank.Trooper,
            "Trooper",
            [
                new EnlistedPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.ANDORIAN_IMPERIAL_GUARD)
            ]),

        // Romulan Star Empire
        new RankModel(
            Rank.SubCommander,
            "Sub-Commander",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.ROMULAN_STAR_EMPIRE, AlliedMilitaryType.VULCAN_HIGH_COMMAND)
            ]),
        new RankModel(
            Rank.SubLieutenant,
            "Sub-Lieutenant",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.ROMULAN_STAR_EMPIRE, AlliedMilitaryType.VULCAN_HIGH_COMMAND)
            ]),
        new RankModel(
            Rank.Centurion, // Junior officer
            "Centurion",
            [
                new SourcePrerequisite(Source.PlayersGuide),
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Young]),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.ROMULAN_STAR_EMPIRE)
            ]),
        new RankModel(
            Rank.Centurion, // Enlisted
            "Centurion",
            [
                new SourcePrerequisite(Source.PlayersGuide),
                new EnlistedPrerequisite(),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.ROMULAN_STAR_EMPIRE)
            ]),
        new RankModel(
            Rank.Uhlan,
            "Uhlan",
            [
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Young]),
                new EnlistedPrerequisite(),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.ROMULAN_STAR_EMPIRE)
            ]),

        // Vulcan High Command
        new RankModel(
            Rank.Administrator,
            "Administrator",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Veteran]),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.VULCAN_HIGH_COMMAND)
            ]),
        new RankModel(
            Rank.FleetCommander,
            "Fleet Commander",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CareersPrerequisite([Career.Veteran]),
                new AlliedMilitaryPrerequisite(AlliedMilitaryType.VULCAN_HIGH_COMMAND)
            ]),


        // Cadets
        new RankModel(
            Rank.CadetFourthClass,  // first year cadet
            "Cadet, fourth class",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CharacterTypePrerequisite(CharacterType.Cadet),
                new NoCareerEventsPrerequisite(),
            ],
            "Cdt."),
        new RankModel(
            Rank.CadetThirdClass, // second-year cadet
            "Cadet, third class",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CharacterTypePrerequisite(CharacterType.Cadet),
                new NoCareerEventsPrerequisite(),
            ],
            "Cdt."),
        new RankModel(
            Rank.CadetSecondClass, // third-year cadet
            "Cadet, second class",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CharacterTypePrerequisite(CharacterType.Cadet),
                new HasCareerEventsPrerequisite(),
            ],
            "Cdt."),
        new RankModel(
            Rank.CadetFirstClass, // fourth-year cadet
            "Cadet, first class",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.PlayersGuide),
                new CharacterTypePrerequisite(CharacterType.Cadet),
                new HasCareerEventsPrerequisite(),
            ],
            "Cdt."),
        ];

    getRanks(ignorePrerequisites?: boolean) {
        let ranks: RankModel[] = [];

        for (let rank in this._ranks) {
            let r = this._ranks[rank];
            let valid = true;

            if (ignorePrerequisites === undefined || ignorePrerequisites === false) {
                r.prerequisites.forEach(req => {
                    if (!req.isPrerequisiteFulfilled()) {
                        valid = false;
                    }
                });
            }

            if (valid) {
                ranks.push(r);
            }
        }
        return ranks;
    }

    getRank(rank: Rank) {
        let ranks = this._ranks.filter(r => r.id === rank);
        return ranks?.length ? ranks[0] : null;
    }

    getRankByName(name: string) {
        for (const rank in this._ranks) {
            const r = this._ranks[rank];
            if (r.name === name) {
                return r;
            }
            if (r.tiers > 1) {
                for (let i = 1; i <= r.tiers; i++) {
                    let tieredName = r.name + " " + this.tierToString(i) + " Class";
                    if (tieredName === name) {
                        return r;
                    }
                    tieredName = r.name + " " + this.tierToString(i) + " class";
                    if (tieredName === name) {
                        return r;
                    }
                }
            }
        }

        return null;
    }

    applyRank(rank: Rank, tier: number) {
        const r = this.getRank(rank);
        character.rank = r.name;

        if (r.tiers > 1) {
            character.rank += ` ${this.tierToString(tier)} Class`;
        }
    }

    private tierToString(tier: number) {
        let result = "";

        switch (tier) {
            case 1:
                result = "1st";
                break;
            case 2:
                result = "2nd";
                break;
            case 3:
                result = "3rd";
                break;
        }

        return result;
    }
}

export const RanksHelper = new Ranks();
