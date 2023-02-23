import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CharacterTypeModel } from '../../common/characterType';
import { navigateTo } from '../../common/navigator';
import { Button } from '../../components/button';
import { DropDownElement, DropDownInput } from '../../components/dropDownInput';
import { Header } from '../../components/header';
import InstructionText from '../../components/instructionText';
import { marshaller } from '../../helpers/marshaller';
import { SpeciesHelper, SpeciesModel } from '../../helpers/species';
import { Species } from '../../helpers/speciesEnum';
import { PageIdentity } from '../../pages/pageIdentity';
import { NpcGenerator } from '../model/npcGenerator';
import { NpcType } from '../model/npcType';
import { SpecializationModel, Specializations } from '../model/specializations';

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
        let character = NpcGenerator.createNpc(NpcType.Notable, this.state.selectedType.type,
            this.state.selectedSpecies, this.state.selectedSpecialization);

        const value = marshaller.encodeSupportingCharacter(character);
        window.open('/view?s=' + value, "_blank");
    }
}

export default withTranslation()(NpcConfigurationPage);
