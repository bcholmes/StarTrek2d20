import React from 'react';
import { Window } from '../common/window';
import { SpeciesModel } from '../helpers/species';
import { AttributesHelper } from '../helpers/attributes';
import { Button } from './button';
import { Species } from '../helpers/speciesEnum';
import { Character } from '../common/character';

interface ISimpleSpeciesSelectionProperties {
    onSelection: (species: SpeciesModel) => void;
    species: SpeciesModel[];
    character: Character;
}

export class SimpleSpeciesSelection extends React.Component<ISimpleSpeciesSelectionProperties, {}> {
    constructor(props: ISimpleSpeciesSelectionProperties) {
        super(props);
        this.state = {
            allowAllSpecies: false
        }
    }

    render() {
        var species = this.props.species.map((s, i) => {
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
                    return t.isAvailableExcludingSpecies(this.props.character) ? <div key={i}>{t.name}</div> : <span key={i}></span>;
                });

            return (
                <tr key={i} onClick={() => { if (Window.isCompact()) this.props.onSelection(s); }}>
                    <td className="selection-header">{s.name}</td>
                    <td>{attributes}</td>
                    <td>{talents}</td>
                    <td className="text-end"><Button buttonType={true} className="button-small" text="Select" onClick={() => { this.props.onSelection(s) }} /></td>
                </tr>
            );
        });

        return (
            <div>
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
            </div>
        );
    }
}
