import i18next from "i18next";
import { makeKey } from "../../common/translationKey";

export enum ModificationType {
    Reputation,
    Milestone,
    Promotion
}

export class ModificationModel {

    readonly name: string;
    readonly type: ModificationType;

    constructor(type: ModificationType, name: string) {
        this.name = name;
        this.type = type;
    }

    get localizedName() {
        return i18next.t(makeKey('ModificationType.name.', ModificationType[this.type]));
    }
}

class Modifications {
    static _instance: Modifications;

    private items: ModificationModel[] = [
        new ModificationModel(ModificationType.Reputation, "Reputation"),
        new ModificationModel(ModificationType.Milestone, "Milestone"),
        new ModificationModel(ModificationType.Promotion, "Promotion"),
    ];

    static get instance() {
        if (Modifications._instance == null) {
            Modifications._instance = new Modifications();
        }
        return Modifications._instance;
    }

    getItems() {
        return [this.items[0], this.items[2]];
    }
}

export default Modifications;