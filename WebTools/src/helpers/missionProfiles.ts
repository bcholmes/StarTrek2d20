import { CharacterType } from '../common/characterType';
import {TalentsHelper, TalentModel} from './talents';

export enum MissionProfile {
    StrategicAndDiplomatic,
    PathfinderAndReconaissance,
    TechnicalTestBed,
    Tactical,
    ScientificAndSurvey,
    CrisisAndEmergencyResponse,
    MultiroleExplorer,
    HouseGuard
}

class MissionProfileModel {
    name: string;
    departments: number[];
    talents: TalentModel[];

    constructor(name: string, departments: number[], talents: TalentModel[]) {
        this.name = name;
        this.departments = departments;
        this.talents = talents;
    }
}

export class MissionProfileViewModel extends MissionProfileModel {
    id: MissionProfile;

    constructor(id: MissionProfile, base: MissionProfileModel) {
        super(base.name, base.departments, base.talents);
        this.id = id;
    }
}

class MissionProfiles {
    private _profiles: { [id: number]: MissionProfileModel } = {
        [MissionProfile.StrategicAndDiplomatic]: new MissionProfileModel(
            "Strategic and Diplomatic Operations",
            [3, 1, 2, 2, 2, 2],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Diplomatic Suites"),
                TalentsHelper.getTalent("Electronic Warfare Systems"),
                TalentsHelper.getTalent("Extensive Shuttlebays")
            ]),
        [MissionProfile.PathfinderAndReconaissance]: new MissionProfileModel(
            "Pathfinder and Reconnaissance Operations",
            [2, 3, 2, 2, 2, 1],
            [
                TalentsHelper.getTalent("Improved Reaction Control System"),
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("Rugged Design")
            ]),
        [MissionProfile.TechnicalTestBed]: new MissionProfileModel(
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
            "Scientific and Survey Operations",
            [2, 2, 1, 2, 3, 2],
            [
                TalentsHelper.getTalent("Advanced Research Facilities"),
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("High Resolution Sensors"),
                TalentsHelper.getTalent("Modular Laboratories")
            ]),
        [MissionProfile.CrisisAndEmergencyResponse]: new MissionProfileModel(
            "Crisis and Emergency Response",
            [2, 2, 2, 1, 2, 3],
            [
                TalentsHelper.getTalent("Advanced Sickbay"),
                TalentsHelper.getTalent("Emergency Medical Hologram"),
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Modular Laboratories")
            ]),
        [MissionProfile.MultiroleExplorer]: new MissionProfileModel(
            "Multirole Explorer",
            [2, 2, 2, 2, 2, 2],
            [
                TalentsHelper.getTalent("Improved Hull Integrity"),
                TalentsHelper.getTalent("Improved Power Systems"),
                TalentsHelper.getTalent("Rugged Design"),
                TalentsHelper.getTalent("Redundant Systems"),
                TalentsHelper.getTalent("Secondary Reactors")
            ]),
        //[MissionProfile.StrategicAndDiplomatic]: new MissionProfileModel(
        //    "",
        //    [],
        //    []),
    };

    private _klingonProfiles: { [id: number]: MissionProfileModel } = {
        [MissionProfile.CrisisAndEmergencyResponse]: new MissionProfileModel(
            "Crisis Response and Interception",
            [2, 2, 2, 3, 1, 2],
            [
                TalentsHelper.getTalent("Advanced Medical Ward"),
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Improved Impulse Drive"),
                TalentsHelper.getTalent("Improved Warp Drive")
            ]),
        [MissionProfile.MultiroleExplorer]: new MissionProfileModel(
            "Multirole Battle Cruiser",
            [2, 2, 2, 2, 2, 2],
            [
                TalentsHelper.getTalent("Improved Damage Control"),
                TalentsHelper.getTalent("Improved Hull Integrity"),
                TalentsHelper.getTalent("Redundant Systems"),
                TalentsHelper.getTalent("Secondary Reactors")
            ]),
        [MissionProfile.PathfinderAndReconaissance]: new MissionProfileModel(
            "Intelligence and Reconnaissance Operations",
            [2, 2, 2, 2, 3, 1],
            [
                TalentsHelper.getTalent("Electronic Warfare Systems"),
                TalentsHelper.getTalent("Improved Reaction Control System"),
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("High Resolution Sensors")
            ]),
        [MissionProfile.ScientificAndSurvey]: new MissionProfileModel(
            "Scientific and Survey Operations",
            [2, 1, 2, 2, 3, 2],
            [
                TalentsHelper.getTalent("Advanced Medical Ward"),
                TalentsHelper.getTalent("Advanced Research Facilities"),
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("Modular Laboratories")
            ]),
        [MissionProfile.StrategicAndDiplomatic]: new MissionProfileModel(
            "Strategic and Diplomatic Operations",
            [3, 1, 2, 2, 2, 2],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Rugged Design")
            ]),
        [MissionProfile.Tactical]: new MissionProfileModel(
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
        let profiles: MissionProfileViewModel[] = [];
        let keys = (type === CharacterType.KlingonWarrior) 
        ? [ MissionProfile.CrisisAndEmergencyResponse,
            MissionProfile.MultiroleExplorer,
            MissionProfile.PathfinderAndReconaissance,
            MissionProfile.ScientificAndSurvey,
            MissionProfile.StrategicAndDiplomatic,
            MissionProfile.Tactical,
            MissionProfile.HouseGuard ]
        : [ MissionProfile.StrategicAndDiplomatic,
            MissionProfile.PathfinderAndReconaissance,
            MissionProfile.TechnicalTestBed,
            MissionProfile.Tactical,
            MissionProfile.ScientificAndSurvey,
            MissionProfile.CrisisAndEmergencyResponse,
            MissionProfile.MultiroleExplorer ];        

        for (let i in keys) {
            let n = keys[i];
            let profile = (type === CharacterType.KlingonWarrior) ? this._klingonProfiles[n] : this._profiles[n];

            profiles.push(new MissionProfileViewModel(n, profile));
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
            if (profile === MissionProfile[parseInt(id)]) {
                result = list[id];
                break;
            }
        }
        return result;
    }
}

export const MissionProfileHelper = new MissionProfiles();