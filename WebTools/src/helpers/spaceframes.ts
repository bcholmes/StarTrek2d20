import { CharacterType } from '../common/characterType';
import { hasSource } from '../state/contextFunctions';
import {Era} from './eras';
import {Source} from './sources';
import {TalentsHelper, TalentModel, TalentViewModel, TalentSelection} from './talents';

export enum Spaceframe {
    Akira,
    Ambassador,
    Archer,
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

    // Discovery
    Walker,
    Shepard,
    Magee,
    Cardenas,
    Hoover,
    Malachowski,
    Engle,
    Nimitz,
    Crossfield,
    Hiawatha,


    // Section 31
    StealthShip,
    Nimrod,
    Shiva,


    D5,
    Raptor,
    VonTalk,
    KToch,
    TuYuQ,
    D7,
    Brel,
    PachNom,
    QoToch,
    IwChaPar,
    D12,
    KlingonCivilianTransport,
    KVort,
    ParTok,
    Toron,
    VorCha,
    NeghVar,


    // Discovery
    DiscoBirdOfPrey,
    Qugh,
    Daspu,
    Qoj,
    Batlh,
    Chargh,
    NaQjej,
    Elth,
    BortasBir,
    Sech,
    SarcophagusShip,

}

export enum MissionPod {
    CommandAndControl,
    Sensors,
    Weapons
}


class SpaceframeModel {
    id: Spaceframe;
    type: CharacterType;
    name: string;
    serviceYear: number;
    eras: Era[];
    source: Source;
    systems: number[];
    departments: number[];
    scale: number;
    attacks: string[];
    talents: TalentSelection[];
    additionalTraits: string[];
    maxServiceYear: number;

    constructor(id: Spaceframe, type: CharacterType, name: string, serviceYear: number, eras: Era[], source: Source, systems: number[], departments: number[], 
        scale: number, attacks: string[], talents: TalentSelection[], additionalTraits: string[] = [ "Federation Starship" ], maxServiceYear: number = 99999) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.serviceYear = serviceYear;
        this.eras = eras;
        this.source = source;
        this.systems = systems;
        this.departments = departments;
        this.scale = scale;
        this.attacks = attacks;
        this.talents = talents;
        this.additionalTraits = additionalTraits;
        this.maxServiceYear = maxServiceYear;
    }
}

export class SpaceframeViewModel extends SpaceframeModel {
    id: Spaceframe;
    isMissionPodAvailable: boolean;
    isCustom: boolean;

    constructor(type: CharacterType, name: string, serviceYear: number, eras: Era[], source: Source, systems: number[], departments: number[], scale: number, 
        attacks: string[], talents: TalentSelection[], additionalTraits: string[] = [ "Federation Starship" ], maxServiceYear: number = 99999, id?: Spaceframe) {
        super(id, type, name, serviceYear, eras, source, systems, departments, scale, attacks, talents, additionalTraits, maxServiceYear);
        this.id = id;
        this.isCustom = (id === undefined || source === Source.None);
        this.isMissionPodAvailable = (id === Spaceframe.Nebula);
    }

    static createCustomSpaceframe(type: CharacterType, serviceYear: number, eras: Era[]) {
        return new SpaceframeViewModel(type, "", serviceYear, eras, Source.None, [7, 7, 7, 7, 7, 7], [0, 0, 0, 0, 0, 0], 3, [], [], type === CharacterType.KlingonWarrior ? [ "Klingon Starship"] : [ "Federation Starship" ]);
    }

    static from(base: SpaceframeModel) {
        return new SpaceframeViewModel(base.type, base.name, base.serviceYear, base.eras, base.source, base.systems, base.departments, base.scale, 
            base.attacks, base.talents, base.additionalTraits, base.maxServiceYear, base.id);
    }
}

export class MissionPodViewModel {
    id: number;
    name: string;
    description: string;
    departments: number[];
    systems: number[];
    talents: TalentModel[];

