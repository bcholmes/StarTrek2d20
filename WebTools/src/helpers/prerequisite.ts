import { Character } from "../common/character";
import { CharacterType } from "../common/characterType";
import { Construct, Stereotype } from "../common/construct";
import { IConstruct } from "../common/iconstruct";
import { Specialization } from "../common/specializationEnum";
import { Starship } from "../common/starship";
import store from "../state/store";
import { Career } from "./careerEnum";
import { Era } from "./eras";
import { Source } from "./sources";
import { Track } from "./trackEnum";


export interface IConstructPrerequisite<T extends IConstruct> {
    isPrerequisiteFulfilled(t: T): boolean;
    describe(): string
}

export interface ICompositePrerequisite<T extends IConstruct> {
    prerequisites: IConstructPrerequisite<T>[];
}

export class CadetPrerequisite implements IConstructPrerequisite<Character> {
    isPrerequisiteFulfilled(character: Character): boolean {
        return character.type === CharacterType.Cadet;
    }
    describe(): string {
        return "";
    }
}

export class OfficerPrerequisite implements IConstructPrerequisite<Character> {
    isPrerequisiteFulfilled(character: Character) {
        return !character.enlisted && !character.isCivilian();
    }

    describe(): string {
        return "";
    }
}

export class MainCharacterPrerequisite implements IConstructPrerequisite<Character> {

    isPrerequisiteFulfilled(c: Character) {
        return c.stereotype === Stereotype.MainCharacter;
    }
    describe(): string {
        return "Main Character only";
    }
}



export class SourcePrerequisite implements IConstructPrerequisite<Construct> {
    private sources: Source[];

    constructor(...sources: Source[]) {
        this.sources = sources;
    }

    isPrerequisiteFulfilled(c: Construct) {
        let result = false
        this.sources.forEach((s) => { result = result || store.getState().context.sources.indexOf(s) >= 0 })
        return result;
    }

    getSources() {
        return this.sources;
    }
    describe(): string {
        return "";
    }
}

export class StarshipTypePrerequisite implements IConstructPrerequisite<Starship> {
    private types: CharacterType[];

    constructor(...type: CharacterType[]) {
        this.types = type;
    }

    isPrerequisiteFulfilled(s: Starship) {
        return this.types.indexOf(s.type) >= 0;
    }
    describe(): string {
        return "";
    }
}

export class ServiceYearPrerequisite implements IConstructPrerequisite<Starship> {
    private year: number;

    constructor(year: number) {
        this.year = year;
    }

    isPrerequisiteFulfilled(s: Starship) {
        return s != null && s.serviceYear >= this.year;
    }
    describe(): string {
        return "" + this.year + " or later";
    }
}

export class KlingonPrerequisite implements IConstructPrerequisite<Character> {

    isPrerequisiteFulfilled(character: Character) {
        return character.isKlingon();
    }
    describe(): string {
        return "";
    }
}

export class CivilianPrerequisite implements IConstructPrerequisite<Character> {

    // arguably, a Child character is a Civilian, but the Roles restrict Child
    // characters to only one Role, so there's no point including them.
    isPrerequisiteFulfilled(character: Character) {
        if (new SourcePrerequisite(Source.SciencesDivision, Source.PlayersGuide, Source.KlingonCore).isPrerequisiteFulfilled(character)) {
            return character.type === CharacterType.AmbassadorDiplomat ||
                character.type === CharacterType.Civilian ||
                (character.type === CharacterType.Starfleet
                    && (character.educationStep?.track === Track.UniversityAlumni
                        || character.educationStep?.track === Track.ResearchInternship)) ||
                (character.type === CharacterType.KlingonWarrior
                    && character.educationStep?.track === Track.Laborer);
        } else {
            return true;
        }
    }
    describe(): string {
        return "";
    }
}

export class NotPrerequisite implements IConstructPrerequisite<Character> {
    private prereq: IConstructPrerequisite<Character>;

    constructor(prereq: IConstructPrerequisite<Character>) {
        this.prereq = prereq;
    }
    isPrerequisiteFulfilled(character: Character): boolean {
        return !this.prereq.isPrerequisiteFulfilled(character);
    }
    describe(): string {
        return "";
    }
}

export class AnyOfPrerequisite implements IConstructPrerequisite<Character> {
    private _prequisites: IConstructPrerequisite<Character>[];

    constructor(...prequisites: IConstructPrerequisite<Character>[]) {
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
    describe(): string {
        return "";
    }
}

export class CareersPrerequisite implements IConstructPrerequisite<Character> {
    private _careers: Career[];

    constructor(...careers: Career[]) {
        this._careers = careers;
    }

    isPrerequisiteFulfilled(character: Character) {
        return character.careerStep?.career != null && this._careers.indexOf(character.careerStep?.career) > -1;
    }
    describe(): string {
        return "Only available to " + this._careers.map(c => Career[c]).join(', ') + " characters";
    }
}

export class EnlistedPrerequisite implements IConstructPrerequisite<Character> {
    isPrerequisiteFulfilled(character: Character) {
        return character.enlisted;
    }
    describe(): string {
        return "";
    }
}

export class AnyEraPrerequisite implements IConstructPrerequisite<Construct> {
    private eras: Era[];

    constructor(...era: Era[]) {
        this.eras = era;
    }

    isPrerequisiteFulfilled(construct: Construct) {
        return this.eras.indexOf(store.getState().context.era) >= 0;
    }
    describe(): string {
        return "";
    }
}

export class ChildPrerequisite implements IConstructPrerequisite<Character> {
    isPrerequisiteFulfilled(character: Character): boolean {
        return character.type === CharacterType.Child ||
            character.age.isChild;
    }
    describe(): string {
        return "";
    }
}

export class AdultPrerequisite implements IConstructPrerequisite<Character> {
    isPrerequisiteFulfilled(character: Character): boolean {
        return character.age.isAdult;
    }
    describe(): string {
        return "";
    }
}

export class CharacterTypePrerequisite implements IConstructPrerequisite<Character> {
    private types: CharacterType[];

    constructor(...type: CharacterType[]) {
        this.types = type;
    }

    isPrerequisiteFulfilled(character: Character) {
        return this.types.indexOf(character.type) >= 0;
    }
    describe(): string {
        return "";
    }
}

export class CharacterStereotypePrerequisite implements IConstructPrerequisite<Character> {
    private types: Stereotype[];

    constructor(...type: Stereotype[]) {
        this.types = type;
    }

    isPrerequisiteFulfilled(character: Character) {
        return character instanceof Character && this.types.indexOf(character.stereotype) >= 0;
    }
    describe(): string {
        return "";
    }
}

export class SpecializationPrerequisite implements IConstructPrerequisite<Character> {
    private types: Specialization[];

    constructor(...type: Specialization[]) {
        this.types = type;
    }

    isPrerequisiteFulfilled(character: Character) {
        return character instanceof Character && character.stereotype === Stereotype.Npc && this.types.indexOf(character.npcGenerationStep?.specialization) >= 0;
    }
    describe(): string {
        return "";
    }
}

export class NeverPrerequisite implements IConstructPrerequisite<Starship> {

    isPrerequisiteFulfilled(c: Starship) {
        return false;
    }

    describe(): string {
        return "";
    }
}

export class AllOfPrerequisite implements IConstructPrerequisite<Character> {
    private prequisites: IConstructPrerequisite<Character>[];

    constructor(...prequisites: IConstructPrerequisite<Character>[]) {
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
    describe(): string {
        return "";
    }
}