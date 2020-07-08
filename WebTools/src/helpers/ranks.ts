import {Career} from './careers';
import {Role, RolesHelper} from './roles';
import {Era} from './eras';
import {Source} from './sources';
import {character} from '../common/character';

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
}

interface IRankPrerequisite {
    isPrerequisiteFulfilled(): boolean;
}

class EnlistedPrerequisite implements IRankPrerequisite {
    isPrerequisiteFulfilled() {
        return character.enlisted;
    }
}

class OfficerPrerequisite implements IRankPrerequisite {
    isPrerequisiteFulfilled() {
        return !character.enlisted;
    }
}

class CareersPrerequisite implements IRankPrerequisite {
    private _careers: Career[];

    constructor(careers: Career[]) {
        this._careers = careers;
    }

    isPrerequisiteFulfilled() {
        return this._careers.indexOf(character.career) > -1;
    }
}

class RolesPrerequisite implements IRankPrerequisite {
    private _roles: Role[];

    constructor(roles: Role[]) {
        this._roles = roles;
    }

    isPrerequisiteFulfilled() {
        const role = RolesHelper.getRoleByName(character.role);
        return this._roles.indexOf(role) > -1;
    }
}

class NotRolesPrerequisite implements IRankPrerequisite {
    private _roles: Role[];

    constructor(roles: Role[]) {
        this._roles = roles;
    }

    isPrerequisiteFulfilled() {
        const role = RolesHelper.getRoleByName(character.role);
        return this._roles.indexOf(role) === -1;
    }
}

class EraPrerequisite implements IRankPrerequisite {
    private _era: Era;

    constructor(era: Era) {
        this._era = era;
    }

    isPrerequisiteFulfilled() {
        return character.era === this._era;
    }
}

class NotEraPrerequisite implements IRankPrerequisite {
    private _era: Era;

    constructor(era: Era) {
        this._era = era;
    }

    isPrerequisiteFulfilled() {
        return character.era !== this._era;
    }
}

class SourcePrerequisite implements IRankPrerequisite {
    private _source: Source;

    constructor(source: Source) {
        this._source = source;
    }

    isPrerequisiteFulfilled() {
        return character.hasSource(this._source);
    }
}

class RankModel {
    name: string;
    prerequisites: IRankPrerequisite[];
    tiers: number;

    constructor(name: string, prerequisites: IRankPrerequisite[], tiers: number) {
        this.name = name;
        this.prerequisites = prerequisites;
        this.tiers = tiers;
    }
}

class RankViewModel extends RankModel {
    id: Rank;

    constructor(id: Rank, base: RankModel) {
        super(base.name, base.prerequisites, base.tiers);
        this.id = id;
    }
}

