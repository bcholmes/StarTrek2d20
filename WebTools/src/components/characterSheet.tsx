import * as React from 'react';
import {character} from '../common/character';
import {Attribute} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {SpeciesHelper} from '../helpers/species';
import {EnvironmentsHelper, Environment} from '../helpers/environments';
import {UpbringingsHelper} from '../helpers/upbringings';
import {TracksHelper} from '../helpers/tracks';
import {CareersHelper} from '../helpers/careers';
import {TalentsHelper} from '../helpers/talents';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {Era} from '../helpers/eras';

class SectionContent {
    name: string;
    value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }
}

class CharacterSheetData {
    private _data: SectionContent[] = [
        new SectionContent("SPECIES", this.getSpeciesString()),
        new SectionContent("ENVIRONMENT", this.getEnvironmentString()),
        new SectionContent("UPBRINGING", character.upbringing >= 0 ? UpbringingsHelper.getUpbringing(character.upbringing).name + (character.acceptedUpbringing ? "(A)" : "(R)") : "None"),
        new SectionContent("TRAINING", character.track >= 0 ? TracksHelper.getTrack(character.track).name : "None"),
        new SectionContent("CAREER", character.career >= 0 ? CareersHelper.getCareer(character.career).name : "None"),
        new SectionContent("TRAITS", character.traits.join(", "))
    ];

    get dataSection() {
        return this._data;
    }

    private getSpeciesString() {
        var species = character.species >= 0 ? SpeciesHelper.getSpeciesByType(character.species).name : "None"
        if (character.mixedSpecies >= 0) {
            species += `/${SpeciesHelper.getSpeciesByType(character.mixedSpecies).name}`;
        }

        return species;
    }

    private getEnvironmentString() {
        let env = character.environment >= 0 ? EnvironmentsHelper.getEnvironment(character.environment).name : "None";

        if (character.environment === Environment.AnotherSpeciesWorld) {
            env += ` (${character.otherSpeciesWorld})`;
        }

        return env;
    }
}

interface ICharacterSheetProperties {
    showProfile: boolean;
}

export class CharacterSheet extends React.Component<ICharacterSheetProperties, {}> {
    private _sheetData: CharacterSheetData;

    render() {
        this._sheetData = new CharacterSheetData();

        const data = this._sheetData.dataSection.map((s, i) => {
            return (
                <tr key={i}>
                    <td className="bg-dark">{s.name}</td>
                    <td className="bg-light border-dark text-dark">{s.value}</td>
                </tr>
            )
        });

        const characterValues = [
            character.environmentValue,
            character.trackValue,
            character.careerValue,
            character.finishValue
        ];

        const values = characterValues.map((v, i) => {
            return (<div key={i}>{v}</div>);
        });

        const focuses = character.focuses.map((f, i) => {
            return (<div key={i}>{f}</div>);
        });

        let characterTalents = [];

        for (var talent in character.talents) {
            var t = character.talents[talent];
            var tt = TalentsHelper.getTalent(talent);
            if (tt && tt.maxRank > 1) {
                characterTalents.push(talent + " [Rank: " + t.rank + "]");
            } else {
                characterTalents.push(talent);
            }
        }

        const talents = characterTalents.map((t, i) => {
            return (<div key={i}>{t}</div>)
        });

        let equipment = character.equipment.map((e, i) => {
            return (<div key={i}>{e}</div>)
        });

        if (character.career !== undefined) {
            if (character.era === Era.Enterprise) {
                equipment.push(<div key={999}>Phase pistol</div>);
            }
            else {
                if (character.isSecurityOrSeniorOfficer()) {
                    equipment.push(<div key={999}>Phaser type -2</div>);
                }
                else {
                    equipment.push(<div key={999}>Phaser type -1</div>);
                }
            }
        }

        let careerEvents = character.careerEvents.map((e, i) => {
            return (<div key={i}>{CareerEventsHelper.getCareerEvent(e).name}</div>)
        });

        let containerClass = this.props.showProfile ? "sheet-container sheet-container-visible" :  "sheet-container sheet-container-hidden";

        return (
            <div id="character-sheet">
                <div id="character-sheet" className={this.props.showProfile ? 'sheet-visible' : 'sheet-hidden'}>
                    <div className="sheet-bg" id="sheet-bg" style={{ display: this.props.showProfile ? '' : 'none' }}></div>
                    <div className={containerClass} id="sheet-container">
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    {data}
                                </tbody>
                            </table>
                        </div>
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    <tr>
                                        <td className="bg-darker">CONTROL</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Control].value}
                                        </td>
                                        <td className="bg-darker">DARING</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Daring].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darker">FITNESS</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Fitness].value}
                                        </td>
                                        <td className="bg-darker">INSIGHT</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Insight].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darker">PRESENCE</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Presence].value}
                                        </td>
                                        <td className="bg-darker">REASON</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Reason].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest">COMMAND</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Command].expertise}
                                        </td>
                                        <td className="bg-darkest">CONN</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Conn].expertise}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest">SECURITY</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Security].expertise}
                                        </td>
                                        <td className="bg-darkest">ENGINEERING</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Engineering].expertise}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest">SCIENCE</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Science].expertise}
                                        </td>
                                        <td className="bg-darkest">MEDICINE</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Medicine].expertise}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    <tr>
                                        <td className="bg-dark">VALUES</td>
                                        <td className="bg-light border-dark-nopadding text-dark">
                                            {values}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    <tr>
                                        <td className="bg-dark">FOCUSES</td>
                                        <td className="bg-light border-dark-nopadding text-dark">
                                            {focuses}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    <tr>
                                        <td className="bg-dark">TALENTS</td>
                                        <td className="bg-light border-dark-nopadding text-dark">
                                            {talents}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    <tr>
                                        <td className="bg-dark">EQUIPMENT</td>
                                        <td className="bg-light border-dark text-dark">
                                            {equipment}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    <tr>
                                        <td className="bg-dark">CAREER EVENTS</td>
                                        <td className="bg-light border-dark text-dark">
                                            {careerEvents}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}
