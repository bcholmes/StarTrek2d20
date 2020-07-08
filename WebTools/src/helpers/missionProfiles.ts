import {TalentsHelper, TalentModel} from './talents';

export enum MissionProfile {
    StrategicAndDiplomatic,
    PathfinderAndReconaissance,
    TechnicalTestBed,
    Tactical,
    ScientificAndSurvey,
    CrisisAndEmergencyResponse,
    MultiroleExplorer
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

    getMissionProfiles() {
        let profiles: MissionProfileViewModel[] = [];
        let n = 0;

        for (var prof in this._profiles) {
            let profile = this._profiles[prof];

            profiles.push(new MissionProfileViewModel(n, profile));

            n++;
        }

        return profiles;
    }

    getMissionProfile(profile: MissionProfile) {
        return this._profiles[profile];
    }
}

export const MissionProfileHelper = new MissionProfiles();