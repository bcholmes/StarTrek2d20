import * as React from 'react';
import {character } from '../common/character';
import {CharacterType, CharacterTypeModel } from '../common/characterType';
import {CharacterSerializer} from '../common/characterSerializer';
import {Species, SpeciesHelper} from '../helpers/species';
import {DropDownInput} from '../components/dropDownInput';
import {SupportingCharacterAttributes} from '../components/supportingCharacterAttributes';
import {SupportingCharacterDisciplines} from '../components/supportingCharacterDisciplines';
import {Rank, RanksHelper} from '../helpers/ranks';
import {Button} from '../components/button';
import {CharacterSheetDialog} from '../components/characterSheetDialog'
import {CharacterSheetRegistry} from '../helpers/sheets';
import AgeHelper, { Age } from '../helpers/age';
import { Source } from '../helpers/sources';
import { marshaller } from '../helpers/marshaller';


interface ISupportingCharacterState {
    age: Age;
    type: CharacterTypeModel;
}

export class SupportingCharacterPage extends React.Component<{}, ISupportingCharacterState> {
    private _nameElement: HTMLInputElement;
    private _purposeElement: HTMLInputElement;
    private _focus1Element: HTMLInputElement;
    private _focus2Element: HTMLInputElement;
    private _focus3Element: HTMLInputElement;
    private _attributeElement: SupportingCharacterAttributes;
    private _pronounsElement: HTMLInputElement;

    private _name: string;
    private _rank: string;
    private _purpose: string;
    private _species: string;
    private _focus1: string;
    private _focus2: string;
    private _focus3: string;
    private _pronouns: string = "";

    constructor(props: {}) {
        super(props);

        const profileButton = document.getElementById("profile-button");
        if (profileButton !== undefined) {
            profileButton.style.display = "none";
        }

        this._species = "Human";

        [10, 9, 9, 8, 8, 7].forEach((v, i) => {
            character.attributes[i].value = v;
        });

        character.species = Species.Human;
        character.rank = "Lieutenant";
        character.careerValue = "";
        character.environmentValue = "";
        character.finishValue = "";
        character.trackValue = "";
        character.addEquipment("Uniform");
        character.addEquipment("Tricorder");
        character.addEquipment("Communicator");
        this.state = {
            age: AgeHelper.getAdultAge(),
            type: CharacterTypeModel.getAllTypes()[character.type]
        }
    }

    render() {
        let ageDiv = character.hasSource(Source.PlayersGuide) && character.age.isChild()
            ? (<div className="panel">
                    <div className="header-small">Age</div>
                    <div className="page-text-aligned">
                        How old is this character?
                    </div>
                    <div>
                        <DropDownInput
                            items={this.getAges() }
                            defaultValue={this.state.age.name}
                            onChange={(index) => this.selectAge(index) }/>
                    </div>
                </div>)
            : null;



        return (
            <div className="page">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Supporting Character Creation</li>
                    </ol>
                </nav>

                <div className="starship-container">
                    <div className="starship-panel">
                        <div className="panel">
                            <div className="header-small">Character Type</div>
                            <div className="page-text-aligned">
                                Is this a Starfleet/Federation character, or a member of the Klingon Empire?
                            </div>
                            <div>
                                <DropDownInput
                                    items={this.getTypes() }
                                    defaultValue={this.state.type.name}
                                    onChange={(index) => this.selectType(index) }/>
                            </div>
                        </div>
                        <div className="panel">
                            <div className="header-small">Purpose/Department</div>
                            <div className="page-text-aligned">
                                First determine what purpose the Supporting Character will fill.
                                Are they an engineer, or a doctor, or a scientist, or a security officer?
                            </div>
                            <div className="textinput-label">DEPARTMENT</div>
                            <input
                                type="text"
                                defaultValue={this._purpose}
                                ref={(el) => { this._purposeElement = el; } }
                                onChange={() => {
                                    this._purpose = this._purposeElement.value;
                                    character.role = this._purpose;
                                    this.forceUpdate();
                                } } />
                        </div>
                        {ageDiv}
                        <div className="panel mt-3">
                            <div className="header-small">Species &amp; Attributes</div>
                            <div className="page-text-aligned">
                                Secondly, assign Attribute scores and choose the character's species.
                                The chosen species will affect the final Attribute scores.
                                Select two different values to swap them.
                            </div>
                            <DropDownInput
                                items={SpeciesHelper.getSpecies().map(s => { return s.name }) }
                                defaultValue={this._species}
                                onChange={(index) => this.selectSpecies(index) }/>
                            <br/><br/>
                            <SupportingCharacterAttributes age={this.state.age}
                                ref={(el) => this._attributeElement = el}
                                species={SpeciesHelper.getSpeciesByName(this._species) }
                                onUpdate={() => { this.forceUpdate(); }}/>
                        </div>
                        <div className="panel mt-3">
                            <div className="header-small">Disciplines</div>
                            <div className="page-text-aligned">
                                Next, assign the character's Disciplines.
                                The highest value should match up with the department/purpose of the character.
                                Select two different values to swap them.
                            </div>
                            <SupportingCharacterDisciplines age={this.state.age}
                                onUpdate={() => { this.forceUpdate(); } }/>
                        </div>
                    </div>
                    <br/><br/>
                    <div className="panel">
                        <div className="header-small">Focuses</div>
                        <div className="page-text-aligned">
                            Choose three Focuses for the character.
                            At least one should reflect the department/purpose of the character.
                        </div>
                        <div>
                            <div className="textinput-label">FOCUS 1</div>
                            <input
                                type="text"
                                defaultValue={this._focus1}
                                ref={(el) => { this._focus1Element = el; } }
                                onChange={() => {
                                    this._focus1 = this._focus1Element.value;
                                    this.onFocusChanged();
                                } } />
                        </div>
                        <div>
                            <div className="textinput-label">FOCUS 2</div>
                            <input
                                type="text"
                                defaultValue={this._focus2}
                                ref={(el) => { this._focus2Element = el; } }
                                onChange={() => {
                                    this._focus2 = this._focus2Element.value;
                                    this.onFocusChanged();
                                } } />
                        </div>
                        <div>
                            <div className="textinput-label">FOCUS 3</div>
                            <input
                                type="text"
                                defaultValue={this._focus3}
                                ref={(el) => { this._focus3Element = el; } }
                                onChange={() => {
                                    this._focus3 = this._focus3Element.value;
                                    this.onFocusChanged();
                                } } />
                        </div>
                    </div>
                    <br/><br/>
                    <div className="panel">
                        <div className="header-small">Name &amp; Rank</div>
                        <div className="page-text-aligned">
                            Give the character an appropriate name and rank.
                            Supporting Characters should never have a rank above Lieutenant
                            and may often be enlisted personnel rather than officers.
                        </div>
                        <div style={{borderBottom:"1px solid rgba(128, 128, 128, 0.4)", marginBottom:"10px",paddingBottom:"18px"}}>
                            <DropDownInput
                                items={this.getRanks() }
                                defaultValue={this._rank}
                                onChange={(index) => this.selectRank(index) }/>
                        </div>
                        <div>
                            <div className="textinput-label">NAME</div>
                            <input
                                type="text"
                                defaultValue={this._name}
                                ref={(el) => { this._nameElement = el; } }
                                onChange={() => {
                                    this._name = this._nameElement.value;
                                    character.name = this._name;
                                    this.forceUpdate();
                                } } />
                        </div>
                        <div>
                            <div className="textinput-label">PRONOUNS</div>
                            <input
                                type="text"
                                defaultValue={this._pronouns}
                                ref={(el) => { this._pronounsElement = el; } }
                                onChange={() => {
                                    this._pronouns = this._pronounsElement.value;
                                    character.pronouns = this._pronouns;
                                    this.forceUpdate();
                                } } />
                        </div>
                    </div>
                    <br/>
                    <div className="button-container">
                        <Button text="Export to PDF" className="button-small mr-2 mb-2" onClick={() => this.showDialog() } buttonType={true} />
                        <Button text="View" className="button-small mr-2 mb-2" onClick={() => this.showViewPage() } buttonType={true} />
                    </div>
                </div>
            </div>
        );
    }

