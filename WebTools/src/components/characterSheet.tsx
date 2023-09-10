import * as React from 'react';
import i18n from 'i18next';
import {Character, character} from '../common/character';
import {Attribute} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {EnvironmentsHelper, Environment} from '../helpers/environments';
import {TracksHelper} from '../helpers/tracks';
import {CareersHelper} from '../helpers/careers';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {Era, ErasHelper} from '../helpers/eras';
import store from '../state/store';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CharacterTypeModel } from '../common/characterType';
import { Stereotype } from '../common/construct';
import { CharacterSerializer } from '../common/characterSerializer';

class SectionContent {
    name: string;
    value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }
}

class CharacterSheetData {

    readonly character: Character;
    private _data: SectionContent[];


    constructor(character: Character) {
        this.character = character;
        this._data = [
            new SectionContent(i18n.t('Construct.other.species'), this.getSpeciesString()),
            new SectionContent(i18n.t('Construct.other.environment'), this.getEnvironmentString()),
            new SectionContent(i18n.t('Construct.other.upbringing'), this.character.upbringingStep ? this.character.upbringingStep?.description : i18n.t('Common.text.none')),
            new SectionContent(i18n.t('Construct.other.training'), this.character.educationStep?.track != null ? TracksHelper.instance().getTrack(this.character.educationStep.track, character).name : i18n.t('Common.text.none')),
            new SectionContent(i18n.t('Construct.other.career'), this.character.career != null ? CareersHelper.instance.getCareer(this.character.career).localizedName : i18n.t('Common.text.none')),
            new SectionContent(i18n.t('Construct.other.traits'), this.character.traits.join(", "))
        ];
    }

    get dataSection() {
        return this._data;
    }

    private getSpeciesString() {
        return this.character.speciesName || i18n.t('Common.text.none');
    }

    private getEnvironmentString() {
        let env = this.character.environmentStep ? EnvironmentsHelper.getEnvironment(this.character.environmentStep.environment, this.character.type).name : i18n.t('Common.text.none');

        if (this.character.environmentStep?.environment === Environment.AnotherSpeciesWorld && this.character.environmentStep?.otherSpecies != null) {
            env = CharacterSerializer.serializeEnvironment(this.character.environmentStep.environment, this.character.environmentStep.otherSpecies, this.character.type);
        }

        return env;
    }
}

interface ICharacterSheetProperties extends WithTranslation {
    era?: Era;
    showProfile: boolean;
    storeBased?: boolean;
    close: () => void;
}

class CharacterSheet extends React.Component<ICharacterSheetProperties, {}> {
    private _sheetData: CharacterSheetData;

    render() {
        const { t } = this.props;
        let c = character;
        if (this.props.storeBased && store.getState().character.currentCharacter) {
            c = store.getState().character.currentCharacter;
        }

        this._sheetData = new CharacterSheetData(c);

        const data = this._sheetData.dataSection.map((s, i) => {
            return (
                <tr key={i}>
                    <td className="bg-dark text-uppercase">{s.name}</td>
                    <td className="bg-light border-dark text-dark">{s.value}</td>
                </tr>
            )
        });

        const characterValues = [
            c.environmentValue,
            c.trackValue,
            c.careerValue,
            c.finishValue
        ];

        const values = characterValues.map((v, i) => {
            return (<div key={i}>{v}</div>);
        });

        const focuses = c.focuses.map((f, i) => {
            return (<div key={i}>{f}</div>);
        });

        let characterTalents = c.getTalentNameList();

        const talents = characterTalents.map((t, i) => {
            return (<div key={i}>{t}</div>)
        });

        let equipment = c.equipment.map((e, i) => {
            return (<div key={i}>{e}</div>)
        });

        if (c.career !== undefined) {
            if (store.getState().context.era === Era.Enterprise) {
                equipment.push(<div key={999}>Phase pistol</div>);
            } else {
                if (c.isSecurityOrSeniorOfficer()) {
                    equipment.push(<div key={999}>Phaser type -2</div>);
                }
                else {
                    equipment.push(<div key={999}>Phaser type -1</div>);
                }
            }
        }

        let careerEvents = c.careerEvents.map((e, i) => {
            return (<div key={i}>{CareerEventsHelper.getCareerEvent(e.id, c.type).localizedName}</div>)
        });

        let containerClass = this.props.showProfile ? "sheet-container sheet-container-visible" :  "sheet-container sheet-container-hidden";
        const era = this.props.era == null ? null : ErasHelper.getEra(this.props.era);

        return (
            <div id="character-sheet">
                <div id="character-sheet" className={this.props.showProfile ? 'sheet-visible' : 'sheet-hidden'}>
                    <div className="sheet-bg" id="sheet-bg" style={{ display: this.props.showProfile ? '' : "none" }} onClick={() => this.props.close()}></div>
                    <div className={containerClass} id="sheet-container">
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    <tr>
                                        <td className="bg-dark text-uppercase">{t('Construct.other.characterType')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark">
                                            {CharacterTypeModel.getByType(c.type)?.localizedName}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="sheet-panel">
                            <table className="sheet-section">
                                <tbody>
                                    <tr>
                                        <td className="bg-darker text-uppercase">{t('Construct.other.era')}:</td>
                                        <td className="bg-light border-dark-nopadding text-dark">{era?.localizedName ?? ""}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

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
                                            {c.attributes[Attribute.Control].value}
                                        </td>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.daring')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.attributes[Attribute.Daring].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.fitness')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.attributes[Attribute.Fitness].value}
                                        </td>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.insight')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.attributes[Attribute.Insight].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.presence')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.attributes[Attribute.Presence].value}
                                        </td>
                                        <td className="bg-darker text-uppercase">{t('Construct.attribute.reason')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.attributes[Attribute.Reason].value}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.command')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.skills[Skill.Command].expertise}
                                        </td>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.conn')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.skills[Skill.Conn].expertise}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.security')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.skills[Skill.Security].expertise}
                                        </td>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.engineering')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.skills[Skill.Engineering].expertise}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.science')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.skills[Skill.Science].expertise}
                                        </td>
                                        <td className="bg-darkest text-uppercase">{t('Construct.discipline.medicine')}</td>
                                        <td className="bg-light border-dark-nopadding text-dark text-center">
                                            {c.skills[Skill.Medicine].expertise}
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
                        {c.stereotype === Stereotype.SoloCharacter ? undefined :
                            (<div className="sheet-panel">
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
                            </div>)}
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

function mapStateToProps(state, ownProps) {
    return {
        era: state.context.era,
    };
}

export default withTranslation()(connect(mapStateToProps)(CharacterSheet));