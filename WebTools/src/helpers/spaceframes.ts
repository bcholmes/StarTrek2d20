import { CharacterType } from '../common/characterType';
import { Starship } from '../common/starship';
import { hasAnySource } from '../state/contextFunctions';
import { Era } from './eras';
import { IConstructPrerequisite, ServiceYearPrerequisite } from './prerequisite';
import {Source} from './sources';
import { Spaceframe } from './spaceframeEnum';
import { SoloSpaceframeStats, SpaceframeModel } from './spaceframeModel';
import { TalentSelection } from './talentSelection';

export class SourcePrerequisite implements IConstructPrerequisite<Starship> {
    sources: Source[];

    constructor(...source: Source[]) {
        this.sources = source;
    }

    isPrerequisiteFulfilled(c: Starship) {
        return hasAnySource(this.sources);
    }

    describe(): string {
        return "";
    }
}

export class NotSourcePrerequisite implements IConstructPrerequisite<Starship> {
    sources: Source[];

    constructor(...source: Source[]) {
        this.sources = source;
    }

    isPrerequisiteFulfilled(c: Starship) {
        return !hasAnySource(this.sources);
    }

    describe(): string {
        return "";
    }
}

export class SpaceframeHelper {

    private static _instance;

    static instance(): SpaceframeHelper {
        if (SpaceframeHelper._instance == null) {
            SpaceframeHelper._instance = new SpaceframeHelper();
        }
        return SpaceframeHelper._instance;
    }

