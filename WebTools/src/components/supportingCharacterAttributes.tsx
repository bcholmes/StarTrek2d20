import * as React from 'react';
import {character} from '../common/character';
import {SpeciesHelper, SpeciesModel} from '../helpers/species';
import {Attribute} from '../helpers/attributes';
import {CheckBox} from './checkBox';
import { Age } from '../helpers/age';
import { Species } from '../helpers/speciesEnum';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';

interface IValueProperties {
    index: number;
    value: number;
    isSelected: boolean;
    onSelect: (index: number) => void;
}

class Value extends React.Component<IValueProperties, {}> {
    render() {
        const className = this.props.isSelected ? "die die-selected" : "die";

        return (
            <div className={className} onClick={() => this.toggleSelection() }>
                <div className="die-value">
                    {this.props.value}
                </div>
            </div>
        );
    }

    private toggleSelection() {
        this.props.onSelect(this.props.isSelected ? -1 : this.props.index);
    }
}

interface IAttributeProperties extends WithTranslation {
    species: Species;
    age: Age;
    onUpdate: () => void;
}

interface IAttributeState {
    selectedValue?: number;
    assignedValues: number[];
    checkedValues: number[];
}

class SupportingCharacterAttributes extends React.Component<IAttributeProperties, IAttributeState> {
    private _species: SpeciesModel;

    constructor(props: IAttributeProperties) {
        super(props);

        this.state = {
            assignedValues: [0, 1, 2, 3, 4, 5],
            checkedValues: []
        };

        this._species = SpeciesHelper.getSpeciesByType(this.props.species);

        this.updateCharacterAttributes(this.state.assignedValues, this.state.checkedValues);
    }

    componentDidUpdate(prevProps: Readonly<IAttributeProperties>, prevState: Readonly<IAttributeState>, snapshot?: any): void {
        if (prevProps.age !== this.props.age) {
            this.updateCharacterAttributes(this.state.assignedValues, this.state.checkedValues);
        }
    }

    set species(species: Species) {
        if (this.props.species !== species) {
            this._species = SpeciesHelper.getSpeciesByType(species);
            this.updateCharacterAttributes(this.state.assignedValues, []);
            this.setState({
                ...this.state,
                checkedValues: []
            });
        }
    }

    render() {
        const { t } = this.props;
        const attributes = [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason].map((a, i) => {
            const val = this.props.age.attributes[this.state.assignedValues[a]];

            if (this._species.attributes.length === 3) { // most species
                const speciesHasAttribute = this._species.attributes.indexOf(a) > -1;
                return (
                    <tr key={i}>
                        <td className="selection-header">{t(makeKey('Construct.attribute.', Attribute[a]))}</td>
                        <td>
                            <Value
                                index={a}
                                value={val}
                                onSelect={(index) => this.selectValue(index) }
                                isSelected={this.state.selectedValue === a} />
                        </td>
                        <td>{speciesHasAttribute ? "+1" : "-"}</td>
                        <td>{val + (speciesHasAttribute ? 1 : 0) }</td>
                    </tr>
                );
            } else if (this._species.attributes.length > 3) { // Human can choose any three
                const isChecked = this.state.checkedValues.indexOf(a) > -1;
                return (
                    <tr key={i}>
                        <td className="selection-header">{t(makeKey('Construct.attribute.', Attribute[a]))}</td>
                        <td>
                            <Value
                                index={a}
                                value={val}
                                onSelect={(index) => this.selectValue(index) }
                                isSelected={this.state.selectedValue === a} />
                        </td>
                        <td>
                            <CheckBox
                                text=""
                                value={this.state.checkedValues.indexOf(a) === -1 }
                                isChecked={this.state.checkedValues.indexOf(a) > -1 }
                                onChanged={(val) => this.checkAttribute(a, val) }/>
                        </td>
                        <td>{isChecked ? "+1" : "-"}</td>
                        <td>{val + (isChecked ? 1 : 0) }</td>
                    </tr>
                );
            } else { // Ktarians have two attributes pre-defined, and can choose from Secondary Attributes as a third attribute
                const speciesHasAttribute = this._species.attributes.indexOf(a) > -1;
                const isChecked = this.state.checkedValues.indexOf(a) > -1;

                let checkBox = (<td></td>);
                if (this._species.secondaryAttributes.indexOf(a) >= 0) {
                    checkBox = ( <td>
                        <CheckBox
                            text=""
                            value={this.state.checkedValues.indexOf(a) === -1 }
                            isChecked={this.state.checkedValues.indexOf(a) > -1 }
                            onChanged={(val) => this.checkAttribute(a, val) }/>
                    </td>);
                }

                return (<tr key={i}>
                    <td className="selection-header">{t(makeKey('Construct.attribute.', Attribute[a]))}</td>
                    <td>
                        <Value
                            index={a}
                            value={val}
                            onSelect={(index) => this.selectValue(index) }
                            isSelected={this.state.selectedValue === a} />
                    </td>
                    {checkBox}
                    <td>{speciesHasAttribute || isChecked ? "+1" : "-"}</td>
                    <td>{val + (speciesHasAttribute || isChecked ? 1 : 0) }</td>
                </tr>);
            }
        });

        const checkValue = this._species.attributes.length !== 3
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
            if (this.state.selectedValue === undefined) {
                this.setState({
                    ...this.state,
                    selectedValue: index
                });
            } else {
                this.swapValues(this.state.selectedValue, index);
            }
        } else {
            this.setState({
                ...this.state,
                selectedValue: undefined
            });
        }
    }

    private swapValues(from: number, to: number) {
        let assignedValues = [...this.state.assignedValues];
        const f = assignedValues[from];
        const t = assignedValues[to];

        assignedValues[from] = t;
        assignedValues[to] = f;

        this.updateCharacterAttributes(assignedValues, this.state.checkedValues);
        this.setState({
            assignedValues: assignedValues,
            selectedValue: undefined
        });
    }

    private checkAttribute(attribute: Attribute, check: boolean) {
        let checkedValues = [...this.state.checkedValues];
        if (check) {
            checkedValues.push(attribute);

            let numberOfSelections = 3;
            if (this._species.attributes.length < 3) {
                numberOfSelections = 3 - this._species.attributes.length;
            }
            while (checkedValues.length > numberOfSelections) {
                checkedValues.splice(0, 1);
            }
            this.setState({
                ...this.state,
                checkedValues: checkedValues
            });
        } else {
            checkedValues.splice(checkedValues.indexOf(attribute), 1);
            this.setState({
                ...this.state,
                checkedValues: checkedValues
            });
        }

        this.updateCharacterAttributes(this.state.assignedValues, checkedValues);
    }

    private updateCharacterAttributes(assignedValues: number[], checkedValues: number[]) {
        [Attribute.Control, Attribute.Daring, Attribute.Fitness, Attribute.Insight, Attribute.Presence, Attribute.Reason].forEach(a => {
            const hasAttributeOptions = this._species.attributes.length > 3;
            const speciesHasAttribute = !hasAttributeOptions && this._species.attributes.indexOf(a) > -1;
            const isChecked = checkedValues.indexOf(a) > -1;

            character.attributes[a].value = this.props.age.attributes[assignedValues[a]];

            if (speciesHasAttribute || isChecked) {
                character.attributes[a].value++;
            }
        });

        this.props.onUpdate();
    }
}

export default withTranslation()(SupportingCharacterAttributes);