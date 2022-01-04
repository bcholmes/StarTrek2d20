import * as React from 'react';
import {character, Starship} from '../common/character';
import {CharacterTypeModel} from '../common/characterType';
import { CharacterType } from '../common/characterType';
import {DropDownInput} from '../components/dropDownInput';
import {Era} from '../helpers/eras';
import {SpaceframeHelper, MissionPod, SpaceframeViewModel} from '../helpers/spaceframes';
import {MissionProfileHelper, MissionProfile} from '../helpers/missionProfiles';
import {TalentViewModel} from "../helpers/talents";
import {Source} from "../helpers/sources";
import {Skill} from "../helpers/skills";
import {Button} from '../components/button';
import {TalentSelectionList} from "../components/talentSelectionList";
import {Refits} from "../components/refits";
import {StarshipTalentSelection} from "../components/starshipTalentSelection";
import {CharacterSheetDialog} from '../components/characterSheetDialog'
import {CharacterSheetRegistry} from '../helpers/sheets';
import { ModalControl } from '../components/modal';
import SpaceframeSelection from '../components/spaceframeSelection';
import StarshipStats from '../components/starshipStats';
import MissionProfileSelection from '../components/missionProfileSelection';
import MissionPodSelection from '../components/missionPodSelection';
import CustomSpaceframeForm from '../components/customSpaceframeForm';

interface StarshipPageState {
    type: CharacterTypeModel
    name: string
}

export class StarshipPage extends React.Component<{}, StarshipPageState> {
    private _yearInput: HTMLInputElement;
    private _profileTalent: string;
    private _talentSelection: string[];
    private _traits: string;
    private _registry: string = "NCC-";
    private _refits: number;

    constructor(props: {}) {
        super(props);

        const profileButton = document.getElementById("profile-button");
        if (profileButton !== undefined) {
            profileButton.style.display = "none";
        }

        character.starship = new Starship();
        character.starship.serviceYear = this.eraDefaultYear(character.era);

        this._profileTalent = null;
        this._talentSelection = [];
        this._refits = 0;

        this.state = {
            type: CharacterTypeModel.getStarshipTypes()[character.type],
            name: 'U.S.S. '
        };
    }

    renderSpaceframeSection() {
        const spaceframes = SpaceframeHelper.getSpaceframes(character.starship.serviceYear, this.state.type.type, true);
        // if other choices have changed, then the current spaceframe might be invalid
        if (character.starship && character.starship.spaceframeModel) {
            if (character.starship.spaceframeModel.isCustom) {
                // check type and year?
            } else {

                let frames = spaceframes.filter(f => f.id === character.starship.spaceframeModel.id);
                if (frames.length === 0) {
                    character.starship.spaceframeModel = undefined;
                }
            }
        }

        let selectedSpaceframeDetails = (<div className="p-0"><h5 className="text-selection">No Selection</h5></div>);
        if (character.starship.spaceframeModel) {
            let talentList = character.starship.spaceframeModel.talents ? character.starship.spaceframeModel.talents.map(t => t.name).join(", ") : "None specified";
            if (!talentList) {
                talentList = "None";
            }
            selectedSpaceframeDetails = (
                <div className="p-0">
                    <h5 className="text-selection">{character.starship.spaceframeModel.name ? character.starship.spaceframeModel.name : "Unnamed Class"}</h5>
                    <StarshipStats model={character.starship.spaceframeModel} type="spaceframe" />
                    <p><b className="text-selection">Talents:</b> {talentList}</p>
                </div>
            );
        }
        return selectedSpaceframeDetails;
    }

    renderMissionProfilesSection() {
        const profiles = MissionProfileHelper.getMissionProfiles(this.state.type.type);
        let missionProfileModel = undefined;
        // if other choices have changed, then the current spaceframe might be invalid
        if (character.starship && character.starship.missionProfile !== undefined) {
            let frames = profiles.filter(p => p.id === character.starship.missionProfile);
            if (frames.length === 0) {
                character.starship.missionProfile = undefined;
            } else {
                missionProfileModel = frames[0];
            }
        }

        let details = (<div className="p-0"><h5 className="text-selection">No Selection</h5></div>);
        if (missionProfileModel) {
            details = (
                <div className="p-0">
                    <h5 className="text-selection">{missionProfileModel.name}</h5>
                    <StarshipStats model={missionProfileModel} type="missionProfile" />
                </div>
            );
        }
        return details;
    }

