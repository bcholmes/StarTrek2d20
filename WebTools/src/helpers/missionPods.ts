import i18next from "i18next";
import { Starship } from "../common/starship";
import { IConstructPrerequisite, SourcePrerequisite } from "./prerequisite";
import { Source } from "./sources";
import { TalentModel, TalentsHelper } from "./talents";
import { makeKey } from "../common/translationKey";


export enum MissionPod {
    CommandAndControl,
    Sensors,
    Weapons,

    // Utopia Planitia
    AstrometricsAndNavigation,
    DefensiveShieldEnhancement,
    EmergencyRecovery,
    FieldHospital,
    FleetCarrier,
    FleetCommandSupport,
    MobileDrydock,
    WarpPropulsionPod
}

export class MissionPodModel {
    id: number;
    name: string;
    description: string;
    departments: number[];
    systems: number[];
    talents: TalentModel[];
    prerequisites: IConstructPrerequisite<Starship>[];

    constructor(id: number, name: string, description: string, departments: number[], systems: number[], talents: TalentModel[], prerequisites: IConstructPrerequisite<Starship>[] = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.departments = departments;
        this.systems = systems;
        this.talents = talents;
        this.prerequisites = prerequisites;
    }

    public isPrerequisitesFulfilled(starship: Starship) {
        let result = true;
        this.prerequisites.forEach(p => {
            result = result && p.isPrerequisiteFulfilled(starship);
        });
        return result;
    }

    get localizedName() {
        return i18next.t(makeKey('MissionPod.',MissionPod[this.id]));
    }
}

export class MissionPodHelper {

    private static _instance: MissionPodHelper;

    public static instance() {
        if (MissionPodHelper._instance == null) {
            MissionPodHelper._instance = new MissionPodHelper();
        }
        return MissionPodHelper._instance;
    }

