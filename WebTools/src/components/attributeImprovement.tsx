import React from 'react';
import {Attribute} from '../helpers/attributes';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';

interface IAttributeImprovementProperties extends WithTranslation {
    attribute: Attribute;
    value: number;
    deltaValue?: number;
    showIncrease: boolean;
    showDecrease: boolean;
    onDecrease: () => void;
    onIncrease: () => void;
}

class AttributeImprovement extends React.Component<IAttributeImprovementProperties, {}> {

    render() {
        const {attribute, value, deltaValue, showDecrease, showIncrease, t} = this.props;

        const dec = showDecrease
            ? (<img style={{ float: "left" }} height="20" src="static/img/dec.png" onClick={ () => { this.props.onDecrease() } } alt="-"/>)
            : undefined;

        const inc = showIncrease
            ? (<img style={{ float: "right" }} height="20" src="static/img/inc.png" onClick={ () => { this.props.onIncrease() } }alt="+"/>)
            : undefined;

        return (
            <div className="stat pb-2">
                <div className="stat-entry-name purple">
                    {t(makeKey('Construct.attribute.', Attribute[attribute]))}
                </div>
                <div className="stat-entry-value">
                    {dec}
                    {value}
                    {(deltaValue == null || deltaValue === 0) ? "" : (" (" + (deltaValue > 0 ? "+" : "") + deltaValue + ")")}
                    {inc}
                </div>
            </div>
        );
    }
}


export default withTranslation()(AttributeImprovement);
