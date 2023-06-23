import * as React from 'react';
import { Character, character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Window } from '../common/window';
import { SpeciesHelper } from '../helpers/species';
import { Attribute } from '../helpers/attributes';
import { Button } from './button';
import { CheckBox } from './checkBox';
import { Species } from '../helpers/speciesEnum';
import { Header } from './header';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';
import { SourcesHelper } from '../helpers/sources';

interface ISpeciesSelectionProperties extends WithTranslation {
    onSelection: (species: Species) => void;
    onCancel: () => void;
}

interface ISpeciesSelectionPageState {
    allowAllSpecies: boolean
}

class SpeciesSelection extends React.Component<ISpeciesSelectionProperties, ISpeciesSelectionPageState> {
    constructor(props: ISpeciesSelectionProperties) {
        super(props);
        this.state = {
            allowAllSpecies: false
        }
    }

    render() {
        const { t } = this.props;

        let overrideCheckbox = (Character.isSpeciesListLimited(character)) ? (<CheckBox
            isChecked={this.state.allowAllSpecies}
            text="Allow any species (GM's decision)"
            value={!this.state.allowAllSpecies}
            onChanged={() => { let val = this.state.allowAllSpecies; this.setState({ allowAllSpecies: !val }); }} />)
            : undefined


        var species = SpeciesHelper.getPrimarySpecies(this.state.allowAllSpecies ? CharacterType.Starfleet : character.type).map((s, i) => {
            const attributes = s.id === Species.Ktarian
                ? (
                    <div key={'species-' + s.id}>
                        <div>{t('Construct.attribute.control')}</div>
                        <div>{t('Construct.attribute.reason')}</div>
                        <div>Fitness or Presence</div>
                    </div>
                )
                : s.attributes.map((a, i) => {
                    return <div key={i}>{t(makeKey('Construct.attribute.', Attribute[a])) }</div>;
                });

            const talents = s.id === Species.Changeling
                ? <div>Morphogenic Matrix</div>
                : s.talents.map((t, i) => {
                    return t.isAvailableExcludingSpecies() ? <div key={i}>{t.name}</div> : <span key={i}></span>;
                });
            const sources = SourcesHelper.getSourceName(s.sources);

            return (
                <tr key={i} onClick={() => { if (Window.isCompact()) this.props.onSelection(s.id); }}>
                    <td className="selection-header">{s.name}</td>
                    <td>{attributes}</td>
                    <td className="d-none d-md-table-cell">{sources}</td>
                    <td>{talents}</td>
                    <td className="text-right"><Button buttonType={true} className="button-small"onClick={() => { this.props.onSelection(s.id) }} >{t('Common.button.select')}</Button></td>
                </tr>
            );
        });

        return (
            <div>
                <Header className="mb-4">{t('SpeciesPage.selectSpecies')}</Header>
                {overrideCheckbox}
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>{t('Construct.other.attributes')}</b></td>
                            <td className="d-none d-md-table-cell"><b>{t('Construct.other.sources')}</b></td>
                            <td><b>{t('Construct.other.talentOptions')}</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {species}
                    </tbody>
                </table>
                <Button text="Cancel" className="button button-cancel" onClick={() => this.props.onCancel()} />
            </div>
        );
    }
}

export default withTranslation()(SpeciesSelection);