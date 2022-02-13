import { character } from "../common/character";
import { CharacterType } from "../common/characterType";
import { Career } from "./careers";
import { Era } from "./eras";
import { Source } from "./sources";
import { Track } from "./tracks";

export interface IPrerequisite {
    isPrerequisiteFulfilled(): boolean;
}

export class SourcePrerequisite implements IPrerequisite {
    private sources: Source[];

    constructor(...source: Source[]) {
        this.sources = source;
    }

    isPrerequisiteFulfilled() {
        return character.hasAnySource(this.sources);
    }
}

export class KlingonPrerequisite implements IPrerequisite {

    isPrerequisiteFulfilled() {
        return character.isKlingon();
    }
}

export class CivilianPrerequisite implements IPrerequisite {

    isPrerequisiteFulfilled() {
        if (new SourcePrerequisite(Source.SciencesDivision, Source.PlayersGuide, Source.KlingonCore).isPrerequisiteFulfilled) {
            return character.type === CharacterType.AmbassadorDiplomat || 
                character.type === CharacterType.Civilian ||
                (character.type === CharacterType.Starfleet 
                    && (character.track === Track.UniversityAlumni
                        || character.track === Track.ResearchInternship)) ||
                (character.type === CharacterType.KlingonWarrior 
                    && character.track === Track.Laborer);
        } else {
            return true;
        }
    }
}

export class NotPrerequisite implements IPrerequisite {
    private prereq: IPrerequisite;

    constructor(prereq: IPrerequisite) {
        this.prereq = prereq;
    }
    isPrerequisiteFulfilled(): boolean {
        return !this.prereq.isPrerequisiteFulfilled();
    }
}

export class AnyOfPrerequisite implements IPrerequisite {
    private _prequisites: IPrerequisite[];

    constructor(...prequisites: IPrerequisite[]) {
        this._prequisites = prequisites;
    }

    isPrerequisiteFulfilled() {
        if (this._prequisites.length === 0) {
            return true;
        } else {
            var result = false;
            this._prequisites.forEach(req => {
                result = result || req.isPrerequisiteFulfilled();
            });
            return result;
        }
    }
}

export class CareersPrerequisite implements IPrerequisite {
    private _careers: Career[];

    constructor(...careers: Career[]) {
        this._careers = careers;
    }

    isPrerequisiteFulfilled() {
        return this._careers.indexOf(character.career) > -1;
    }
}

export class EnlistedPrerequisite implements IPrerequisite {
    isPrerequisiteFulfilled() {
        return character.enlisted;
    }
}

export class EraPrerequisite implements IPrerequisite {
    private era: Era;

    constructor(era: Era) {
        this.era = era;
    }

    isPrerequisiteFulfilled() {
        return character.era === this.era;
    }
}

export class TypePrerequisite implements IPrerequisite {
    private types: CharacterType[];

    constructor(...type: CharacterType[]) {
        this.types = type;
    }

    isPrerequisiteFulfilled() {
        return this.types.indexOf(character.type) >= 0;
    }
}

export class AllOfPrerequisite implements IPrerequisite {
    private prequisites: IPrerequisite[];

    constructor(...prequisites: IPrerequisite[]) {
        this.prequisites = prequisites;
    }

    isPrerequisiteFulfilled() {
        if (this.prequisites.length === 0) {
            return true;
        } else {
            var result = true;
            this.prequisites.forEach(req => {
                result = result && req.isPrerequisiteFulfilled();
            });
            return result;
        }
    }
}