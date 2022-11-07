import React from "react";
import { StarshipView } from "../view/starshipView"
import { SupportingCharacterView } from "../view/supportingCharacterView";
import { marshaller } from "../helpers/marshaller";
import { MainCharacterView } from "../view/mainCharacterView";
import { IPageProperties } from "./iPageProperties";

export class ViewSheetPage extends React.Component<IPageProperties, {}> {

    render() {
        let url = new URL(window.location.href);
        let query = new URLSearchParams(url.search);
        let encodedSheet = query.get('s');

        let json = marshaller.decode(encodedSheet);

        if (!json) {
            return (<div className="page text-white">Things have gone terribly, terribly wrong. We might be in the mirror universe.</div>);
        } else if (json.stereotype === "starship") {
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">View Starship</li>
                    </ol>
                </nav>
                <StarshipView starship={marshaller.decodeStarship(encodedSheet)}/>
            </div>);
        } else if (json.stereotype === "supportingCharacter") {
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">View Supporting Character</li>
                    </ol>
                </nav>
                <SupportingCharacterView character={marshaller.decodeCharacter(json)} />
            </div>);
        } else if (json.stereotype === "mainCharacter") {
            return (<div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">View Main Character</li>
                    </ol>
                </nav>
                <MainCharacterView character={marshaller.decodeCharacter(json)} />
            </div>);
        }
    }
}