    constructor(id: number, name: string, description: string, departments: number[], systems: number[], talents: TalentModel[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.departments = departments;
        this.systems = systems;
        this.talents = talents;
    }
}

class Spaceframes {
    private _frames: { [id: number]: SpaceframeModel } = {
        [Spaceframe.Akira]: new SpaceframeModel(
            Spaceframe.Akira,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Rapid-Fire Torpedo Launcher")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Constellation]: new SpaceframeModel(
            Spaceframe.Constellation,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Extensive Shuttlebays")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Constitution]: new SpaceframeModel(
            Spaceframe.Constitution,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Rugged Design"),
                TalentSelection.selectTalent("Modular Laboratories")
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Defiant]: new SpaceframeModel(
            Spaceframe.Defiant,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Quantum Torpedoes")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Excelsior]: new SpaceframeModel(
            Spaceframe.Excelsior,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Secondary Reactors")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Galaxy]: new SpaceframeModel(
            Spaceframe.Galaxy,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Saucer Separation"),
                TalentSelection.selectTalent("Modular Laboratories"),
                TalentSelection.selectTalent("Redundant Systems")
            ]),
        [Spaceframe.Intrepid]: new SpaceframeModel(
            Spaceframe.Intrepid,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Emergency Medical Hologram")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Miranda]: new SpaceframeModel(
            Spaceframe.Miranda,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Extensive Shuttlebays")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Nova]: new SpaceframeModel(
            Spaceframe.Nova,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Advanced Sensor Suites")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Daedalus]: new SpaceframeModel(
            Spaceframe.Daedalus,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Polarized Hull Plating"),
                TalentSelection.selectTalent("Grappler Cables"),
                TalentSelection.selectTalent("Rugged Design"),
            ],
            [ "Federation Starship" ],
            2269),
        [Spaceframe.NX]: new SpaceframeModel(
            Spaceframe.NX,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Polarized Hull Plating"),
                TalentSelection.selectTalent("Grappler Cables"),
            ],
            [ "Federation Starship" ],
            2170),
        [Spaceframe.Hermes]: new SpaceframeModel(
            Spaceframe.Hermes,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Improved Reaction Control System"),
                TalentSelection.selectTalent("Independent Phaser Supply"),
                TalentSelection.selectTalent("Rugged Design"),
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Oberth]: new SpaceframeModel(
            Spaceframe.Oberth,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("High Resolution Sensors"),
                TalentSelection.selectTalent("Improved Warp Drive"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Sydney]: new SpaceframeModel(
            Spaceframe.Sydney,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Rugged Design"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Centaur]: new SpaceframeModel(
            Spaceframe.Centaur,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Improved Warp Drive"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Ambassador]: new SpaceframeModel(
            Spaceframe.Ambassador,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("High Resolution Sensors"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Saucer Separation"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Nebula]: new SpaceframeModel(
            Spaceframe.Nebula,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Saucer Separation"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.NewOrleans]: new SpaceframeModel(
            Spaceframe.NewOrleans,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("High Resolution Sensors"),
                TalentSelection.selectTalent("Modular Laboratories"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Olympic]: new SpaceframeModel(
            Spaceframe.Olympic,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Advanced Sickbay"),
                TalentSelection.selectTalent("Modular Laboratories"),
                TalentSelection.selectTalent("Dedicated Personnel (Medicine)"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Steamrunner]: new SpaceframeModel(
            Spaceframe.Steamrunner,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Improved Warp Drive"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Norway]: new SpaceframeModel(
            Spaceframe.Norway,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Advanced Sickbay"),
                TalentSelection.selectTalent("Emergency Medical Hologram"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Saber]: new SpaceframeModel(
            Spaceframe.Saber,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("High-Power Tractor Beam"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Sovereign]: new SpaceframeModel(
            Spaceframe.Sovereign,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Emergency Medical Hologram"),
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Quantum Torpedoes"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Luna]: new SpaceframeModel(
            Spaceframe.Luna,
            CharacterType.Starfleet,
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
                TalentSelection.selectTalent("Advanced Research Facilities"),
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Emergency Medical Hologram"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Archer]: new SpaceframeModel(
            Spaceframe.Archer,
            CharacterType.Starfleet,
            "Archer Class",
            2258,
            [],
            Source.TricorderSet,
            [8, 9, 6, 7, 8, 6],
            [0, 0, 1, 2, 0, 0],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Improved Reaction Control System")
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Walker]: new SpaceframeModel(
            Spaceframe.Walker,
            CharacterType.Starfleet,
            "Walker Class",
            2195,
            [],
            Source.DiscoveryCampaign,
            [6, 7, 6, 8, 6, 6],
            [0, 0, 0, 1, 1, 1],
            3,
            [
                "Phase Cannons",
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Rugged Design")
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Shepard]: new SpaceframeModel(
            Spaceframe.Shepard,
            CharacterType.Starfleet,
            "Shepard Class",
            2195,
            [],
            Source.DiscoveryCampaign,
            [6, 6, 7, 7, 7, 6],
            [0, 0, 1, 1, 1, 0],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Rugged Design")
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Magee]: new SpaceframeModel(
            Spaceframe.Magee,
            CharacterType.Starfleet,
            "Magee Class",
            2198,
            [],
            Source.DiscoveryCampaign,
            [7, 7, 6, 8, 6, 5],
            [0, 0, 0, 1, 2, 0],
            3,
            [
                "Phaser Banks",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Advanced Research Facilities"),
                TalentSelection.selectTalent("Specialized Crew (Science)")
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Cardenas]: new SpaceframeModel(
            Spaceframe.Cardenas,
            CharacterType.Starfleet,
            "Cardenas Class",
            2202,
            [],
            Source.DiscoveryCampaign,
            [6, 6, 8, 7, 6, 7],
            [0, 1, 1, 0, 1, 0],
            4,
            [
                "Phase Cannons",
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Redundant Systems [Warp Enginges]")
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Hoover]: new SpaceframeModel(
            Spaceframe.Hoover,
            CharacterType.Starfleet,
            "Hoover Class",
            2209,
            [],
            Source.DiscoveryCampaign,
            [6, 6, 7, 6, 7, 8],
            [0, 0, 1, 1, 1, 0],
            4,
            [
                "Phase Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Extensive Shuttlebays")
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Malachowski]: new SpaceframeModel(
            Spaceframe.Malachowski,
            CharacterType.Starfleet,
            "Malachowski Class",
            2210,
            [],
            Source.DiscoveryCampaign,
            [7, 6, 5, 6, 8, 8],
            [0, 0, 2, 1, 0, 0],
            3,
            [
                "Phase Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Fast Targeting Systems"),
                TalentSelection.selectTalent("Rapid-Fire Torpedo Launcher"),
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Engle]: new SpaceframeModel(
            Spaceframe.Engle,
            CharacterType.Starfleet,
            "Engle Class",
            2224,
            [],
            Source.DiscoveryCampaign,
            [7, 8, 8, 6, 6, 6],
            [0, 1, 0, 1, 0, 1],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Nimitz]: new SpaceframeModel(
            Spaceframe.Nimitz,
            CharacterType.Starfleet,
            "Nimitz Class",
            2235,
            [],
            Source.DiscoveryCampaign,
            [8, 7, 7, 7, 7, 7],
            [2, 0, 0, 0, 1, 0],
            4,
            [
                "Phaser Banks",
                "Phase Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Crossfield]: new SpaceframeModel(
            Spaceframe.Crossfield,
            CharacterType.Starfleet,
            "Crossfield Class",
            2255,
            [],
            Source.DiscoveryCampaign,
            [7, 8, 8, 8, 8, 7],
            [0, 0, 0, 1, 2, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Hiawatha]: new SpaceframeModel(
            Spaceframe.Hiawatha,
            CharacterType.Starfleet,
            "Hiawatha Class",
            2235,
            [],
            Source.DiscoveryCampaign,
            [8, 8, 6, 8, 8, 5],
            [0, 0, 0, 0, 1, 2],
            3,
            [
                "Phase Cannons",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Advanced Sickbay"),
                TalentSelection.selectTalent("Redundant Systems [Life Support]"),
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.StealthShip]: new SpaceframeModel(
            Spaceframe.StealthShip,
            CharacterType.Starfleet,
            "Stealth Ship",
            2250,
            [],
            Source.DiscoveryCampaign,
            [8, 8, 6, 9, 6, 6],
            [0, 0, 0, 0, 3, 0],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Electronic Warfare Systems"),
                TalentSelection.selectTalent("Stealth Systems"),
            ],
            [ "Federation Starship", "Section 31 Starship" ],
            2350),
        [Spaceframe.Nimrod]: new SpaceframeModel(
            Spaceframe.Nimrod,
            CharacterType.Starfleet,
            "Nimrod",
            2250,
            [],
            Source.DiscoveryCampaign,
            [7, 7, 8, 7, 7, 8],
            [0, 0, 1, 1, 1, 0],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Electronic Warfare Systems"),
                TalentSelection.selectTalent("Improved Warp Drive"),
            ],
            [ "Federation Starship", "Section 31 Starship" ],
            2299),
        [Spaceframe.Shiva]: new SpaceframeModel(
            Spaceframe.Shiva,
            CharacterType.Starfleet,
            "Shiva",
            2253,
            [],
            Source.DiscoveryCampaign,
            [9, 9, 7, 7, 6, 7],
            [1, 1, 0, 1, 0, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Electronic Warfare Systems"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
            ],
            [ "Federation Starship", "Section 31 Starship" ],
            2299),
            


        // Klingon Spaceframes
        [Spaceframe.D5]: new SpaceframeModel(
            Spaceframe.D5,
            CharacterType.KlingonWarrior,
            "D5-Class Battle Cruiser",
            2146,
            [Era.Enterprise],
            Source.KlingonCore,
            [6, 7, 7, 6, 7, 8],
            [1, 0, 1, 1, 0, 0],
            2,
            [
                "Disruptor Cannons",
                "Photon Torpedoes"
            ],
            [
                TalentSelection.selectTalent("Improved Hull Integrity"),
                TalentSelection.selectTalent("Improved Warp Drive")
            ],
            [
                "Klingon Starship"
            ],
            2279),
        [Spaceframe.Raptor]: new SpaceframeModel(
            Spaceframe.Raptor,
            CharacterType.KlingonWarrior,
            "Raptor-class Scout",
            2146,
            [Era.Enterprise],
            Source.KlingonCore,
            [6, 6, 7, 7, 7, 6],
            [0, 1, 1, 0, 1, 0],
            2,
            [
                "Disruptor Cannons",
                "Photon Torpedoes"
            ],
            [
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Improved Reaction Control System")
            ],
            [
                "Klingon Starship",
                "Targ-pit"
            ],
            2270),
        [Spaceframe.VonTalk]: new SpaceframeModel(
            Spaceframe.VonTalk,
            CharacterType.KlingonWarrior,
            "Vo'n'Talk",
            2149,
            [Era.Enterprise],
            Source.KlingonCore,
            [6, 6, 8, 7, 6, 7],
            [0, 1, 1, 1, 0, 0],
            3,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Reaction Control System"),
                TalentSelection.selectTalent("Redundant Systems [Warp Drive]"),
            ],
            [
                "Klingon Starship",
                "Bird-of-Prey"
            ],
            2210),
        [Spaceframe.KToch]: new SpaceframeModel(
            Spaceframe.KToch,
            CharacterType.KlingonWarrior,
            "K'Toch Scout",
            2128,
            [Era.Enterprise, Era.OriginalSeries],
            Source.KlingonCore,
            [6, 6, 5, 7, 5, 7],
            [0, 1, 0, 1, 1, 0],
            2,
            [
                "Disruptor Cannons"
            ],
            [
                TalentSelection.selectTalent("Rugged Design")
            ],
            [
                "Klingon Starship"
            ],
            2310),
        [Spaceframe.TuYuQ]: new SpaceframeModel(
            Spaceframe.TuYuQ,
            CharacterType.KlingonWarrior,
            "Tu'YuQ Exploratory Ship",
            2176,
            [Era.Enterprise, Era.OriginalSeries],
            Source.KlingonCore,
            [7, 8, 7, 7, 5, 7],
            [0, 0, 1, 0, 1, 1],
            3,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("High Resolution Sensors"),
                TalentSelection.selectTalent("Improved Power Systems")
            ],
            [
                "Klingon Starship",
                "Bird-of-Prey"
            ],
            2299),
        [Spaceframe.D7]: new SpaceframeModel(
            Spaceframe.D7,
            CharacterType.KlingonWarrior,
            "D7-Class Battle Cruiser",
            2250,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.KlingonCore,
            [7, 7, 8, 7, 8, 9],
            [0, 1, 2, 0, 0, 0],
            4,
            [
                "Disruptor Cannons",
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Rugged Design")
            ],
            [
                "Klingon Starship",
                "Long-Serving (24th century)"
            ],
            2350),
        [Spaceframe.Brel]: new SpaceframeModel(
            Spaceframe.Brel,
            CharacterType.KlingonWarrior,
            "B'rel-Class Bird-of-Prey",
            2280,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.KlingonCore,
            [8, 7, 9, 7, 7, 9],
            [0, 2, 1, 0, 0, 0],
            3,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Fast Targeting Systems")
            ],
            [
                "Klingon Starship",
                "Bird-of-Prey"
            ],
            99999),
        [Spaceframe.PachNom]: new SpaceframeModel(
            Spaceframe.PachNom,
            CharacterType.KlingonWarrior,
            "Pach'Nom Multirole Escort",
            2297,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.KlingonCore,
            [8, 7, 8, 8, 10, 8],
            [0, 0, 1, 1, 0, 1],
            5,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Advanced Medical Ward"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Redundant Systems [Engines]")
            ],
            [
                "Klingon Starship"
            ]),
        [Spaceframe.QoToch]: new SpaceframeModel(
            Spaceframe.QoToch,
            CharacterType.KlingonWarrior,
            "Qo'Toch Heavy Fighter",
            2298,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.KlingonCore,
            [7, 7, 6, 8, 6, 8],
            [0, 1, 1, 1, 0, 0],
            2,
            [
                "Disruptor Cannons"
            ],
            [
                TalentSelection.selectTalent("Improved Hull Integrity")
            ],
            [
                "Klingon Starship"
            ]),
        [Spaceframe.IwChaPar]: new SpaceframeModel(
            Spaceframe.IwChaPar,
            CharacterType.KlingonWarrior,
            "Iw'Cha'Par Heavy Explorer",
            2295,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.KlingonCore,
            [9, 9, 7, 8, 7, 8],
            [0, 0, 2, 0, 1, 0],
            4,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("High Resolution Sensors"),
                TalentSelection.selectTalent("Rapid-Fire Torpedo Launcher")
            ],
            [
                "Klingon Starship",
                "Bird-of-Prey"
            ]),
        [Spaceframe.D12]: new SpaceframeModel(
            Spaceframe.D12,
            CharacterType.KlingonWarrior,
            "D12-Class Bird-of-Prey",
            2315,
            [Era.NextGeneration],
            Source.KlingonCore,
            [9, 7, 9, 7, 8, 10],
            [0, 1, 2, 0, 0, 0],
            4,
            [
                "Disruptor Cannons",
                "Disruptor Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Backup EPS Conduits"),
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Rugged Design")
            ],
            [ 
                "Klingon Starship", 
                "Bird-of-Prey", 
                "Bad Reputation"
            ],
            99999),
        [Spaceframe.KlingonCivilianTransport]: new SpaceframeModel(
            Spaceframe.KlingonCivilianTransport,
            CharacterType.KlingonWarrior,
            "Klingon Civilian Transport",
            2352,
            [Era.NextGeneration],
            Source.KlingonCore,
            [7, 8, 9, 8, 9, 8],
            [0, 1, 1, 0, 0, 1],
            4,
            [
                "Disruptor Banks",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Redundant Systems [Life Support / Structure]"),
                TalentSelection.selectTalent("Rugged Design")
            ],
            [ 
                "Klingon Starship", 
                "Civilian", 
                "Targ-Pit"
            ]),
        [Spaceframe.KVort]: new SpaceframeModel(
            Spaceframe.KVort,
            CharacterType.KlingonWarrior,
            "K'Vort-Class Bird-of-Prey",
            2349,
            [Era.NextGeneration],
            Source.KlingonCore,
            [9, 8, 11, 8, 9, 11],
            [0, 2, 1, 0, 0, 0],
            5,
            [
                "Disruptor Banks",
                "Disruptor Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Improved Reaction Control System")
            ],
            [ 
                "Klingon Starship",
                "Bird-of-Prey"
            ],
            99999),
        [Spaceframe.ParTok]: new SpaceframeModel(
            Spaceframe.ParTok,
            CharacterType.KlingonWarrior,
            "Par'Tok Transport",
            2356,
            [Era.NextGeneration],
            Source.KlingonCore,
            [9, 7, 10, 8, 8, 7],
            [0, 1, 0, 2, 0, 0],
            5,
            [
                "Disruptor Banks",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Modular Cargo Pods"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Secondary Reactors")
            ],
            [ 
                "Klingon Starship", 
                "Civilian", 
                "Targ-Pit"
            ]),
        [Spaceframe.Toron]: new SpaceframeModel(
            Spaceframe.Toron,
            CharacterType.KlingonWarrior,
            "Toron-Class Shuttlepod",
            2357,
            [Era.NextGeneration],
            Source.KlingonCore,
            [5, 5, 7, 5, 5, 7],
            [0, 2, 1, 1, 0, 0],
            1,
            [
                "Disruptor Arrays",
                "Photon Torpedo"
            ],
            [
                TalentSelection.selectTalent("Improved Reaction Control System")
            ],
            [ 
                "Klingon Ship", 
                "Small Craft"
            ]),
        [Spaceframe.VorCha]: new SpaceframeModel(
            Spaceframe.VorCha,
            CharacterType.KlingonWarrior,
            "Vor'Cha-Class Attack Cruiser",
            2367,
            [Era.NextGeneration],
            Source.KlingonCore,
            [9, 9, 10, 9, 10, 10],
            [1, 0, 2, 0, 0, 0],
            6,
            [
                "Disruptor Cannons",
                "Disruptor Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Improved Hull Integrity")
            ],
            [
                "Klingon Starship"
            ],
            99999),
        [Spaceframe.NeghVar]: new SpaceframeModel(
            Spaceframe.NeghVar,
            CharacterType.KlingonWarrior,
            "Negh'Var-Class Warship",
            2372,
            [Era.NextGeneration],
            Source.KlingonCore,
            [8, 10, 9, 8, 10, 12],
            [1, 0, 1, 1, 0, 0],
            6,
            [
                "Disruptor Cannons",
                "Disruptor Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 5)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Fast Targeting Systems"),
                TalentSelection.selectTalent("Secondary Reactors")
            ],
            [
                "Klingon Starship"
            ],
            99999),
        [Spaceframe.DiscoBirdOfPrey]: new SpaceframeModel(
            Spaceframe.DiscoBirdOfPrey,
            CharacterType.KlingonWarrior,
            "Bird of Prey (Mid 23rd Century)",
            2233,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [6, 6, 7, 8, 7, 8],
            [0, 1, 2, 0, 0, 0],
            3,
            [
                "Phaser Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Monopole Warp Field"),
                TalentSelection.selectTalent("Stealth Systems")
            ],
            [
                "Klingon Starship", "Bird-Of-Prey"
            ],
            2285),
        [Spaceframe.Qugh]: new SpaceframeModel(
            Spaceframe.Qugh,
            CharacterType.KlingonWarrior,
            "Qugh-class Destroyer",
            2130,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [4, 4, 7, 5, 6, 6],
            [0, 1, 1, 1, 0, 0],
            3,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Secondary Reactors"),
                TalentSelection.selectTalent("Stealth Systems")  // NOTE: pre-2245 ships are meant to have Extensive Shuttlebays
            ],
            [
                "Klingon Starship", "Hur'q Starship"
            ],
            2260),
        [Spaceframe.Daspu]: new SpaceframeModel(
            Spaceframe.Daspu,
            CharacterType.KlingonWarrior,
            "Daspu'-class Escort",
            2175,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [6, 5, 5, 6, 7, 7],
            [0, 1, 1, 1, 0, 0],
            3,
            [
                "Disruptor Banks",
                "Phasor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Monopole Warp Field"),
                TalentSelection.selectTalent("Stealth Systems")
            ],
            [
                "Klingon Starship", "Hur'q Starship", "Targ Pit"
            ],
            2269),
        [Spaceframe.Qoj]: new SpaceframeModel(
            Spaceframe.Qoj,
            CharacterType.KlingonWarrior,
            "Qoj-class Dreadnought",
            2225,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [8, 6, 6, 7, 8, 8],
            [1, 1, 1, 0, 0, 0],
            5,
            [
                "Disruptor Banks",
                "Phasor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Stealth Systems")
            ],
            [
                "Klingon Starship", "Hur'q Starship"
            ],
            2269),
        [Spaceframe.Batlh]: new SpaceframeModel(
            Spaceframe.Batlh,
            CharacterType.KlingonWarrior,
            "Batlh-class Escort",
            2203,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [7, 7, 6, 7, 7, 8],
            [0, 0, 1, 1, 1, 0],
            4,
            [
                "Disruptor Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Stealth Systems"),
                TalentSelection.selectTalent("Fast Targeting Systems")
            ],
            [
                "Klingon Starship"
            ],
            2268),
        [Spaceframe.Chargh]: new SpaceframeModel(
            Spaceframe.Chargh,
            CharacterType.KlingonWarrior,
            "Chargh / Jach-class Battlecruiser",
            2203,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [6, 7, 7, 6, 6, 8],
            [0, 0, 2, 1, 0, 0],
            4,
            [
                "Disruptor Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Stealth Systems"),
                TalentSelection.selectTalent("Redundant Systems [Computers]"),
                TalentSelection.selectTalent("Fast Targeting Systems")
            ],
            [
                "Klingon Starship"
            ],
            2269),
        [Spaceframe.NaQjej]: new SpaceframeModel(
            Spaceframe.NaQjej,
            CharacterType.KlingonWarrior,
            "Na'Qjej-class Cleave Ship",
            2185,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [6, 5, 6, 6, 9, 7],
            [0, 2, 0, 1, 0, 0],
            4,
            [
                "Disruptor Banks",
                "Disruptor Cannons"
            ],
            [
                TalentSelection.selectTalent("Stealth Systems"),
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Improved Hull Integrity", 2)
            ],
            [
                "Klingon Starship", "Doomed"
            ],
            2269),
        [Spaceframe.Elth]: new SpaceframeModel(
            Spaceframe.Elth,
            CharacterType.KlingonWarrior,
            "'Elth-class Assault Ship",
            2185,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [6, 6, 8, 7, 8, 6],
            [1, 0, 1, 0, 0, 1],
            4,
            [
                "Disruptor Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Advanced Medical Ward"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Improved Hull Integrity")
            ],
            [
                "Klingon Starship"
            ],
            2304),
        [Spaceframe.BortasBir]: new SpaceframeModel(
            Spaceframe.BortasBir,
            CharacterType.KlingonWarrior,
            "Bortas bir-class Battlecruiser",
            2235,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [6, 7, 7, 7, 8, 8],
            [0, 2, 1, 0, 0, 0],
            4,
            [
                "Disruptor Cannons",
                "Disruptor Banks",
                "Phaser Banks",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Stealth Systems"),
                TalentSelection.selectTalent("Fast Targeting Systems"),
                TalentSelection.selectTalent("Improved Reaction Control System")
            ],
            [
                "Klingon Starship", "Hur'q Starship"
            ],
            2258),
        [Spaceframe.Sech]: new SpaceframeModel(
            Spaceframe.Sech,
            CharacterType.KlingonWarrior,
            "Sech-class Fast Frigate",
            2231,
            [Era.OriginalSeries, Era.NextGeneration],
            Source.DiscoveryCampaign,
            [7, 7, 8, 7, 7, 7],
            [0, 2, 1, 0, 0, 0],
            4,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Stealth Systems"),
                TalentSelection.selectTalent("Improved Warp Drive")
            ],
            [
                "Klingon Starship"
            ],
            2269),
                

        //[Spaceframe.]: new SpaceframeModel(
        //    CharacterType.Starfleet,
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

    private _missionPods: { [id: number]: MissionPodViewModel } = {
        [MissionPod.CommandAndControl]: new MissionPodViewModel(
            MissionPod.CommandAndControl,
            "Command & Control",
            "The pod contains additional subspace antennae and supplementary computer cores, allowing it to serve as a command vessel for fleet actions.",
            [1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0],
            [
                TalentsHelper.getTalent("Command Ship"),
                TalentsHelper.getTalent("Electronic Warfare Systems")
            ]),
        [MissionPod.Sensors]: new MissionPodViewModel(
            MissionPod.Sensors,
            "Sensors",
            "The pod contains additional sensor systems, allowing the ship to serve a range of scientific and reconnaissance roles.",
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 2, 0, 0],
            [
                TalentsHelper.getTalent("Advanced Sensor Suites"),
                TalentsHelper.getTalent("High Resolution Sensors")
            ]),
        [MissionPod.Weapons]: new MissionPodViewModel(
            MissionPod.Weapons,
            "Weapons",
            "The pod contains additional torpedo launchers, phaser arrays, and targeting sensors.",
            [0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 1],
            [
                TalentsHelper.getTalent("Fast Targeting Systems"),
                TalentsHelper.getTalent("Rapid-Fire Torpedo Launcher")
            ]),
    };

    getSpaceframes(year: number, type: CharacterType, ignoreMaxServiceYear: boolean = false) {
        let frames: SpaceframeViewModel[] = [];
        for (var frame in this._frames) {
            let f = this._frames[frame];
            if (f.serviceYear <= year && (f.maxServiceYear >= year || ignoreMaxServiceYear)) {
                if (hasSource(f.source) && type === f.type) {
                    frames.push(SpaceframeViewModel.from(f));
                }
            }
        }

        return frames;
    }

    getSpaceframe(frame: Spaceframe) {
        const result = this._frames[frame];
        return result ? SpaceframeViewModel.from(result) : undefined;
    }

    getSpaceframeByName(name: string) {
        let result = undefined;
        for (let id in this._frames) {
            if (Spaceframe[id] === name) {
                result = SpaceframeViewModel.from(this._frames[id]);
                break;
            }
        }
        return result;
    }

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

    getMissionPods() {
        let missionPods: MissionPodViewModel[] = [];

        for (var pod in this._missionPods) {
            let p = this._missionPods[pod];
            missionPods.push(p);
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

export const SpaceframeHelper = new Spaceframes();