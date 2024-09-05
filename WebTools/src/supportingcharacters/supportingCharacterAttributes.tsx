import React, { useState } from 'react';
import {SpeciesHelper} from '../helpers/species';
import {Attribute, AttributesHelper} from '../helpers/attributes';
import {CheckBox} from '../components/checkBox';
import { Species } from '../helpers/speciesEnum';
import { useTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import store from '../state/store';
import { StepContext, modifyCharacterAttribute, setSupportingCharacterAttributes } from '../state/characterActions';

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

const SupportingCharacterAttributes: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [selectedAttribute, setSelectedAttribute] = useState(undefined);

    const speciesModel = character?.speciesStep?.species != null && character?.speciesStep?.species !== Species.Custom
        ? SpeciesHelper.getSpeciesByType(character?.speciesStep?.species)
        : undefined;

    const selectAttributeValue = (index: Attribute) => {
        if (index > -1) {
            if (selectedAttribute === undefined) {
                setSelectedAttribute(index);
            } else {
                swapAttributeValues(selectedAttribute, index);
            }
        } else {
            setSelectedAttribute(undefined);
        }
    }

    const swapAttributeValues = (from: Attribute, to: Attribute) => {
        let attributeList = [...character.supportingStep?.attributes];
        let newList = attributeList.map(d => {
            if (d === from) {
                return to;
            } else if (d === to) {
                return from;
            } else {
                return d;
            }
        })

        updateCharacterAttributes(newList);
        setSelectedAttribute(undefined);
    }

    const toggleSpeciesAttribute = (attribute: Attribute) => {
        if (character?.speciesStep?.attributes?.indexOf(attribute) >= 0) {
            store.dispatch(modifyCharacterAttribute(attribute, StepContext.Species, false));
        } else {
            store.dispatch(modifyCharacterAttribute(attribute, StepContext.Species, true));
        }
    }

    const updateCharacterAttributes = (attributes: Attribute[]) => {
        store.dispatch(setSupportingCharacterAttributes(attributes));
    }

    const attributes = AttributesHelper.getAllAttributes().map((a, i) => {
        const index = character?.supportingStep?.attributes.indexOf(a);
        let val = character.age.attributes[index];
        if (character.supportingStep?.supervisory) {
            val = [10, 10, 9, 9, 8, 8][index];
        }

        if (character?.speciesStep?.species === Species.Custom || speciesModel?.attributes?.length > 3) {
            const isChecked = character?.speciesStep?.attributes?.indexOf(a) >= 0;
            return (
                <tr key={i}>
                    <td className="selection-header">{t(makeKey('Construct.attribute.', Attribute[a]))}</td>
                    <td>
                        <Value
                            index={a}
                            value={val}
                            onSelect={(index) => selectAttributeValue(index) }
                            isSelected={selectedAttribute === a} />
                    </td>
                    <td>
                        <CheckBox
                            text=""
                            value={a}
                            isChecked={isChecked }
                            onChanged={(_) => toggleSpeciesAttribute(a) }/>
                    </td>
                    <td className='text-center'>{isChecked ? "+1" : "-"}</td>
                    <td className='text-center'>{val + (isChecked ? 1 : 0) }</td>
                </tr>
            );
        } else if (speciesModel?.attributes?.length === 3) { // most species
            const speciesHasAttribute = speciesModel?.attributes?.indexOf(a) > -1;
            return (
                <tr key={i}>
                    <td className="selection-header">{t(makeKey('Construct.attribute.', Attribute[a]))}</td>
                    <td>
                        <Value
                            index={a}
                            value={val}
                            onSelect={(index) => selectAttributeValue(index) }
                            isSelected={selectedAttribute === a} />
                    </td>
                    <td className='text-center'>{speciesHasAttribute ? "+1" : "-"}</td>
                    <td className='text-center'>{val + (speciesHasAttribute ? 1 : 0) }</td>
                </tr>
            );
        } else { // Ktarians have two attributes pre-defined, and can choose from Secondary Attributes as a third attribute
            const speciesHasAttribute = speciesModel?.attributes?.indexOf(a) > -1;
            const isChecked = character?.speciesStep?.attributes?.indexOf(a) > -1;

            let checkBox = (<td></td>);
            if (speciesModel?.secondaryAttributes?.indexOf(a) >= 0) {
                checkBox = ( <td>
                    <CheckBox
                        text=""
                        value={a}
                        isChecked={isChecked }
                        onChanged={(val) => toggleSpeciesAttribute(a) }/>
                </td>);
            }

            return (<tr key={i}>
                <td className="selection-header">{t(makeKey('Construct.attribute.', Attribute[a]))}</td>
                <td>
                    <Value
                        index={a}
                        value={val}
                        onSelect={(index) => selectAttributeValue(index) }
                        isSelected={selectedAttribute === a} />
                </td>
                {checkBox}
                <td className='text-center'>{speciesHasAttribute || isChecked ? "+1" : "-"}</td>
                <td className='text-center'>{val + (speciesHasAttribute || isChecked ? 1 : 0) }</td>
            </tr>);
        }
    });

    const checkValue = character?.speciesStep?.species === Species.Custom || speciesModel?.attributes?.length !== 3
        ? <td>{t('Common.text.select')}</td>
        : undefined;

    return (
        <table className="selection-list">
            <thead>
                <tr>
                    <td>{t('Construct.other.attribute')}</td>
                    <td>{t('SupportingCharacter.numericalValue')}</td>
                    {checkValue}
                    <td className='text-center'>{t('SupportingCharacter.speciesBonus')}</td>
                    <td className='text-center'>{t('Common.text.total')}</td>
                </tr>
            </thead>
            <tbody>
                {attributes}
            </tbody>
        </table>
    );
}

export default connect(characterMapStateToProperties)(SupportingCharacterAttributes);