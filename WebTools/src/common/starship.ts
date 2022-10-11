import { allDepartments, Department } from "../helpers/departments";
import { MissionPodModel } from "../helpers/missionPods";
import { MissionProfileModel } from "../helpers/missionProfiles";
import { SpaceframeModel } from "../helpers/spaceframes";
import { allSystems, System } from "../helpers/systems";
import { TalentSelection, TalentsHelper, TalentViewModel } from "../helpers/talents";
import { Weapon, WeaponType } from "../helpers/weapons";
import { CharacterType } from "./characterType";
import { Construct } from "./construct";

export class SimpleStats {
    deparments: number[];
    systems: number[];
    className: string = "";
    scale: number = 0;

    constructor() {
        this.deparments = [0, 0, 0, 0, 0, 0];
        this.systems = [0, 0, 0, 0, 0, 0];
    }
}

export enum ShipBuildType {
    POD, SHUTTLE, RUNABOUT, STARSHIP
}

export class Starship extends Construct {
    registry: string = "";
    traits: string = "";
    serviceYear?: number;
    spaceframeModel?: SpaceframeModel = undefined;
    missionPodModel?: MissionPodModel;
    missionProfileModel?: MissionProfileModel;
    profileTalent?: TalentViewModel;
    additionalTalents: TalentViewModel[] = [];
    refits: System[] = [];
    simpleStats: SimpleStats;

    constructor() {
        super();
        this.name = "";
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
        let bonus = this.getTalentSelectionList().filter(t => t.talent.name === "Secondary Reactors");
        if (power != null && bonus.length > 0) {
            power += (5 * bonus[0].rank);
        }
        return power;
    }

    get defaultTraits() {
        let trait = [];
        if (this.type === CharacterType.KlingonWarrior) {
            trait.push("Klingon Starship");
        } else if (this.type === CharacterType.Starfleet) {
            trait.push("Federation Starship");
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
            let advanced = this.getTalentSelectionList().filter(t => t.talent.name === "Advanced Shields");
            if (advanced.length > 0) {
                base += (5 * advanced[0].rank);
            }
            return base;
        } else {
            return undefined;
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

    determineWeapons(): Weapon[] {
        var result = [];
        var secondary = [];
        const talents = this.getTalentNameList();
        const spaceframe = this.spaceframeModel;
        if (spaceframe) {
            for (var attack of spaceframe.attacks) {

                if (attack === 'Photon Torpedoes') {
                    result.push(new Weapon(attack, 3, "High Yield", WeaponType.TORPEDO));
                } else if (attack === 'Phaser Cannons' || attack === 'Phase Cannons') {
                    result.push(new Weapon(attack, 2, "Versatile 2", WeaponType.ENERGY));
                } else if (attack === 'Phaser Banks') {
                    result.push(new Weapon(attack, 1, "Versatile 2", WeaponType.ENERGY));
                } else if (attack === 'Phaser Arrays') {
                    result.push(new Weapon(attack, 0, "Versatile 2, Area or Spread", WeaponType.ENERGY));
                } else if (attack === 'Disruptor Cannons') {
                    result.push(new Weapon(attack, 2, "Viscious 1", WeaponType.ENERGY));
                } else if (attack === 'Disruptor Banks') {
                    result.push(new Weapon(attack, 1, "Viscious 1", WeaponType.ENERGY));
                } else if (attack === 'Disruptor Arrays') {
                    result.push(new Weapon(attack, 0, "Viscious 1, Area or Spread", WeaponType.ENERGY));
                } else if (attack === 'Plasma Torpedoes') {
                    result.push(new Weapon(attack, 3, "Persistent, Calibration", WeaponType.TORPEDO));
                } else if (attack.indexOf('Tractor Beam') >= 0 || attack.indexOf('Grappler Cables') >= 0) {
                    let index = attack.indexOf("(Strength");
                    let index2 = attack.indexOf(")", index);
                    let strength = index >= 0 && index2 >= 0 ? attack.substr(index + "(Strength".length + 1, index2) : "0";
                    secondary.push(new Weapon(attack.indexOf('Tractor Beam') >= 0 ? 'Tractor Beam' : 'Grappler Cables', parseInt(strength), "", WeaponType.ENTANGLE));
                }
            }

            if (spaceframe.attacks.indexOf('Quantum Torpedoes') >= 0 || talents.indexOf('Quantum Torpedoes') >= 0) {
                result.push(new Weapon('Quantum Torpedoes', 4, "Vicious 1, Calibration, High Yield", WeaponType.TORPEDO));
            }

            if (spaceframe.attacks.indexOf('Spatial Torpedoes') >= 0 && talents.indexOf('Nuclear Warheads') >= 0) {
                result.push(new Weapon('Nuclear Warheads', 3, "Vicious 1, Calibration", WeaponType.TORPEDO));
            } else if (spaceframe.attacks.indexOf('Spatial Torpedoes') >= 0) {
                result.push(new Weapon('Spatial Torpedoes', 2, "", WeaponType.TORPEDO));
            } else if (spaceframe.attacks.indexOf('Nuclear Warheads') >= 0 || talents.indexOf('Nuclear Warheads') >= 0) {
                result.push(new Weapon('Nuclear Warheads', 3, "Vicious 1, Calibration", WeaponType.TORPEDO));
            }
        }

        secondary.forEach(w => {
            result.push(w);
        });

        return result;
    }

    get departments() {
        let result = [0, 0, 0, 0, 0, 0];
        if (this.spaceframeModel !== undefined && this.missionProfileModel !== undefined) {
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

            profile.departments.forEach((d, i) => {
                result[i] += d;
            });
        } else if (this.simpleStats != null) {
            allDepartments().forEach(d => result[d] = this.simpleStats.deparments[d]);
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
        if (this.simpleStats != null) {
            result.simpleStats = new SimpleStats();
            result.simpleStats.className = this.simpleStats.className;
            result.simpleStats.deparments = [...this.simpleStats.deparments];
            result.simpleStats.systems = [...this.simpleStats.systems];
            result.simpleStats.scale = this.simpleStats.scale;
        }
        return result;
    }
}

