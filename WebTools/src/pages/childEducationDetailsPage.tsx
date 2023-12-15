import * as React from 'react';
import { Button } from '../components/button';
import { ChildAttributeImprovementCollection } from '../components/childAttributeImprovement';
import { ChildSkillList } from '../components/childSkillList';
import { Header } from '../components/header';
import ValueInput from '../components/valueInputWithRandomOption';
import { ICharacterPageProperties } from '../common/iCharacterPageProperties';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import InstructionText from '../components/instructionText';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import store from '../state/store';
import { StepContext, setCharacterFocus, setCharacterValue } from '../state/characterActions';
import { ValueRandomTable } from '../solo/table/valueRandomTable';

const ChildEducationDetailsPage: React.FC<ICharacterPageProperties> = ({character}) => {

    const { t } = useTranslation();

    const randomValue = () => {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        onValueChanged(value);
    }

    const onValueChanged = (value: string) => {
        store.dispatch(setCharacterValue(value, StepContext.Education));
    }

    const onAttributesChanged = (dec: boolean, inc: boolean) => {
    }

    const onDisciplinesChanged = (dec: boolean, inc: boolean) => {
    }

    const onNext = () => {
        /*
        if (!this.state.attributesDecreased) {
            Dialog.show("You must decrease " + (character.age.options.decreaseAttributes === 1 ? "one attribute" : (character.age.options.decreaseAttributes + " attributes")));
        } else if (!this.state.attributesChosen) {
            Dialog.show("You must distribute all three attribute points.");
        } else if (!this.state.attributesDecreased) {
            Dialog.show("You must decrease " + (character.age.options.decreaseDisciplines === 1 ? "one discipline" : (character.age.options.decreaseDisciplines + " disciplines")));
        } else if (!this.state.disciplinesChosen) {
            Dialog.show("You must select one major and two minor disciplines.");
        } else if (character.age.options.numberOfFocuses === 1 && !this.state.focus1) {
            Dialog.show("You must select a Focus");
        } else if (character.age.options.numberOfFocuses > 1 && (!this.state.focus1 || !this.state.focus2)) {
            Dialog.show("You must select " + character.age.options.numberOfFocuses + " Focuses.");
        } else {
            if (character.educationStep != null) {
                character.educationStep.focuses.push(this.state.focus1);
                if (character.age.options.numberOfFocuses > 1) {
                    character.educationStep.focuses.push(this.state.focus2);
                }
            }

            Navigation.navigateToPage(PageIdentity.ChildCareer);
        }
        */
    }

    let focuses = character.age.options.numberOfFocuses === 1
        ? (<div className="col-lg-6 my-3">
            <Header level={2}>{t('Construct.other.focus')}</Header>
            <ReactMarkdown>{character.age.options.focusText}</ReactMarkdown>

            <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                value={character.educationStep?.focuses[0] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 0))} />
        </div>)
        : (<div className="col-lg-6 my-3">
            <Header level={2}>{t('Construct.other.focuses')}</Header>
            <ReactMarkdown>{character.age.options.focusText}</ReactMarkdown>

            <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                value={character.educationStep?.focuses[0] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 0))} />
            <InputFieldAndLabel id="focus2" labelName={t('Construct.other.focus2')}
                value={character.educationStep?.focuses[1] ?? ""}
                onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 1))} />
        </div>);

    return (<div className="page container ml-0">
        <Header>{character.age.name}</Header>
        <InstructionText text={character.age.description} />
        <div className="row">
            <div className="col-lg-6 my-3">
                <Header level={2}>{t('Construct.other.attributes')}</Header>
                <ChildAttributeImprovementCollection decreasePoints={character.age.options.decreaseAttributes} onChange={(dec, inc) => onAttributesChanged(dec, inc)} />
            </div>
            <div className="col-lg-6 my-3">
                <Header level={2}>{t('Construct.other.disciplines')}</Header>
                <ChildSkillList decreasePoints={character.age.options.decreaseDisciplines} onChanged={(dec, inc) => { onDisciplinesChanged(dec, inc) } } />
            </div>
            {focuses}
            <div className="col-lg-6 my-3">
                <Header level={2}>{t('Construct.other.value')}</Header>
                <ValueInput value={character.educationStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value)}
                    onRandomClicked={() => randomValue()} textDescription={t('Value.childEducation.text')} />

            </div>
        </div>

        <div className="text-right">
            <Button buttonType={true} className="btn btn-primary" onClick={() => onNext() }>{t('Common.button.next')}</Button>
        </div>
    </div>);
}

export default connect(characterMapStateToProperties)(ChildEducationDetailsPage);