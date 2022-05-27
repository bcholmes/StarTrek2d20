import { Character } from "../common/character";
import { CharacterType } from "../common/characterType";
import { hasAnySource } from "../state/contextFunctions";
import store from "../state/store";
import { Career } from "./careers";
import { Era } from "./eras";
import { Source } from "./sources";
import { Track } from "./tracks";

export interface IPrerequisite {
    isPrerequisiteFulfilled(character: Character): boolean;
}

export class SourcePrerequisite implements IPrerequisite {
    private sources: Source[];

    constructor(...source: Source[]) {
        this.sources = source;
    }

    isPrerequisiteFulfilled(character: Character) {
        return hasAnySource(this.sources);
    }
}

export class KlingonPrerequisite implements IPrerequisite {

    isPrerequisiteFulfilled(character: Character) {
        return character.isKlingon();
    }
}

export class CharacterTypePrerequisite implements IPrerequisite {

    private type: CharacterType;

    constructor(type: CharacterType) {
        this.type = type;
    }
    
    isPrerequisiteFulfilled(character: Character) {
        return character.type === this.type;
    }
}


export class CivilianPrerequisite implements IPrerequisite {

    // arguably, a Child character is a Civilian, but the Roles restrict Child
    // characters to only one Role, so there's no point including them.
    isPrerequisiteFulfilled(character: Character) {
        if (new SourcePrerequisite(Source.SciencesDivision, Source.PlayersGuide, Source.KlingonCore).isPrerequisiteFulfilled(character)) {
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
    isPrerequisiteFulfilled(character: Character): boolean {
        return !this.prereq.isPrerequisiteFulfilled(character);
    }
}

export class AnyOfPrerequisite implements IPrerequisite {
    private _prequisites: IPrerequisite[];

    constructor(...prequisites: IPrerequisite[]) {
        this._prequisites = prequisites;
    }

    isPrerequisiteFulfilled(character: Character) {
        if (this._prequisites.length === 0) {
            return true;
        } else {
            var result = false;
            this._prequisites.forEach(req => {
                result = result || req.isPrerequisiteFulfilled(character);
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

    isPrerequisiteFulfilled(character: Character) {
        return this._careers.indexOf(character.career) > -1;
    }
}

export class EnlistedPrerequisite implements IPrerequisite {
    isPrerequisiteFulfilled(character: Character) {
        return character.enlisted;
    }
}

export class EraPrerequisite implements IPrerequisite {
    private eras: Era[];

    constructor(...era: Era[]) {
        this.eras = era;
    }

    isPrerequisiteFulfilled(character: Character) {
        return this.eras.indexOf(store.getState().context.era) >= 0;
    }
}

export class ChildPrerequisite implements IPrerequisite {
    isPrerequisiteFulfilled(character: Character): boolean {
        return character.type === CharacterType.Child || 
            character.age.isChild();
    }
}

export class AdultPrerequisite implements IPrerequisite {
    isPrerequisiteFulfilled(character: Character): boolean {
        return character.age.isAdult();
    }
}

export class TypePrerequisite implements IPrerequisite {
    private types: CharacterType[];

    constructor(...type: CharacterType[]) {
        this.types = type;
    }

    isPrerequisiteFulfilled(character: Character) {
        return this.types.indexOf(character.type) >= 0;
    }
}

export class AllOfPrerequisite implements IPrerequisite {
    private prequisites: IPrerequisite[];

    constructor(...prequisites: IPrerequisite[]) {
        this.prequisites = prequisites;
    }

    isPrerequisiteFulfilled(character: Character) {
        if (this.prequisites.length === 0) {
            return true;
        } else {
            let result = true;
            this.prequisites.forEach(req => {
                result = result && req.isPrerequisiteFulfilled(character);
            });
            return result;
        }
    }
}