    renderMissionPodsSection() {
        if (character.starship && character.starship.spaceframeModel && character.starship.spaceframeModel.isMissionPodAvailable) {
            const pods = SpaceframeHelper.getMissionPods();
            let missionPodModel = undefined;
            // if other choices have changed, then the current spaceframe might be invalid
            if (character.starship && character.starship.missionPod !== undefined) {
                let items = pods.filter(p => p.id === character.starship.missionPod);
                if (items.length === 0) {
                    character.starship.missionPod = undefined;
                } else {
                    missionPodModel = items[0];
                }
            }
    
            let details = (<div className="p-0"><h5 className="text-selection">No Selection</h5></div>);
            if (missionPodModel) {
                let talentList = missionPodModel.talents ? missionPodModel.talents.map(t => t.name).join(", ") : "None specified";
                if (!talentList) {
                    talentList = "None";
                }
                details = (
                    <div className="p-0">
                        <h5 className="text-selection">{missionPodModel.name}</h5>
                        <StarshipStats model={missionPodModel} type="missionPod" />
                        <p><b className="text-selection">Talents:</b> {talentList}</p>
                    </div>
                );
            }
            return details;
    
        } else {
            character.starship.missionPod = undefined;
            return undefined;
        }
    }


    render() {
        const selectedSpaceframeDetails = this.renderSpaceframeSection();
        const missionProfilesDetails = this.renderMissionProfilesSection();
        
        let spaceframeTalents = [];
        let missionPodDetails = undefined;
        if (character.starship.spaceframeModel) {
            spaceframeTalents = character.starship.spaceframeModel.talents.map(t => { return t.name });
            if (character.starship.spaceframeModel.isMissionPodAvailable) {
                missionPodDetails = (<div className="panel">
                        <div className="header-small">Mission Pod</div>
                        <div className="page-text-aligned">
                            This class of starship is fitted with a single Mission Pod.
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '700px'}}>
                                {this.renderMissionPodsSection()}
                                <div className="p-0">
                                    <Button className="button-small" text="Choose" onClick={() => this.showModal('missionPod')} buttonType={true}/>
                                </div>
                            </div>
                    </div>);
                if (character.starship.missionPod !== undefined) {
                    SpaceframeHelper.getMissionPod(character.starship.missionPod).talents.forEach(t => {
                        spaceframeTalents.push(t.name);
                    });
                }
            }
        }

        let talents: TalentViewModel[] = [];
        if (character.starship.missionProfile !== undefined) {
            MissionProfileHelper.getMissionProfile(character.starship.missionProfile, character.type).talents
                .forEach(t => {
                    if (spaceframeTalents.indexOf(t.name) === -1) {
                        talents.push(new TalentViewModel(t.name, 1, false, t.description, Skill.None, t.category));
                    }
                });
        }

        let defaultTrait = character.type === CharacterType.KlingonWarrior ? ["Klingon Starship"] : ["Federation Starship"];
        let numRefits = 0;
        if (character.starship.spaceframeModel) {
            const frame = character.starship.spaceframeModel;
            numRefits = Math.floor((character.starship.serviceYear - frame.serviceYear) / 10);
            defaultTrait = frame.additionalTraits;
        }

        const refits = numRefits > 0
            ? (
                <div className="panel" style={{ marginTop: "2em" }}>
                    <div className="header-small">Refits</div>
                    <div className="page-text-aligned">
                        Your ship is entitled to <b>{numRefits}</b> {(numRefits === 1 ? ' Refit' : ' Refits')}.
                        Each refit grants a point that can be used to increase a System attribute by one.
                        No System attribute may go above 12.
                    </div>
                    <Refits points={numRefits - this._refits} onUpdate={(points) => { this._refits = points; }}/>
                </div>
            )
            : undefined;

        const numAdditionalTalents = this.calculateTalents();
        const additionalTalentOptions = numAdditionalTalents < character.starship.scale
            ? (
                <div className="panel" style={{ marginTop: "2em" }}>
                    <div className="header-small">Additional Talents</div>
                    <div className="page-text-aligned">
                        Select {character.starship.scale - numAdditionalTalents} additional {(character.starship.scale - numAdditionalTalents === 1) ? ' talent ' : ' talents '} for your starship.
                    </div>
                    <StarshipTalentSelection
                        points={character.starship.scale - numAdditionalTalents}
                        filter={[this._profileTalent, ...spaceframeTalents]}
                        onSelection={(talents) => { this._talentSelection = talents; character.starship.additionalTalents = this._talentSelection; this.forceUpdate(); } }/>
                </div>
              )
            : undefined;

        let typeSelection = character.hasSource(Source.KlingonCore) 
                ? (<div className="panel">
                        <div className="header-small">Ship Type</div>
                        <div className="page-text-aligned">
                            Is this a Starfleet/Federation vessel, or a ship of the Klingon Empire?
                        </div>
                        <div>
                            <DropDownInput
                                items={this.getTypes() }
                                defaultValue={this.getSelectedType()}
                                onChange={(index) => this.selectType(index) }/>
                        </div>
                    </div>)
                : undefined;

        const traitList = defaultTrait.map((t, i) => {
            return (
                <li key={'trait-' + i}>
                    {t}
                </li>
            );
        });
    

        let nameSection = character.type === CharacterType.KlingonWarrior 
            ?   (<div className="panel">
                    <div className="page-text-aligned">
                    <div className="header-small">Name</div>
                        Every Starship needs a name.
                        The Empire has no universal convention for the naming of ships, often naming them after locations, brave warriors, 
                        ancient ships, mythical figures, or even important objects from history, great beasts, or boasts relating to a 
                        House's conquests.
                        In many cases, these vague naming conventions overlap — a ship may be named after an ancient ship that was itself 
                        named after a location, for example — but this shouldn’t cause any issues.
                        The name should ideally be a single word or, more rarely, two.
                        <br/><br/>
                        A Klingon starship's name is prefixed with I.K.S., standing for Imperial Klingon Ship, if it is not part of a 
                        House fleet and serves the Empire as a whole. House vessels may continue to use the I.K.S. prefix, though they 
                        may also not have any prefix at all or one made by the leader of that House.
                    </div>
                    <div className="textinput-label">NAME</div>
                    <input
                        type="text"
                        onChange={(ev) => {
                            let name = (ev.target as HTMLInputElement).value;
                            character.starship.name = name;
                            let state = this.state;
                            this.setState({
                                ...state,
                                name: name
                            });
                        } }
                        value={this.state.name} />
                </div>)
            : (<div className="panel">
                    <div className="header-small">Name</div>
                    <div className="page-text-aligned">
                        Every Starship needs a name.
                        The Federation has no universal convention for the naming of ships, often naming them after locations, important historical persons (normally only the person’s surname), ancient ships, mythical figures, or even more abstract ideals, virtues, or concepts.
                        In many cases, these vague naming conventions overlap — a ship may be named after an ancient ship that was itself named after a location, for example — but this shouldn’t cause any issues.
                        The name should ideally be a single word or, more rarely, two.
                        <br/><br/>
                        In all cases, a Federation starship’s name will be prefixed with U.S.S.
                    </div>
                    <div className="textinput-label">NAME</div>
                    <input
                        type="text"
                        onChange={(ev) => {
                            let name = (ev.target as HTMLInputElement).value;
                            character.starship.name = name;
                            let state = this.state;
                            this.setState({
                                ...state,
                                name: name
                            });
                        } }
                        value={this.state.name} />
                </div>);

        let registrySection = character.type === CharacterType.KlingonWarrior ? undefined
            : (<div className="panel">
            <div className="header-small">Registry Number</div>
            <div className="page-text-aligned">
                To go with the name, each Federation starship has a registry number.
                This is a four- (for games set in the Original Series era), or five-digit number (for games set in the Next Generation era), prefixed by either the letters NCC, or NX.
                NCC is used for most ships, but NX is reserved for prototype vessels and the first ship of a class , in honor of the first Human starships able to reach warp 5. 
            </div>
            <div className="textinput-label">REGISTRY NUMBER</div>
            <input
                type="text"
                onChange={(ev) => {
                    this._registry = (ev.target as HTMLInputElement).value;
                    character.starship.registry = this._registry;
                    this.forceUpdate();
                } }
                value={this._registry} />
        </div>);

        return (
            <div className="page">
                <div className="starship-container">
                    <div className="starship-panel">
                        {typeSelection}
                        <div className="panel">
                            <div className="header-small">Year of Service</div>
                            <div className="page-text-aligned">
                                The year in which the ship exists determines available options.
                                Choose which year you want to play in together with your GM.
                                A default year will be filled in automatically dependent on the chosen Era.
                            </div>
                            <div className="textinput-label">YEAR</div>
                            <input
                                type="number"
                                defaultValue={character.starship.serviceYear.toString()}
                                ref={(el) => { this._yearInput = el; } }
                                onChange={() => {
                                    character.starship.serviceYear = parseInt(this._yearInput.value);
                                    this.updateSystemAndDepartments();
                                    this.forceUpdate();
                                } } />
                        </div>
                        <br/><br/>
                        <div className="panel">
                            <div className="header-small">Spaceframe</div>
                            <div className="page-text-aligned">
                                The vessel's spaceframe is its basic superstructure, core systems, operation infrastructure, 
                                and all the other elements that are common to every vessel of the same class.
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '700px'}}>
                                {selectedSpaceframeDetails}
                                <div className="p-0">
                                    <div className="p-0">
                                        <Button className="button-small" text="Choose" onClick={() => this.showModal('spaceframes')} buttonType={true}/>
                                    </div>
                                    <div className="p-0 pt-2">
                                        <Button className="button-small" text="Custom" onClick={() => this.showModal('customSpaceframe')} buttonType={true}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/><br/>
                        {missionPodDetails}
                        <div className="panel">
                            <div className="header-small">Mission Profile</div>
                            <div className="page-text-aligned">
                                The ship’s Mission Profile is a key part of what distinguishes it from her sister ships.
                                It determines how the ship will be equipped, what facilities and personnel are assigned to
                                it, and what kind of operations it will be expected to perform.
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '700px'}}>
                                {missionProfilesDetails}
                                <div className="p-0">
                                    <Button className="button-small" text="Choose" onClick={() => this.showModal('missionProfile')} buttonType={true}/>
                                </div>
                            </div>
                        </div>
                        <br/><br/>
                        <div className="panel">
                            <div className="header-small">Talent</div>
                            <div className="page-text-aligned">
                                Select one talent from those offered by the ship's Mission Profile.
                            </div>
                            <TalentSelectionList
                                talents={talents}
                                onSelection={(talent) => {
                                    this._profileTalent = talent.substr(0, talent.indexOf("(") - 1);
                                    character.starship.profileTalent = this._profileTalent;
                                    this.forceUpdate();
                                } }/>
                        </div>
                        {refits}
                        {additionalTalentOptions}
                        <br/><br/>
                        <div className="panel">
                            <div className="header-small">Traits</div>
                            <div className="page-text-aligned">
                                You may now define additional Traits for your starship.
                                Your starship already has these traits:
                                <ul>
                                    {traitList}
                                </ul>
                                Your GM may allow you to pick additional traits that describe your
                                vessel. Examples include: Prototype, Legacy Vessel, Renowned and Long-Serving.
                            </div>
                            <textarea
                                rows={8}
                                onChange={(ev) => {
                                    this._traits = ((ev.target as HTMLTextAreaElement).value);
                                    character.starship.traits = this._traits;
                                    this.forceUpdate();
                                } }
                                onBlur={(ev) => {
                                    this._traits = ((ev.target as HTMLTextAreaElement).value.replace(/\n/g, ', '));
                                    this.forceUpdate();
                                } }
                                value={this._traits} />
                        </div>
                        <br/><br/>
                        {nameSection}
                        <br/><br/>
                        {registrySection}
                    </div>
                    <br/><br/>
                    <div className="starship-panel">
                        <div className="button-container">
                            <Button text="Export to PDF" className="button-small" onClick={() => this.showExportDialog() } />
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    closeModal() {
        ModalControl.hide();
        this.forceUpdate();
    }

    showModal(name: string) {
        ModalControl.show("lg", () => this.closeModal(), this.modalContents(name), this.modalHeader(name));
    }

    modalHeader(name: string) {
        if (name === 'spaceframes') {
            return "Select a Spaceframe";
        } else if (name === 'missionProfile') {
            return "Select a Mission Profile";
        } else if (name === 'missionPod') {
            return "Select a Mission Pod";
        } else if (name === 'customSpaceframe') {
            return "Provide details about your Spaceframe";
        } else {
            return undefined;
        }
    }

    modalContents(name: string) {
        if (name === 'spaceframes') {
            return (<SpaceframeSelection serviceYear={character.starship.serviceYear} type={character.type} 
                initialSelection={character.starship.spaceframeModel} onSelection={(s) => { this.onSpaceframeSelected(s); this.closeModal() }} />);
        } else if (name === 'customSpaceframe') {
            return (<CustomSpaceframeForm  
                initialSelection={this.createOrReuseCustomSpaceframe()} onComplete={(s) => { this.onSpaceframeSelected(s); this.closeModal() }} />);
        } else if (name === 'missionProfile') {
            return (<MissionProfileSelection type={character.type} 
                initialSelection={character.starship.missionProfile} onSelection={(m) => { this.onMissionProfileSelected(m); this.closeModal() }} />);
        } else if (name === 'missionPod') {
            return (<MissionPodSelection 
                initialSelection={character.starship.missionPod} onSelection={(m) => { this.onMissionPodSelected(m); this.closeModal() }} />);
            } else {
            return undefined;
        }
    }

    private showExportDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getStarshipSheets(), "starship");
    }

    private getTypes() {
        return CharacterTypeModel.getStarshipTypes().map((t, i) => t.name);
    }

    private getSelectedType() {
        return this.state.type.name;
    }

    createOrReuseCustomSpaceframe() {
        if (character.starship && character.starship.spaceframeModel && character.starship.spaceframeModel.isCustom) {
            return character.starship.spaceframeModel;
        } else {
            return SpaceframeViewModel.createCustomSpaceframe(character.type, character.starship.serviceYear, [ character.era ]);
        }
    }

    private selectType(index: number) {
        let state = this.state;
        character.type = CharacterTypeModel.getStarshipTypes()[index].type;
        let name = state.name;
        if (name === "U.S.S. " && character.type === CharacterType.KlingonWarrior) {
            name = "I.K.S. ";
        }
        this.setState({
            ...state,
            type: CharacterTypeModel.getStarshipTypes()[index],
            name: name
        });
    }

    private eraDefaultYear(era: Era) {
        switch (era) {
            case Era.Enterprise:
                return 2155;
            case Era.OriginalSeries:
                return 2269;
            case Era.NextGeneration:
                return 2371;
        }
    }

    private onSpaceframeSelected(spaceframe: SpaceframeViewModel) {
        character.starship.spaceframeModel = spaceframe;
        this.updateSystemAndDepartments();
        this.forceUpdate();
    }

    private onMissionPodSelected(pod: MissionPod) {
        character.starship.missionPod = pod;
        this.updateSystemAndDepartments();
        this.forceUpdate();
    }

    private onMissionProfileSelected(profile: MissionProfile) {
        character.starship.missionProfile = profile;
        this.updateSystemAndDepartments();
        this.forceUpdate();
    }

    private updateSystemAndDepartments() {
        if (character.starship.spaceframeModel === undefined || character.starship.missionProfile === undefined) {
            return;
        }

        const frame = character.starship.spaceframeModel;
        const missionPod = SpaceframeHelper.getMissionPod(character.starship.missionPod);
        const profile = MissionProfileHelper.getMissionProfile(character.starship.missionProfile, character.type);

        character.starship.scale = frame.scale;

        frame.systems.forEach((s, i) => {
            character.starship.systems[i] = s;
        });

        frame.departments.forEach((d, i) => {
            character.starship.departments[i] = d;
        });

        if (missionPod) {
            missionPod.systems.forEach((s, i) => {
                character.starship.systems[i] += s;
            });

            missionPod.departments.forEach((d, i) => {
                character.starship.departments[i] += d;
            });
        }

        profile.departments.forEach((d, i) => {
            character.starship.departments[i] += d;
        });

        this._refits = 0;
    }

    private calculateTalents() {
        let numTalents = 1; // the mission profile talent should always be counted

        if (character.starship.spaceframeModel !== undefined) {
            numTalents += character.starship.spaceframeModel.talents.length;

            if (character.starship.spaceframeModel.isMissionPodAvailable) {
                numTalents += 2;
            }
        }

        return numTalents;
    }
}