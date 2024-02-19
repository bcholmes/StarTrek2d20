import React from 'react';
import {Navigation} from '../common/navigator';
import {AttributesHelper} from '../helpers/attributes';
import {AttributeView} from '../components/attribute';
import {Button} from '../components/button';
import {Dialog} from '../components/dialog';
import {CheckBox} from '../components/checkBox';
import { TALENT_NAME_BRAK_LUL, TalentsHelper, TalentViewModel, ToViewModel } from '../helpers/talents';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import InstructionText from '../components/instructionText';
import { Header } from '../components/header';
import { useTranslation } from 'react-i18next';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { addCharacterTalent, setCharacterEarlyOutlook, setCharacterFocus, StepContext } from '../state/characterActions';
import store from '../state/store';
import { PageIdentity } from './pageIdentity';
import { FocusRandomTableWithHints } from '../solo/table/focusRandomTable';
import { connect } from 'react-redux';
import D20IconButton from '../solo/component/d20IconButton';
import { EarlyOutlookDiscplineController } from '../components/earlyOutlookControllers';
import DisciplineListComponent from '../components/disciplineListComponent';
import { CharacterType } from '../common/characterType';
import { Species } from '../helpers/speciesEnum';
import { localizedFocus } from '../components/focusHelper';
import { makeKey } from '../common/translationKey';

const EarlyOutlookDetailsPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const earlyOutlook = character.upbringingStep?.upbringing;
    const disciplineController = new EarlyOutlookDiscplineController(character, earlyOutlook);

    const changeAccepted = (accepted: boolean) => {
        store.dispatch(setCharacterEarlyOutlook(earlyOutlook, accepted));
    }

    const navigateToNextPage = () => {
        if (character.upbringingStep?.discipline == null) {
            Dialog.show(t('UpbringingDetailPage.error.discipline'));
        } else if (!character.upbringingStep?.focus) {
            Dialog.show(t('UpbringingDetailPage.error.focus'));
        } else if (character.upbringingStep?.talent == null) {
            Dialog.show(t('UpbringingDetailPage.error.talent'));
        } else {

            if (character.type === CharacterType.Child) {
                Navigation.navigateToPage(PageIdentity.ChildEducationPage);
            } else {
                Navigation.navigateToPage(PageIdentity.Education);
            }
        }
    }

    const selectRandomFocus = () => {
        let done = false;
        while (!done) {
            let focus = localizedFocus(FocusRandomTableWithHints(character.upbringingStep?.discipline, earlyOutlook.focusSuggestions));
            if (character.focuses.indexOf(focus) < 0) {
                done = true;
                store.dispatch(setCharacterFocus(focus, StepContext.EarlyOutlook));
            }
        }
    }

    const onTalentSelected = (talent: TalentViewModel) => {
        store.dispatch(addCharacterTalent(talent, StepContext.EarlyOutlook));
    }

    const filterTalentList = () => {
        if (character.type === CharacterType.KlingonWarrior && character.speciesStep?.species === Species.Klingon) {
            return [ ToViewModel( TalentsHelper.getTalent(TALENT_NAME_BRAK_LUL), 1, character.type ) ];
        } else {
            return TalentsHelper.getAllAvailableTalentsForCharacter(character).filter(
                t => !character.hasTalent(t.name) || (character.upbringingStep.talent != null && t.name === character.upbringingStep.talent.talent) || t.rank > 1);
        }

    }

    const attributes = character.upbringingStep?.acceptedUpbringing
        ? (<div>
            <AttributeView name={t(makeKey('Construct.attribute.', AttributesHelper.getAttributeName(earlyOutlook.attributeAcceptPlus2))) } points={2} value={character.attributes[earlyOutlook.attributeAcceptPlus2].value}/>
            <AttributeView name={t(makeKey('Construct.attribute.', AttributesHelper.getAttributeName(earlyOutlook.attributeAcceptPlus1))) } points={1} value={character.attributes[earlyOutlook.attributeAcceptPlus1].value}/>
        </div>)
        : (<div>
            <AttributeView name={t(makeKey('Construct.attribute.', AttributesHelper.getAttributeName(earlyOutlook.attributeRebelPlus2))) } points={2} value={character.attributes[earlyOutlook.attributeRebelPlus2].value}/>
            <AttributeView name={t(makeKey('Construct.attribute.', AttributesHelper.getAttributeName(earlyOutlook.attributeRebelPlus1))) } points={1} value={character.attributes[earlyOutlook.attributeRebelPlus1].value}/>
        </div>);


    let talents = filterTalentList()

    return (
        <div className="page container ms-0">
            <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.UpbringingDetails} />
            <Header>{earlyOutlook.localizedName}</Header>

            <InstructionText text={earlyOutlook.localizedDescription} />

            <div className="row">
                <div className="col-lg-6 my-3">
                    <p>{t('UpbringingDetailPage.text')}</p>
                    <CheckBox isChecked={character.upbringingStep?.acceptedUpbringing} text={t('UpbringingDetailPage.text.accept')} value={1} onChanged={() => changeAccepted(true)}/>
                    <CheckBox isChecked={!character.upbringingStep?.acceptedUpbringing} text={t('UpbringingDetailPage.text.reject')} value={0} onChanged={() => changeAccepted(false)}/>
                </div>
                <div className="col-md-6 my-3">
                    <Header level={2}>{t('Construct.other.attributes')}</Header>
                    {attributes}
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 my-3">
                    <Header level={2}><>{t('Construct.other.disciplines')} ({t('Common.text.selectOne')})</></Header>
                    <DisciplineListComponent controller={disciplineController} />
                </div>
                <div className="my-3 col-lg-6">
                    <Header level={2}>{t('Construct.other.focus')}</Header>
                    <p>{earlyOutlook.localizedFocusDescription}</p>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <InputFieldAndLabel id="focus" labelName={t('Construct.other.focus')}
                            value={character.upbringingStep?.focus || ""} className="mt-1"
                            onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.EarlyOutlook))} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomFocus()}/>
                        </div>
                    </div>
                    <div className="py-1 text-white"><b>{t('Common.text.suggestions')}:</b> {earlyOutlook.focusSuggestions.map(f => localizedFocus(f)).join(", ")}</div>
                </div>
            </div>
            <div>
                <Header level={2}>{t('Construct.other.talent')}</Header>
                <SingleTalentSelectionList talents={talents} onSelection={(talent) => { onTalentSelected(talent) } } construct={character}/>
            </div>
            <div className="text-end">
                <Button className="btn btn-primary mt-4" onClick={() => navigateToNextPage() }>{t('Common.button.next')}</Button>
            </div>
        </div>
    );
}

export default connect(characterMapStateToProperties)(EarlyOutlookDetailsPage)