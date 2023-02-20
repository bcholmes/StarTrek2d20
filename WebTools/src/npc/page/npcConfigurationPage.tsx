import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Character, SpeciesStep } from '../../common/character';
import { CharacterTypeModel } from '../../common/characterType';
import { D20 } from '../../common/die';
import { navigateTo } from '../../common/navigator';
import { Button } from '../../components/button';
import { DropDownElement, DropDownInput } from '../../components/dropDownInput';
import { Header } from '../../components/header';
import InstructionText from '../../components/instructionText';
import { AttributesHelper } from '../../helpers/attributes';
import { Career } from '../../helpers/careerEnum';
import { marshaller } from '../../helpers/marshaller';
import { RanksHelper } from '../../helpers/ranks';
import { Skill, SkillsHelper } from '../../helpers/skills';
import { SpeciesHelper, SpeciesModel } from '../../helpers/species';
import { Species } from '../../helpers/speciesEnum';
import { PageIdentity } from '../../pages/pageIdentity';
import { NpcType, NpcTypes } from '../model/npcType';
import { SpecializationModel, Specializations } from '../model/specializations';
import { NameGenerator } from '../nameGenerator';

const recreationSkills = [ "Holodeck Simulations", "Dixie Hill Adventures",
    "Model Ship Building", "Federation History", "Bolian Neo-Metal Bands",
    "Oil Painting", "Camping", "Survival", "Gourmet Cooking", "Bajoran Spirituality",
    "Klingon Chancellors", "Ice Fishing", "Musical Instrument", "Barbeque Grilling",
    "History of the Human Civil Rights Movement", "Classical Jazz", "The Sacred Texts of Betazed",
    "Games of Chance", "Spy Holonovels", "White Water Rafting", "The Human Beatnik Era",
    "Borg Threat Assessment", "The History of Romulan Coups", "The Bajoran Age of Sail",
    "Water Vessels", "Historical Re-enactment", "Whiskey Tasting", "Wine Making", "Darts",
    "Meditation" ]

interface INpcConfigurationPageState {
    selectedType: CharacterTypeModel;
    selectedSpecies: SpeciesModel;
    selectedSpecialization?: SpecializationModel;
}

class NpcConfigurationPage extends React.Component<WithTranslation, INpcConfigurationPageState> {

    constructor(props) {
        super(props);

        this.state = {
            selectedType: CharacterTypeModel.getNpcCharacterTypes()[0],
            selectedSpecies: SpeciesHelper.getSpeciesByType(Species.Human)
        }
    }

    render() {


        const { t } = this.props;
        return (<div className="page">
            <div className="container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('Page.title.npcConfiguration')}</li>
                    </ol>
                </nav>

                <Header>{t('Page.title.npcConfiguration')}</Header>

                <div className="my-4">
                    <InstructionText text={"Specify what kind of NPC you're trying to create."} />
                </div>

                <div className="row">
                    <div className="col-lg-4 my-4">
                        <Header level={2}>Type</Header>

                        <div className="mt-4">
                            <DropDownInput
                                items={ CharacterTypeModel.getNpcCharacterTypes().map(t => new DropDownElement(t.type, t.localizedName )) }
                                defaultValue={ this.state.selectedType.type }
                                onChange={(index) => this.selectType(CharacterTypeModel.getNpcCharacterTypes()[index] ) }/>
                        </div>
                    </div>

                    <div className="col-lg-4 my-4">
                        <Header level={2}>Species</Header>

                        <div className="mt-4">
                            <DropDownInput
                                items={ this.getSpeciesList().map(t => new DropDownElement(t.id, t.name )) }
                                defaultValue={ this.state.selectedSpecies }
                                onChange={(index) => this.selectSpecies(this.getSpeciesList()[index] ) }/>
                        </div>
                    </div>

                    <div className="col-lg-4 my-4">
                        <Header level={2}>Specialization</Header>

                        <div className="mt-4">
                            <DropDownInput
                                items={ this.getSpecializations() }
                                defaultValue={ this.state.selectedSpecialization?.id }
                                onChange={(index) => this.selectSpecialization(index) }/>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <Button buttonType={true} className="btn btn-primary" onClick={() => this.createNpc()}>{t('Common.button.create')}</Button>
                </div>
            </div>
        </div>);
    }

    getSpecializations() {
        let result = [ new DropDownElement(null, "Any Specialization")];
        Specializations.instance.getSpecializations().forEach(s => result.push(new DropDownElement(s.id, s.name)));
        return result;
    }

