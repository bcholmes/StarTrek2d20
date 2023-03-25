import i18next from "i18next";
import { allDepartments, Department } from "../helpers/departments";
import { MissionPodModel } from "../helpers/missionPods";
import { MissionProfileModel } from "../helpers/missionProfiles";
import { SpaceframeModel } from "../helpers/spaceframeModel";
import { allSystems, System } from "../helpers/systems";
import { TalentsHelper, TalentViewModel } from "../helpers/talents";
import { TalentSelection } from "../helpers/talentSelection";
import StarshipWeaponRegistry, { Weapon } from "../helpers/weapons";
import { CharacterType } from "./characterType";
import { Construct, Stereotype } from "./construct";
import { makeKey } from "./translationKey";

export class SimpleStats {
    departments: number[];
    systems: number[];
    className: string = "";
    scale: number = 0;
    weapons: Weapon[];

    constructor() {
        this.departments = [0, 0, 0, 0, 0, 0];
        this.systems = [0, 0, 0, 0, 0, 0];
    }
}

export enum ShipBuildType {
    Pod, Shuttlecraft, Runabout, Starship
}

export const refitCalculator = (starship: Starship) => {
    if (starship.buildType === ShipBuildType.Starship && starship?.serviceYear && starship?.spaceframeModel?.serviceYear) {
        if (starship.serviceYear >= 2400 && starship.spaceframeModel.serviceYear >= 2400) {
            return Math.floor((starship.serviceYear - starship.spaceframeModel.serviceYear) / 50);
        } else if (starship.serviceYear < 2400 && starship.spaceframeModel.serviceYear < 2400) {
            return Math.floor((starship.serviceYear - starship.spaceframeModel.serviceYear) / 10);
        } else if (starship.serviceYear > starship.spaceframeModel.serviceYear) {
            let remainder = starship.spaceframeModel.serviceYear % 10;
            let inflectionYear = 2400 + (remainder === 0 ? 0 : (remainder - 10));
            let result = Math.floor((starship.serviceYear - inflectionYear) / 50)
                + Math.floor((inflectionYear - starship.spaceframeModel.serviceYear) / 10);
            return result;
        } else {
            return 0;
        }

    } else {
        return 0;
    }
}

export class ShipBuildTypeModel {
    readonly name: string;
    readonly type: ShipBuildType;
    readonly scale: number;

    private static TYPES: ShipBuildTypeModel[] = [
        new ShipBuildTypeModel("Pod", ShipBuildType.Pod, 1),
        new ShipBuildTypeModel("Shuttlecraft", ShipBuildType.Shuttlecraft, 1),
        new ShipBuildTypeModel("Runabout", ShipBuildType.Runabout, 2),
        new ShipBuildTypeModel("Starship", ShipBuildType.Starship)
    ];

    constructor(name: string, type: ShipBuildType, scale: number = 0) {
        this.name = name;
        this.type = type;
        this.scale = scale;
    }

    static allTypes() {
        return ShipBuildTypeModel.TYPES;
    }

    static getByType(type: ShipBuildType) {
        return ShipBuildTypeModel.TYPES[type];
    }
    get localizedName() {
        return i18next.t(makeKey("ShipBuildType.", ShipBuildType[this.type], ".name"));
    }
}

export class Starship extends Construct {
    buildType: ShipBuildType = ShipBuildType.Starship;
    registry: string = "";
    traits: string = "";
    serviceYear?: number;
    private _spaceframe?: SpaceframeModel = undefined;
    missionPodModel?: MissionPodModel;
    missionProfileModel?: MissionProfileModel;
    profileTalent?: TalentViewModel;
    additionalTalents: TalentViewModel[] = [];
    refits: System[] = [];
    simpleStats: SimpleStats;
    additionalWeapons: Weapon[] = [];

    constructor() {
        super(Stereotype.Starship);
        this.name = "";
    }

    get spaceframeModel() {
        return this._spaceframe;
    }

    set spaceframeModel(spaceframe: SpaceframeModel) {
        this._spaceframe = spaceframe;
        if (!spaceframe?.isMissionPodAvailable) {
            this.missionPodModel = undefined;
        }
    }

    get isSmallCraft() {
        return this.buildType === ShipBuildType.Pod || this.buildType === ShipBuildType.Shuttlecraft || this.buildType === ShipBuildType.Runabout;
    }

    get className() {
        if (this.spaceframeModel != null) {
            return this.spaceframeModel.name;
        } else if (this.simpleStats != null) {
            return this.simpleStats.className;
        } else {
            return undefined;
        }
    }

