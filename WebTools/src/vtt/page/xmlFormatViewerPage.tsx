import React from "react";
import { Header } from "../../components/header";
import LcarsFrame from "../../components/lcarsFrame";
import { PageIdentity } from "../../pages/pageIdentity";
import convert from "xml-js"
import { Character, UpbringingStep } from "../../common/character";
import MainCharacterView from "../../view/mainCharacterView";
import { Attribute, AttributesHelper } from "../../helpers/attributes";
import { Skill, SkillsHelper } from "../../helpers/skills";
import { SpeciesHelper } from "../../helpers/species";
import { Species } from "../../helpers/speciesEnum";
import { UpbringingsHelper } from "../../helpers/upbringings";

interface IXmlFormatViewerState {
    character?: Character;
    messages?: string[];
}

class XmlFormatViewerPage extends React.Component<{}, IXmlFormatViewerState> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (<LcarsFrame activePage={PageIdentity.XmlViewer}>
            <div id="app">
                <div className="container ml-0">
                    <Header>XML Viewer</Header>
                    <p>Paste in an XML file.</p>

                    <textarea className="w-100" rows={10} onChange={e => this.parseXml(e.target.value)}>

                    </textarea>

                    {this.state.messages ? (<div className="mt-3">
                            {this.state.messages.map((m, i) => (<p className="text-danger" key={i}>{m}</p>))}
                        </div>) : null}
                    <div className="mt-5">
                        {this.state.character ? <MainCharacterView character={this.state.character} showButtons={false} /> : null}
                    </div>
                </div>
            </div>
        </LcarsFrame>)
    }

    parseXml(xml: string) {
        try {
            let json = convert.xml2js(xml, {compact: true});

            if (json && json["root"] && json["root"]["character"]) {
                let c = json["root"]["character"];

                let character = new Character();
                character.name = c.name._text;

                let focuses = c.focuslist;
                Object.keys(focuses).forEach(k => {
                    let focus = focuses[k]?.name?._text;
                    if (focus) {
                        character.addFocus(focus);
                    }
                });

                let attributes = c.attributes;
                AttributesHelper.getAllAttributes().forEach(a => {
                    let attributeName = Attribute[a];
                    let attribute = attributes[attributeName.toLowerCase()];
                    let value = attribute?.total?._text;
                    character.attributes[a].value = parseInt(value);
                });

                let disciplines = c.disciplines;
                SkillsHelper.getSkills().forEach(s => {
                    let name = Skill[s];
                    let discipline = disciplines[name.toLowerCase()];
                    let value = discipline?.total?._text;
                    character.skills[s].expertise = parseInt(value);
                });

                let speciesName = c.species?._text;
                SpeciesHelper.getAllSpecies().forEach(s => {
                    if (speciesName === s.name) {
                        console.log(speciesName);
                        character.species = s.id;
                    }
                });
                if (character.species == null) {
                    character.species = Species.Custom;
                    character.customSpeciesName = speciesName;
                }

                let notes = c.notes;
                Object.keys(notes).forEach(k => {
                    let note = notes[k];
                    let text = note?.text?.p?._text;

                    if (text && note?.name?._text?.indexOf("Values") === 0) {
                        text.split(',').map(t => t.trim()).forEach((v, i) => {
                            if (i === 0) {
                                character.environmentValue = v;
                            } else if (i === 1) {
                                character.trackValue = v;
                            } else if (i === 2) {
                                character.careerValue = v;
                            } else if (i === 3) {
                                character.finishValue = v;
                            }
                        })
                    } else if (text && note?.name?._text === "Traits") {
                        text.split(',').map(t => t.trim()).forEach(t => {
                            character.addTrait(t);
                        });
                    }
                });


                let upbringingName = c.upbringing?._text;
                UpbringingsHelper.getUpbringings(false).forEach(u => {
                    if (upbringingName.toLowerCase() === u.name.toLocaleLowerCase()) {
                        character.upbringingStep = new UpbringingStep(u);
                    }
                });



                this.setState((state) => ({...state, character: character}));
            } else {
                this.setState((state) => ({...state, character: null, messages: [ "This does not look like a valid XML character" ]}));
            }
        } catch (e) {
            this.setState((state) => ({...state, character: null, messages: [ "This does not look like valid XML" ]}));
        }
    }
}

export default XmlFormatViewerPage;