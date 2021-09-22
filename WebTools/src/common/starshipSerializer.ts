import {Starship} from './character';
import {SpaceframeHelper} from '../helpers/spaceframes';
import {MissionProfileHelper} from '../helpers/missionProfiles';
import {TalentModel} from '../helpers/talents';
import {Department} from '../helpers/departments';
import {System} from '../helpers/systems';

interface IData {
    name: string;
    value: string;
}

export class StarshipSerializer {
    static serialize(starship: Starship, profileTalent: string, additionalTalents: string[], traits: string, name: string, registryNumber: string): IData[] {
        if (starship.spaceframe === undefined || starship.missionProfile === undefined) {
            return [];
        }

        const spaceframe = SpaceframeHelper.getSpaceframe(starship.spaceframe);
        const missionProfile = MissionProfileHelper.getMissionProfile(starship.missionProfile);
        const missionPod = SpaceframeHelper.getMissionPod(starship.missionPod);

        let talents = [...spaceframe.talents.map(t => { return t.name; }), profileTalent, ...additionalTalents];

        if (missionPod) {
            missionPod.talents.forEach(t => {
                talents.push(t.name);
            });
        }

        let trait = "Federation Starship";
        if (traits !== undefined) {
            trait += `, ${traits}`;
        }

        return [
            { name: "game", value: "STARSHIP" },
            { name: "name", value: name },
            { name: "designation", value: registryNumber },
            { name: "year", value: starship.serviceYear.toString() },
            { name: "spaceframe", value: spaceframe.name },
            { name: "missionprofile", value: missionProfile.name },
            { name: "refit", value: "" }, // TODO
            { name: "traits", value: trait },
            { name: "systems", value: starship.systems.join(",") },
            { name: "departments", value: starship.departments.join(",") },
            { name: "scale", value: spaceframe.scale.toString() },
            { name: "resistance", value: this.calculateResistance(starship.scale, talents) },
            { name: "power", value: this.calculatePower(starship.systems[System.Engines], talents) },
            { name: "shields", value: this.calculateShields(starship.systems[System.Structure] + starship.departments[Department.Security], talents) },
            { name: "crew", value: this.calculateCrewSupport(starship.scale) },
            { name: "talents", value: this.serializeTalents(talents) },
            { name: "weapons", value: this.serializeWeapons(spaceframe.attacks, talents) },
        ];
    }

    public static calculateResistance(scale: number, talents: string[]) {
        var resistance = scale;

        if (talents.indexOf("Ablative Armor") > -1) {
            resistance += 2;
        }

        if (talents.indexOf("Improved Hull Integrity") > -1) {
            resistance++;
        }

        return resistance.toString();
    }

    public static calculatePower(base: number, talents: string[]) {
        var power = base;

        if (talents.indexOf("Secondary Reactors") > -1) {
            power += 5;
        }

        return power.toString();
    }

    public static calculateShields(base: number, talents: string[]) {
        var shields = base;

        if (talents.indexOf("Advanced Shields") > -1) {
            shields += 5;
        }

        return shields.toString();
    }

    public static calculateCrewSupport(scale: number) {
        var crew = scale;
        return crew.toString();
    }

    private static serializeTalents(talents: string[]) {
        return talents.join(",");
    }

    private static serializeWeapons(weapons: string[], talents: string[]) {
        var weaponry = weapons.join(",");

        if (talents.indexOf("Quantum Torpedoes") > -1 && weapons.indexOf("Quantum Torpedoes") === -1) {
            weaponry += ",Quantum Torpedoes";
        }

        if (talents.indexOf("Photonic Torpedoes") > -1 && weapons.indexOf("Spatial Torpedoes") > -1) {
            weaponry.replace(",Spatial Torpedoes", ",Photonic Torpedoes");
        }

        if (talents.indexOf("Nuclear Warheads") > -1 && weapons.indexOf("Nuclear Warheads") === -1) {
            weaponry += ",Nuclear Warheads";
        }

        return weaponry;
    }
}