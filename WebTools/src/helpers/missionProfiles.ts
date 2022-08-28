import { CharacterType } from '../common/characterType';
import { IPrerequisite, SourcePrerequisite } from './prerequisite';
import { Source } from './sources';
import {TalentsHelper, TalentModel} from './talents';

export enum MissionProfile {
    StrategicAndDiplomatic,
    PathfinderAndReconaissance,
    TechnicalTestBed,
    Tactical,
    ScientificAndSurvey,
    CrisisAndEmergencyResponse,
    MultiroleExplorer,
    HouseGuard,
    ProjectEscalante,
    Battlecruiser,
    ReserveFleet,

    CivilianMerchantMarine,
    ColonySupport,
    EntertainmentPleasureShip,
    EspionageIntelligence,
    Flagship,
    LogisticalQuartermaster,
    Patrol,
    Warship,
    TechnicalTestbed,
}

export class MissionProfileModel {
    id: MissionProfile;
    name: string;
    departments: number[];
    talents: TalentModel[];
    traits: string;
    notes: string;
    prerequisites: IPrerequisite[];

    constructor(id: MissionProfile, name: string, departments: number[], talents: TalentModel[], traits: string = "", notes: string = "", ...prerequisites: IPrerequisite[]) {
        this.id = id;
        this.name = name;
        this.departments = departments;
        this.talents = talents;
        this.notes = notes;
        this.prerequisites = prerequisites;
    }

    public isPrerequisitesFulfilled() {
        let result = true;
        this.prerequisites.forEach(p => {
            result = result && p.isPrerequisiteFulfilled();
        });
        return result;
    }
}

