import * as React from 'react';
import {SetHeaderText} from '../common/extensions';
import {character, CharacterTypeModel, Starship} from '../common/character';
import { CharacterType } from '../common/characterType';
import {DropDownInput} from '../components/dropDownInput';
import {Era} from '../helpers/eras';
import {SpaceframeHelper, Spaceframe, MissionPod} from '../helpers/spaceframes';
import {MissionProfileHelper, MissionProfile} from '../helpers/missionProfiles';
import {System} from '../helpers/systems';
import {Department} from '../helpers/departments';
import {TalentViewModel} from "../helpers/talents";
import {Source} from "../helpers/sources";
import {Skill} from "../helpers/skills";
import {Button} from '../components/button';
import {CheckBox} from "../components/checkBox";
import {TalentSelectionList} from "../components/talentSelectionList";
import {Refits} from "../components/refits";
import {StarshipTalentSelection} from "../components/starshipTalentSelection";
import {CharacterSheetDialog} from '../components/characterSheetDialog'
import {CharacterSheetRegistry} from '../helpers/sheets';

interface StarshipPageState {
    type: CharacterTypeModel
    name: string
    allowAllFrames: boolean
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

        SetHeaderText("STARSHIP");

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
            name: 'U.S.S. ',
            allowAllFrames: false
        };
    }

    render() {

        let overrideCheckbox =(<CheckBox
            isChecked={this.state.allowAllFrames}
            text="Ignore end-of-service date (GM's decision)"
            value={!this.state.allowAllFrames}
            onChanged={() => { let val = this.state.allowAllFrames; this.setState({ allowAllFrames: !val }); }} />);

        const spaceframes = SpaceframeHelper.getSpaceframes(character.starship.serviceYear, this.state.type.type, this.state.allowAllFrames);
        
        const frames = spaceframes.map((f, i) => {
            const systems = f.systems.map((s, si) => {
                return (
                    <tr key={si}>
                        <td>{System[si]}</td>
                        <td>{s}</td>
                    </tr>
                );
            });

            const departments = f.departments.map((d, di) => {
                return (
                    <tr key={di}>
                        <td>{Department[di]}</td>
                        <td>{d === 0 ? "-" : `+${d}`}</td>
                    </tr>
                );
            });

            const talents = f.talents.map((t, ti) => {
                if (t === null) {
                    console.log(f.name);
                }

                return t.isAvailableForServiceYear() ? (
                    <div key={ti}>{t.name}</div>
                ) : undefined;
            });

            return (
                <tr key={i}>
                    <td className="selection-header">{f.name}</td>
                    <td><table><tbody>{systems}</tbody></table></td>
                    <td><table><tbody>{departments}</tbody></table></td>
                    <td style={{ verticalAlign: "top" }}>{f.scale}</td>
                    <td style={{ verticalAlign: "top" }}>{talents}</td>
                    <td>
                        <CheckBox
                            isChecked={character.starship.spaceframe === f.id}
                            text=""
                            value={f.id}
                            onChanged={(val) => { this.onSpaceframeSelected(f.id); } }/>
                    </td>
                </tr>
            );
        });

        const missionPods = character.starship.spaceframe === Spaceframe.Nebula ||
                            character.starship.spaceframe === Spaceframe.Luna
            ? (
                <div className="panel">
                    <div className="header-small">Mission Pod</div>
                    <div className="page-text-aligned">
                        This class of starship is fitted with a single Mission Pod, chosen from the list below.
                    </div>
                    <table className="selection-list">
                        <tbody>
                            <tr>
                                <td></td>
                                <td>Systems</td>
                                <td>Departments</td>
                                <td>Talents</td>
                                <td></td>
                            </tr>
                            {
                                SpaceframeHelper.getMissionPods().map((p, i) => {
                                    const systems = p.systems.map((s, si) => {
                                        return (
                                            <tr key={si}>
                                                <td>{System[si]}</td>
                                                <td>{s}</td>
                                            </tr>
                                        );
                                    });

                                    const departments = p.departments.map((d, di) => {
                                        return (
                                            <tr key={di}>
                                                <td>{Department[di]}</td>
                                                <td>{d === 0 ? "-" : `+${d}`}</td>
                                            </tr>
                                        );
                                    });

                                    const talents = p.talents.map((t, ti) => {
                                        if (t === null) {
                                            console.log(t.name);
                                        }

                                        return (
                                            <div key={ti}>{t.name}</div>
                                        );
                                    });
                                    return (
                                        <tr key={i}>
                                            <td className="selection-header">{p.name}</td>
                                            <td><table><tbody>{systems}</tbody></table></td>
                                            <td><table><tbody>{departments}</tbody></table></td>
                                            <td style={{ verticalAlign: "top" }}>{talents}</td>
                                            <td>
                                                <CheckBox
                                                    isChecked={character.starship.missionPod === p.id}
                                                    text=""
                                                    value={p.id}
                                                    onChanged={(val) => { this.onMissionPodSelected(p.id); } }/>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    <br/> <br/>
                </div>
              )
            : undefined;

        const missionProfiles = MissionProfileHelper.getMissionProfiles(character.type).map((m, i) => {
            const departments = m.departments.map((d, di) => {
                return (
                    <tr key={di}>
                        <td>{Department[di]}</td>
                        <td>{d}</td>
                    </tr>
                );
            });

            const talents = m.talents.map((t, ti) => {
                return (<div key={ti}>{t.name}</div>);
            });

            return (
                <tr key={i}>
                    <td className="selection-header">{m.name}</td>
                    <td><table><tbody>{departments}</tbody></table></td>
                    <td style={{ verticalAlign: "top" }}>{talents}</td>
                    <td>
                        <CheckBox
                            isChecked={character.starship.missionProfile === m.id}
                            text=""
                            value={m.id}
                            onChanged={(val) => { this.onMissionProfileSelected(m.id); } }/>
                    </td>
                </tr>
            );
        });

        let spaceframeTalents = character.starship.spaceframe !== undefined
            ? spaceframes.filter(f => f.id === character.starship.spaceframe)[0].talents.map(t => { return t.name })
            : undefined;

        if ((character.starship.spaceframe === Spaceframe.Nebula || character.starship.spaceframe === Spaceframe.Luna) && character.starship.missionPod !== undefined) {
            SpaceframeHelper.getMissionPod(character.starship.missionPod).talents.forEach(t => {
                spaceframeTalents.push(t.name);
            });
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
        if (character.starship.spaceframe >= 0) {
            const frame = SpaceframeHelper.getSpaceframe(character.starship.spaceframe);
            numRefits = Math.floor((character.starship.serviceYear - frame.serviceYear) / 10);
            defaultTrait = frame.additionalTraits;
        }

        const refits = numRefits > 0
            ? (
                <div className="panel" style={{ marginTop: "2em" }}>
                    <div className="header-small">Refits</div>
                    <div className="page-text-aligned">
                        Your ship is entitled to <b>{numRefits}</b> Refits.
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
                        Select {character.starship.scale - numAdditionalTalents} additional talents for your starship.
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
                <li>
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
                            {overrideCheckbox}
                            <table className="selection-list">
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>Systems</td>
                                        <td>Departments</td>
                                        <td>Scale</td>
                                        <td>Talents</td>
                                        <td></td>
                                    </tr>
                                    {frames}
                                </tbody>
                            </table>
                        </div>
                        <br/><br/>
                        {missionPods}
                        <div className="panel">
                            <div className="header-small">Mission Profile</div>
                            <div className="page-text-aligned">
                                The ship’s Mission Profile is a key part of what distinguishes it from her sister ships.
                                It determines how the ship will be equipped, what facilities and personnel are assigned to
                                it, and what kind of operations it will be expected to perform.
                            </div>
                            <table className="selection-list">
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>Departments</td>
                                        <td>Talent options</td>
                                        <td></td>
                                    </tr>
                                    {missionProfiles}
                                </tbody>
                            </table>
                        </div>
                        <br/><br/>
                        <div className="panel">
                            <div className="header-small">Stats</div>
                            <div className="sheet-panel">
                                <table className="sheet-section">
                                    <tbody>
                                        <tr>
                                            <td className="bg-darker">COMMS</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.systems[System.Comms]}
                                            </td>
                                            <td className="bg-darker">COMPUTERS</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.systems[System.Computer]}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bg-darker">ENGINES</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.systems[System.Engines]}
                                            </td>
                                            <td className="bg-darker">SENSORS</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.systems[System.Sensors]}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bg-darker">STRUCTURE</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.systems[System.Structure]}
                                            </td>
                                            <td className="bg-darker">WEAPONS</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.systems[System.Weapons]}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bg-darkest">COMMAND</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.departments[Department.Command]}
                                            </td>
                                            <td className="bg-darkest">CONN</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.departments[Department.Conn]}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bg-darkest">SECURITY</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.departments[Department.Security]}
                                            </td>
                                            <td className="bg-darkest">ENGINEERING</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.departments[Department.Engineering]}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bg-darkest">SCIENCE</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.departments[Department.Science]}
                                            </td>
                                            <td className="bg-darkest">MEDICINE</td>
                                            <td className="bg-light border-dark-nopadding text-dark text-center">
                                                {character.starship.departments[Department.Medicine]}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
                            <Button text="Export to PDF" className="button-small" onClick={() => this.showDialog() } />
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private showDialog() {
        CharacterSheetDialog.show(CharacterSheetRegistry.getStarshipSheets(), "starship");
    }

    private getTypes() {
        return CharacterTypeModel.getStarshipTypes().map((t, i) => t.name);
    }

    private getSelectedType() {
        return this.state.type.name;
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

    private onSpaceframeSelected(spaceframe: Spaceframe) {
        character.starship.spaceframe = spaceframe;
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
        if (character.starship.spaceframe === undefined || character.starship.missionProfile === undefined) {
            return;
        }

        const frame = SpaceframeHelper.getSpaceframe(character.starship.spaceframe);
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
        let numTalents = 0;

        if (this._profileTalent !== null) {
            numTalents++;
        }

        if (character.starship.spaceframe !== undefined) {
            numTalents += SpaceframeHelper.getSpaceframe(character.starship.spaceframe).talents.length;

            if (character.starship.spaceframe === Spaceframe.Nebula) {
                numTalents += 2;
            }
        }

        return numTalents;
    }
}