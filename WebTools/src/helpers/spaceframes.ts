import {character} from '../common/character';
import {Era} from './eras';
import {Source} from './sources';
import {TalentsHelper, TalentModel} from './talents';

export enum Spaceframe {
    Akira,
    Ambassador,
    Centaur,
    Constellation,
    Constitution,
    Daedalus,
    Defiant,
    Excelsior,
    Galaxy,
    Hermes,
    Intrepid,
    Luna,
    Miranda,
    Nebula,
    NewOrleans,
    Norway,
    Nova,
    NX,
    Oberth,
    Olympic,
    Saber,
    Sovereign,
    Steamrunner,
    Sydney,
}

export enum MissionPod {
    CommandAndControl,
    Sensors,
    Weapons
}

class SpaceframeModel {
    name: string;
    serviceYear: number;
    eras: Era[];
    source: Source;
    systems: number[];
    departments: number[];
    scale: number;
    attacks: string[];
    talents: TalentModel[];

    constructor(name: string, serviceYear: number, eras: Era[], source: Source, systems: number[], departments: number[], scale: number, attacks: string[], talents: TalentModel[]) {
        this.name = name;
        this.serviceYear = serviceYear;
        this.eras = eras;
        this.source = source;
        this.systems = systems;
        this.departments = departments;
        this.scale = scale;
        this.attacks = attacks;
        this.talents = talents;
    }
}

export class SpaceframeViewModel extends SpaceframeModel {
    id: Spaceframe;

    constructor(id: Spaceframe, base: SpaceframeModel) {
        super(base.name, base.serviceYear, base.eras, base.source, base.systems, base.departments, base.scale, base.attacks, base.talents);
        this.id = id;
    }
}

class MissionPodModel {
    name: string;
    description: string;
    departments: number[];
    systems: number[];
    talents: TalentModel[];

    constructor(name: string, description: string, departments: number[], systems: number[], talents: TalentModel[]) {
        this.name = name;
        this.description = description;
        this.departments = departments;
        this.systems = systems;
        this.talents = talents;
    }
}

export class MissionPodViewModel extends MissionPodModel {
    id: MissionPod;

    constructor(id: MissionPod, base: MissionPodModel) {
        super(base.name, base.description, base.departments, base.systems, base.talents);
        this.id = id;
    }
}

