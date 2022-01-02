import * as React from 'react';
import {character} from '../common/character';
import {Species, SpeciesHelper, SpeciesViewModel} from '../helpers/species';
import {Attribute, AttributesHelper} from '../helpers/attributes';
import {CheckBox} from './checkBox';

interface IValueProperties {
    index: number;
    value: number;
    isSelected: boolean;
    onSelect: (index: number) => void;
}

interface IValueState {
    isSelected: boolean;
}

class Value extends React.Component<IValueProperties, IValueState> {
    constructor(props: IValueProperties) {
        super(props);
        this.state = {
            isSelected: props.isSelected
        }
    }

    static getDerivedStateFromProps(props: IValueProperties, state: IValueState) {
        return {
            isSelected: props.isSelected
        }
    }
    render() {
        const className = this.state.isSelected ? "die die-selected" : "die";

        return (
            <div className={className} onClick={() => this.toggleSelection() }>
                <div className="die-value">
                    {this.props.value}
                </div>
            </div>
        );
    }

    private toggleSelection() {        
        let isSelected = !this.state.isSelected;
        this.setState({
            isSelected: isSelected
        });
        this.props.onSelect(isSelected ? this.props.index : -1);
    }
}

interface IAttributeProperties {
    species: Species;
    onUpdate: () => void;
}

export class SupportingCharacterAttributes extends React.Component<IAttributeProperties, {}> {
    private _values: number[];
    private _assignedValues: number[];
    private _selectedValue: number;
    private _species: SpeciesViewModel;
    private _checkedValues: number[];

    constructor(props: IAttributeProperties) {
        super(props);

        this._values = [10, 9, 9, 8, 8, 7];
        this._assignedValues = [0, 1, 2, 3, 4, 5];
        this._checkedValues = [];

        this._species = SpeciesHelper.getSpeciesByType(this.props.species);

        this.updateCharacterAttributes();
    }

    set species(species: Species) {
        if (this.props.species !== species) {
            this._checkedValues = [];
        }

        this._species = SpeciesHelper.getSpeciesByType(species);

        this.updateCharacterAttributes();
    }

    render() {
        const attributes = [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason].map((a, i) => {
            const val = this._values[this._assignedValues[a]];
            const showCheckBoxes = this._species.attributes.length > 3;
            const speciesHasAttribute = !showCheckBoxes && this._species.attributes.indexOf(a) > -1;
            const isChecked = this._checkedValues.indexOf(a) > -1;

            const checkBox = showCheckBoxes
                ? (
                    <td>
                        <CheckBox
                            text=""
                            value={this._checkedValues.indexOf(a) === -1 }
                            isChecked={this._checkedValues.indexOf(a) > -1 }
                            onChanged={(val) => this.checkAttribute(a, val) }/>
                    </td>
                  )
                : undefined;

            return (
                <tr key={i}>
                    <td className="selection-header">{AttributesHelper.getAttributeName(a) }</td>
                    <td>
                        <Value
                            index={a}
                            value={val}
                            onSelect={(index) => this.selectValue(index) }
                            isSelected={this._selectedValue === a} />
                    </td>
                    {checkBox}
                    <td>{speciesHasAttribute || isChecked ? "+1" : "-"}</td>
                    <td>{val + (speciesHasAttribute || isChecked ? 1 : 0) }</td>
                </tr>
            );
        });

        const checkValue = this._species.attributes.length > 3
            ? <td>Select</td>
            : undefined;

        return (
            <table className="selection-list">
                <thead>
                    <tr>
                        <td>Attribute</td>
                        <td>Value</td>
                        {checkValue}
                        <td>Species Bonus</td>
                        <td>Total</td>
                    </tr>
                </thead>
                <tbody>
                    {attributes}
                </tbody>
            </table>
        );
    }

    private selectValue(index: number) {
        if (index > -1) {
            if (this._selectedValue === undefined) {
                this._selectedValue = index;
            }
            else {
                this.swapValues(this._selectedValue, index);
            }
        }
        else {
            this._selectedValue = undefined;
        }
    }

    private swapValues(from: number, to: number) {
        const f = this._assignedValues[from];
        const t = this._assignedValues[to];

        this._assignedValues[from] = t;
        this._assignedValues[to] = f;

        this._selectedValue = undefined;

        this.updateCharacterAttributes();
        this.forceUpdate();
    }

    private checkAttribute(attribute: Attribute, check: boolean) {
        if (check) {
            this._checkedValues.push(attribute);

            if (this._checkedValues.length > 3) {
                this._checkedValues.splice(0, 1);
            }
        }
        else {
            this._checkedValues.splice(this._checkedValues.indexOf(attribute), 1);
        }

        this.updateCharacterAttributes();
        this.forceUpdate();
    }

    private updateCharacterAttributes() {
        [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason].forEach(a => {
            const hasAttributeOptions = this._species.attributes.length > 3;
            const speciesHasAttribute = !hasAttributeOptions && this._species.attributes.indexOf(a) > -1;
            const isChecked = this._checkedValues.indexOf(a) > -1;

            character.attributes[a].value = this._values[this._assignedValues[a]];

            if (speciesHasAttribute || isChecked) {
                character.attributes[a].value++;
            }
        });

        this.props.onUpdate();
    }
}