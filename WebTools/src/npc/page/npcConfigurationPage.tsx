import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CharacterTypeModel } from '../../common/characterType';
import { navigateTo } from '../../common/navigator';
import { Button } from '../../components/button';
import { DropDownElement, DropDownInput, DropDownSelect } from '../../components/dropDownInput';
import { Header } from '../../components/header';
import InstructionText from '../../components/instructionText';
import { Era } from '../../helpers/eras';
import { marshaller } from '../../helpers/marshaller';
import { SpeciesHelper } from '../../helpers/species';
import { Species } from '../../helpers/speciesEnum';
import { PageIdentity } from '../../pages/pageIdentity';
import { NpcGenerator } from '../model/npcGenerator';
import { NpcType, NpcTypes } from '../model/npcType';
import { SpecializationModel, Specializations } from '../model/specializations';

interface INpcConfigurationPageProperties extends WithTranslation {
    era: Era;
}

interface INpcConfigurationPageState {
    selectedNpcType: NpcType;
    selectedType: CharacterTypeModel;
    selectedSpecies?: Species;
    selectedSpecialization?: SpecializationModel;
}

class NpcConfigurationPage extends React.Component<INpcConfigurationPageProperties, INpcConfigurationPageState> {

    constructor(props) {
        super(props);

        this.state = {
            selectedNpcType: NpcType.Notable,
            selectedType: CharacterTypeModel.getNpcCharacterTypes()[0]
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
                    <div className="col-md-6 my-4">
                        <Header level={2}>NPC Type</Header>

                        <div className="my-4">
                            <DropDownSelect
                                items={ NpcTypes.getNpcTypes().map(t => new DropDownElement(t.type, t.localizedName)) }
                                defaultValue={ this.state.selectedNpcType }
                                onChange={(type) => this.setState((state) => ({...state, selectedNpcType: type as number })) }/>
                        </div>

                        <Header level={2} className="mt-5">Species</Header>

                        <div className="mt-4">
                            <DropDownInput
                                items={ this.getSpeciesDropDownList() }
                                defaultValue={ this.state.selectedSpecies ?? "" }
                                onChange={(index) => this.selectSpecies(index) }/>
                        </div>

                    </div>

                    <div className="col-md-6 my-4">
                        <Header level={2}>Type</Header>

                        <div className="my-4">
                            <DropDownInput
                                items={ CharacterTypeModel.getNpcCharacterTypes().map(t => new DropDownElement(t.type, t.localizedName )) }
                                defaultValue={ this.state.selectedType.type }
                                onChange={(index) => this.selectType(CharacterTypeModel.getNpcCharacterTypes()[index] ) }/>
                        </div>

                        <Header level={2} className="mt-5">Specialization</Header>

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
        const list = [ Species.Andorian, Species.Bajoran, Species.Betazoid, Species.Denobulan, Species.Human, Species.Tellarite, Species.Trill, Species.Vulcan ];
        let result = list.map(s => SpeciesHelper.getSpeciesByType(s)).filter(s => s.eras.indexOf(this.props.era) >= 0);
        return result;
    }

    getSpeciesDropDownList() {
        let result = [ new DropDownElement("", "Any Major Species")];
        this.getSpeciesList().forEach(s => result.push(new DropDownElement(s.id, s.name)));
        return result;
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

    selectSpecies(index: number) {
        if (index > 0) {
            this.setState((state) => ({...state, selectedSpecies: this.getSpeciesList()[index-1].id }));
        } else {
            this.setState((state) => ({...state, selectedSpecies: undefined }));
        }
    }

    createNpc() {
        let species = this.state.selectedSpecies != null
            ? this.state.selectedSpecies
            : SpeciesHelper.generateSpecies();
        let character = NpcGenerator.createNpc(this.state.selectedNpcType, this.state.selectedType.type,
            SpeciesHelper.getSpeciesByType(species), this.state.selectedSpecialization);

        const value = marshaller.encodeNpc(character);
        window.open('/view?s=' + value, "_blank");
    }
}

function mapStateToProps(state, ownProps) {
    return {
        era: state.context.era
    };
}

export default withTranslation()(connect(mapStateToProps)(NpcConfigurationPage));
