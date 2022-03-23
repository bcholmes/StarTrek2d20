import base64url from "base64url";
import React from "react";
import huffman from 'rfc7541-huffman';
import { Starship } from "../common/character";
import { Header } from "../components/header";
import { StarshipView } from "../components/starshipView";
import { marshaller } from "../helpers/marshaller";
import { MissionProfileHelper } from "../helpers/missionProfiles";
import { SpaceframeHelper } from "../helpers/spaceframes";
import { System } from "../helpers/systems";
import { TalentsHelper } from "../helpers/talents";
import { IPageProperties } from "./iPageProperties";

export class ViewSheetPage extends React.Component<IPageProperties, {}> {

    render() {
        let sheet = {
            "stereotype": "starship",
            "type": "Starfleet",
            "year": 2377,
            "spaceframe": {
                "name": "Intrepid"
            },
            "missionProfile": {
                "name": "ScientificAndSurvey"
            },
            "name": "USS Alan Turing",
            "registry": "NCC-74859",
            "refits": ["Structure"],
            "talents": [{ "name" : "Modular Laboratories" }],
            "traits": ["Dominion War Service"]
        };

        let url = new URL(window.location.href);
        let query = new URLSearchParams(url.search);
        let encodedSheet = query.get('s');

        {
            let text = JSON.stringify(sheet);
            let encoded = huffman.encode(text);
            console.log(base64url.encode(encoded));
        }
        
        let json = marshaller.decode(encodedSheet);

        if (!json) {
            return (<div className="page text-white">This have gone terribly, terribly wrong. We might be in the mirror universe.</div>);
        } else if (json.stereotype === "starship") {
            return (<div className="page">
                <StarshipView starship={this.createStarship(json)}/>
            </div>);
        } else if (json.stereotype === "character") {
            return (<div className="page">
                <Header>Character Sheet</Header>
            </div>);
        }
    }

    createStarship(json: any) {
        let result = new Starship();
        result.name = json.name;
        result.registry = json.registry;
        result.traits = json.traits;
        result.serviceYear = json.year;
        if (json.spaceframe) {
            result.spaceframeModel = SpaceframeHelper.getSpaceframeByName(json.spaceframe.name);
        }
        if (json.missionProfile && result.spaceframeModel) {
            result.missionProfileModel = MissionProfileHelper.getMissionProfileByName(json.missionProfile.name, result.spaceframeModel.type);      
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