    private _missionPods: { [id: number]: MissionPodModel } = {
        [MissionPod.CommandAndControl]: new MissionPodModel(
            MissionPod.CommandAndControl,
            "Command & Control",
            "The pod contains additional subspace antennae and supplementary computer cores, allowing it to serve as a command vessel for fleet actions.",
            [1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Electronic Warfare Systems")
            ]),
        [MissionPod.Sensors]: new MissionPodModel(
            MissionPod.Sensors,
            "Sensors",
            "The pod contains additional sensor systems, allowing the ship to serve a range of scientific and reconnaissance roles.",
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 2, 0, 0],
            [
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("High Resolution Sensors")
            ]),
        [MissionPod.Weapons]: new MissionPodModel(
            MissionPod.Weapons,
            "Weapons",
            "The pod contains additional torpedo launchers, phaser arrays, and targeting sensors.",
            [0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 1],
            [
                TalentsHelper.getTalent("Fast Targeting Systems"),
                TalentsHelper.getTalent("Rapid-Fire Torpedo Launcher")
            ]),
        [MissionPod.AstrometricsAndNavigation]: new MissionPodModel(
            MissionPod.AstrometricsAndNavigation,
            "Astrometrics and Navigation",
            "This pod contains sensors specifically tuned to detect, triangulate, and time distant quasar signals and map gravitic distortions. Combined with a secondary navigational defelctor, this pod allows a vessel to be highly accurate in warp and quickly ascertain its position even after travel through wormholds.",
            [0, 1, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("Advanced Sensor Suites")
            ],
            [ new SourcePrerequisite(Source.UtopiaPlanitia) ]),
        [MissionPod.DefensiveShieldEnhancement]: new MissionPodModel(
            MissionPod.DefensiveShieldEnhancement,
            "Defensive Shield Enhancement",
            "This pod contains extra shield generators, structural integrity field systems, and a network of graviton emitters capable of improving the defensive field around a starship",
            [0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0],
            [
                TalentsHelper.getTalent("Advanced Shields"),
                TalentsHelper.getTalent("Improved Shield Recharge")
            ],
            [ new SourcePrerequisite(Source.UtopiaPlanitia) ]),
        [MissionPod.EmergencyRecovery]: new MissionPodModel(
            MissionPod.EmergencyRecovery,
            "Emergency Recovery",
            "The pod contains extensive and robust tractor beam emitters and graviton buffers, along with mission-adaptable cargo space to allow the vessel to act as a fleet tender, or emergency recovery starship for vessels without propulsion.",
            [0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0],
            [
                TalentsHelper.getTalent("High-Power Tractor Beam"),
                TalentsHelper.getTalent("Redundant Systems")
            ],
            [ new SourcePrerequisite(Source.UtopiaPlanitia) ]),
        [MissionPod.FieldHospital]: new MissionPodModel(
            MissionPod.FieldHospital,
            "Field Hospital",
            "The pod has an isolated environment able to contain even the most virulent diseases known to Federation science, along with an independent life support system, holoemitters, medical repliators able to house hundreds of patients.",
            [0, 0, 0, 0, 0, 1],
            [0, 2, 0, 0, 0, 0],
            [
                TalentsHelper.getTalent("Emergency Medical Hologram"),
                TalentsHelper.getTalent("Advanced Sickbay")
            ],
            [ new SourcePrerequisite(Source.UtopiaPlanitia) ]),
        [MissionPod.FleetCarrier]: new MissionPodModel(
            MissionPod.FleetCarrier,
            "Fleet Carrier",
            "The pod contains a cavernous shuttlecraft bay along with the maintenance facilities for them. It is capable of handling craft as large as runabouts.",
            [0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 1, 0],
            [
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Command Ship")
            ],
            [ new SourcePrerequisite(Source.UtopiaPlanitia) ]),
        [MissionPod.FleetCommandSupport]: new MissionPodModel(
            MissionPod.FleetCommandSupport,
            "Fleet Command Support",
            "This is a specialized pod containing subspace communications transceivers that link into powerful sensor arrays, allowing starships in communications with the command ship to synchronize their fire systems together.",
            [1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Linked Fire Control")
            ],
            [ new SourcePrerequisite(Source.UtopiaPlanitia) ]),
        [MissionPod.MobileDrydock]: new MissionPodModel(
            MissionPod.MobileDrydock,
            "Mobile Drydock",
            "This pod contains a folded dry dock that can be unfurled and deployed for assisting in repairing other starships. Inside the remaining pod there are replicator facilities capable of disassembling asteroids and comets to produce replacement parts and hull for damaged vessels, plus a large work bee bay.",
            [0, 0, 0, 1, 0, 0],
            [0, 1, 0, 0, 1, 0],
            [
                TalentsHelper.getTalent("Improved Damage Control"),
                TalentsHelper.getTalent("Rugged Design")
            ],
            [ new SourcePrerequisite(Source.UtopiaPlanitia) ]),
        [MissionPod.WarpPropulsionPod]: new MissionPodModel(
            MissionPod.WarpPropulsionPod,
            "Warp Propulsion Pod",
            "The pod contains an advanced warp nacelle with paired coils, along with extra fusion reactors that can either assist the ship in maintaining a high warp velocity, or maintain a warp field after saucer separation.",
            [0, 1, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 0],
            [
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("Secondary Reactors")
            ],
            [ new SourcePrerequisite(Source.UtopiaPlanitia) ]),

    };

    getMissionPodByName(name: string) {
        let result = undefined;
        for (let id in this._missionPods) {
            if (MissionPod[id] === name) {
                result = this._missionPods[id];
                break;
            }
        }
        return result;
    }

    getMissionPods(starship: Starship) {
        let missionPods: MissionPodModel[] = [];

        for (var pod in this._missionPods) {
            let p = this._missionPods[pod];
            if (p.isPrerequisitesFulfilled(starship)) {
                missionPods.push(p);
            }
        }

        return missionPods;
    }

    getMissionPod(pod: MissionPod) {
        if (pod == null) {
            return null;
        }

        let model = this._missionPods[pod];
        return model == null ? null : model;
    }
}
