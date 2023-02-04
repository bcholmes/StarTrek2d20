import i18next from "i18next";
import { makeKey } from "../../common/translationKey";

export enum MilestoneType {
    NormalMilestone,
    SpotlightMilestone,
    ArcMilestone,
}

export class MilestoneModel {

    readonly name: string;
    readonly type: MilestoneType;

    constructor(type: MilestoneType, name: string) {
        this.name = name;
        this.type = type;
    }

    get localizedName() {
        return i18next.t(makeKey('MilestoneType.name.', MilestoneType[this.type]));
    }
}

class Milestones {
    static _instance: Milestones;

    private items: MilestoneModel[] = [
        new MilestoneModel(MilestoneType.NormalMilestone, "Normal Milestone"),
        new MilestoneModel(MilestoneType.SpotlightMilestone, "Spotlight Milestone"),
        new MilestoneModel(MilestoneType.ArcMilestone, "Arc Milestone"),
    ];

    static get instance() {
        if (Milestones._instance == null) {
            Milestones._instance = new Milestones();
        }
        return Milestones._instance;
    }

    getItems() {
        return [ this.items[0] ];
    }
}

export default Milestones;