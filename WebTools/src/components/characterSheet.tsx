import * as React from 'react';
import i18n from 'i18next';
import {character} from '../common/character';
import {Attribute} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {EnvironmentsHelper, Environment} from '../helpers/environments';
import {TracksHelper} from '../helpers/tracks';
import {CareersHelper} from '../helpers/careers';
import {TalentsHelper} from '../helpers/talents';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {Era} from '../helpers/eras';
import store from '../state/store';
import { withTranslation, WithTranslation } from 'react-i18next';

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
        new SectionContent(i18n.t('Construct.other.species'), this.getSpeciesString()),
        new SectionContent(i18n.t('Construct.other.environment'), this.getEnvironmentString()),
        new SectionContent(i18n.t('Construct.other.upbringing'), character.upbringingStep ? character.upbringingStep?.upbringing?.name + (character.upbringingStep?.acceptedUpbringing ? "(A)" : "(R)") : i18n.t('Common.text.none')),
        new SectionContent(i18n.t('Construct.other.training'), character.track >= 0 ? TracksHelper.instance().getTrack(character.track).name : i18n.t('Common.text.none')),
        new SectionContent(i18n.t('Construct.other.career'), character.career >= 0 ? CareersHelper.getCareer(character.career).name : i18n.t('Common.text.none')),
        new SectionContent(i18n.t('Construct.other.traits'), character.traits.join(", "))
    ];

    get dataSection() {
        return this._data;
    }

    private getSpeciesString() {
        return character.speciesName || i18n.t('Common.text.none');
    }

    private getEnvironmentString() {
        let env = character.environment >= 0 ? EnvironmentsHelper.getEnvironment(character.environment, character.type).name : i18n.t('Common.text.none');

        if (character.environment === Environment.AnotherSpeciesWorld) {
            env += ` (${character.otherSpeciesWorld})`;
        }

        return env;
    }
}

interface ICharacterSheetProperties extends WithTranslation {
    showProfile: boolean;
    close: () => void;
}

class CharacterSheet extends React.Component<ICharacterSheetProperties, {}> {
    private _sheetData: CharacterSheetData;

    render() {
        const { t } = this.props;

        this._sheetData = new CharacterSheetData();

        const data = this._sheetData.dataSection.map((s, i) => {
            return (
                <tr key={i}>
                    <td className="bg-dark text-uppercase">{s.name}</td>
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
            let tal = character.talents[talent];
            let tt = TalentsHelper.getTalent(talent);
            if (tt && tt.maxRank > 1) {
                characterTalents.push(talent + " [Rank: " + tal.rank + "]");
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
            if (store.getState().context.era === Era.Enterprise) {
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
            return (<div key={i}>{CareerEventsHelper.getCareerEvent(e, character.type).name}</div>)
        });

        let containerClass = this.props.showProfile ? "sheet-container sheet-container-visible" :  "sheet-container sheet-container-hidden";

        return (
            <div id="character-sheet">
                <div id="character-sheet" className={this.props.showProfile ? 'sheet-visible' : 'sheet-hidden'}>
                    <div className="sheet-bg" id="sheet-bg" style={{ display: this.props.showProfile ? '' : "none" }} onClick={() => this.props.close()}></div>
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
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.control')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Control].value}
                                        </td>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.daring')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Daring].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.fitness')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Fitness].value}
                                        </td>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.insight')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Insight].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.presence')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Presence].value}
                                        </td>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.reason')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.attributes[Attribute.Reason].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.command')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Command].expertise}
                                        </td>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.conn')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Conn].expertise}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.security')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Security].expertise}
                                        </td>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.engineering')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Engineering].expertise}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.science')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {character.skills[Skill.Science].expertise}
                                        </td>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.medicine')}</td>
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
                                        <td className="bg-dark text-uppercase">{t('Construct.other.values')}</td>
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
                                        <td className="bg-dark text-uppercase">{t('Construct.other.focuses')}</td>
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
                                        <td className="bg-dark text-uppercase">{t('Construct.other.talents')}</td>
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
                                        <td className="bg-dark text-uppercase">{t('Construct.other.equipment')}</td>
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
                                        <td className="bg-dark text-uppercase">{t('Construct.other.careerEvents')}</td>
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

export default withTranslation()(CharacterSheet);