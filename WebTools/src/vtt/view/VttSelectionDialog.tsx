import React from "react";
import { Character } from "../../common/character";
import { Button } from "../../components/button";
import { ModalControl } from "../../components/modal";
import { FoundryVttExporter } from "../foundryVttExporter";

declare function download(bytes: any, fileName: any, contentType: any): any;

interface IVttSelectionModalProperties {
    character: Character;
}

class VttSelectionModal extends React.Component<IVttSelectionModalProperties, {}> {
    render() {
        return (
            <div>
                <p>Select the Virtual Table Top implementation that you use.</p>
                <p>Don't see the one you like? With luck, more will be added over time.</p>
                <div className="my-5">
                    <Button buttonType={true} className="btn btn-primary" onClick={() => this.exportToFoundryVtt() } >Foundry VTT</Button>
                </div>
            </div>
        );
    }


    exportToFoundryVtt() {
        const json = FoundryVttExporter.instance.exportCharacter(this.props.character);
        const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

        var escaped = this.props.character.name?.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_') ?? "sta";
        download(jsonBytes, escaped + "-sta.json", "application/json");

        VttSelectionDialog.instance.hide();
    }
}

export class VttSelectionDialog {

    private static _instance: VttSelectionDialog;

    static get instance() {
        if (VttSelectionDialog._instance == null) {
            VttSelectionDialog._instance = new VttSelectionDialog();
        }
        return VttSelectionDialog._instance;
    }

    show(character: Character) {
        ModalControl.show("lg", () => {}, React.createElement(VttSelectionModal, {
            character: character
        }), "Virtual Table Top");
    }

    hide() {
        ModalControl.hide();
    }
}