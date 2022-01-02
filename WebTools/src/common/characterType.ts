export const enum CharacterType {
    Starfleet = 0,
    KlingonWarrior,
    Other
}

export class CharacterTypeModel {
    private static TYPES: CharacterTypeModel[] = [ 
        new CharacterTypeModel("Federation/Starfleet", CharacterType.Starfleet),
        new CharacterTypeModel("Klingon Empire", CharacterType.KlingonWarrior),
        new CharacterTypeModel("Other", CharacterType.Other)
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

    public static getStarshipTypes() {
        return [ CharacterTypeModel.TYPES[0], CharacterTypeModel.TYPES[1] ]; 
    }
}

