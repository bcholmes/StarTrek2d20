import { Source } from "../helpers/sources";
import i18next from "i18next";
import { makeKey } from "./translationKey";

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

    get localizedName() {
        return i18next.t(makeKey('CharacterType.name.', CharacterType[this.type]));
    }

    public static getAllTypes() {
        return CharacterTypeModel.TYPES;
    }

    public static getByType(type: CharacterType) {
        return CharacterTypeModel.TYPES[type];
    }


    public static getAllTypesExceptOther(sources: Source[]) {
        return this.TYPES_EXCEPT_OTHER.filter(t => {
            if (t.type === CharacterType.KlingonWarrior) {
                return sources.indexOf(Source.KlingonCore) >= 0;
            } else if (t.type === CharacterType.Starfleet) {
                return true;
            } else if (t.type === CharacterType.Civilian || t.type === CharacterType.AmbassadorDiplomat) {
                return sources.indexOf(Source.PlayersGuide) || sources.indexOf(Source.Core2ndEdition);
            } else {
                return sources.indexOf(Source.PlayersGuide) >= 0
            }
        });
    }

    public static getCharacterTypeByTypeName(name: String) {
        let matches = CharacterTypeModel.TYPES.filter(t => CharacterType[t.type] === name);
        return matches.length === 0 ? undefined : matches[0];
    }

    public static getNpcCharacterTypes() {
        return [ CharacterTypeModel.TYPES[0] ];
    }

    public static getSoloCharacterTypes() {
        return [ CharacterTypeModel.TYPES[0], CharacterTypeModel.TYPES[2], CharacterTypeModel.TYPES[3], CharacterTypeModel.TYPES[4] ].sort((c1, c2) =>
            c1.localizedName.localeCompare(c2.localizedName)
        );
    }

    public static getStarshipTypes() {
        return [ CharacterTypeModel.TYPES[0], CharacterTypeModel.TYPES[1] ];
    }
}

