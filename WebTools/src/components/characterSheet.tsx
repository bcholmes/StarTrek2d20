import React from 'react';
import i18n from 'i18next';
import {Character} from '../common/character';
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
import { TalentsHelper } from '../helpers/talents';
import { BorgImplants } from '../helpers/borgImplant';

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
            new SectionContent(i18n.t('Construct.other.upbringing'), this.character.upbringingStep ? this.character.upbringingStep?.localizedDescription : i18n.t('Common.text.none')),
            new SectionContent(i18n.t('Construct.other.training'), this.character.educationStep?.track != null
                ? TracksHelper.instance.getTrack(this.character.educationStep?.track, character.type)?.localizedName
                : i18n.t('Common.text.none')),
            new SectionContent(i18n.t('Construct.other.career'), this.character.careerStep?.career != null
                ? (this.character.stereotype === Stereotype.SoloCharacter
                    ? CareersHelper.instance.getSoloCareerLength(this.character.careerStep?.career).localizedName
                    : CareersHelper.instance.getCareer(this.character.careerStep?.career).localizedName)
                : i18n.t('Common.text.none')),
            new SectionContent(i18n.t('Construct.other.traits'), this.character.getAllTraits())
        ];
    }

    get dataSection() {
        return this._data;
    }

    private getSpeciesString() {
        return this.character.localizedSpeciesName || i18n.t('Common.text.none');
    }

    private getEnvironmentString() {
        let env = this.character.environmentStep ? EnvironmentsHelper.getEnvironment(this.character.environmentStep.environment, this.character.type).localizedName : i18n.t('Common.text.none');

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
        let c = new Character();
        if (store.getState().character.currentCharacter) {
            c = store.getState().character.currentCharacter;
        }

        this._sheetData = new CharacterSheetData(c);

        const data = this._sheetData.dataSection.map((s, i) => {
            return (
                <div className="sheet-panel d-flex" key={'data-' + i}>
                    <div className="sheet-label-purple text-uppercase">{s.name}</div>
                    <div className="sheet-data">{s.value}</div>
                </div>
            )
        });

        const characterValues = c.values;

        const values = characterValues.map((v, i) => {
            return (<div key={i}>{v}</div>);
        });

        const focuses = c.focuses.map((f, i) => {
            return (<div key={i}>{f}</div>);
        });

        const talents = c.talents.map((t, i) => {
            const talentModel = TalentsHelper.getTalent(t.talent);
            return (<div key={i}>{talentModel.localizedDisplayName}</div>)
        });

        let equipment = c.equipmentModels.map((e, i) => {
            return (<div key={i}>{e.localizedName}</div>)
        });

        c.implants.map((type, i) => {
            let implant = BorgImplants.instance.getImplantByType(type);
            return equipment.push(<div key={i + equipment.length}>{implant.type}</div>)
        });


        if (c.careerStep?.career !== undefined) {
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

        let containerClass = this.props.showProfile ? "sheet-container sheet-container-visible pe-3" :  "sheet-container sheet-container-hidden pe-3";
        const era = this.props.era == null ? null : ErasHelper.getEra(this.props.era);

        return (
            <div id="character-sheet">
                <div id="character-sheet" className={this.props.showProfile ? 'sheet-visible' : 'sheet-hidden'}>
                    <div className="sheet-bg" id="sheet-bg" style={{ display: this.props.showProfile ? '' : "none" }} onClick={() => this.props.close()}></div>
                    <div className={containerClass} id="sheet-container">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <div className="sheet-panel d-flex">
                                    <div className="sheet-label-purple text-uppercase">{t('Construct.other.characterType')}</div>
                                    <div className="sheet-data">
                                        {CharacterTypeModel.getByType(c.type)?.localizedName}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-2">
                                <div className="sheet-panel d-flex">
                                    <div className="sheet-label-purple text-uppercase">{t('Construct.other.era')}</div>
                                    <div className="sheet-data">
                                        {era?.localizedName ?? ""}
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-6 mb-2">
                                {data}
                            </div>

                            <div className="col-md-6 mb-2">

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.attribute.control')}</div>
                                            <div className="sheet-data text-center">
                                                {c.attributes[Attribute.Control].value}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.attribute.daring')}</div>
                                            <div className="sheet-data text-center">
                                                {c.attributes[Attribute.Daring].value}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.attribute.fitness')}</div>
                                            <div className="sheet-data text-center">
                                                {c.attributes[Attribute.Fitness].value}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.attribute.insight')}</div>
                                            <div className="sheet-data text-center">
                                                {c.attributes[Attribute.Insight].value}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.attribute.presence')}</div>
                                            <div className="sheet-data text-center">
                                                {c.attributes[Attribute.Presence].value}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-purple text-uppercase">{t('Construct.attribute.reason')}</div>
                                            <div className="sheet-data text-center">
                                                {c.attributes[Attribute.Reason].value}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.discipline.command')}</div>
                                            <div className="sheet-data text-center">
                                                {c.skills[Skill.Command].expertise}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.discipline.conn')}</div>
                                            <div className="sheet-data text-center">
                                                {c.skills[Skill.Conn].expertise}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.discipline.security')}</div>
                                            <div className="sheet-data text-center">
                                                {c.skills[Skill.Security].expertise}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.discipline.engineering')}</div>
                                            <div className="sheet-data text-center">
                                                {c.skills[Skill.Engineering].expertise}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.discipline.science')}</div>
                                            <div className="sheet-data text-center">
                                                {c.skills[Skill.Science].expertise}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="sheet-panel d-flex mw-100">
                                            <div className="sheet-label-orange text-uppercase">{t('Construct.discipline.medicine')}</div>
                                            <div className="sheet-data text-center">
                                                {c.skills[Skill.Medicine].expertise}
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className="sheet-panel d-flex">
                                    <div className="sheet-label-purple text-uppercase">{t('Construct.other.values')}</div>
                                    <div className="sheet-data">
                                        {values}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-2">
                                <div className="sheet-panel d-flex">
                                    <div className="sheet-label-purple text-uppercase">{t('Construct.other.focuses')}</div>
                                    <div className="sheet-data">
                                        {focuses}
                                    </div>
                                </div>
                            </div>

                            {c.stereotype === Stereotype.SoloCharacter ? undefined :
                                (<div className="col-md-6 mb-2">
                                    <div className="sheet-panel d-flex">
                                        <div className="sheet-label-purple text-uppercase">{t('Construct.other.talents')}</div>
                                        <div className="sheet-data">
                                        {talents}
                                        </div>
                                    </div>
                                </div>)}

                            <div className="col-md-6 mb-2">
                                <div className="sheet-panel d-flex">
                                    <div className="sheet-label-purple text-uppercase">{t('Construct.other.equipment')}</div>
                                    <div className="sheet-data">
                                        {equipment}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-2">
                                <div className="sheet-panel d-flex">
                                    <div className="sheet-label-purple text-uppercase">{t('Construct.other.careerEvents')}</div>
                                    <div className="sheet-data">
                                        {careerEvents}
                                    </div>
                                </div>
                            </div>

                        </div>
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