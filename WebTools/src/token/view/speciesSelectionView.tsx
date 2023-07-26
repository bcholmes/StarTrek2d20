
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
}

class SpeciesSelectionView extends React.Component<ISpeciesSelectionProperties, {}> {

    render() {
        const { token } = this.props;
        return (
            <div className="mt-4">
                <DropDownSelect items={this.speciesList()} defaultValue={token.species} onChange={(s) => store.dispatch(setTokenSpecies(s as Species))} />

                {this.renderOptions()}
            </div>);
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
        return [Species.Andorian, Species.Bajoran, Species.Betazoid, Species.Bolian, Species.Deltan, Species.Denobulan,
                Species.Efrosian, Species.Ferengi, Species.Human,
                Species.Klingon, Species.KlingonQuchHa,
                Species.Orion, Species.Risian,
                // Species.Romulan,
                Species.Saurian,
                Species.Tellarite, Species.Trill, Species.Vulcan
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