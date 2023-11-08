import React from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import {CareersHelper} from '../helpers/careers';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Career } from '../helpers/careerEnum';

export enum Value {
    Environment,
    Track,
    Career,
    Finish
}

interface IValueInputProperties extends WithTranslation{
    value: Value;
    text?: string;
    onChange?: () => void;
}

class ValueInput extends React.Component<IValueInputProperties, {}> {

    render() {
        const {text, t} = this.props;

        let description = "";

        switch (this.props.value) {
            case Value.Environment:
                description = t('Value.environment.text');
                break;
            case Value.Track:
                if (character.type === CharacterType.Starfleet) {
                    description = t('Value.starfleetTraining.text')
                } else if (character.age.isChild()) {
                    description = t('Value.childEducation.text')
                } else {
                    description = t('Value.otherTraining.text')
                }
                break;
            case Value.Career:
                if (character.age.isChild() || character.type === CharacterType.Cadet) {
                    description = CareersHelper.instance.getCareer(Career.Young).localizedDescription;
                } else {
                    description = CareersHelper.instance.getCareer(character.career).localizedValueDescription;
                }
                break;
            case Value.Finish:
                description = t('Value.final.text');
                break;
        }

        return (
            <div>
                <InputFieldAndLabel labelName={t('Construct.other.value')} id={'value-' + this.props.value} value={text} onChange={(value) => this.onValueChanged(value) } />
                <div className="text-white py-1">{description}</div>
            </div>
        );
    }

    private onValueChanged(value: string) {

        switch (this.props.value) {
            case Value.Environment:
                character.environmentValue = value;
                break;
            case Value.Track:
                character.trackValue = value;
                break;
            case Value.Career:
                character.careerValue = value;
                break;
            case Value.Finish:
                character.finishValue = value;
                break;
        }

        if (this.props.onChange) {
            this.props.onChange();
        }
    }
}

export default withTranslation()(ValueInput);