    private _frames: { [id: number]: SpaceframeModel } = {
        [Spaceframe.Akira]: new SpaceframeModel(
            Spaceframe.Akira,
            CharacterType.Starfleet,
            "Akira Class",
            2368,
            [
                new SourcePrerequisite(Source.Core),
                new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.GmToolkit2e),
                new ServiceYearPrerequisite(2368)
            ],
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
            [
                new SourcePrerequisite(Source.Core),
                new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.GmToolkit2e),
                new ServiceYearPrerequisite(2285)
            ],
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
            [ new SourcePrerequisite(Source.Core), new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.Core2ndEdition),
                new ServiceYearPrerequisite(2243) ],
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
            [
                new SourcePrerequisite(Source.Core),
                new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.GmToolkit2e),
                new ServiceYearPrerequisite(2371)
            ],
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
            [
                new SourcePrerequisite(Source.Core),
                new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.Core2ndEdition),
                new ServiceYearPrerequisite(2285)
            ],
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
            [
                new SourcePrerequisite(Source.Core, Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.Core2ndEdition)
             ],
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
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 11, 10, 10, 10, 10],
                [3, 2, 2, 2, 3, 3],
            )),
        [Spaceframe.Intrepid]: new SpaceframeModel(
            Spaceframe.Intrepid,
            CharacterType.Starfleet,
            "Intrepid Class",
            2371,
            [
                new SourcePrerequisite(Source.Core),
                new NotSourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.Core2ndEdition),
                new ServiceYearPrerequisite(2371)
            ],
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
            [
                new SourcePrerequisite(Source.Core),
                new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.GmToolkit2e),
                new ServiceYearPrerequisite(2274)
            ],
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
            [
                new SourcePrerequisite(Source.Core, Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2368)
            ],
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
            99999,
            new SoloSpaceframeStats(
                [10, 10, 10, 10, 8, 8],
                [2, 2, 2, 2, 4, 3],
            )),
        [Spaceframe.Daedalus]: new SpaceframeModel(
            Spaceframe.Daedalus,
            CharacterType.Starfleet,
            "Daedalus Class",
            2140,
            [ new SourcePrerequisite(Source.CommandDivision), new NotSourcePrerequisite(Source.UtopiaPlanitia),
                new ServiceYearPrerequisite(2140) ],
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
            [
                new SourcePrerequisite(Source.CommandDivision),
                new NotSourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.Core2ndEdition),
                new ServiceYearPrerequisite(2151)
            ],
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
        [Spaceframe.Hermes]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Hermes,
            CharacterType.Starfleet,
            "Hermes Class",
            2242,
            [ Source.CommandDivision, Source.UtopiaPlanitia ],
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
            2290,
            new SoloSpaceframeStats(
                [7, 9, 9, 10, 8, 6],
                [2, 4, 1, 3, 4, 2]
            )),
        [Spaceframe.ScoutType]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.ScoutType,
            CharacterType.Starfleet,
            "Scout Type",
            2242,
            [ Source.CaptainsLog ],
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
            2290,
            new SoloSpaceframeStats(
                [7, 9, 9, 10, 8, 6],
                [2, 4, 1, 3, 4, 2]
            )),
        [Spaceframe.Oberth]: new SpaceframeModel(
            Spaceframe.Oberth,
            CharacterType.Starfleet,
            "Oberth Class",
            2269,
            [
                new SourcePrerequisite(Source.CommandDivision),
                new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.GmToolkit2e),
                new ServiceYearPrerequisite(2269) ],
            [8, 9, 7, 9, 8, 7],
            [0, 1, 0, 0, 2, 0],
            3,
            [
                "Phaser Banks",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Improved Warp Drive"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Sydney]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Sydney,
            CharacterType.Starfleet,
            "Sydney Class",
            2279,
            [ Source.CommandDivision, Source.UtopiaPlanitia ],
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
            99999,
            new SoloSpaceframeStats(
                [9, 7, 9, 9, 10, 7],
                [2, 4, 2, 2, 2, 3]
            )),
        [Spaceframe.Centaur]: new SpaceframeModel(
            Spaceframe.Centaur,
            CharacterType.Starfleet,
            "Centaur Class",
            2285,
            [ new SourcePrerequisite(Source.CommandDivision), new NotSourcePrerequisite(Source.UtopiaPlanitia),
                new ServiceYearPrerequisite(2285) ],
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
            [ new SourcePrerequisite(Source.CommandDivision), new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.Core2ndEdition),
                new ServiceYearPrerequisite(2335) ],
            [9, 9, 9, 9, 10, 9],
            [1, 1, 0, 0, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
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
            [
                new SourcePrerequisite(Source.CommandDivision),
                new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.GmToolkit2e),
                new ServiceYearPrerequisite(2361) ],
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
        [Spaceframe.NewOrleans]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.NewOrleans,
            CharacterType.Starfleet,
            "New Orleans Class",
            2364,
            [ Source.CommandDivision, Source.UtopiaPlanitia ],
            [9, 10, 10, 10, 8, 9],
            [0, 1, 0, 1, 1, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Modular Laboratories"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 10, 10, 10, 8, 9],
                [2, 3, 1, 4, 4, 2],
            )),
        [Spaceframe.Olympic]: new SpaceframeModel(
            Spaceframe.Olympic,
            CharacterType.Starfleet,
            "Olympic Class",
            2368,
            [ new SourcePrerequisite(Source.CommandDivision), new NotSourcePrerequisite(Source.UtopiaPlanitia),
                new ServiceYearPrerequisite(2268) ],
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
            [ new SourcePrerequisite(Source.CommandDivision), new NotSourcePrerequisite(Source.UtopiaPlanitia),
                new ServiceYearPrerequisite(2370) ],
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
            [ new SourcePrerequisite(Source.CommandDivision), new NotSourcePrerequisite(Source.UtopiaPlanitia),
                new ServiceYearPrerequisite(2371) ],
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
        [Spaceframe.Saber]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Saber,
            CharacterType.Starfleet,
            "Saber",
            2371,
            [ Source.CommandDivision, Source.UtopiaPlanitia ],
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
            99999,
            new SoloSpaceframeStats(
                [10, 9, 11, 10, 9, 9],
                [2, 4, 4, 2, 1, 2],
            )),
        [Spaceframe.Sovereign]: new SpaceframeModel(
            Spaceframe.Sovereign,
            CharacterType.Starfleet,
            "Sovereign Class",
            2371,
            [ new SourcePrerequisite(Source.CommandDivision), new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.Core2ndEdition),
                new ServiceYearPrerequisite(2371) ],
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
            [
                new SourcePrerequisite(Source.CommandDivision),
                new NotSourcePrerequisite(Source.UtopiaPlanitia, Source.GmToolkit2e),
                new ServiceYearPrerequisite(2372)
            ],
            [10, 11, 10, 11, 8, 9],
            [0, 0, 0, 1, 2, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Advanced Research Facilities"),
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Emergency Medical Hologram"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Archer]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Archer,
            CharacterType.Starfleet,
            "Archer Class",
            2258,
            [ Source.TricorderSet, Source.UtopiaPlanitia ],
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
            2290,
            new SoloSpaceframeStats(
                [9, 8, 10, 9, 6, 6],
                [2, 4, 2, 2, 3, 1]
            )),
        [Spaceframe.Walker]: new SpaceframeModel(
            Spaceframe.Walker,
            CharacterType.Starfleet,
            "Walker Class",
            2195,
            [
                new SourcePrerequisite(Source.DiscoveryCampaign, Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2195)
            ],
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
            2265,
            new SoloSpaceframeStats(
                [7, 8, 7, 10, 7, 6],
                [2, 2, 2, 3, 3, 3]
            )),
        [Spaceframe.Shepard]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Shepard,
            CharacterType.Starfleet,
            "Shepard Class",
            2195,
            [ Source.DiscoveryCampaign, Source.UtopiaPlanitia ],
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
            2290,
            new SoloSpaceframeStats(
                [6, 7, 9, 8, 8, 7],
                [2, 2, 3, 3, 3, 2]
            )),
        [Spaceframe.Magee]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Magee,
            CharacterType.Starfleet,
            "Magee Class",
            2198,
            [ Source.DiscoveryCampaign, Source.UtopiaPlanitia ],
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
            2290,
            new SoloSpaceframeStats(
                [7, 9, 7, 10, 6, 5],
                [2, 2, 1, 4, 5, 2]
            )),
        [Spaceframe.Cardenas]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Cardenas,
            CharacterType.Starfleet,
            "Cardenas Class",
            2202,
            [ Source.DiscoveryCampaign, Source.UtopiaPlanitia ],
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
            2290,
            new SoloSpaceframeStats(
                [7, 6, 9, 8, 6, 7],
                [2, 3, 3, 2, 3, 1]
            )),
        [Spaceframe.Hoover]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Hoover,
            CharacterType.Starfleet,
            "Hoover Class",
            2209,
            [ Source.DiscoveryCampaign, Source.UtopiaPlanitia ],
            [6, 6, 7, 6, 7, 8],
            [0, 0, 1, 1, 1, 0],
            4,
            [
                "Phaser Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Extensive Shuttlebays")
            ],
            [ "Federation Starship" ],
            2290,
            new SoloSpaceframeStats(
                [6, 8, 8, 7, 7, 8],
                [1, 2, 3, 4, 3, 2]
            )),
        [Spaceframe.Malachowski]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Malachowski,
            CharacterType.Starfleet,
            "Malachowski Class",
            2210,
            [ Source.DiscoveryCampaign, Source.UtopiaPlanitia ],
            [7, 6, 5, 6, 8, 8],
            [0, 0, 2, 1, 0, 0],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Fast Targeting Systems"),
                TalentSelection.selectTalent("Rapid-Fire Torpedo Launcher"),
            ],
            [ "Federation Starship" ],
            2290,
            new SoloSpaceframeStats(
                [7, 6, 6, 8, 8, 10],
                [2, 2, 5, 3, 2, 1]
            )),
        [Spaceframe.Engle]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Engle,
            CharacterType.Starfleet,
            "Engle Class",
            2224,
            [ Source.DiscoveryCampaign, Source.UtopiaPlanitia ],
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
            2290,
            new SoloSpaceframeStats(
                [8, 8, 10, 7, 6, 6],
                [2, 3, 2, 2, 2, 4]
            )),
        [Spaceframe.Nimitz]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Nimitz,
            CharacterType.Starfleet,
            "Nimitz Class",
            2235,
            [ Source.DiscoveryCampaign, Source.UtopiaPlanitia ],
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
            2290,
            new SoloSpaceframeStats(
                [10, 7, 7, 7, 7, 7],
                [5, 1, 3, 1, 3, 1]
            )),
        [Spaceframe.Crossfield]: new SpaceframeModel(
            Spaceframe.Crossfield,
            CharacterType.Starfleet,
            "Crossfield Class",
            2255,
            [
                new SourcePrerequisite(Source.DiscoveryCampaign, Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2255),
            ],
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
            2290,
            new SoloSpaceframeStats(
                [7, 8, 8, 8, 8, 7],
                [1, 2, 2, 4, 4, 2]
            )),
        [Spaceframe.Hiawatha]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Hiawatha,
            CharacterType.Starfleet,
            "Hiawatha Class",
            2235,
            [ Source.DiscoveryCampaign, Source.UtopiaPlanitia ],
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
            2290,
            new SoloSpaceframeStats(
                [8, 8, 6, 9, 8, 5],
                [2, 2, 2, 1, 3, 5]
            )),
        [Spaceframe.StealthShip]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.StealthShip,
            CharacterType.Starfleet,
            "Stealth Ship",
            2250,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.Nimrod]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Nimrod,
            CharacterType.Starfleet,
            "Nimrod Class",
            2250,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.HouYi]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.HouYi,
            CharacterType.Starfleet,
            "Hou Yi Class",
            2250,
            [ Source.DiscoveryCampaign ],
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
            2260),
        [Spaceframe.Shiva]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Shiva,
            CharacterType.Starfleet,
            "Shiva Class",
            2253,
            [ Source.DiscoveryCampaign ],
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
        // Utopia Planitia Ships
        [Spaceframe.JClassYClass]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.JClassYClass,
            CharacterType.Starfleet,
            "J-Class/Y-Class",
            2103,
            [ Source.UtopiaPlanitia ],
            [4, 4, 5, 5, 6, 4],
            [0, 1, 0, 1, 0, 1],
            2,
            [
                "Phase Cannons"
            ],
            [
                TalentSelection.selectTalent("Polarized Hull Plating")
            ],
            [ "UESPA Civilian Starship" ],
            2399,
            new SoloSpaceframeStats(
                [5, 5, 6, 7, 8, 4],
                [1, 3, 1, 4, 1, 4]
            )),
        [Spaceframe.Delta]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Delta,
            CharacterType.Starfleet,
            "Warp Delta",
            2125,
            [ Source.UtopiaPlanitia ],
            [6, 5, 6, 6, 5, 5],
            [0, 1, 1, 1, 0, 0],
            3,
            [
                "Phase Cannons",
                "Spatial Torpedoes",
                "Grappler Cables"
            ],
            [
                TalentSelection.selectTalent("Grappler Cables"),
                TalentSelection.selectTalent("Polarized Hull Plating")
            ],
            [ "UESPA Starship" ],
            2190,
            new SoloSpaceframeStats(
                [6, 5, 6, 6, 5, 7],
                [2, 3, 4, 3, 1, 2]
            )),
        [Spaceframe.IntrepidType]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.IntrepidType,
            CharacterType.Starfleet,
            "Intrepid Type",
            2152,
            [ Source.UtopiaPlanitia ],
            [6, 5, 7, 6, 5, 5],
            [0, 1, 1, 0, 1, 0],
            3,
            [
                "Phase Cannons",
                "Spatial Torpedoes",
                "Grappler Cables"
            ],
            [
                TalentSelection.selectTalent("Grappler Cables"),
                TalentSelection.selectTalent("Polarized Hull Plating")
            ],
            [ "UESPA Starship" ],
            2190,
            new SoloSpaceframeStats(
                [6, 5, 7, 6, 5, 5],
                [2, 3, 3, 2, 3, 1]
            )),
        [Spaceframe.Antares]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Antares,
            CharacterType.Starfleet,
            "Antares",
            2245,
            [ Source.UtopiaPlanitia ],
            [8, 6, 7, 8, 7, 6],
            [0, 0, 0, 1, 1, 1],
            2,
            [
                "Phaser Banks",
                "Tractor Beam"
            ],
            [
                TalentSelection.selectTalent("Rugged Design")
            ],
            [ "Federation Starship" ],
            2315,
            new SoloSpaceframeStats(
                [8, 8, 7, 8, 7, 6],
                [1, 3, 1, 4, 3, 3]
            )),
        [Spaceframe.Springfield]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Springfield,
            CharacterType.Starfleet,
            "Springfield",
            2352,
            [ Source.UtopiaPlanitia ],
            [10, 9, 10, 10, 8, 8],
            [0, 0, 1, 1, 1, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Rugged Design")
            ],
            [ "Federation Starship" ],
            2419,
            new SoloSpaceframeStats(
                [9, 9, 11, 10, 9, 9],
                [1, 3, 3, 3, 3, 2],
            )),
        [Spaceframe.RavenType]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.RavenType,
            CharacterType.Starfleet,
            "Raven Type",
            2354,
            [ Source.UtopiaPlanitia ],
            [11, 11, 8, 11, 7, 5],
            [0, 0, 0, 0, 2, 1],
            2,
            [
                "Phaser Banks"
            ],
            [
                TalentSelection.selectTalent("Advanced Sensor Suites")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [11, 11, 8, 11, 7, 5],
                [2, 2, 1, 3, 5, 3],
            )),
        [Spaceframe.Niagara]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Niagara,
            CharacterType.Starfleet,
            "Niagara",
            2358,
            [ Source.UtopiaPlanitia ],
            [9, 9, 11, 10, 9, 8],
            [0, 1, 0, 0, 1, 1],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam",
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Improved Warp Drive")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 9, 11, 10, 9, 9],
                [2, 3, 2, 2, 4, 1],
            )),
        [Spaceframe.Cheyenne]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Cheyenne,
            CharacterType.Starfleet,
            "Cheyenne",
            2350,
            [ Source.UtopiaPlanitia ],
            [9, 9, 10, 9, 9, 9],
            [0, 2, 0, 1, 0, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Improved Reaction Control System"),
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Secondary Reactors")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 10, 10, 9, 9, 9],
                [1, 4, 2, 4, 2, 2],
            )),
        [Spaceframe.Challenger]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Challenger,
            CharacterType.Starfleet,
            "Challenger",
            2360,
            [ Source.UtopiaPlanitia ],
            [8, 10, 11, 11, 8, 8],
            [0, 1, 0, 1, 1, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Redundant Systems [Sensors]")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [8, 10, 12, 11, 9, 8],
                [1, 3, 2, 4, 3, 2],
            )),
        [Spaceframe.Freedom]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Freedom,
            CharacterType.Starfleet,
            "Freedom",
            2361,
            [ Source.UtopiaPlanitia ],
            [9, 9, 9, 11, 8, 10],
            [1, 0, 1, 0, 1, 0],
            4,
            [
                "Phaser Arrays",
                "Phaser Cannons",
                "Photon Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Secondary Reactors")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 9, 11, 11, 8, 10],
                [3, 2, 3, 2, 3, 1],
            )),
        [Spaceframe.Prometheus]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Prometheus,
            CharacterType.Starfleet,
            "Prometheus",
            2373,
            [ Source.UtopiaPlanitia ],
            [8, 9, 10, 9, 10, 11],
            [0, 0, 2, 1, 0, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Multi-Vector Assault Mode"),
                TalentSelection.selectTalent("Redundant Systems [Engines]")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 9, 10, 9, 10, 12],
                [3, 1, 4, 3, 2, 2],
            )),
        [Spaceframe.Vesta]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Vesta,
            CharacterType.Starfleet,
            "Vesta",
            2380,
            [ Source.UtopiaPlanitia ],
            [10, 10, 12, 10, 9, 9],
            [0, 1, 0, 1, 1, 0],
            6,
            [
                "Phaser Arrays",
                "Phaser Cannons",
                "Quantum Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Advanced Shields"),
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Secondary Reactors"),
                TalentSelection.selectTalent("Additional Propulsion System [Burst Drive]")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 12, 12, 10, 9, 9],
                [2, 3, 2, 3, 3, 2],
            )),
        [Spaceframe.Ross]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Ross,
            CharacterType.Starfleet,
            "Ross",
            2381,
            [ Source.UtopiaPlanitia ],
            [9, 11, 10, 10, 10, 10],
            [0, 0, 0, 1, 1, 1],
            6,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Diplomatic Suites"),
                TalentSelection.selectTalent("Saucer Separation"),
                TalentSelection.selectTalent("Secondary Reactors"),
                TalentSelection.selectTalent("EXEO Holographic Core")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 10, 11, 10, 10, 9],
                [2, 2, 2, 3, 3, 3],
            )),
        [Spaceframe.Inquiry]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Inquiry,
            CharacterType.Starfleet,
            "Inquiry",
            2394,
            [ Source.UtopiaPlanitia ],
            [10, 11, 10, 11, 10, 9],
            [1, 1, 0, 0, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Phaser Banks",
                "Quantum Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Improved Power Systems"),
                TalentSelection.selectTalent("Improved Warp Drive")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 10, 10, 11, 10, 9],
                [4, 2, 2, 2, 3, 2],
            )),
        [Spaceframe.Reliant]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Reliant,
            CharacterType.Starfleet,
            "Reliant",
            2397,
            [ Source.UtopiaPlanitia ],
            [10, 10, 10, 10, 10, 9],
            [0, 1, 0, 1, 0, 1],
            4,
            [
                "Phaser Arrays",
                "Quantum Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Redundant Systems"),
                TalentSelection.selectTalent("Additional Propulsion System [Quantum Slipstream Burst Drive]")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 10, 10, 10, 10, 10],
                [2, 3, 2, 2, 2, 4],
            )),
        [Spaceframe.Sutherland]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Sutherland,
            CharacterType.Starfleet,
            "Sutherland",
            2398,
            [ Source.UtopiaPlanitia ],
            [9, 9, 10, 10, 10, 10],
            [0, 1, 0, 1, 0, 1],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Saucer Separation"),
                TalentSelection.selectTalent("Mission Pod"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [11, 11, 10, 14, 10, 10],
                [2, 2, 2, 4, 3, 2],
            )),
        [Spaceframe.Gagarin]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Gagarin,
            CharacterType.Starfleet,
            "Gagarin",
            2398,
            [ Source.UtopiaPlanitia ],
            [9, 9, 12, 10, 9, 10],
            [0, 1, 1, 1, 0, 0],
            5,
            [
                "Phaser Arrays",
                "Phaser Cannons",
                "Quantum Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Improved Damage Control"),
                TalentSelection.selectTalent("Redundant Systems"),
                TalentSelection.selectTalent("Refracting Energy Shunt")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 9, 12, 10, 9, 12],
                [2, 3, 4, 3, 1, 2],
            )),
        [Spaceframe.Odyssey]: new SpaceframeModel(
            Spaceframe.Odyssey,
            CharacterType.Starfleet,
            "Odyssey",
            2401,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2401)
            ],
            [11, 11, 10, 10, 11, 10],
            [1, 0, 1, 1, 0, 0],
            7,
            [
                "Phaser Arrays",
                "Quantum Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Redundant Systems [Engines]"),
                TalentSelection.selectTalent("Saucer Separation"),
                TalentSelection.selectTalent("Additional Propulsion System [Quantum Slipstream Burst Drive]"),
                TalentSelection.selectTalent("Aquarius Escort"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [11, 11, 10, 10, 11, 10],
                [3, 2, 4, 3, 2, 2],
            )),
        [Spaceframe.Pathfinder]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Pathfinder,
            CharacterType.Starfleet,
            "Pathfinder",
            2410,
            [ Source.UtopiaPlanitia ],
            [9, 11, 11, 11, 9, 9],
            [0, 1, 0, 0, 2, 0],
            4,
            [
                "Phaser Arrays",
                "Quantum Torpedoes",
                "Tractor Beam"

            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Modular Mission Bay")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 11, 11, 11, 9, 9],
                [2, 4, 2, 2, 4, 1],
            )),

        [Spaceframe.Akira_UP]: new SpaceframeModel(
            Spaceframe.Akira_UP,
            CharacterType.Starfleet,
            "Akira Class",
            2368,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2368)
            ],
            [9, 9, 9, 9, 10, 11],
            [0, 0, 2, 0, 0, 1],
            5,
            [
                "Phaser Arrays",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Rapid-Fire Torpedo Launcher")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 9, 10, 10, 10, 11],
                [3, 1, 4, 2, 2, 3],
            )),
        [Spaceframe.Ambassador_UP]: new SpaceframeModel(
            Spaceframe.Ambassador_UP,
            CharacterType.Starfleet,
            "Ambassador Class",
            2335,
            [ new SourcePrerequisite(Source.UtopiaPlanitia), new NotSourcePrerequisite(Source.Core2ndEdition) ],
            [9, 9, 9, 9, 9, 9],
            [1, 1, 0, 0, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Saucer Separation"),
            ],
            [ "Federation Starship" ],
            2369,
            new SoloSpaceframeStats(
                [9, 10, 9, 11, 10, 9],
                [3, 3, 2, 2, 3, 2],
            )),
        [Spaceframe.Centaur_UP]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Centaur_UP,
            CharacterType.Starfleet,
            "Centaur Class",
            2285,
            [ Source.UtopiaPlanitia ],
            [8, 7, 10, 8, 7, 8],
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
        [Spaceframe.Constellation_UP]: new SpaceframeModel(
            Spaceframe.Constellation_UP,
            CharacterType.Starfleet,
            "Constellation Class",
            2285,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2285)
            ],
            [8, 7, 9, 9, 8, 7],
            [0, 1, 1, 1, 0, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Four-Nacelle Stability"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 9, 11, 11, 9, 8],
                [2, 4, 3, 2, 2, 1]
            )),
        [Spaceframe.Constitution_UP]: new SpaceframeModel(
            Spaceframe.Constitution_UP,
            CharacterType.Starfleet,
            "Constitution Class",
            2243,
            [ new SourcePrerequisite(Source.UtopiaPlanitia), new NotSourcePrerequisite(Source.Core2ndEdition) ],
            [7, 7, 8, 8, 7, 7],
            [1, 0, 1, 0, 1, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Rugged Design"),
                TalentSelection.selectTalent("Modular Laboratories"),
                TalentSelection.selectTalent("Constitution Saucer Separation")
            ],
            [ "Federation Starship" ],
            2290,
            new SoloSpaceframeStats(
                [8, 8, 8, 8, 7, 7],
                [3, 2, 3, 2, 3, 2]
            )),
        [Spaceframe.Daedalus_UP]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Daedalus_UP,
            CharacterType.Starfleet,
            "Daedalus Class",
            2140,
            [ Source.UtopiaPlanitia ],
            [5, 5, 6, 5, 6, 6],
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
                TalentSelection.selectTalent("Efficiency"),
            ],
            [ "Federation Starship" ],
            2269,
            new SoloSpaceframeStats(
                [7, 7, 7, 8, 10, 10],
                [2, 2, 1, 5, 4, 2]
            )),
        [Spaceframe.Defiant_UP]: new SpaceframeModel(
            Spaceframe.Defiant_UP,
            CharacterType.Starfleet,
            "Defiant Class",
            2371,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2371)
            ],
            [9, 9, 8, 9, 8, 13],
            [0, 1, 2, 0, 0, 0],
            3,
            [
                "Phaser Arrays",
                "Phaser Cannons",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Defiant Class Cloaking Device")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 9, 8, 9, 8, 13],
                [2, 3, 5, 2, 1, 2],
            )),
        [Spaceframe.Excelsior_UP]: new SpaceframeModel(
            Spaceframe.Excelsior_UP,
            CharacterType.Starfleet,
            "Excelsior Class",
            2285,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new ServiceYearPrerequisite(2285),
                new NotSourcePrerequisite(Source.Core2ndEdition),
            ],
            [8, 8, 9, 8, 9, 8],
            [1, 0, 0, 2, 0, 0],
            5,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Secondary Reactors"),
                TalentSelection.selectTalent("Excelsior Saucer Separation")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [8, 8, 10, 10, 9, 8],
                [4, 1, 2, 4, 2, 2]
            )),
        [Spaceframe.Intrepid_UP]: new SpaceframeModel(
            Spaceframe.Intrepid_UP,
            CharacterType.Starfleet,
            "Intrepid Class",
            2371,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.Core2ndEdition)
            ],
            [9, 11, 11, 10, 8, 9],
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
            99999,
            new SoloSpaceframeStats(
                [9, 11, 11, 10, 8, 8],
                [2, 4, 2, 2, 4, 1],
            )),
        [Spaceframe.Luna_UP]: new SpaceframeModel(
            Spaceframe.Luna_UP,
            CharacterType.Starfleet,
            "Luna Class",
            2372,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia, Source.LowerDecksCampaign),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2372)
            ],
            [10, 10, 10, 10, 8, 8],
            [0, 0, 0, 1, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Advanced Research Facilities"),
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Emergency Medical Hologram"),
                TalentSelection.selectTalent("Mission Pod"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 10, 10, 12, 8, 8],
                [2, 2, 2, 3, 4, 2],
            )),
        [Spaceframe.Miranda_UP]: new SpaceframeModel(
            Spaceframe.Miranda_UP,
            CharacterType.Starfleet,
            "Miranda Class",
            2264,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2264)
            ],
            [7, 8, 8, 8, 8, 8],
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
            99999,
            new SoloSpaceframeStats(
                [7, 8, 8, 9, 8, 8],
                [3, 3, 2, 2, 3, 2]
            )),
        [Spaceframe.Nebula_UP]: new SpaceframeModel(
            Spaceframe.Nebula_UP,
            CharacterType.Starfleet,
            "Nebula Class",
            2361,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2361)
            ],
            [9, 10, 10, 8, 9, 9],
            [0, 0, 0, 2, 0, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Saucer Separation"),
                TalentSelection.selectTalent("Mission Pod"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [11, 11, 10, 8, 9, 9],
                [4, 1, 2, 4, 2, 2],
            )),
        [Spaceframe.Norway_UP]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Norway_UP,
            CharacterType.Starfleet,
            "Norway Class",
            2371,
            [ Source.UtopiaPlanitia ],
            [9, 9, 10, 10, 10, 9],
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
                TalentSelection.selectTalent("Backpacking"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 9, 10, 11, 10, 9],
                [2, 2, 2, 3, 2, 4],
            )),
        [Spaceframe.NX_UP]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.NX_UP,
            CharacterType.Starfleet,
            "NX Class",
            2151,
            [ Source.UtopiaPlanitia ],
            [5, 5, 6, 6, 6, 6],
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
            2170,
            new SoloSpaceframeStats(
                [6, 6, 6, 6, 6, 6],
                [3, 2, 2, 3, 3, 2]
            )),
        [Spaceframe.Oberth_UP]: new SpaceframeModel(
            Spaceframe.Oberth_UP,
            CharacterType.Starfleet,
            "Oberth Class",
            2269,
            [
                new SourcePrerequisite(Source.UtopiaPlanitia),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2269)
            ],
            [8, 9, 7, 9, 6, 6],
            [0, 1, 0, 0, 2, 0],
            3,
            [
                "Phaser Banks",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Improved Warp Drive"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [8, 9, 8, 9, 7, 6],
                [1, 3, 2, 3, 4, 2]
            )),
        [Spaceframe.Olympic_UP]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Olympic_UP,
            CharacterType.Starfleet,
            "Olympic Class",
            2368,
            [ Source.UtopiaPlanitia ],
            [10, 11, 10, 10, 9, 6],
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
                TalentSelection.selectTalent("Do No Harm"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 11, 10, 11, 9, 7],
                [2, 2, 2, 1, 3, 5],
            )),
        [Spaceframe.Sovereign_UP]: new SpaceframeModel(
            Spaceframe.Sovereign_UP,
            CharacterType.Starfleet,
            "Sovereign Class",
            2371,
            [ new SourcePrerequisite(Source.UtopiaPlanitia), new NotSourcePrerequisite(Source.Core2ndEdition) ],
            [10, 9, 10, 10, 10, 10],
            [1, 0, 1, 0, 1, 0],
            6,
            [
                "Phaser Arrays",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 5)"
            ],
            [
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Emergency Medical Hologram"),
                TalentSelection.selectTalent("Improved Warp Drive")
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [10, 9, 10, 10, 9, 10],
                [4, 1, 3, 2, 3, 2],
            )),
        [Spaceframe.Soyuz]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Soyuz,
            CharacterType.Starfleet,
            "Soyuz Class",
            2269,
            [ Source.UtopiaPlanitia ],
            [7, 7, 7, 6, 8, 9],
            [0, 0, 2, 0, 1, 0],
            4,
            [
                "Phaser Banks",
                "Phaser Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Secondary Reactors"),
            ],
            [ "Federation Starship" ],
            2310,
            new SoloSpaceframeStats(
                [8, 10, 9, 10, 10, 10],
                [2, 2, 4, 2, 3, 2]
            )),
        [Spaceframe.Steamrunner_UP]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Steamrunner_UP,
            CharacterType.Starfleet,
            "Steamrunner Class",
            2370,
            [ Source.UtopiaPlanitia ],
            [9, 9, 11, 10, 9, 9],
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
                TalentSelection.selectTalent("Steamrunner Separation"),
            ],
            [ "Federation Starship" ],
            99999,
            new SoloSpaceframeStats(
                [9, 9, 11, 10, 9, 9],
                [1, 3, 3, 3, 3, 2],
            )),
        [Spaceframe.California]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.California,
            CharacterType.Starfleet,
            "California Class",
            2370, // not really specified
            [ Source.LowerDecksCampaign ],
            [10, 10, 8, 9, 10, 8],
            [0, 0, 0, 1, 1, 1],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Dedicated Personnel"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Osler]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Osler,
            CharacterType.Starfleet,
            "Osler Class",
            2377,
            [ Source.LowerDecksCampaign ],
            [9, 9, 11, 9, 8, 10],
            [0, 1, 1, 1, 0, 0],
            3,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Slim Sensor Silhouette"),
            ],
            [ "Federation Starship", "Andorian Starship" ],
            99999),
        [Spaceframe.Obena]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Obena,
            CharacterType.Starfleet,
            "Obena Class",
            2381,
            [ Source.LowerDecksCampaign ],
            [9, 9, 12, 10, 10, 9],
            [0, 1, 0, 1, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Secondary Reactors"),
                TalentSelection.selectTalent("Additional Propulsion System [Quantum Slipstream Burst Drive]"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Parliament]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Parliament,
            CharacterType.Starfleet,
            "Parliament Class",
            2380,
            [ Source.LowerDecksCampaign ],
            [9, 9, 11, 10, 11, 9],
            [1, 0, 0, 2, 0, 0],
            5,
            [
                "Phaser Arrays",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Improved Hull Integrity"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Secondary Reactors"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.TKalat]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.TKalat,
            CharacterType.Starfleet,
            "T'Kalat Class",
            2375,
            [ Source.LowerDecksCampaign ],
            [9, 10, 10, 12, 9, 9],
            [0, 0, 0, 1, 2, 0],
            6,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 5)"
            ],
            [
                TalentSelection.selectTalent("Advanced Research Facilities"),
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Advanced Sickbay"),
                TalentSelection.selectTalent("High-Resolution Sensors"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Ganashia]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Ganashia,
            CharacterType.Starfleet,
            "Ganashia Class",
            2378,
            [ Source.LowerDecksCampaign ],
            [9, 9, 10, 11, 10, 9],
            [1, 1, 0, 1, 0, 0],
            5,
            [
                "Phaser Arrays",
                "Phaser Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Expanded Munitions [Phaser Cannons]"),
                TalentSelection.selectTalent("Improved Hull Integrity"),
                TalentSelection.selectTalent("Improved Power Systems")
            ],
            [ "Federation Starship" ],
            99999),


        [Spaceframe.Loknar]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Loknar,
            CharacterType.Starfleet,
            "Loknar Class",
            2243,
            [ Source.ContinuingMissions ],
            [7, 8, 8, 8, 8, 8],
            [0, 1, 2, 0, 0, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Rapid-Fire Torpedo Launcher"),
                TalentSelection.selectTalent("Rugged Design"),
            ],
            [ "Federation Starship" ],
            2297),
        [Spaceframe.Larson]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Larson,
            CharacterType.Starfleet,
            "Larson Class",
            2244,
            [ Source.ContinuingMissions ],
            [6, 7, 8, 8, 9, 9],
            [0, 2, 1, 0, 0, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Improved Reaction Control System"),
                TalentSelection.selectTalent("Rugged Design"),
            ],
            [ "Federation Starship" ],
            2309),
        [Spaceframe.Perseus]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Perseus,
            CharacterType.Starfleet,
            "Perseus Class",
            2247,
            [ Source.ContinuingMissions ],
            [8, 8, 8, 7, 8, 9],
            [0, 1, 2, 0, 0, 0],
            3,
            [
                "Phaser Banks",
                "Phaser Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Fast Targeting Systems"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
            ],
            [ "Federation Starship" ],
            2280),
        [Spaceframe.Pioneer]: new SpaceframeModel(
            Spaceframe.Pioneer,
            CharacterType.Starfleet,
            "Pioneer Class",
            2238,
            [
                new SourcePrerequisite(Source.ContinuingMissions),
                new NotSourcePrerequisite(Source.GmToolkit2e),
                new ServiceYearPrerequisite(2238)
            ],
            [8, 7, 7, 7, 8, 7],
            [0, 0, 0, 1, 1, 1],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Hull Integrity"),
                TalentSelection.selectTalent("Improved Power Systems"),
            ],
            [ "Federation Starship" ],
            2280),
        [Spaceframe.Ptolemy]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Ptolemy,
            CharacterType.Starfleet,
            "Ptolemy Class",
            2257,
            [ Source.ContinuingMissions ],
            [7, 8, 9, 8, 9, 5],
            [0, 1, 0, 2, 0, 0],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Hull Integrity"),
                TalentSelection.selectTalent("Improved Power Systems"),
            ],
            [ "Federation Starship" ],
            2280),
        [Spaceframe.Chandley]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Chandley,
            CharacterType.Starfleet,
            "Chandley Class",
            2285,
            [ Source.ContinuingMissions ],
            [7, 8, 9, 8, 10, 8],
            [1, 0, 1, 1, 0, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Rugged Design"),
            ],
            [ "Federation Starship" ],
            2300),





        // Klingon Spaceframes
        [Spaceframe.D5]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.D5,
            CharacterType.KlingonWarrior,
            "D5-Class Battle Cruiser",
            2146,
            [ Source.KlingonCore ],
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
        [Spaceframe.Raptor]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Raptor,
            CharacterType.KlingonWarrior,
            "Raptor-class Scout",
            2146,
            [ Source.KlingonCore ],
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
        [Spaceframe.VonTalk]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.VonTalk,
            CharacterType.KlingonWarrior,
            "Vo'n'Talk",
            2149,
            [ Source.KlingonCore ],
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
        [Spaceframe.KToch]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.KToch,
            CharacterType.KlingonWarrior,
            "K'Toch Scout",
            2128,
            [ Source.KlingonCore ],
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
        [Spaceframe.TuYuQ]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.TuYuQ,
            CharacterType.KlingonWarrior,
            "Tu'YuQ Exploratory Ship",
            2176,
            [ Source.KlingonCore ],
            [7, 8, 7, 7, 5, 7],
            [0, 0, 1, 0, 1, 1],
            3,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
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
            [
                new SourcePrerequisite(Source.KlingonCore),
                new NotSourcePrerequisite(Source.Core2ndEdition)
            ],
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
            [
                new SourcePrerequisite(Source.KlingonCore),
                new NotSourcePrerequisite(Source.Core2ndEdition),
            ],
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
        [Spaceframe.PachNom]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.PachNom,
            CharacterType.KlingonWarrior,
            "Pach'Nom Multirole Escort",
            2297,
            [ Source.KlingonCore ],
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
        [Spaceframe.QoToch]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.QoToch,
            CharacterType.KlingonWarrior,
            "Qo'Toch Heavy Fighter",
            2298,
            [ Source.KlingonCore ],
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
        [Spaceframe.IwChaPar]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.IwChaPar,
            CharacterType.KlingonWarrior,
            "Iw'Cha'Par Heavy Explorer",
            2295,
            [ Source.KlingonCore ],
            [9, 9, 7, 8, 7, 8],
            [0, 0, 2, 0, 1, 0],
            4,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Rapid-Fire Torpedo Launcher")
            ],
            [
                "Klingon Starship",
                "Bird-of-Prey"
            ]),
        [Spaceframe.D12]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.D12,
            CharacterType.KlingonWarrior,
            "D12-Class Bird-of-Prey",
            2315,
            [ Source.KlingonCore ],
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
        [Spaceframe.KlingonCivilianTransport]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.KlingonCivilianTransport,
            CharacterType.KlingonWarrior,
            "Klingon Civilian Transport",
            2352,
            [ Source.KlingonCore ],
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
        [Spaceframe.KVort]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.KVort,
            CharacterType.KlingonWarrior,
            "K'Vort-Class Bird-of-Prey",
            2349,
            [ Source.KlingonCore ],
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
        [Spaceframe.ParTok]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.ParTok,
            CharacterType.KlingonWarrior,
            "Par'Tok Transport",
            2356,
            [ Source.KlingonCore ],
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
        [Spaceframe.Toron]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Toron,
            CharacterType.KlingonWarrior,
            "Toron-Class Shuttlepod",
            2357,
            [ Source.KlingonCore ],
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
            [ new SourcePrerequisite(Source.KlingonCore), new ServiceYearPrerequisite(2367), new NotSourcePrerequisite(Source.GmToolkit2e) ],
            [9, 9, 10, 9, 10, 10],
            [1, 0, 2, 0, 0, 0],
            5,
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
        [Spaceframe.NeghVar]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.NeghVar,
            CharacterType.KlingonWarrior,
            "Negh'Var-Class Warship",
            2372,
            [ Source.KlingonCore ],
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
        [Spaceframe.DiscoBirdOfPrey]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.DiscoBirdOfPrey,
            CharacterType.KlingonWarrior,
            "Bird of Prey (Mid 23rd Century)",
            2233,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.Qugh]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Qugh,
            CharacterType.KlingonWarrior,
            "Qugh-class Destroyer",
            2130,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.Daspu]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Daspu,
            CharacterType.KlingonWarrior,
            "Daspu'-class Escort",
            2175,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.Qoj]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Qoj,
            CharacterType.KlingonWarrior,
            "Qoj-class Dreadnought",
            2225,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.Batlh]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Batlh,
            CharacterType.KlingonWarrior,
            "Batlh-class Escort",
            2203,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.Chargh]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Chargh,
            CharacterType.KlingonWarrior,
            "Chargh / Jach-class Battlecruiser",
            2203,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.NaQjej]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.NaQjej,
            CharacterType.KlingonWarrior,
            "Na'Qjej-class Cleave Ship",
            2185,
            [ Source.DiscoveryCampaign ],
            [6, 5, 6, 6, 9, 7],
            [0, 2, 0, 1, 0, 0],
            5,
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
        [Spaceframe.Elth]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Elth,
            CharacterType.KlingonWarrior,
            "'Elth-class Assault Ship",
            2185,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.BortasBir]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.BortasBir,
            CharacterType.KlingonWarrior,
            "Bortas bir-class Battlecruiser",
            2235,
            [ Source.DiscoveryCampaign ],
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
        [Spaceframe.Sech]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Sech,
            CharacterType.KlingonWarrior,
            "Sech-class Fast Frigate",
            2231,
            [ Source.DiscoveryCampaign ],
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



        [Spaceframe.Angelou]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Angelou,
            CharacterType.Starfleet,
            "Angelou Class",
            3188,
            [ Source.CaptainsLog ],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            5,
            [
            ],
            [
            ],
            [
                "Federation Starship",
                "IMT-C"
            ],
            9999,
            new SoloSpaceframeStats(
                [7, 6, 6, 7, 8, 6],
                [2, 2, 2, 3, 3, 3]
            )),
        [Spaceframe.Eisenberg]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Eisenberg,
            CharacterType.Starfleet,
            "Eisenberg Class",
            3188,
            [ Source.CaptainsLog ],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            4,
            [
            ],
            [
            ],
            [
                "Federation Starship",
                "IMT-C"
            ],
            9999,
            new SoloSpaceframeStats(
                [7, 6, 6, 7, 8, 6],
                [2, 2, 2, 3, 3, 3]
            )),
        [Spaceframe.Friendship]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Friendship,
            CharacterType.Starfleet,
            "Friendship Class",
            3188,
            [ Source.CaptainsLog ],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            4,
            [
            ],
            [
            ],
            [
                "Federation Starship",
                "IMT-C"
            ],
            9999,
            new SoloSpaceframeStats(
                [6, 6, 7, 7, 6, 6],
                [2, 3, 2, 3, 3, 2]
            )),
        [Spaceframe.Janeway]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Janeway,
            CharacterType.Starfleet,
            "Janeway Class",
            3188,
            [ Source.CaptainsLog ],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            4,
            [
            ],
            [
            ],
            [
                "Federation Starship",
                "IMT-C"
            ],
            9999,
            new SoloSpaceframeStats(
                [7, 6, 7, 8, 6, 5],
                [2, 2, 2, 3, 4, 2]
            )),
        [Spaceframe.Kirk]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Kirk,
            CharacterType.Starfleet,
            "Kirk Class",
            3188,
            [ Source.CaptainsLog ],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            4,
            [
            ],
            [
            ],
            [
                "Federation Starship",
                "IMT-C"
            ],
            9999,
            new SoloSpaceframeStats(
                [6, 6, 7, 6, 6, 8],
                [3, 2, 3, 3, 2, 2]
            )),

        [Spaceframe.NX_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.NX_2E,
            CharacterType.Starfleet,
            "NX Class",
            2151,
            [ Source.UtopiaPlanitia ],
            [5, 5, 6, 6, 6, 6],
            [0, 1, 0, 1, 1, 0],
            3,
            [
                "Phase Cannons",
                "Spatial Torpedoes",
                "Grappler Cable (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Polarized Hull Plating (Special Rule)"),
                TalentSelection.selectTalent("Grappler Cable (Special Rule)"),
            ],
            [ "Federation Starship" ],
            2170,
        ),
        [Spaceframe.Constitution_2E]: new SpaceframeModel(
            Spaceframe.Constitution_2E,
            CharacterType.Starfleet,
            "Constitution Class",
            2243,
            [ new SourcePrerequisite(Source.Core2ndEdition) ],
            [7, 7, 8, 8, 7, 7],
            [1, 0, 1, 0, 1, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Rugged Design"),
                TalentSelection.selectTalent("Modular Laboratories"),
                TalentSelection.selectTalent("Saucer Separation (2nd Edition)")
            ],
            [ "Federation Starship" ],
            2290),
        [Spaceframe.Excelsior_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Excelsior_UP,
            CharacterType.Starfleet,
            "Excelsior Class",
            2285,
            [ Source.Core2ndEdition ],
            [8, 7, 9, 8, 9, 8],
            [1, 0, 0, 2, 0, 0],
            5,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Secondary Reactors"),
                TalentSelection.selectTalent("Saucer Separation (2nd Edition)")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Ambassador_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Ambassador_2E,
            CharacterType.Starfleet,
            "Ambassador Class",
            2335,
            [ Source.UtopiaPlanitia ],
            [9, 9, 9, 9, 9, 9],
            [1, 1, 0, 0, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Saucer Separation (2nd Edition)"),
            ],
            [ "Federation Starship" ],
            2369),
        [Spaceframe.Galaxy_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Galaxy_2E,
            CharacterType.Starfleet,
            "Galaxy Class",
            2359,
            [ Source.Core2ndEdition ],
            [9, 10, 10, 8, 10, 10],
            [1, 0, 0, 0, 1, 1],
            6,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 5)"
            ],
            [
                TalentSelection.selectTalent("Abundant Personnel"),
                TalentSelection.selectTalent("Saucer Separation and Reconnect"),
                TalentSelection.selectTalent("Modular Laboratories"),
                TalentSelection.selectTalent("Redundant Systems")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Intrepid_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Intrepid_2E,
            CharacterType.Starfleet,
            "Intrepid Class",
            2371,
            [ Source.Core2ndEdition ],
            [9, 11, 11, 10, 8, 8],
            [0, 1, 0, 1, 1, 0],
            4,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Emergency Medical Hologram"),
                TalentSelection.selectTalent("Landing Gear")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Sovereign_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Sovereign_2E,
            CharacterType.Starfleet,
            "Sovereign Class",
            2371,
            [ Source.Core2ndEdition ],
            [10, 9, 10, 10, 10, 10],
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
                TalentSelection.selectTalent("Saucer Separation (2nd Edition)")
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Constitution3]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Constitution3,
            CharacterType.Starfleet,
            "Constitution III",
            2396,
            [ Source.Core2ndEdition ],
            [9, 10, 11, 10, 10, 10],
            [0, 1, 0, 1, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Improved Impulse Drive"),
                TalentSelection.selectTalent("Improved Warp Drive"),
            ],
            [ "Federation Starship", "Legacy Components" ],
            99999),
        [Spaceframe.Freedom_22ndCentury]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Freedom_22ndCentury,
            CharacterType.Starfleet,
            "Freedome",
            2148,
            [ Source.GmToolkit2e ],
            [5, 5, 5, 6, 5, 6],
            [0, 2, 0, 1, 0, 0],
            2,
            [
                "Phaser Cannons",
                "Spatial Torpedoes",
                "Grappler Cables (Strength 1)"
            ],
            [
                TalentSelection.selectTalent("Compact Vessel"),
                TalentSelection.selectTalent("Polarized Hull Plating"),
            ],
            [ "United Earth Starship", "Compact Size", "No Personnel Transporter" ],
            2200),
        [Spaceframe.Walker_2E]: new SpaceframeModel(
            Spaceframe.Walker_2E,
            CharacterType.Starfleet,
            "Walker",
            2396,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2195) ],
            [6, 7, 6, 7, 6, 8],
            [0, 0, 0, 1, 1, 1],
            3,
            [
                "Phaser Cannons",
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Rugged Design"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Pioneer_2E]: new SpaceframeModel(
            Spaceframe.Pioneer_2E,
            CharacterType.Starfleet,
            "Pioneer class",
            2241,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2241) ],
            [8, 7, 8, 7, 7, 6],
            [0, 0, 0, 1, 1, 1],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Rugged Design"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Crossfield_2E]: new SpaceframeModel(
            Spaceframe.Crossfield_2E,
            CharacterType.Starfleet,
            "Crossfield",
            2255,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2255) ],
            [7, 8, 8, 8, 7, 7],
            [0, 0, 0, 1, 2, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Modular Laboratories"),
                TalentSelection.selectTalent("Classified Design"),
            ],
            [ "Federation Starship", "Experimental" ],
            99999),
        [Spaceframe.Miranda_2E]: new SpaceframeModel(
            Spaceframe.Miranda_2E,
            CharacterType.Starfleet,
            "Miranda",
            2264,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2264) ],
            [7, 8, 8, 8, 8, 8],
            [1, 1, 0, 0, 1, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Extensive Shuttlebays"),
            ],
            [ "Federation Starship", "Long-serving" ],
            99999),
        [Spaceframe.Oberth_2E]: new SpaceframeModel(
            Spaceframe.Oberth_2E,
            CharacterType.Starfleet,
            "Oberth",
            2269,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2269) ],
            [8, 9, 7, 9, 6, 6],
            [0, 0, 0, 1, 2, 0],
            3,
            [
                "Phaser Banks",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("High-Resolution Sensors"),
                TalentSelection.selectTalent("Improved Warp Drive"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Columbia]: new SpaceframeModel(
            Spaceframe.Columbia,
            CharacterType.Starfleet,
            "Columbia",
            2284,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2284) ],
            [8, 8, 8, 8, 7, 8],
            [0, 1, 1, 0, 1, 0],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Preferential Targeting"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Constellation_2E]: new SpaceframeModel(
            Spaceframe.Constellation_2E,
            CharacterType.Starfleet,
            "Constellation",
            2285,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2285) ],
            [8, 7, 9, 9, 8, 7],
            [0, 1, 1, 1, 0, 0],
            4,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Four-Nacelle Stability"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Nebula_2E]: new SpaceframeModel(
            Spaceframe.Nebula_2E,
            CharacterType.Starfleet,
            "Nebula",
            2361,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2361) ],
            [9, 10, 10, 8, 9, 9],
            [0, 0, 0, 2, 0, 0],
            5,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Mission Pod"),
                TalentSelection.selectTalent("Saucer Separation and Reconnect"),
            ],
            [ "Federation Starship", "Adaptable" ],
            99999),
        [Spaceframe.Akira_2E]: new SpaceframeModel(
            Spaceframe.Akira_2E,
            CharacterType.Starfleet,
            "Akira",
            2368,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2368) ],
            [9, 9, 9, 9, 10, 11],
            [1, 0, 2, 0, 0, 0],
            5,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Extensive Shuttlebays"),
                TalentSelection.selectTalent("Rapid-Fire Torpedo Launcher"),
                TalentSelection.selectTalent("Specialized Shuttlebay"),
            ],
            [ "Federation Starship", "Extensive Tactival Systems" ],
            99999),
        [Spaceframe.Nova_2E]: new SpaceframeModel(
            Spaceframe.Nova_2E,
            CharacterType.Starfleet,
            "Nova",
            2368,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2368) ],
            [10, 10, 9, 10, 8, 8],
            [0, 0, 0, 1, 2, 0],
            3,
            [
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Advanced Sensor Suites"),
            ],
            [ "Federation Starship", "Efficient but Austere" ],
            99999),
        [Spaceframe.Defiant_2E]: new SpaceframeModel(
            Spaceframe.Defiant_2E,
            CharacterType.Starfleet,
            "Defiant",
            2371,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2371) ],
            [9, 9, 8, 9, 8, 13],
            [0, 1, 2, 0, 0, 0],
            3,
            [
                "Phaser Arrays",
                "Pulse Phaser Cannons",
                "Photon Torpedoes",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Ablative Armor"),
                TalentSelection.selectTalent("Pulse Phaser Cannons"),
                TalentSelection.selectTalent("Landing Gear"),
            ],
            [ "Federation Starship", "Warship" ],
            99999),
        [Spaceframe.Luna_2E]: new SpaceframeModel(
            Spaceframe.Luna_2E,
            CharacterType.Starfleet,
            "Luna",
            2372,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2372) ],
            [10, 10, 10, 10, 8, 8],
            [0, 0, 0, 1, 0, 1],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Advanced Research Facilities"),
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Emergency Medical Hologram"),
                TalentSelection.selectTalent("Mission Pod"),
            ],
            [ "Federation Starship" ],
            99999),
        [Spaceframe.Sagan]: new SpaceframeModel(
            Spaceframe.Sagan,
            CharacterType.Starfleet,
            "Sagan",
            2401,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2401) ],
            [10, 10, 11, 11, 10, 9],
            [0, 1, 0, 1, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Advanced Sensor Suites"),
                TalentSelection.selectTalent("Advanced Shields"),
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Four-Nacelle Stability"),
            ],
            [ "Federation Starship", "Borg Technology" ],
            99999),
        [Spaceframe.Odyssey_2E]: new SpaceframeModel(
            Spaceframe.Odyssey_2E,
            CharacterType.Starfleet,
            "Odyssey",
            2381,
            [ new SourcePrerequisite(Source.GmToolkit2e), new ServiceYearPrerequisite(2381) ],
            [10, 11, 10, 10, 11, 10],
            [1, 0, 1, 1, 0, 0],
            7,
            [
                "Phaser Arrays",
                "Phaser Banks",
                "Photon Torpedoes",
                "Quantum Torpedoes",
                "Tractor Beam (Strength 6)"
            ],
            [
                TalentSelection.selectTalent("Command Ship"),
                TalentSelection.selectTalent("Improved Warp Drive"),
                TalentSelection.selectTalent("Redundant Systems [Engines]"),
                TalentSelection.selectTalent("Aquarius Escort"),
                TalentSelection.selectTalent("Quantum Slipstream Burst Drive"),
                TalentSelection.selectTalent("Saucer Separation and Reconnect"),
            ],
            [ "Federation Starship", "Borg Technology" ],
            99999),
        [Spaceframe.D7_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.D7_2E,
            CharacterType.KlingonWarrior,
            "D7-Class Battle Cruiser",
            2257,
            [ Source.KlingonCore ],
            [7, 7, 8, 8, 8, 9],
            [0, 1, 2, 0, 0, 0],
            4,
            [
                "Disruptor Cannons",
                "Phaser Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Rugged Design")
            ],
            [
                "Klingon Starship",
                "Symbol of Klingoon Unity"
            ],
            2350),
        [Spaceframe.Brel_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Brel_2E,
            CharacterType.KlingonWarrior,
            "B'rel-Class Bird-of-Prey",
            2280,
            [ Source.KlingonCore ],
            [8, 7, 9, 7, 7, 9],
            [0, 1, 2, 0, 0, 0],
            3,
            [
                "Disruptor Cannons",
                "Photon Torpedoes",
                "Tractor Beam (Strength 2)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Fast Targeting Systems"),
                TalentSelection.selectTalent("Landing Gear")
            ],
            [
                "Klingon Starship",
                "Bird-of-Prey",
                "Agile Raider"
            ],
            99999),
        [Spaceframe.Tliss]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Tliss,
            CharacterType.Romulan,
            "T'Liss",
            2260,
            [ Source.Core2ndEdition ],
            [6, 8, 7, 9, 7, 9],
            [0, 1, 1, 1, 0, 0],
            4,
            [
                "Disruptor Banks",
                "Plasma Torpedoes",
                "Tractor Beam (Strength 3)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Prototype Cloaking Device"),
            ],
            [ "Romulan Starship", "Bird of Prey", "Experimental" ],
            99999),
        [Spaceframe.DDeridex]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.DDeridex,
            CharacterType.Romulan,
            "D'Deridex",
            2348,
            [ Source.Core2ndEdition ],
            [8, 9, 10, 10, 11, 9],
            [1, 0, 1, 1, 0, 0],
            6,
            [
                "Disruptor Banks",
                "Plasma Torpedoes",
                "Tractor Beam (Strength 5)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Abundant Personnel"),
            ],
            [ "Romulan Starship", "Imposing" ],
            99999),
        [Spaceframe.Galor]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Galor,
            CharacterType.Cardassian,
            "Galor",
            2348,
            [ Source.Core2ndEdition ],
            [8, 8, 9, 7, 8, 9],
            [1, 0, 1, 1, 0, 0],
            4,
            [
                "Phaser Banks",
                "Disruptor Spinal Lance",
                "Tractor Beam (Strength 3)"
            ],
            [
            ],
            [ "Cardassian Starship" ],
            99999),
        [Spaceframe.DKora]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.DKora,
            CharacterType.Ferengi,
            "D'Kora class",
            2350,
            [ Source.Core2ndEdition ],
            [9, 8, 10, 9, 10, 7],
            [1, 0, 0, 1, 1, 0],
            5,
            [
                "Phaser Arrays",
                "Electromagnetic Cannon",
                "Disruptor Banks",
                "Tractor Beam (Strength 4)"
            ],
            [
            ],
            [ "Ferengi Starship", "Marauder", "The Best Latinum Can Buy" ],
            99999),


        [Spaceframe.VorCha_2E]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.VorCha_2E,
            CharacterType.KlingonWarrior,
            "Vor'Cha-Class Attack Cruiser",
            2367,
            [ Source.GmToolkit2e ],
            [9, 9, 10, 9, 10, 10],
            [1, 0, 2, 0, 0, 0],
            5,
            [
                "Disruptor Cannons",
                "Disruptor Banks",
                "Photon Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
                TalentSelection.selectTalent("Fast Targeting Systems")
            ],
            [
                "Klingon Starship", "Formidable Reputation"
            ],
            99999),

        [Spaceframe.Mogai]: SpaceframeModel.createStandardSpaceframe(
            Spaceframe.Mogai,
            CharacterType.Romulan,
            "Mogai class",
            2374,
            [ Source.GmToolkit2e ],
            [9, 9, 10, 10, 10, 10],
            [0, 1, 1, 1, 0, 0],
            5,
            [
                "Disruptor Banks",
                "Plasma Torpedoes",
                "Tractor Beam (Strength 4)"
            ],
            [
                TalentSelection.selectTalent("Cloaking Device"),
            ],
            [ "Romulan Starship", "Warbird" ],
            99999),
        //[Spaceframe.]: SpaceframeModel.createStandardSpaceframe(
        //    CharacterType.Starfleet,
        //    "",
        //    0,
        //    [ Source.Core, Source.UtopiaPlanitia ],
        //    [],
        //    [],
        //    0,
        //    [
        //    ],
        //    [
        //    ]),
    };

    getSpaceframes(starship: Starship, ignoreMaxServiceYear: boolean = false) {
        let frames: SpaceframeModel[] = [];
        for (var frame in this._frames) {
            let f = this._frames[frame];
            if (f.serviceYear <= starship.serviceYear && (f.maxServiceYear >= starship.serviceYear || ignoreMaxServiceYear)) {
                if (f.isPrerequisiteFulfilled(starship) && starship.type === f.type) {
                    frames.push(f);
                }
            }
        }

        return frames;
    }

    getSpaceframe(frame: Spaceframe) {
        const result = this._frames[frame];
        return result ? result : undefined;
    }

    getSpaceframeByName(name: string) {
        let result = undefined;
        for (let id in this._frames) {
            if (Spaceframe[id] === name) {
                result = this._frames[id];
                break;
            }
        }
        return result;
    }

    soloSpaceframesByEra(era: Era) : Spaceframe[] {
        switch (era) {
            case Era.Enterprise:
                return [ Spaceframe.Daedalus_UP, Spaceframe.IntrepidType, Spaceframe.JClassYClass, Spaceframe.NX_UP, Spaceframe.Delta ];
            case Era.OriginalSeries:
                return [
                    Spaceframe.Antares,
                    Spaceframe.Archer,
                    Spaceframe.Cardenas,
                    Spaceframe.Constellation_UP,
                    Spaceframe.Constitution_UP,
                    Spaceframe.Crossfield,
                    Spaceframe.Engle,
                    Spaceframe.Excelsior_UP,
                    Spaceframe.Hiawatha,
                    Spaceframe.Hoover,
                    Spaceframe.Magee,
                    Spaceframe.Malachowski,
                    Spaceframe.Miranda_UP,
                    Spaceframe.Nimitz,
                    Spaceframe.Oberth_UP,
                    Spaceframe.ScoutType,
                    Spaceframe.Shepard,
                    Spaceframe.Soyuz,
                    Spaceframe.Sydney,
                    Spaceframe.Walker,
                ];
            case Era.NextGeneration:
                return [
                    Spaceframe.Akira_UP,
                    Spaceframe.Ambassador_UP,
                    Spaceframe.Challenger,
                    Spaceframe.Cheyenne,
                    Spaceframe.Defiant_UP,
                    Spaceframe.Freedom,
                    Spaceframe.Galaxy,
                    Spaceframe.Intrepid_UP,
                    Spaceframe.Nebula_UP,
                    Spaceframe.NewOrleans,
                    Spaceframe.Niagara,
                    Spaceframe.Norway_UP,
                    Spaceframe.Nova,
                    Spaceframe.Olympic_UP,
                    Spaceframe.RavenType,
                    Spaceframe.Saber,
                    Spaceframe.Springfield,
                    Spaceframe.Steamrunner_UP
                ];
            case Era.PicardProdigy:
                return [
                    Spaceframe.Gagarin,
                    Spaceframe.Inquiry,
                    Spaceframe.Luna_UP,
                    Spaceframe.Odyssey,
                    Spaceframe.Pathfinder,
                    Spaceframe.Prometheus,
                    Spaceframe.Reliant,
                    Spaceframe.Ross,
                    Spaceframe.Sovereign_UP,
                    Spaceframe.Sutherland,
                    Spaceframe.Vesta
                ];
            case Era.Discovery32:
            default:
                return [ Spaceframe.Angelou, Spaceframe.Eisenberg, Spaceframe.Friendship, Spaceframe.Janeway, Spaceframe.Kirk ];
        }
    }
}
