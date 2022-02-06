import { Source } from "../helpers/sources";

export const enum CharacterType {
    Starfleet = 0,
    KlingonWarrior,
    AlliedMilitary,
    Other
}

export class CharacterTypeModel {
    private static TYPES: CharacterTypeModel[] = [ 
        new CharacterTypeModel("Federation/Starfleet", CharacterType.Starfleet),
        new CharacterTypeModel("Klingon Empire", CharacterType.KlingonWarrior),
        new CharacterTypeModel("Allied Military", CharacterType.AlliedMilitary),
        new CharacterTypeModel("Other", CharacterType.Other)
    ];

    private static TYPES_EXCEPT_OTHER: CharacterTypeModel[] = [ 
        CharacterTypeModel.TYPES[0], CharacterTypeModel.TYPES[1], CharacterTypeModel.TYPES[2]
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
            } else if (t.type === CharacterType.AlliedMilitary) {
                return sources.indexOf(Source.PlayersGuide) >= 0
            } else {
                return true;
            }
        });
    }

    public static getStarshipTypes() {
        return [ CharacterTypeModel.TYPES[0], CharacterTypeModel.TYPES[1] ]; 
    }
}

