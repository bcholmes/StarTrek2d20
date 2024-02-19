import React, { useEffect } from 'react';
import {Navigation} from '../common/navigator';
import {Button} from '../components/button';
import {TalentDescription} from '../components/talentDescription';
import ValueInput from '../components/valueInputWithRandomOption';
import { TalentsHelper } from '../helpers/talents';
import InstructionText from '../components/instructionText';
import { Header } from '../components/header';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { useTranslation } from 'react-i18next';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import { PageIdentity } from './pageIdentity';
import store from '../state/store';
import { StepContext, addCharacterTalent, setCharacterValue } from '../state/characterActions';
import { CharacterType } from '../common/characterType';
import { ValueRandomTable } from '../solo/table/valueRandomTable';
import { makeKey } from '../common/translationKey';
import { Career } from '../helpers/careerEnum';

interface ISimpleCareerPageProperties extends ICharacterProperties {
    talent: string;
    nextPage: PageIdentity;
}

const SimpleCareerPage: React.FC<ISimpleCareerPageProperties> = ({character, talent, nextPage}) => {

    const { t } = useTranslation();
    const talentModel = TalentsHelper.getTalent(talent);

    const onNext = () => {
        Navigation.navigateToPage(nextPage);
    }

    const randomValue = () => {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        onValueChanged(value);
    }

    const onValueChanged = (value: string) => {
        store.dispatch(setCharacterValue(value, StepContext.Career));
    }

    useEffect(() => {
        store.dispatch(addCharacterTalent(talentModel, StepContext.Career));
    }, [talent]);

    let instruction = character.type === CharacterType.Child ? "CareerLength.instruction.child" : "CareerLength.instruction.cadet";
    let career = character.careerStep?.career;

    return (
        <div className="page container ms-0">
            <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.CadetCareer}/>
            <main>
                <Header>{t('Page.title.careerLength')}</Header>
                <InstructionText text={t(instruction)} />
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Header level={2}>{t('Construct.other.value')}</Header>
                        <ValueInput value={character.careerStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value)}
                                onRandomClicked={() => randomValue()} textDescription={t(makeKey('Value.careerLength.', Career[career], '.text'))}
                            />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Header level={2}>{t('Construct.other.talent')}</Header>
                        <TalentDescription name={talentModel.localizedName} description={talentModel.localizedDescription} />
                    </div>
                </div>
                <div className="text-end">
                    <Button className="btn btn-primary" onClick={() => onNext() }>{t('Common.button.next')}</Button>
                </div>
            </main>
        </div>
    );
}

export default connect(characterMapStateToProperties)(SimpleCareerPage);