    getSpeciesList() {
        let list = [ SpeciesHelper.getSpeciesByType(Species.Human) ];
        return list;
    }

    selectSpecialization(index: number) {
        if (index ===  0) {
            this.setState((state) => ({...state, selectedSpecialization: null }));
        } else {
            this.setState((state) => ({...state, selectedSpecialization: Specializations.instance.getSpecializations()[index-1] }));
        }
    }

    selectType(type: CharacterTypeModel) {
        this.setState((state) => ({...state, selectedType: type }));
    }

    selectSpecies(species: SpeciesModel) {
        this.setState((state) => ({...state, selectedSpecies: species }));
    }

    createNpc() {
        let character = new Character();
        let specialization = this.state.selectedSpecialization;
        if (specialization == null) {
            let specializations = Specializations.instance.getSpecializations();
            specialization = specializations[Math.floor(Math.random() * specializations.length)];
        }

        let {name, pronouns} = NameGenerator.instance.createName(this.state.selectedSpecies);
        character.name = name;
        character.pronouns = pronouns;
        character.speciesStep = new SpeciesStep(this.state.selectedSpecies.id);
        character.jobAssignment = specialization.name;

        let attributes = AttributesHelper.getAllAttributes();
        let attributePoints = NpcTypes.attributePoints(NpcType.Notable);
        let chances = [20, 14, 8];

        for (let i = 0; i < attributePoints.length; i++) {
            let a = attributes[Math.floor(Math.random() * attributes.length)];
            if (i < specialization.primaryAttributes.length && i < chances.length && D20.roll() <= chances[i]) {
                let temp = specialization.primaryAttributes[Math.floor(Math.random() * specialization.primaryAttributes.length)];
                if (attributes.indexOf(temp) >= 0) {
                    a = temp;
                }
            }
            character.attributes[a].value = attributePoints[i];
            attributes.splice(attributes.indexOf(a), 1);
        }

        // TODO: apply species attribute bumps

        let disciplines = SkillsHelper.getSkills();
        let disciplinePoints = NpcTypes.disciplinePoints(NpcType.Notable);

        for (let i = 0; i < disciplinePoints.length; i++) {
            let a = disciplines[Math.floor(Math.random() * disciplines.length)];
            if (i === 0 && specialization.primaryDiscipline != null) {
                a = specialization.primaryDiscipline;
            }
            character.skills[a].expertise = disciplinePoints[i];
            disciplines.splice(disciplines.indexOf(a), 1);
        }

        let careers = [Career.Young, Career.Young, Career.Young, Career.Young, Career.Young, Career.Young, Career.Young,
            Career.Experienced, Career.Experienced, Career.Experienced, Career.Experienced, Career.Experienced, Career.Experienced,
            Career.Experienced, Career.Veteran, Career.Veteran];

        character.career = careers[Math.floor(Math.random() * careers.length)];
        character.enlisted = (Math.random() < specialization.officerProbability) ? false : true;

        let ranks = RanksHelper.instance().getRanks(character);
        if (ranks.length > 0) {
            let rank = ranks[Math.floor(Math.random() * ranks.length)];
            if (rank.tiers > 1) {
                let tier = Math.ceil(Math.random() * rank.tiers);
                RanksHelper.instance().applyRank(character, rank.id, tier);
            } else {
                RanksHelper.instance().applyRank(character, rank.id, 1);
            }
        }

        let numberOfFocuses = NpcTypes.numberOfFocuses(NpcType.Notable);
        let primaryChances = [20, 12, 8, 6, 4, 2];
        let secondaryChances = [17, 15, 13, 11, 9, 5];

        for (let i = 0; i < numberOfFocuses; i++) {
            let focuses = recreationSkills;
            if (D20.roll() <= primaryChances[i]) {
                focuses = specialization.primaryFocuses;
            } else if (D20.roll() <= secondaryChances[i]) {
                focuses = specialization.secondaryFocuses;
            }

            let done = false;
            while (!done) {
                let focus = focuses[Math.floor(Math.random() * focuses.length)];
                if (character.focuses.indexOf(focus) < 0) {
                    character.addFocus(focus);
                    done = true;
                }
            }
        }

        const value = marshaller.encodeSupportingCharacter(character);
        window.open('/view?s=' + value, "_blank");
    }
}

export default withTranslation()(NpcConfigurationPage);
