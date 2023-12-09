import React, { useEffect } from 'react';
import {Navigation} from '../common/navigator';
import {Button} from '../components/button';
import {TalentDescription} from '../components/talentDescription';
import ValueInput, {Value} from '../components/valueInput';
import { TalentsHelper, ToViewModel } from '../helpers/talents';
import InstructionText from '../components/instructionText';
import { Header } from '../components/header';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { useTranslation } from 'react-i18next';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import { PageIdentity } from './pageIdentity';
import store from '../state/store';
import { StepContext, addCharacterTalent } from '../state/characterActions';
import { CharacterType } from '../common/characterType';

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

    useEffect(() => {
        store.dispatch(addCharacterTalent(ToViewModel(talentModel), StepContext.Career));
    }, [talent]);

    let instruction = character.type === CharacterType.Child ? "CareerLength.instruction.child" : "CareerLength.instruction.cadet";

    return (
        <div className="page">
            <CharacterCreationBreadcrumbs />
            <Header>{t('Page.title.career')}</Header>
            <InstructionText text={t(instruction)} />
            <div className="row">
                <div className="col-12 col-lg-6">
                    <Header level={2}>{t('Construct.other.value')}</Header>
                    <ValueInput value={Value.Career}/>
                </div>
                <div className="col-12 col-lg-6">
                    <Header level={2}>{t('Construct.other.talent')}</Header>
                    <TalentDescription name={talentModel.localizedName} description={talentModel.description} />
                </div>
            </div>
            <div className="text-right">
                <Button buttonType={true} text={t('Common.button.next')} className="btn btn-primary" onClick={() => onNext() }/>
            </div>
        </div>
    );
}

export default connect(characterMapStateToProperties)(SimpleCareerPage);