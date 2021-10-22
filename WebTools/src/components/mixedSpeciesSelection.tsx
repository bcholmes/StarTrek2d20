import * as React from 'react';
import {Window} from '../common/window';
import {SpeciesHelper, Species} from '../helpers/species';
import {AttributesHelper} from '../helpers/attributes';
import {CheckBox} from './checkBox';
import {Button} from './button';
import { character } from '../common/character'

interface IMixedSpeciesSelectionProperties {
    onSelection: (primary: Species, secondary: Species) => void;
    onCancel: () => void
}

export class MixedSpeciesSelection extends React.Component<IMixedSpeciesSelectionProperties, {}> {
    private _primary: Species;
    private _secondary: Species;

    constructor(props: IMixedSpeciesSelectionProperties) {
        super(props);
    }

    render() {
        const primarySpecies = SpeciesHelper.getPrimarySpecies(character.type).map((s, i) => {
            if (s.id === this._secondary) return undefined;

            const attributes = s.attributes.map((a, i) => {
                return <div>{AttributesHelper.getAttributeName(a) }</div>;
            });

            const talents = s.talents.map((t, i) => {
                return <div>{t.name}</div>;
            });

            const checkbox = !Window.isCompact()
                    ? (<CheckBox
                        key={i}
                        isChecked={this._primary === s.id}
                        onChanged={(val) => { this._primary = val; this.forceUpdate(); } }
                        value={s.id} />)
                    : undefined;

            const rowBackground = Window.isCompact() && this._primary === s.id
                ? "#9179B7"
                : "";

            return (
                <tr key={i}
                    style={{backgroundColor:rowBackground}}
                    onClick={() => { if (Window.isCompact()) { this._primary = s.id; this.forceUpdate(); } } }>
                    <td className="selection-header">{s.name}</td>
                    <td>{attributes}</td>
                    <td>{talents}</td>
                    <td>{checkbox}</td>
                </tr>
            );
        });

        const secondarySpecies = SpeciesHelper.getSpecies().map((s, i) => {
            if (s.id === this._primary) return undefined;

            const attributes = s.attributes.map((a, i) => {
                return <div>{AttributesHelper.getAttributeName(a) }</div>;
            });

            const talents = s.talents.map((t, i) => {
                return <div>{t.name}</div>;
            });

            const checkbox = !Window.isCompact()
                ? (<CheckBox
                    key={i}
                    isChecked={this._secondary === s.id}
                    onChanged={(val) => { this._secondary = val; this.forceUpdate(); } }
                    value={s.id} />)
                : undefined;

            const rowBackground = Window.isCompact() && this._secondary === s.id
                ? "#9179B7"
                : "";

            return (
                <tr key={i}
                    style={{ backgroundColor: rowBackground }}
                    onClick={() => { if (Window.isCompact()) { this._secondary = s.id; this.forceUpdate(); } } }>
                    <td className="selection-header">{s.name}</td>
                    <td>{attributes}</td>
                    <td>{talents}</td>
                    <td>{checkbox}</td>
                </tr>
            );
        });

        return (
            <div>
                <div className="header-text"><div>SELECT PRIMARY SPECIES</div></div>
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
                        {primarySpecies}
                    </tbody>
                </table>
                <br/>
                <div className="header-text"><div>SELECT SECONDARY SPECIES</div></div>
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
                        {secondarySpecies}
                    </tbody>
                </table>
                <Button className="button" text="Confirm" onClick={() => this.props.onSelection(this._primary, this._secondary) }/>
                <Button className="button button-cancel" text="Cancel" onClick={() => this.props.onCancel() }/>
            </div>
        );
    }
}