class MissionProfiles {
    private _profiles: { [id: number]: MissionProfileModel } = {
        [MissionProfile.StrategicAndDiplomatic]: new MissionProfileModel(
            MissionProfile.StrategicAndDiplomatic,
            "Strategic and Diplomatic Operations",
            [3, 1, 2, 2, 2, 2],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Diplomatic Suites"),
                TalentsHelper.getTalent("Electronic Warfare Systems"),
                TalentsHelper.getTalent("Extensive Shuttlebays")
            ]),
        [MissionProfile.PathfinderAndReconaissance]: new MissionProfileModel(
            MissionProfile.PathfinderAndReconaissance,
            "Pathfinder and Reconnaissance Operations",
            [2, 3, 2, 2, 2, 1],
            [
                TalentsHelper.getTalent("Improved Reaction Control System"),
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("Rugged Design")
            ]),
        [MissionProfile.TechnicalTestBed]: new MissionProfileModel(
            MissionProfile.TechnicalTestBed,
            "Technical Test-Bed",
            [1, 2, 2, 3, 2, 2],
            [
                TalentsHelper.getTalent("Advanced Shields"),
                TalentsHelper.getTalent("Backup EPS Conduits"),
                TalentsHelper.getTalent("High Resolution Sensors"),
                TalentsHelper.getTalent("Improved Power Systems"),
                TalentsHelper.getTalent("Improved Warp Drive")
            ]),
        [MissionProfile.Tactical]: new MissionProfileModel(
            MissionProfile.Tactical,
            "Tactical Operations",
            [2, 2, 3, 2, 1, 2],
            [
                TalentsHelper.getTalent("Ablative Armor"),
                TalentsHelper.getTalent("Fast Targeting Systems"),
                TalentsHelper.getTalent("Improved Damage Control"),
                TalentsHelper.getTalent("Quantum Torpedoes"),
                TalentsHelper.getTalent("Improved Impulse Drive")
            ]),
        [MissionProfile.ScientificAndSurvey]: new MissionProfileModel(
            MissionProfile.ScientificAndSurvey,
            "Scientific and Survey Operations",
            [2, 2, 1, 2, 3, 2],
            [
                TalentsHelper.getTalent("Advanced Research Facilities"),
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("High Resolution Sensors"),
                TalentsHelper.getTalent("Modular Laboratories")
            ]),
        [MissionProfile.CrisisAndEmergencyResponse]: new MissionProfileModel(
            MissionProfile.CrisisAndEmergencyResponse,
            "Crisis and Emergency Response",
            [2, 2, 2, 1, 2, 3],
            [
                TalentsHelper.getTalent("Advanced Sickbay"),
                TalentsHelper.getTalent("Emergency Medical Hologram"),
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Modular Laboratories")
            ]),
        [MissionProfile.MultiroleExplorer]: new MissionProfileModel(
            MissionProfile.MultiroleExplorer,
            "Multirole Explorer",
            [2, 2, 2, 2, 2, 2],
            [
                TalentsHelper.getTalent("Improved Hull Integrity"),
                TalentsHelper.getTalent("Improved Power Systems"),
                TalentsHelper.getTalent("Rugged Design"),
                TalentsHelper.getTalent("Redundant Systems"),
                TalentsHelper.getTalent("Secondary Reactors")
            ]),
        [MissionProfile.ProjectEscalante]: new MissionProfileModel(
            MissionProfile.ProjectEscalante,
            "Project Escalante",
            [3, 1, 1, 2, 3, 2],
            [
                TalentsHelper.getTalent("Expanded Connectivity")
            ],
            "Expanded sensor footprint, Prototype",
            "Used in the adventure \"Plague of Arias\"", 
            new SourcePrerequisite(Source.TheseAreTheVoyages)),
        [MissionProfile.Battlecruiser]: new MissionProfileModel(
            MissionProfile.Battlecruiser,
            "Battlecruiser",
            [2, 2, 3, 2, 2, 1],
            [
                TalentsHelper.getTalent("Ablative Armor"),
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Fast Targeting Systems"),
                TalentsHelper.getTalent("Improved Damage Control"),
                TalentsHelper.getTalent("Rapid-Fire Torpedo Launcher"),
            ],
            "",
            "", 
            new SourcePrerequisite(Source.DiscoveryCampaign, Source.UtopiaPlanitia)),
        [MissionProfile.ReserveFleet]: new MissionProfileModel(
            MissionProfile.ReserveFleet,
            "Reserve Fleet",
            [1, 2, 1, 3, 2, 3],
            [
                TalentsHelper.getTalent("Advanced Sickbay"),
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Improved Hull Integrity"),
                TalentsHelper.getTalent("Secondary Reactors"),
            ],
            "",
            "", 
            new SourcePrerequisite(Source.DiscoveryCampaign, Source.UtopiaPlanitia)),
    };

    private _klingonProfiles: { [id: number]: MissionProfileModel } = {
        [MissionProfile.CrisisAndEmergencyResponse]: new MissionProfileModel(
            MissionProfile.CrisisAndEmergencyResponse,
            "Crisis Response and Interception",
            [2, 2, 2, 3, 1, 2],
            [
                TalentsHelper.getTalent("Advanced Medical Ward"),
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Improved Impulse Drive"),
                TalentsHelper.getTalent("Improved Warp Drive")
            ]),
        [MissionProfile.MultiroleExplorer]: new MissionProfileModel(
            MissionProfile.MultiroleExplorer,
            "Multirole Battle Cruiser",
            [2, 2, 2, 2, 2, 2],
            [
                TalentsHelper.getTalent("Improved Damage Control"),
                TalentsHelper.getTalent("Improved Hull Integrity"),
                TalentsHelper.getTalent("Redundant Systems"),
                TalentsHelper.getTalent("Secondary Reactors")
            ]),
        [MissionProfile.PathfinderAndReconaissance]: new MissionProfileModel(
            MissionProfile.PathfinderAndReconaissance,
            "Intelligence and Reconnaissance Operations",
            [2, 2, 2, 2, 3, 1],
            [
                TalentsHelper.getTalent("Electronic Warfare Systems"),
                TalentsHelper.getTalent("Improved Reaction Control System"),
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("High Resolution Sensors")
            ]),
        [MissionProfile.ScientificAndSurvey]: new MissionProfileModel(
            MissionProfile.ScientificAndSurvey,
            "Scientific and Survey Operations",
            [2, 1, 2, 2, 3, 2],
            [
                TalentsHelper.getTalent("Advanced Medical Ward"),
                TalentsHelper.getTalent("Advanced Research Facilities"),
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("Modular Laboratories")
            ]),
        [MissionProfile.StrategicAndDiplomatic]: new MissionProfileModel(
            MissionProfile.StrategicAndDiplomatic,
            "Strategic and Diplomatic Operations",
            [3, 1, 2, 2, 2, 2],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Rugged Design")
            ]),
        [MissionProfile.Tactical]: new MissionProfileModel(
            MissionProfile.Tactical,
            "Warship",
            [2, 2, 3, 3, 1, 1],
            [
                TalentsHelper.getTalent("Ablative Armor"),
                TalentsHelper.getTalent("Fast Targeting Systems"),
                TalentsHelper.getTalent("Improved Damage Control"),
                TalentsHelper.getTalent("Quantum Torpedoes"),
                TalentsHelper.getTalent("Rapid-Fire Torpedo Launcher")
            ]),
        [MissionProfile.HouseGuard]: new MissionProfileModel(
            MissionProfile.HouseGuard,
            "House Guard",
            [2, 2, 2, 3, 2, 1],
            [
                TalentsHelper.getTalent("Backup EPS Conduits"),
                TalentsHelper.getTalent("Improved Power Systems"),
                TalentsHelper.getTalent("Redundant Systems"),
                TalentsHelper.getTalent("Rugged Design")
            ]),
            //[MissionProfile.StrategicAndDiplomatic]: new MissionProfileModel(
        //    "",
        //    [],
        //    []),
    };

    getMissionProfiles(type: CharacterType) {
        let profiles: MissionProfileModel[] = [];
        let keys = [];
        if (type === CharacterType.KlingonWarrior) {
            keys = [ MissionProfile.CrisisAndEmergencyResponse,
                MissionProfile.MultiroleExplorer,
                MissionProfile.PathfinderAndReconaissance,
                MissionProfile.ScientificAndSurvey,
                MissionProfile.StrategicAndDiplomatic,
                MissionProfile.Tactical,
                MissionProfile.HouseGuard ];
        } else {
            keys = [ MissionProfile.StrategicAndDiplomatic,
                MissionProfile.PathfinderAndReconaissance,
                MissionProfile.TechnicalTestBed,
                MissionProfile.Tactical,
                MissionProfile.ScientificAndSurvey,
                MissionProfile.CrisisAndEmergencyResponse,
                MissionProfile.MultiroleExplorer, 
                MissionProfile.ProjectEscalante,
                MissionProfile.Battlecruiser,
                MissionProfile.ReserveFleet ];
        }
        
        for (let i in keys) {
            let n = keys[i];
            let profile = (type === CharacterType.KlingonWarrior) ? this._klingonProfiles[n] : this._profiles[n];

            if (profile.isPrerequisitesFulfilled()) {
                profiles.push(profile);
            }
        }

        return profiles;
    }

    getMissionProfile(profile: MissionProfile, type: CharacterType) {
        return (type === CharacterType.KlingonWarrior) ? this._klingonProfiles[profile] : this._profiles[profile];
    }

    getMissionProfileByName(profile: string, type: CharacterType) {
        let list = (type === CharacterType.KlingonWarrior) ? this._klingonProfiles : this._profiles;
        let result = null;
        for (let id in list) {
            console.log("Compare " + profile + " to " + MissionProfile[id]);
            if (profile === MissionProfile[id]) {
                result = list[id];
                break;
            }
        }
        return result;
    }
}

export const MissionProfileHelper = new MissionProfiles();