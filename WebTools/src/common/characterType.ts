import { Source } from "../helpers/sources";

export enum CharacterType {
    Starfleet = 0,
    KlingonWarrior,
    AlliedMilitary,
    AmbassadorDiplomat,
    Civilian,
    Cadet,
    Child,
    Tribble,
    Other
}

export class CharacterTypeModel {
    private static TYPES: CharacterTypeModel[] = [
        new CharacterTypeModel("Starfleet", CharacterType.Starfleet),
        new CharacterTypeModel("Klingon Defense Force", CharacterType.KlingonWarrior),
        new CharacterTypeModel("Allied Military", CharacterType.AlliedMilitary),
        new CharacterTypeModel("Ambassador / Diplomat", CharacterType.AmbassadorDiplomat),
        new CharacterTypeModel("Civilian", CharacterType.Civilian),
        new CharacterTypeModel("Cadet", CharacterType.Cadet),
        new CharacterTypeModel("Child", CharacterType.Child),
        new CharacterTypeModel("Other", CharacterType.Other)
    ];

    private static TYPES_EXCEPT_OTHER: CharacterTypeModel[] = [
        CharacterTypeModel.TYPES[0], CharacterTypeModel.TYPES[1], CharacterTypeModel.TYPES[2], CharacterTypeModel.TYPES[3],
        CharacterTypeModel.TYPES[4], CharacterTypeModel.TYPES[5], CharacterTypeModel.TYPES[6]
    ];

    name: string;
    type: CharacterType;

    constructor(name: string, type: CharacterType) {
        this.name = name;
        this.type = type;
    }

    public static getAllTypes() {
        return CharacterTypeModel.TYPES;
    }

    public static getAllTypesExceptOther(sources: Source[]) {
        return this.TYPES_EXCEPT_OTHER.filter(t => {
            if (t.type === CharacterType.KlingonWarrior) {
                return sources.indexOf(Source.KlingonCore) >= 0;
            } else if (t.type === CharacterType.Starfleet) {
                return true;
            } else {
                return sources.indexOf(Source.PlayersGuide) >= 0
            }
        });
    }

    public static getCharacterTypeByTypeName(name: String) {
        let matches = CharacterTypeModel.TYPES.filter(t => CharacterType[t.type] === name);
        return matches.length === 0 ? undefined : matches[0];
    }

    public static getStarshipTypes() {
        return [ CharacterTypeModel.TYPES[0], CharacterTypeModel.TYPES[1] ];
    }
}

