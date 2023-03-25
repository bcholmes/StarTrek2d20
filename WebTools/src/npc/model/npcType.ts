import { D20 } from "../../common/die";
import i18next from 'i18next';
import { makeKey } from '../../common/translationKey';

export enum NpcType {
    Minor,
    Notable,
    Major
}

export class NpcTypeModel {
    type: NpcType;
    name: string;

    constructor(type: NpcType, name: string) {
        this.type = type;
        this.name = name;
    }

    get localizedName() {
        return i18next.t(makeKey('NpcType.', NpcType[this.type], ".name"));
    }
}

export class NpcTypes {

    static getNpcTypes() {
        return [ new NpcTypeModel(NpcType.Minor, "Minor NPC"),
            new NpcTypeModel(NpcType.Notable, "Notable NPC"),
            new NpcTypeModel(NpcType.Major, "Major NPC")];
    }

    static attributePoints(type: NpcType) {
        if (type === NpcType.Minor) {
            return [9, 9, 8, 8, 7, 7];
        } else if (type === NpcType.Notable) {
            return [10, 9, 9, 8, 8, 7];
        } else {
            let result = [7, 7, 7, 7, 7, 7];
            for (let i = 0; i < 14; i++) {
                let done = false;
                while (!done) {
                    let attr = Math.floor(Math.random() * 6);
                    if (result[attr] < 12) {
                        result[attr] = result[attr] + 1;
                        done = true;
                    }
                }
            }
            result.sort();
            return result;
        }
    }

    static disciplinePoints(type: NpcType) {
        if (type === NpcType.Minor) {
            return [2, 2, 1, 1, 0, 0];
        } else if (type === NpcType.Notable) {
            return [3, 2, 2, 1, 1, 0];
        } else {
            let result = [1, 1, 1, 1, 1, 1];
            for (let i = 0; i < 10; i++) {
                let done = false;
                while (!done) {
                    let disc = Math.floor(Math.random() * 6);
                    if (result[disc] < 5) {
                        result[disc] = result[disc] + 1;
                        done = true;
                    }
                }
            }
            result.sort();
            return result;
        }
    }

    static numberOfFocuses(type: NpcType) {
        if (type === NpcType.Minor) {
            return 0;
        } else if (type === NpcType.Notable) {
            return D20.roll() >= 10 ? 2 : 3;
        } else {
            let distribution = [3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6];
            return distribution[D20.roll() - 1];
        }
    }

    static numberOfValues(type: NpcType) {
        if (type === NpcType.Minor) {
            return 0;
        } else if (type === NpcType.Notable) {
            return 1;
        } else {
            return 4;
        }
    }

    static numberOfTalents(type: NpcType) {
        if (type === NpcType.Minor) {
            return D20.roll() > 10 ? 1 : 2;
        } else if (type === NpcType.Notable) {
            return D20.roll() > 10 ? 2 : 3;
        } else {
            return 4;
        }
    }
}