    get power() {
        let power = this.getSystemValue(System.Engines);
        if (this.buildType !== ShipBuildType.Starship) {
            power = Math.ceil(power / 2);
        }
        let bonus = this.getTalentSelectionList().filter(t => t.talent.name === "Secondary Reactors");
        if (power != null && bonus.length > 0) {
            power += (5 * bonus[0].rank);
        }
        return power;
    }

    get resistance() {
        return this.scale;
    }

    get defaultTraits() {
        let trait = [];
        if (this.type === CharacterType.KlingonWarrior && this.buildType === ShipBuildType.Starship) {
            trait.push("Klingon Starship");
        } else if (this.type === CharacterType.Starfleet && this.buildType === ShipBuildType.Starship) {
            trait.push("Federation Starship");
        } else if (this.buildType !== ShipBuildType.Starship) {
            trait.push("Small Craft");
        }
        if (this.spaceframeModel) {
            trait = [...this.spaceframeModel.additionalTraits];
        }
        if (this.missionProfileModel && this.missionProfileModel.traits && this.missionProfileModel.traits !== "") {
            if (this.missionProfileModel.traits) {
                this.missionProfileModel.traits.split(", ").forEach(t => trait.push(t.trim()));
            }
        }
        return trait;
    }

    get numberOfTalents() {
        let result = this.scale;
        if (this.hasTalent("Efficiency")) {
            result = 5;
        }
        return result;
    }

    get freeTalentSlots() {
        if (this.buildType === ShipBuildType.Starship) {
            let numTalents = 0;

            if (this.spaceframeModel !== undefined) {
                numTalents = 1; // count the mission profile talent

                this.spaceframeModel.talents.forEach(t => numTalents += (t.talent.specialRule ? 0 : t.rank));

                if (this.spaceframeModel.isMissionPodAvailable) {
                    numTalents += 2; // think about this in the context of the Fleet Carrier pod, which seems to have 3 talents
                }
            }

            return Math.max(0, this.numberOfTalents - numTalents);
        } else if (this.buildType === ShipBuildType.Pod) {
            return 0;
        } else if (this.buildType === ShipBuildType.Shuttlecraft) {
            return 1;
        } else {
            return 2;
        }
    }

    get crewSupport() {
        if (this.buildType === ShipBuildType.Starship) {
            return this.scale;
        } else {
            return 0;
        }
    }

    get numberOfRefits() {
        return refitCalculator(this);
    }

    getAllTraits() {
        let trait = this.defaultTraits.join(", ");
        if (this.traits) {
            if (trait.length > 0) {
                trait += ", ";
            }
            trait += this.traits;
        }
        return trait;
    }

    getBaseSystem(system: System) {
        let result = 0;
        if (this.spaceframeModel) {
            result += this.spaceframeModel.systems[system];
            if (this.spaceframeModel.isMissionPodAvailable && this.missionPodModel) {
                result += this.missionPodModel.systems[system];
            }
        } else if (this.simpleStats != null) {
            result = this.simpleStats.systems[system];
        }
        return result;
    }
    getSystemValue(system: System) {
        let base = this.getBaseSystem(system);
        this.refits.forEach(r => { if (r === system) base++});
        return base;
    }

    getTalentNameList() {
        let talents = [];

        if (this.spaceframeModel) {
            talents = [...this.spaceframeModel.talents.map(t => { return t.description; })];
        }

        if (this.profileTalent) {
            talents.push(this.profileTalent.name);
        }
        this.additionalTalents.forEach(t => {
            talents.push(t.name);
        });
        if (this.missionPodModel) {
            this.missionPodModel.talents.forEach(t => {
                talents.push(t.name);
            });
        }
        return talents;
    }

    getTalentSelectionList() {
        let talents: Map<string, TalentSelection> = new Map();
        if (this.spaceframeModel) {
            this.spaceframeModel.talents.forEach(t => {
                this.addTalent(t, talents);
            });
        }

        if (this.profileTalent) {
            this.addTalent(new TalentSelection(TalentsHelper.getTalent(this.profileTalent.name)), talents);
        }

        this.additionalTalents.forEach(t => {
            this.addTalent(new TalentSelection(TalentsHelper.getTalent(t.name)), talents);
        });
        if (this.missionPodModel) {
            this.missionPodModel.talents.forEach(t => {
                this.addTalent(new TalentSelection(t), talents);
            });
        }

        let result: TalentSelection[] = [];
        talents.forEach((value: TalentSelection) => result.push(value));
        return result;
    }

    hasTalent(talentName: string) {
        let talents = this.getTalentSelectionList().filter(t => t.talent.name === talentName);
        return talents.length > 0;
    }

    private addTalent(t: TalentSelection, talents: Map<string, TalentSelection>) {
        if (talents.get(t.nameWithoutRank) != null) {
            let temp = talents.get(t.nameWithoutRank);
            talents.set(t.nameWithoutRank, new TalentSelection(temp.talent, temp.rank + t.rank, temp.qualifier));
        } else {
            talents.set(t.nameWithoutRank, t);
        }
    }

