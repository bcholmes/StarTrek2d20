
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Species } from '../../helpers/speciesEnum';
import { DropDownElement } from '../../components/dropDownInput';
import { SpeciesHelper } from '../../helpers/species';
import { DropDownSelect } from '../../components/dropDownInput';
import { connect } from 'react-redux';
import store from '../../state/store';
import { setTokenSpecies } from '../../state/tokenActions';

interface ISpeciesSelectionProperties extends WithTranslation{
    species: Species;
}

class SpeciesSelectionView extends React.Component<ISpeciesSelectionProperties, {}> {

    render() {
        return (
            <div className="mt-4">
                <DropDownSelect items={this.speciesList()} defaultValue={this.props.species} onChange={(s) => store.dispatch(setTokenSpecies(s as Species))} />
            </div>);
    }

    speciesList() {
        return [Species.Andorian, Species.Bajoran, Species.Betazoid, Species.Bolian, Species.Deltan, Species.Denobulan, Species.Human,
            Species.Orion,
            //Species.Tellarite,
            Species.Trill, Species.Vulcan].map(s => new DropDownElement(s, SpeciesHelper.getSpeciesByType(s).name));
    }
}

function mapStateToProps(state, ownProps) {
    return {
        species: state.token.species
    };
}

export default withTranslation()(connect(mapStateToProps)(SpeciesSelectionView));