    showViewPage() {
        const value = marshaller.encodeSupportingCharacter(character);
        window.open('/view?s=' + value, "_blank");
    }

    getAges() {
        return AgeHelper.getAllChildAges().map(a => a.name);
    }

    selectAge(index: number) {
        this.setState((state) => ({ ...state, age: AgeHelper.getAllChildAges()[index]}));
    }

    private showDialog() {
        this.populateAdditionalFields();
        CharacterSheetDialog.show(CharacterSheetRegistry.getSupportingCharacterSheet(), "supporting-character");
    }

    private populateAdditionalFields() {
        character.traits = [ CharacterSerializer.serializeSpecies(character.species, character.mixedSpecies) ];
    }

    private selectSpecies(index: number) {
        const species = SpeciesHelper.getSpecies();
        this._species = species[index].name;

        character.species = species[index].id;

        this._attributeElement.species = character.species;

        this.forceUpdate();
    }

    private getTypes() {
        return CharacterTypeModel.getAllTypes().map((t, i) => t.name);
    }
    private getRanks() {
        var result = [];

        const ranks = RanksHelper.getRanks(true)
            .filter(r => r.id !== Rank.Captain &&
                         r.id !== Rank.Commander &&
                         r.id !== Rank.LieutenantCommander);

        ranks.forEach(r => {
            if (r.tiers === 1) {
                result.push(r.name);
            }
            else {
                for (var i = 0; i < r.tiers; i++) {
                    result.push(`${r.name} ${this.tierToString(i)} Class`);
                }
            }
        });

        return result;
    }

    private tierToString(tier: number) {
        var tierStr = "";

        switch (tier) {
            case 0: tierStr = "1st"; break;
            case 1: tierStr = "2nd"; break;
            case 2: tierStr = "3rd"; break;
        }

        return tierStr;
    }

    private selectRank(index: number) {
        const ranks = this.getRanks();
        this._rank = ranks[index];

        character.rank = ranks[index];

        this.forceUpdate();
    }

    private selectType(index: number) {
        let type = CharacterTypeModel.getAllTypes()[index];
        character.type = type.type;
        let age = this.state.age;

        if (type.type !== CharacterType.Child) {
            age = AgeHelper.getAdultAge();
            character.age = age;
        } else if (character.age === AgeHelper.getAdultAge()) {
            age = AgeHelper.getAllChildAges()[0];
            character.age = age;
        }

        this.setState((state) => ({
            ...state,
            age: age,
            type: type
        }));
    }

    private onFocusChanged() {
        character.focuses = [];

        character.addFocus(this._focus1);
        character.addFocus(this._focus2);
        character.addFocus(this._focus3);

        this.forceUpdate();
    }
}
