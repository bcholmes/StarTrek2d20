
import i18next from "i18next";
import { Source } from "../../helpers/sources";
import { hasAnySource } from "../../state/contextFunctions";

export enum NpcCharacterType {
    Starfleet, KlingonDefenseForces, RomulanMilitary
}

export class NpcCharacterTypeModel {

    type: NpcCharacterType;
    name: string;

    constructor(type: NpcCharacterType, name: string) {
        this.type = type;
        this.name = name;
    }

    get localizedName() {
        switch (this.type) {
            case NpcCharacterType.Starfleet:
                return i18next.t('CharacterType.name.starfleet');
            case NpcCharacterType.KlingonDefenseForces:
                return i18next.t('CharacterType.name.klingonWarrior');
            default:
                return this.name;
        }
    }
}

export class NpcCharacterTypes {

    private static _instance: NpcCharacterTypes;

    static get instance() {
        if (NpcCharacterTypes._instance == null) {
            NpcCharacterTypes._instance = new NpcCharacterTypes();
        }
        return NpcCharacterTypes._instance;
    }

    private _types = [
        new NpcCharacterTypeModel(NpcCharacterType.Starfleet, "Starfleet"),
        new NpcCharacterTypeModel(NpcCharacterType.KlingonDefenseForces, "Klingon Defence Forces")
    ];

    get types() {
        if (hasAnySource([Source.KlingonCore, Source.PlayersGuide])) {
            return this._types;
        } else {
            return [this._types[0]];
        }
    }

    getType(type: NpcCharacterType) {
        let types = this.types.filter(t => t.type === type);
        return types.length === 1 ? types[0] : null;
    }
}