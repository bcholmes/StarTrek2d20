import React from "react";
import { Character } from "../../common/character";
import { Construct } from "../../common/construct";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import { ModalControl } from "../../components/modal";
import { FoundryVttExporter, FoundryVttExporterOptions } from "../foundryVttExporter";
import { VttType, VttTypes } from "../vttType";
import i18next from 'i18next';
import { FantasyGroupsVttExporter } from "../fantasyGroundsVttExport";
import { Roll20VttExporter } from "../roll20VttExporter";

declare function download(bytes: any, fileName: any, contentType: any): any;

interface IVttSelectionModalProperties {
    construct: Construct;
}

interface IVttSelectionModalState {
    vttType: VttType
    foundryCompendium?: boolean
}

class VttSelectionModal extends React.Component<IVttSelectionModalProperties, IVttSelectionModalState> {

    constructor(props) {
        super(props);

        let dataJson = window.localStorage.getItem("settings.vttOptions");
        let data = {};
        try {
            data = (dataJson) ? JSON.parse(dataJson) : {};
        } catch (e) {
            // ignore
        }
        this.state = {
            vttType: VttTypes.instance.getTypeByTypeName(data["vttType"])?.type ?? VttType.Foundry,
            foundryCompendium: data["foundryCompendium"] || false
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

                {this.renderVttSpecificSettings()}

                <div className="mt-5 text-center">
                    <Button className="btn btn-primary" onClick={() => this.export() }
                        enabled={this.state.vttType !== VttType.FantasyGrounds || this.props.construct instanceof Character} >Export</Button>
                </div>
            </div>
        );
    }

    renderVttSpecificSettings() {
        if (this.state.vttType === VttType.Foundry) {
            return (<div className="mt-4">
                <p>Do you use the Foundry STA Compendia?</p>
                <DropDownSelect defaultValue={this.state.foundryCompendium ? "Y" : "N"}
                    items={this.getFoundryCompendiumOptions()}
                    onChange={(yesNo) => this.selectFoundryCompendium(yesNo === "Y" ? true : false)} />

            </div>)
        } else if (this.state.vttType === VttType.Roll20) {
            return (<div className="mt-4">
                <p>Roll20 doesn't have a standard way to import characters into STA games. This
                    exporter was designed to work with a browser plugin called the {' '}
                    <a href="https://justas-d.github.io/roll20-enhancement-suite/index.html"  target="_blank" rel="noreferrer">VTT Enhancement Suite</a>.
                </p>
            </div>);
        } else {
            return undefined;
        }
    }

    getFoundryCompendiumOptions() {
        return [
            new DropDownElement("Y", i18next.t('Common.text.yes')),
            new DropDownElement("N", i18next.t('Common.text.no'))
        ]
    }

    selectFoundryCompendium(foundryCompendium: boolean) {
        this.setState((state) => {
            let newState = {
                ...state,
                foundryCompendium: foundryCompendium
            };
            this.persistVtt(newState);
            return newState;
        });

    }

    selectVttType(t: VttType) {
        this.setState((state) => {
            let newState = {
                ...state,
                vttType: t
            };
            this.persistVtt(newState);
            return newState;
        });
    }

    export() {
        if (this.props.construct instanceof Character) {
            if (this.state.vttType === VttType.Foundry) {
                this.exportCharacterToFoundryVtt(this.props.construct as Character);
            } else if (this.state.vttType === VttType.FantasyGrounds) {
                this.exportCharacterToFantasyGrounds(this.props.construct as Character);
            } else if (this.state.vttType === VttType.Roll20) {
                this.exportCharacterToRoll20(this.props.construct as Character);
            }
        }
        if (this.props.construct instanceof Starship) {
            if (this.state.vttType === VttType.Foundry) {
                this.exportStarshipToFoundryVtt(this.props.construct as Starship);
            } else if (this.state.vttType === VttType.Roll20) {
                this.exportStarshipToRoll20(this.props.construct as Starship);
            }
        }
        VttSelectionDialog.instance.hide();
    }

    exportCharacterToFoundryVtt(character: Character) {
        const json = FoundryVttExporter.instance.exportCharacter(character, new FoundryVttExporterOptions(this.state.foundryCompendium));
        const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

        const escaped = this.sanitizeName(character.name, "sta-character");
        download(jsonBytes, escaped + "-foundry-vtt.json", "application/json");
    }

    exportCharacterToRoll20(character: Character) {
        const json = Roll20VttExporter.instance.exportCharacter(character);
        const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

        const escaped = this.sanitizeName(character.name, "sta-character");
        download(jsonBytes, escaped + "-roll20-vtt.json", "application/json");
    }

    exportStarshipToRoll20(starship: Starship) {
        const json = Roll20VttExporter.instance.exportStarship(starship);
        const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

        const escaped = this.sanitizeName(starship.name, "sta-starship");
        download(jsonBytes, escaped + "-roll20-vtt.json", "application/json");
    }

    exportCharacterToFantasyGrounds(character: Character) {
        const xml = FantasyGroupsVttExporter.instance.exportCharacter(character);
        const escaped = this.sanitizeName(character.name, "sta-character");
        download(new TextEncoder().encode(xml), escaped + "-fantasy-grounds.xml", "application/xml");
    }

    exportStarshipToFoundryVtt(starship: Starship) {
        const json = FoundryVttExporter.instance.exportStarship(starship, new FoundryVttExporterOptions(this.state.foundryCompendium));
        const jsonBytes = new TextEncoder().encode(JSON.stringify(json, null, 4));

        const escaped = this.sanitizeName(starship.name, "sta-starship");
        download(jsonBytes, escaped + "-foundry-vtt.json", "application/json");
    }

    sanitizeName(name: string, defaultName: string) {
        return name?.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_') || defaultName;
    }

    persistVtt(state: IVttSelectionModalState) {
        let data = {
            vttType: VttType[state.vttType],
            foundryCompendium: state.foundryCompendium
        }
        window.localStorage.setItem("settings.vttOptions", JSON.stringify(data));
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