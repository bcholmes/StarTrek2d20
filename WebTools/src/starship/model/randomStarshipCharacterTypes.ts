import i18next from "i18next";

export enum RandomStarshipCharacterType {
    Starfleet,
    Klingon
}

export class RandomStarshipCharacterTypeModel {

    type: RandomStarshipCharacterType;
    name: string;

    constructor(type: RandomStarshipCharacterType, name: string) {
        this.type = type;
        this.name = name;
    }

    get localizedName() {
        switch (this.type) {
            case RandomStarshipCharacterType.Starfleet:
                return i18next.t('CharacterType.name.starfleet');
            case RandomStarshipCharacterType.Klingon:
                return i18next.t('AlliedMilitaryType.name.klingonDefenceForce');
            default:
                return this.name;
        }
    }
}

export class RandomStarshipCharacterTypes {

    private static _instance: RandomStarshipCharacterTypes;

    static get instance() {
        if (RandomStarshipCharacterTypes._instance == null) {
            RandomStarshipCharacterTypes._instance = new RandomStarshipCharacterTypes();
        }
        return RandomStarshipCharacterTypes._instance;
    }

    private _types = [
        new RandomStarshipCharacterTypeModel(RandomStarshipCharacterType.Starfleet, "Starfleet"),
        new RandomStarshipCharacterTypeModel(RandomStarshipCharacterType.Klingon, "Klingon Defense Force"),
    ];

    get types() {
        return this._types.filter(t => {
            if (t.type === RandomStarshipCharacterType.Starfleet) {
                return true;
            } else {
                return true;
            }
        });
    }

    getType(type: RandomStarshipCharacterType) {
        let types = this.types.filter(t => t.type === type);
        return types.length === 1 ? types[0] : null;
    }
}