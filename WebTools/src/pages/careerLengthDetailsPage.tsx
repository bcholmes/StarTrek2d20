import React, { useEffect, useState } from 'react';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {CareerModel, CareersHelper} from '../helpers/careers';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {TalentDescription} from '../components/talentDescription';
import ValueInput from '../components/valueInputWithRandomOption';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';
import { ValueRandomTable } from '../solo/table/valueRandomTable';
import { Career } from '../helpers/careerEnum';
import store from '../state/store';
import { StepContext, addCharacterTalent, setCharacterValue } from '../state/characterActions';
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';

const CareerLengthDetailsPage : React.FC<ISoloCharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [ talentName, setTalentName ] = useState(null);
    const career = CareersHelper.instance.getCareer(character.careerStep?.career);

    useEffect(() => {
        if (career.talent != null) {
                store.dispatch(addCharacterTalent(career.talent, StepContext.Career));
                setTalentName(career.talent.name);
            }
        }, [career.id]
    )

    const randomValue = () => {
        let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
        onValueChanged(value);
    }

    const onValueChanged = (value: string) => {
        store.dispatch(setCharacterValue(value, StepContext.Career));
    }

    const renderMainBody = (career: CareerModel) => {

        let textDescription = t('Value.careerLength.experienced.text');
        if (career.id === Career.Young) {
            textDescription = t('Value.careerLength.young.text');
        } else if (career.id === Career.Veteran) {
            textDescription = t('Value.careerLength.veteran.text');
        }

        if (career.talent != null) {
            return (<div className="row">
                <div className="col-md-6 my-3">
                    <Header level={2}>{t('Construct.other.value')}</Header>
                    <ValueInput value={character.careerStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value)}
                            onRandomClicked={() => randomValue()} textDescription={textDescription}
                        />
                </div>

                <div className="col-md-6 my-3">
                    <Header level={2}>{t('Construct.other.talent')}</Header>
                    <TalentDescription name={career.talent.name} description={career.talent.description}/>
                </div>
            </div>);
        } else {
            return (<>
            <div className="row">
                <div className="col-md-6 my-3">
                    <Header level={2}>{t('Construct.other.value')}</Header>
                    <ValueInput value={character.careerStep?.value ?? ""} onValueChanged={(value) => onValueChanged(value)}
                                onRandomClicked={() => randomValue()} textDescription={textDescription} />
                </div>
            </div>

            <div className="my-3">
                <Header level={2}>{t('Construct.other.talent')}</Header>
                <SingleTalentSelectionList talents={filterTalentList()}
                    construct={character} onSelection={(talent) => { onTalentSelected(talent) } }/>
                </div>
            </>);
        }
    }

    const filterTalentList = () => {
        return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
            t => !character.hasTalent(talentName) || (talentName != null && t.name === talentName) || t.rank > 1);
    }

    const onTalentSelected = (talent: TalentViewModel) => {
        setTalentName(talent.name);
        store.dispatch(addCharacterTalent(talent, StepContext.Career));
    }

    const onNext = () => {
        if (!talentName) {
            Dialog.show("You must select a Talent before proceeding.");
        } else {
            Navigation.navigateToPage(PageIdentity.CareerEvent1);
        }
    }

    return (
        <div className="page container ml-0">
            <CharacterCreationBreadcrumbs />

            <Header>{career.localizedName}</Header>
            <p>{career.localizedDescription}</p>

            {renderMainBody(career)}

            <div className="text-right">
                <Button buttonType={true} text={t('Common.button.next')} className="btn btn-primary" onClick={() => onNext() }/>
            </div>
        </div>
    );

}

export default connect(soloCharacterMapStateToProperties)(CareerLengthDetailsPage);