import React from "react";
import { Character, Starship } from "../common/character";
import { CharacterType, CharacterTypeModel } from "../common/characterType";
import { Header } from "../components/header";
import { StarshipView } from "../components/starshipView";
import { SupportingCharacterView } from "../components/supportingCharacterView";
import { Attribute } from "../helpers/attributes";
import { marshaller } from "../helpers/marshaller";
import { MissionProfileHelper } from "../helpers/missionProfiles";
import { Skill } from "../helpers/skills";
import { SpaceframeHelper } from "../helpers/spaceframes";
import { SpeciesHelper } from "../helpers/species";
import { System } from "../helpers/systems";
import { TalentsHelper } from "../helpers/talents";
import { IPageProperties } from "./iPageProperties";

export class ViewSheetPage extends React.Component<IPageProperties, {}> {

    render() {
        let url = new URL(window.location.href);
        let query = new URLSearchParams(url.search);
        let encodedSheet = query.get('s');

        let json = marshaller.decode(encodedSheet);

        if (!json) {
            return (<div className="page text-white">This have gone terribly, terribly wrong. We might be in the mirror universe.</div>);
        } else if (json.stereotype === "starship") {
            return (<div className="page">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">View Starship</li>
                    </ol>
                </nav>
                <StarshipView starship={this.createStarship(json)}/>
            </div>);
        } else if (json.stereotype === "supportingCharacter") {
            return (<div className="page">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">View Supporting Character</li>
                    </ol>
                </nav>
                <SupportingCharacterView character={this.createCharacter(json)} />
            </div>);
        } else if (json.stereotype === "character") {
            return (<div className="page">
                <Header>Character Sheet</Header>
            </div>);
        }
    }

    createCharacter(json: any) {
        let result = new Character();
        result.name = json.name;
        result.additionalTraits = json.traits ? json.traits.join(", ") : "";
        result.rank = json.rank;
        result.role = json.role;
        result.pronouns = json.pronouns;
        result.species = SpeciesHelper.getSpeciesTypeByName(json.species);
        if (json.species) {
            result.addTrait(json.species);
        }
        result.focuses = [...json.focuses];
        if (json.attributes) {
            result.attributes.forEach(a => {
                let value = json.attributes[Attribute[a.attribute]];
                if (value != null) {
                    a.value = value;
                }
            });
        }
        if (json.disciplines) {
            result.skills.forEach(s => {
                let value = json.disciplines[Skill[s.skill]];
                if (value != null) {
                    s.expertise = value;
                }
            });
        }

        return result;
    }


    createStarship(json: any) {
        let result = new Starship();
        result.name = json.name;
        result.registry = json.registry;
        result.traits = json.traits;
        result.serviceYear = json.year;
        CharacterTypeModel.getStarshipTypes().forEach(t => {
            if (CharacterType[t.type] === json.type) {
                result.type = t.type;
            }
        });
        if (json.spaceframe) {
            result.spaceframeModel = SpaceframeHelper.getSpaceframeByName(json.spaceframe.name);
        }
        if (json.missionProfile && result.type != null) {
            result.missionProfileModel = MissionProfileHelper.getMissionProfileByName(json.missionProfile.name, result.type);

            if (json.missionProfile.talent) {
                let talent = TalentsHelper.getTalentViewModel(json.missionProfile.talent.name);
                if (talent) {
                    result.profileTalent = talent;
                }
            }
        }
        if (json.missionPod) {
            result.missionPodModel = SpaceframeHelper.getMissionPodByName(json.missionPod.name);
        }
        if (json.traits) {
            result.traits = json.traits.join(", ");
        }
        if (json.refits) {
            json.refits.forEach((r) => {
                let systems = [System.Comms,
                    System.Computer,
                    System.Engines,
                    System.Sensors,
                    System.Structure,
                    System.Weapons];
                systems.forEach(s => {
                    if (System[s] === r) {
                        result.refits.push(s);
                    }
                });
            });
        }

        if (json.talents) {
            json.talents.forEach(t => {
                let talent = TalentsHelper.getTalentViewModel(t.name);
                if (talent) {
                    result.additionalTalents.push(talent);
                }
            });
        }

        Starship.updateSystemAndDepartments(result);

        return result;
    }

}