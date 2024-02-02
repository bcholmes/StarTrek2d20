
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Species } from '../../helpers/speciesEnum';
import { DropDownElement } from '../../components/dropDownInput';
import { SpeciesHelper } from '../../helpers/species';
import { DropDownSelect } from '../../components/dropDownInput';
import { connect } from 'react-redux';
import store from '../../state/store';
import { setTokenSpecies, setTokenSpeciesOption } from '../../state/tokenActions';
import { Token } from '../model/token';
import SpeciesRestrictions from '../model/speciesRestrictions';
import SpeciesOptionCatalog from '../model/speciesOptionCatalog';
import SwatchButton from './swatchButton';

interface ISpeciesSelectionProperties extends WithTranslation {
    token: Token;
    isLoading: boolean;
    loadExtension: () => void;
}

class SpeciesSelectionView extends React.Component<ISpeciesSelectionProperties, {}> {

    selectSpecies(species: Species) {
        if (SpeciesRestrictions.isRubberHeaded(species)) {
            this.props.loadExtension();
        }
        store.dispatch(setTokenSpecies(species));
    }

    render() {
        const { token, isLoading } = this.props;
        if (isLoading) {
            return (<div className="mt-4 text-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>);
        } else {
            return (
                <div className="mt-4">
                    <label className="visually-hidden" htmlFor="species">Species</label>
                    <DropDownSelect items={this.speciesList()} defaultValue={token.species} onChange={(s) => this.selectSpecies(s as Species)}
                        id="species"/>

                    {this.renderOptions()}
                </div>);
        }
    }

    renderOptions() {
        const { t, token } = this.props;

        if (SpeciesRestrictions.isOptionsSupportedFor(token.species)) {
            return (<>
                <p className="mt-4">{t('TokenCreator.section.species.options')}:</p>

                <div className="d-flex flex-wrap" style={{gap: "0.5rem"}}>
                    {SpeciesOptionCatalog.instance.getSwatches(token).map(s => <SwatchButton svg={s.svg} title={s.name} size="lg"
                        onClick={() => store.dispatch(setTokenSpeciesOption(s.id))} active={token.speciesOption === s.id}
                        token={token}
                        key={'species-option-swatch-' + s.id }/>)}
                </div>
            </>)
        } else {
            return null;
        }
    }

    speciesList() {
        return [Species.Andorian, Species.Aurelian, Species.Bajoran, Species.Benzite, Species.Betazoid, Species.Bolian,
                Species.Caitian, Species.Deltan, Species.Denobulan, Species.Efrosian, Species.Ferengi, Species.Haliian,
                Species.Human, Species.Klingon, Species.KlingonQuchHa, Species.JemHadar,
                Species.Ktarian, Species.Orion, Species.Pakled, Species.Reman, Species.Risian, Species.Romulan,
                Species.Saurian, Species.Suliban, Species.Tellarite, Species.Trill,
                Species.Vulcan, Species.XindiPrimate, Species.XindiReptilian, Species.Zaranite
            ].map(s => new DropDownElement(s, SpeciesHelper.getSpeciesByType(s).localizedName))
            .sort((d1, d2) => d1.name.localeCompare(d2.name));
    }
}

function mapStateToProps(state, ownProps) {
    return {
        token: state.token
    };
}

export default withTranslation()(connect(mapStateToProps)(SpeciesSelectionView));