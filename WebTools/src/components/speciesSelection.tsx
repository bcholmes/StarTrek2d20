import * as React from 'react';
import { character } from '../common/character';
import { Window } from '../common/window';
import { Species, SpeciesHelper } from '../helpers/species';
import { AttributesHelper } from '../helpers/attributes';
import { Button } from './button';
import { AttributeView } from './attribute';

interface ISpeciesSelectionProperties {
    onSelection: (species: Species) => void;
    onCancel: () => void;
}

export class SpeciesSelection extends React.Component<ISpeciesSelectionProperties, {}> {
    constructor(props: ISpeciesSelectionProperties) {
        super(props);
    }

    render() {
        var species = SpeciesHelper.getSpecies().map((s, i) => {
            if (s.id !== Species.LiberatedBorg) {
                const attributes = s.id === Species.Ktarian
                    ? (
                        <div>
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
                        return <div key={i}>{t.name}</div>;
                    });

                return (
                    <tr key={i} onClick={() => { if (Window.isCompact()) this.props.onSelection(s.id); }}>
                        <td className="selection-header">{s.name}</td>
                        <td>{attributes}</td>
                        <td>{talents}</td>
                        <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(s.id) }} /></td>
                    </tr>
                );
            }
        });

        return (
            <div>
                <div className="header-text"><div>SELECT SPECIES</div></div>
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