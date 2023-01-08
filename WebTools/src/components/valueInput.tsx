import * as React from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import {CareersHelper} from '../helpers/careers';
import { withTranslation, WithTranslation } from 'react-i18next';

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
                description = "This Value should reflect the environment and culture the character was raised within. This is a good opportunity to consider how the character views their own culture, and how they connect — or possibly, don’t connect — to the philosophies and traditions of their people.";
                break;
            case Value.Track:
                if (character.type === CharacterType.Starfleet) {
                    description = "The character gains a single Value, which should reflect some aspect of the character’s beliefs that developed during their time at the Academy."
                } else if (character.age.isChild()) {
                    description = "The character gains a single Value, which should reflect some aspect of the character’s beliefs that developed during their Education."
                } else {
                    description = "The character gains a single Value, which should reflect some aspect of the character’s beliefs that developed during their Training."
                }
                break;
            case Value.Career:
                if (character.age.isChild() || character.type === CharacterType.Cadet) {
                    description = "The character receives a value, which must reflect their inexperience and naïveté in some way.";
                } else {
                    description = CareersHelper.getCareer(character.career).valueDescription;
                }
                break;
            case Value.Finish:
                description = "The character receives one final Value. This might reflect the Career Events rolled in Step Six, or it may represent some other element of the character. This Value might be a relationship, connecting the character to another character in the crew, or to another organization or culture in some way.";
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