    get shields() {
        if (this.departments) {
            let base = this.getSystemValue(System.Structure) + this.departments[Department.Security];
            if (this.buildType !== ShipBuildType.Starship) {
                base = this.power;
            }
            let advanced = this.getTalentSelectionList().filter(t => t.talent.name === "Advanced Shields");
            if (advanced.length > 0) {
                base += (5 * advanced[0].rank);
            }
            return base;
        } else {
            return undefined;
        }
    }

    pruneExcessTalents() {
        if (this.freeTalentSlots < this.additionalTalents.length) {
            let excess = this.additionalTalents.length - this.freeTalentSlots;
            this.additionalTalents.splice(0, excess);
        }
    }

    refitsAsString() {
        let systems: System[] = allSystems();
        let refitString = "";
        if (this.refits) {
            systems.forEach(s => {
                let value = 0;
                this.refits.forEach(r => value += (r === s) ? 1 : 0);
                if (value > 0) {
                    if (refitString !== "") {
                        refitString += ", ";
                    }
                    refitString += "+" + value + " " + System[s];
                }
            });
        }
        return refitString;
    }

    get weapons() {
        return this.determineWeapons();
    }

    determineWeapons(): Weapon[] {
        let result = [];
        const talents = this.getTalentNameList();
        const spaceframe = this.spaceframeModel;
        if (spaceframe) {
            let secondary = [];
            for (var attack of spaceframe.attacks) {

                for (let weapon of StarshipWeaponRegistry.list) {
                    if (weapon.description === 'Spatial Torpedoes' && talents.indexOf('Nuclear Warheads') >= 0) {
                        // skip it
                    } else if (attack === weapon.description) {
                        result.push(weapon);
                    } else if (attack.indexOf(weapon.description) >= 0) { // Tractor or Grappler
                        secondary.push(weapon);
                    } else if (talents.indexOf(weapon.description) >= 0) {
                        result.push(weapon);
                    }
                }
            }
            secondary.forEach(w => {
                result.push(w);
            });

        }

        if (this.additionalWeapons.length > 0) {
            this.additionalWeapons.forEach(w => result.push(w));
        }

        let names = [];
        let weapons = [];
        result.forEach(w => {
            if (names.indexOf(w.description) >= 0) {
                // skip it
            } else {
                names.push(w.description);
                weapons.push(w);
            }
        });

        return weapons;
    }

    get systems() {
        let result = [0, 0, 0, 0, 0, 0];
        allSystems().forEach(s => result[s] = this.getSystemValue(s));
        return result;
    }

    get departments() {
        let result = [0, 0, 0, 0, 0, 0];
        if (this.spaceframeModel !== undefined) {
            const frame = this.spaceframeModel;
            const missionPod = this.missionPodModel;
            const profile = this.missionProfileModel;

            frame.departments.forEach((d, i) => {
                result[i] = d;
            });

            if (missionPod) {
                missionPod.departments.forEach((d, i) => {
                    result[i] += d;
                });
            }

            if (this.missionProfileModel !== undefined) {
                profile.departments.forEach((d, i) => {
                    result[i] += d;
                });
            }
        } else if (this.simpleStats != null) {
            allDepartments().forEach(d => result[d] = this.simpleStats.departments[d]);
        }
        return result;
    }

    get scale() {
        if (this.spaceframeModel != null) {
            return this.spaceframeModel.scale;
        } else if (this.simpleStats != null) {
            return this.simpleStats.scale;
        } else {
            return 0;
        }
    }

    static updateSystemAndDepartments(starship: Starship) {
    }

    public copy(): Starship {
        let result = new Starship();
        result.type = this.type;
        result.buildType = this.buildType;
        result.name = this.name;
        result.registry = this.registry;
        result.traits = this.traits;
        result.serviceYear = this.serviceYear;
        result.spaceframeModel = this.spaceframeModel;
        result.missionPodModel = this.missionPodModel;
        result.missionProfileModel = this.missionProfileModel;
        result.profileTalent = this.profileTalent;
        result.additionalTalents = [...this.additionalTalents];
        result.refits = [...this.refits];
        result.traits = this.traits;
        result.additionalWeapons = [...this.additionalWeapons];
        if (this.simpleStats != null) {
            result.simpleStats = new SimpleStats();
            result.simpleStats.className = this.simpleStats.className;
            result.simpleStats.departments = [...this.simpleStats.departments];
            result.simpleStats.systems = [...this.simpleStats.systems];
            result.simpleStats.scale = this.simpleStats.scale;
        }
        return result;
    }
}