class Ranks {
    private _ranks: { [id: number]: RankModel } = {
        [Rank.Captain]: new RankModel(
            "Captain",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new RolesPrerequisite([Role.CommandingOfficer, Role.Adjutant])
            ],
            1),
        [Rank.Commander]: new RankModel(
            "Commander",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new NotRolesPrerequisite([Role.Admiral])
            ],
            1),
        [Rank.LieutenantCommander]: new RankModel(
            "Lieutenant Commander",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran]),
                new NotRolesPrerequisite([Role.Admiral, Role.CommandingOfficer])
            ],
            1),
        [Rank.Lieutenant]: new RankModel(
            "Lieutenant",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Experienced]),
                new NotRolesPrerequisite([Role.Admiral, Role.CommandingOfficer])
            ],
            1),
        [Rank.LieutenantJunior]: new RankModel(
            "Lieutenant (Junior Grade)",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new NotRolesPrerequisite([Role.Admiral, Role.CommandingOfficer])
            ],
            1),
        [Rank.Ensign]: new RankModel(
            "Ensign",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced]),
                new RolesPrerequisite([Role.CommunicationsOfficer, Role.FlightController, Role.OperationsManager, Role.ScienceOfficer, Role.ShipsCounselor])
            ],
            1),
        [Rank.MasterChiefPettyOfficer]: new RankModel(
            "Master Chief Petty Officer",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran])
            ],
            1),
        [Rank.MasterChiefSpecialist]: new RankModel(
            "Master Chief Specialist",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran])
            ],
            1),
        [Rank.SeniorChiefPettyOfficer]: new RankModel(
            "Senior Chief Petty Officer",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran])
            ],
            1),
        [Rank.SeniorChiefSpecialist]: new RankModel(
            "Senior Chief Specialist",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran])
            ],
            1),
        [Rank.ChiefPettyOfficer]: new RankModel(
            "Chief Petty Officer",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran])
            ],
            1),
        [Rank.ChiefSpecialist]: new RankModel(
            "Chief Specialist",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Experienced, Career.Veteran])
            ],
            1),
        [Rank.PettyOfficer]: new RankModel(
            "Petty Officer",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced])
            ],
            3),
        [Rank.Specialist]: new RankModel(
            "Specialist",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced])
            ],
            3),
        [Rank.Yeoman]: new RankModel(
            "Yeoman",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced])
            ],
            3),
        [Rank.Crewman]: new RankModel(
            "Crewman",
            [
                new EnlistedPrerequisite(),
                new CareersPrerequisite([Career.Young, Career.Experienced])
            ],
            3),
        [Rank.RearAdmiral]: new RankModel(
            "Rear Admiral",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new NotEraPrerequisite(Era.NextGeneration),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.Admiral])
            ],
            1),
        [Rank.RearAdmiralLower]: new RankModel(
            "Rear Admiral, Lower Half",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new EraPrerequisite(Era.NextGeneration),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.Admiral])
            ],
            1),
        [Rank.RearAdmiral]: new RankModel(
            "Rear Admiral, Upper Half",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new EraPrerequisite(Era.NextGeneration),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.Admiral])
            ],
            1),
        [Rank.ViceAdmiral]: new RankModel(
            "Vice-Admiral",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.Admiral])
            ],
            1),
        [Rank.ViceAdmiral]: new RankModel(
            "Admiral",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.Admiral])
            ],
            1),
        [Rank.ViceAdmiral]: new RankModel(
            "Fleet Admiral",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.Admiral])
            ],
            1),
        [Rank.Commodore]: new RankModel(
            "Commodore",
            [
                new OfficerPrerequisite(),
                new CareersPrerequisite([Career.Veteran]),
                new NotEraPrerequisite(Era.NextGeneration),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.CommandingOfficer])
            ],
            1),
        [Rank.FleetCaptain]: new RankModel(
            "Fleet Captain",
            [
                new OfficerPrerequisite(),
                new SourcePrerequisite(Source.CommandDivision),
                new RolesPrerequisite([Role.CommandingOfficer])
            ],
            1),
        [Rank.Civilian]: new RankModel(
            "Civilian",
            [
                new RolesPrerequisite([Role.DiplomaticAttache])
            ],
            1),
    };

    getRanks(ignorePrerequisites?: boolean) {
        let ranks: RankViewModel[] = [];
        let n = 0;

        for (var rank in this._ranks) {
            var r = this._ranks[rank];
            var valid = true;

            if (ignorePrerequisites === undefined || ignorePrerequisites === false) {
                r.prerequisites.forEach(req => {
                    if (!req.isPrerequisiteFulfilled()) {
                        valid = false;
                    }
                });
            }

            if (valid) {
                ranks.push(new RankViewModel(n, r));
            }

            n++;
        }

        return ranks;
    }

    getRank(rank: Rank) {
        return this._ranks[rank];
    }

    applyRank(rank: Rank, tier: number) {
        const r = this.getRank(rank);
        character.rank = r.name;

        if (r.tiers > 1) {
            character.rank += ` ${this.tierToString(tier)} class`;
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