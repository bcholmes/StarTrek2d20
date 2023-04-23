
import i18next from "i18next";
import { Source } from "../../helpers/sources";
import { hasAnySource } from "../../state/contextFunctions";
import store from "../../state/store";
import { Era } from "../../helpers/eras";

export enum NpcCharacterType {
    Starfleet, KlingonDefenseForces, RomulanMilitary, Ferengi
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
                return "Klingon";
            case NpcCharacterType.Ferengi:
                return "Ferengi";
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
        new NpcCharacterTypeModel(NpcCharacterType.KlingonDefenseForces, "Klingon Defence Forces"),
        new NpcCharacterTypeModel(NpcCharacterType.Ferengi, "Ferengi"),
    ];

    get types() {
        return this._types.filter(t => {
            if (t.type === NpcCharacterType.Starfleet) {
                return true;
            } else if (t.type === NpcCharacterType.KlingonDefenseForces) {
                return hasAnySource([Source.KlingonCore, Source.PlayersGuide]);
            } else if (t.type === NpcCharacterType.Ferengi) {
                return hasAnySource([Source.DS9, Source.AlphaQuadrant]) && store.getState().context.era === Era.NextGeneration;
            } else {
                return true;
            }
        });
    }

    getType(type: NpcCharacterType) {
        let types = this.types.filter(t => t.type === type);
        return types.length === 1 ? types[0] : null;
    }
}