class Spaceframes {
    private _frames: { [id: number]: SpaceframeModel } = {
        [Spaceframe.Akira]: new SpaceframeModel(
            "Akira Class",
            2368,
            [],
            Source.Core,
            [9, 9, 10, 9, 11, 11],
            [0, 0, 2, 0, 0, 1],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentsHelper.getTalent("Ablative Armor"),
                TalentsHelper.getTalent("Extensive Shuttlebays"),
                TalentsHelper.getTalent("Rapid-Fire Torpedo Launcher")
            ]),
        [Spaceframe.Constellation]: new SpaceframeModel(
            "Constellation Class",
            2285,
            [],
            Source.Core,
            [8, 7, 9, 9, 8, 9],
            [0, 1, 1, 1, 0, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("Extensive Shuttlebays")
            ]),
        [Spaceframe.Constitution]: new SpaceframeModel(
            "Constitution Class",
            2243,
            [],
            Source.Core,
            [7, 7, 8, 8, 8, 8],
            [1, 0, 1, 0, 1, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Rugged Design"),
                TalentsHelper.getTalent("Modular Laboratories")
            ]),
        [Spaceframe.Defiant]: new SpaceframeModel(
            "Defiant Class",
            2371,
            [],
            Source.Core,
            [9, 9, 10, 9, 8, 13],
            [0, 1, 2, 0, 0, 0],
            3,
            [
                "Phaser Arrays",
                "Phaser Cannons",
                "Photon Torpedoes",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentsHelper.getTalent("Ablative Armor"),
                TalentsHelper.getTalent("Quantum Torpedoes")
            ]),
        [Spaceframe.Excelsior]: new SpaceframeModel(
            "Excelsior Class",
            2285,
            [],
            Source.Core,
            [8, 8, 9, 8, 9, 9],
            [1, 0, 0, 2, 0, 0],
            5,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentsHelper.getTalent("Improved Impulse Drive"),
                TalentsHelper.getTalent("Secondary Reactors")
            ]),
        [Spaceframe.Galaxy]: new SpaceframeModel(
            "Galaxy Class",
            2359,
            [],
            Source.Core,
            [9, 10, 10, 9, 10, 10],
            [1, 0, 0, 0, 1, 1],
            6,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 5)"
            ],
            [
                TalentsHelper.getTalent("Saucer Separation"),
                TalentsHelper.getTalent("Modular Laboratories"),
                TalentsHelper.getTalent("Redundant Systems")
            ]),
        [Spaceframe.Intrepid]: new SpaceframeModel(
            "Intrepid Class",
            2371,
            [],
            Source.Core,
            [10, 11, 11, 10, 8, 9],
            [0, 1, 0, 0, 2, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("Emergency Medical Hologram")
            ]),
        [Spaceframe.Miranda]: new SpaceframeModel(
            "Miranda Class",
            2274,
            [],
            Source.Core,
            [8, 8, 8, 9, 8, 9],
            [1, 1, 0, 0, 1, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Extensive Shuttlebays")
            ]),
        [Spaceframe.Nova]: new SpaceframeModel(
            "Nova Class",
            2368,
            [],
            Source.Core,
            [10, 10, 9, 10, 8, 8],
            [0, 0, 0, 1, 2, 0],
            3,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentsHelper.getTalent("Advanced Sensor Suites")
            ]),
        [Spaceframe.Daedalus]: new SpaceframeModel(
            "Daedalus Class",
            2140,
            [],
            Source.CommandDivision,
            [6, 6, 5, 6, 8, 5],
            [0, 0, 0, 2, 1, 0],
            3,
            [
                "Phase Cannons",
                "Spatial Torpedoes",
                "Grappler Cable (Strength 2)"
            ],
            [
                TalentsHelper.getTalent("Polarized Hull Plating"),
                TalentsHelper.getTalent("Grappler Cables"),
                TalentsHelper.getTalent("Rugged Design"),
            ]),
        [Spaceframe.NX]: new SpaceframeModel(
            "NX Class",
            2151,
            [],
            Source.CommandDivision,
            [6, 6, 6, 6, 7, 6],
            [0, 1, 0, 1, 1, 0],
            3,
            [
                "Phase Cannons",
                "Spatial Torpedoes",
                "Grappler Cable (Strength 2)"
            ],
            [
                TalentsHelper.getTalent("Polarized Hull Plating"),
                TalentsHelper.getTalent("Grappler Cables"),
            ]),
        [Spaceframe.Hermes]: new SpaceframeModel(
            "Hermes Class",
            2242,
            [],
            Source.CommandDivision,
            [7, 6, 9, 8, 8, 6],
            [0, 2, 0, 0, 1, 0],
            4,
            [
                "Phaser Banks",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Improved Reaction Control System"),
                TalentsHelper.getTalent("Independent Phaser Supply"),
                TalentsHelper.getTalent("Rugged Design"),
            ]),
        [Spaceframe.Oberth]: new SpaceframeModel(
            "Oberth Class",
            2269,
            [],
            Source.CommandDivision,
            [8, 9, 7, 9, 8, 7],
            [0, 1, 0, 0, 2, 0],
            3,
            [
                "Phaser Banks",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentsHelper.getTalent("High Resolution Sensors"),
                TalentsHelper.getTalent("Improved Warp Drive"),
            ]),
        [Spaceframe.Sydney]: new SpaceframeModel(
            "Sydney Class",
            2279,
            [],
            Source.CommandDivision,
            [8, 8, 9, 9, 8, 7],
            [0, 2, 0, 1, 0, 0],
            4,
            [
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Improved Impulse Drive"),
                TalentsHelper.getTalent("Rugged Design"),
            ]),
        [Spaceframe.Centaur]: new SpaceframeModel(
            "Centaur Class",
            2285,
            [],
            Source.CommandDivision,
            [8, 8, 9, 8, 8, 9],
            [0, 2, 1, 0, 0, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Improved Impulse Drive"),
                TalentsHelper.getTalent("Improved Warp Drive"),
            ]),
        [Spaceframe.Ambassador]: new SpaceframeModel(
            "Ambassador Class",
            2335,
            [],
            Source.CommandDivision,
            [9, 9, 9, 9, 10, 9],
            [1, 1, 0, 0, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentsHelper.getTalent("High Resolution Sensors"),
                TalentsHelper.getTalent("Improved Impulse Drive"),
                TalentsHelper.getTalent("Saucer Separation"),
            ]),
        [Spaceframe.Nebula]: new SpaceframeModel(
            "Nebula Class",
            2361,
            [],
            Source.CommandDivision,
            [9, 10, 10, 8, 10, 9],
            [0, 0, 0, 2, 0, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentsHelper.getTalent("Saucer Separation"),
            ]),
        [Spaceframe.NewOrleans]: new SpaceframeModel(
            "New Orleans Class",
            2364,
            [],
            Source.CommandDivision,
            [9, 10, 10, 10, 8, 9],
            [0, 1, 0, 1, 1, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("High Resolution Sensors"),
                TalentsHelper.getTalent("Modular Laboratories"),
            ]),
        [Spaceframe.Olympic]: new SpaceframeModel(
            "Olympic Class",
            2368,
            [],
            Source.CommandDivision,
            [10, 10, 10, 9, 9, 7],
            [0, 0, 0, 0, 1, 2],
            4,
            [
                "Phaser Arrays",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Advanced Sickbay"),
                TalentsHelper.getTalent("Modular Laboratories"),
                TalentsHelper.getTalent("Dedicated Personnel (Medicine)"),
            ]),
        [Spaceframe.Steamrunner]: new SpaceframeModel(
            "Steamrunner Class",
            2370,
            [],
            Source.CommandDivision,
            [10, 9, 11, 10, 9, 10],
            [0, 1, 1, 0, 1, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("Improved Warp Drive"),
            ]),
        [Spaceframe.Norway]: new SpaceframeModel(
            "Norway Class",
            2371,
            [],
            Source.CommandDivision,
            [10, 9, 10, 10, 11, 9],
            [0, 0, 0, 1, 0, 2],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentsHelper.getTalent("Advanced Sickbay"),
                TalentsHelper.getTalent("Emergency Medical Hologram"),
            ]),
        [Spaceframe.Saber]: new SpaceframeModel(
            "Saber",
            2371,
            [],
            Source.CommandDivision,
            [10, 9, 10, 10, 8, 9],
            [0, 2, 1, 0, 0, 0],
            3,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentsHelper.getTalent("High-Power Tractor Beam"),
                TalentsHelper.getTalent("Improved Impulse Drive"),
            ]),
        [Spaceframe.Sovereign]: new SpaceframeModel(
            "Sovereign Class",
            2371,
            [],
            Source.CommandDivision,
            [9, 11, 11, 9, 10, 10],
            [1, 0, 1, 0, 1, 0],
            6,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 5)"
            ],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Emergency Medical Hologram"),
                TalentsHelper.getTalent("Improved Warp Drive"),
                TalentsHelper.getTalent("Quantum Torpedoes"),
            ]),
        [Spaceframe.Luna]: new SpaceframeModel(
            "Luna Class",
            2372,
            [],
            Source.CommandDivision,
            [10, 11, 10, 11, 8, 9],
            [0, 0, 0, 1, 2, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 5)"
            ],
            [
                TalentsHelper.getTalent("Advanced Research Facilities"),
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("Emergency Medical Hologram"),
            ]),
        //[Spaceframe.]: new SpaceframeModel(
        //    "",
        //    0,
        //    [],
        //    Source.Core,
        //    [],
        //    [],
        //    0,
        //    [
        //    ],
        //    [
        //    ]),
    };

    private _missionPods: { [id: number]: MissionPodModel } = {
        [MissionPod.CommandAndControl]: new MissionPodModel(
            "Command & Control",
            "The pod contains additional subspace antennae and supplementary computer cores, allowing it to serve as a command vessel for fleet actions.",
            [1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Electronic Warfare Systems")
            ]),
        [MissionPod.Sensors]: new MissionPodModel(
            "Sensors",
            "The pod contains additional sensor systems, allowing the ship to serve a range of scientific and reconnaissance roles.",
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 2, 0, 0],
            [
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("High Resolution Sensors")
            ]),
        [MissionPod.Weapons]: new MissionPodModel(
            "Weapons",
            "The pod contains additional torpedo launchers, phaser arrays, and targeting sensors.",
            [0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 1],
            [
                TalentsHelper.getTalent("Fast Targeting Systems"),
                TalentsHelper.getTalent("Rapid-Fire Torpedo Launcher")
            ]),
    };

    getSpaceframes(year: number) {
        let frames: SpaceframeViewModel[] = [];
        let n = 0;

        for (var frame in this._frames) {
            let f = this._frames[frame];
            if (f.serviceYear <= year) {
                if (n === Spaceframe.Constitution && year >= 2290 ||
                    !character.hasSource(f.source)) {
                    n++
                    continue;
                }
                frames.push(new SpaceframeViewModel(n, f));
            }

            n++;
        }

        return frames;
    }

    getSpaceframe(frame: Spaceframe) {
        return this._frames[frame];
    }

    getMissionPods() {
        let missionPods: MissionPodViewModel[] = [];
        let n = 0;

        for (var pod in this._missionPods) {
            let p = this._missionPods[pod];
            missionPods.push(new MissionPodViewModel(n, p));
            n++;
        }

        return missionPods;
    }

    getMissionPod(pod: MissionPod) {
        if (pod === null) {
            return null;
        }

        return this._missionPods[pod];
    }
}

export const SpaceframeHelper = new Spaceframes();