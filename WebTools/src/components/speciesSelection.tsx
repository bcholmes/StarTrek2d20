import * as React from 'react';
import { character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Window } from '../common/window';
import { Species, SpeciesHelper } from '../helpers/species';
import { AttributesHelper } from '../helpers/attributes';
import { Button } from './button';
import { CheckBox } from './checkBox';

interface ISpeciesSelectionProperties {
    onSelection: (species: Species) => void;
    onCancel: () => void;
}

interface ISpeciesSelectionPageState {
    allowAllSpecies: boolean
}

export class SpeciesSelection extends React.Component<ISpeciesSelectionProperties, ISpeciesSelectionPageState> {
    constructor(props: ISpeciesSelectionProperties) {
        super(props);
        this.state = {
            allowAllSpecies: false
        }
    }

    render() {
        let overrideCheckbox = (character.type === CharacterType.KlingonWarrior ) ? (<CheckBox
            isChecked={this.state.allowAllSpecies}
            text="Allow non-Klingon species (GM's decision)"
            value={!this.state.allowAllSpecies}
            onChanged={() => { let val = this.state.allowAllSpecies; this.setState({ allowAllSpecies: !val }); }} />) 
            : undefined


        var species = SpeciesHelper.getPrimarySpecies(this.state.allowAllSpecies ? CharacterType.Starfleet : character.type).map((s, i) => {
            const attributes = s.id === Species.Ktarian
                ? (
                    <div key={'species-' + s.id}>
                        <div>Control</div>
                        <div>Reason</div>
                        <div>Fitness or Presence</div>
                    </div>
                )
                : s.attributes.map((a, i) => {
                    return <div key={i}>{AttributesHelper.getAttributeName(a)}</div>;
                });

            const talents = s.id === Species.Changeling
                ? <div>Morphogenic Matrix</div>
                : s.talents.map((t, i) => {
                    return t.isAvailableExcludingSpecies() ? <div key={i}>{t.name}</div> : <span key={i}></span>;
                });

            return (
                <tr key={i} onClick={() => { if (Window.isCompact()) this.props.onSelection(s.id); }}>
                    <td className="selection-header">{s.name}</td>
                    <td>{attributes}</td>
                    <td>{talents}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(s.id) }} /></td>
                </tr>
            );
        });

        return (
            <div>
                <div className="header-text"><div>SELECT SPECIES</div></div>
                {overrideCheckbox}
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>Attributes</b></td>
                            <td><b>Talent Options</b></td>
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
