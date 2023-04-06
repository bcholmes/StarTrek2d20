import React from "react";
import { Character } from "../../common/character";
import { Construct } from "../../common/construct";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import { ModalControl } from "../../components/modal";
import { FoundryVttExporter } from "../foundryVttExporter";
import { VttType, VttTypes } from "../vttType";

declare function download(bytes: any, fileName: any, contentType: any): any;

interface IVttSelectionModalProperties {
    construct: Construct;
}

interface IVttSelectionModalState {
    vttType: VttType
}

class VttSelectionModal extends React.Component<IVttSelectionModalProperties, IVttSelectionModalState> {

    constructor(props) {
        super(props);

        this.state = {
            vttType: VttType.Foundry
        }
    }

    render() {
        return (
            <div>
                <p>Select the Virtual Table Top implementation that you use.</p>
                <p>Don't see the one you like? With luck, more will be added over time.</p>

                <DropDownSelect defaultValue={this.state.vttType}
                    items={VttTypes.instance.getTypes().map(t => new DropDownElement(t.type, t.name))}
                    onChange={(t) => this.selectVttType(t as number)} />

                <div className="mt-5 text-right">
                    <Button buttonType={true} className="btn btn-primary" onClick={() => this.export() } >Export</Button>
                </div>
            </div>
        );
    }

    selectVttType(t: VttType) {
        this.setState((state) => ({
            ...state,
            vttType: t
        }));
    }

    export() {
        if (this.props.construct instanceof Character) {
            if (this.state.vttType === VttType.Foundry) {
                this.exportCharacterToFoundryVtt(this.props.construct as Character);
            }
        }
        if (this.props.construct instanceof Starship) {
            if (this.state.vttType === VttType.Foundry) {
                this.exportStarshipToFoundryVtt(this.props.construct as Starship);
            }
        }
        VttSelectionDialog.instance.hide();
    }

    exportCharacterToFoundryVtt(character: Character) {
        const json = FoundryVttExporter.instance.exportCharacter(character);
        const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

        const escaped = character.name?.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_') || "sta-character";
        download(jsonBytes, escaped + "-foundry-vtt.json", "application/json");
    }

    exportStarshipToFoundryVtt(starship: Starship) {
        const json = FoundryVttExporter.instance.exportStarship(starship);
        const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

        const escaped = starship.name?.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_') || "sta-starship";
        download(jsonBytes, escaped + "-foundry-vtt.json", "application/json");
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

    show(construct: Construct) {
        ModalControl.show("lg", () => {}, React.createElement(VttSelectionModal, {
            construct: construct
        }), "Virtual Table Top");
    }

    hide() {
        ModalControl.hide();
    }
}