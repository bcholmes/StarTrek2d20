import { connect } from "react-redux";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "../solo/page/soloCharacterProperties";
import { useTranslation } from "react-i18next";
import { CharacterType } from "../common/characterType";
import { Header } from "./header";
import { StepContext, setCharacterValue } from "../state/characterActions";
import { ValueRandomTable } from "../solo/table/valueRandomTable";
import store from "../state/store";
import ValueInput from "./valueInputWithRandomOption";
import { makeKey } from "../common/translationKey";
import { Career } from "../helpers/careerEnum";

const AllCharacterValues: React.FC<ISoloCharacterProperties> = ({character}) => {


    const randomValue = (context: StepContext) => {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        onValueChanged(value, context);
    }

    const onValueChanged = (value: string, context: StepContext) => {
        store.dispatch(setCharacterValue(value, context));
    }

    const { t } = useTranslation();
    if (character.age.isChild || character.type === CharacterType.Cadet) {
        return (<div className="my-5">
                <Header level={2}>{t('Construct.other.values')}</Header>
                <p>
                    If you did not define your values during character creation,
                    or if you want to change any of them,
                    now is the time to think about the values your character goes by.
                </p>
                <div className="row">
                    <div className="col-lg-6 py-2">
                        <ValueInput value={character.environmentStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value, StepContext.Environment)}
                            onRandomClicked={() => randomValue(StepContext.Environment)} textDescription={t('Value.environment.text')} />
                    </div>
                    <div className="col-lg-6 py-2">
                    <ValueInput value={character.educationStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value, StepContext.Education)}
                            onRandomClicked={() => randomValue(StepContext.Education)} textDescription={t('Value.starfleetTraining.text')} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 py-2">
                    <ValueInput value={character.careerStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value, StepContext.Career)}
                            onRandomClicked={() => randomValue(StepContext.Career)} textDescription={t('Value.careerLength.young.text')} />
                    </div>
                </div>
        </div>);
    } else {
        let educationText = t('Value.starfleetTraining.text');
        if (character.type === CharacterType.Child) {
            educationText = t('Value.childEducation.text');
        } else if (character.type !== CharacterType.Starfleet) {
            educationText = t('Value.otherTraining.text');
        }

        return (<div className="my-5">
                <Header level={2}>{t('Construct.other.values')}</Header>
                <p>
                    If you did not define your values during character creation,
                    or if you want to change any of them,
                    now is the time to think about the values your character goes by.
                </p>
                <div className="row">
                    <div className="col-lg-6 py-2">
                        <ValueInput value={character.environmentStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value, StepContext.Environment)}
                                onRandomClicked={() => randomValue(StepContext.Environment)} textDescription={t('Value.environment.text')} />
                    </div>
                    <div className="col-lg-6 py-2">
                        <ValueInput value={character.educationStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value, StepContext.Education)}
                                    onRandomClicked={() => randomValue(StepContext.Education)} textDescription={educationText} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 py-2">
                        <ValueInput value={character.careerStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value, StepContext.Career)}
                                    onRandomClicked={() => randomValue(StepContext.Career)} textDescription={t(makeKey('Value.careerLength.', Career[character.careerStep?.career], '.text'))} />
                    </div>
                    <div className="col-lg-6 py-2">
                        <ValueInput value={character.finishingStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value, StepContext.FinishingTouches)}
                                onRandomClicked={() => randomValue(StepContext.FinishingTouches)} textDescription={t('Value.final.text')} />
                    </div>
                </div>
        </div>);
    }
}

export default connect(soloCharacterMapStateToProperties)(AllCharacterValues);