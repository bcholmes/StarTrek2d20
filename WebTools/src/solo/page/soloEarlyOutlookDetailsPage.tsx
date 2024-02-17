import React from "react";
import { ICharacterProperties } from "./soloCharacterProperties";
import { connect } from "react-redux";
import { Header } from "../../components/header";
import InstructionText from "../../components/instructionText";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { AttributeView } from "../../components/attribute";
import { AttributesHelper } from "../../helpers/attributes";
import { CheckBox } from "../../components/checkBox";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import DisciplineListComponent from "../../components/disciplineListComponent";
import store from "../../state/store";
import { StepContext, setCharacterEarlyOutlook, setCharacterFocus } from "../../state/characterActions";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import D20IconButton from "../component/d20IconButton";
import { FocusRandomTable } from "../table/focusRandomTable";
import { EarlyOutlookDiscplineController } from "../../components/earlyOutlookControllers";
import { localizedFocus } from "../../components/focusHelper";

const SoloEarlyOutlookDetailsPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const earlyOutlook = character.upbringingStep?.upbringing;
    const disciplineController = new EarlyOutlookDiscplineController(character, earlyOutlook);

    const changeAccepted = (accepted: boolean) => {
        store.dispatch(setCharacterEarlyOutlook(earlyOutlook, accepted));
    }

    const navigateToNextPage = () => {
        if (character.upbringingStep?.discipline == null) {
            Dialog.show(t('SoloEarlyOutlookDetailsPage.errorDiscipline'));
        } else if (!character.upbringingStep?.focus) {
            Dialog.show(t('SoloEarlyOutlookDetailsPage.errorFocus'));
        } else {
            Navigation.navigateToPage(PageIdentity.SoloEducationType);
        }
    }

    const selectRandomFocus = () => {
        let done = false;
        while (!done) {
            let focus = localizedFocus(FocusRandomTable(character.upbringingStep?.discipline));
            if (character.focuses.indexOf(focus) < 0) {
                done = true;
                store.dispatch(setCharacterFocus(focus, StepContext.EarlyOutlook));
            }
        }
    }

    const attributes = character.upbringingStep?.acceptedUpbringing
        ? (<div>
            <AttributeView name={AttributesHelper.getAttributeName(earlyOutlook.attributeAcceptPlus2) } points={2} value={character.attributes[earlyOutlook.attributeAcceptPlus2].value}/>
            <AttributeView name={AttributesHelper.getAttributeName(earlyOutlook.attributeAcceptPlus1) } points={1} value={character.attributes[earlyOutlook.attributeAcceptPlus1].value}/>
        </div>)
        : (<div>
            <AttributeView name={AttributesHelper.getAttributeName(earlyOutlook.attributeRebelPlus2) } points={2} value={character.attributes[earlyOutlook.attributeRebelPlus2].value}/>
            <AttributeView name={AttributesHelper.getAttributeName(earlyOutlook.attributeRebelPlus1) } points={1} value={character.attributes[earlyOutlook.attributeRebelPlus1].value}/>
        </div>);

    return (
        <div className="page container ms-0">
            <SoloCharacterBreadcrumbs  pageIdentity={PageIdentity.SoloEarlyOutlookDetails} />
            <Header>{earlyOutlook.localizedName}</Header>

            <InstructionText text={earlyOutlook.description} />

            <div className="row">
                <div className="col-lg-6 my-3">
                    <p>{t('UpbringingDetailPage.text')}</p>
                    <CheckBox isChecked={character.upbringingStep?.acceptedUpbringing} text={t('UpbringingDetailPage.text.accept')} value={1} onChanged={() => changeAccepted(true)}/>
                    <CheckBox isChecked={!character.upbringingStep?.acceptedUpbringing} text={t('UpbringingDetailPage.text.reject')} value={0} onChanged={() => changeAccepted(false)}/>
                </div>
                <div className="col-lg-6 my-3">
                    <Header level={2}>{t('Construct.other.attributes')}</Header>
                    {attributes}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 my-3">
                    <Header level={2}><>{t('Construct.other.disciplines')} ({t('Common.text.selectOne')})</></Header>
                    <DisciplineListComponent controller={disciplineController} />
                </div>
                <div className="my-3 col-lg-6">
                    <Header level={2}>{t('Construct.other.focus')}</Header>
                    <p>{earlyOutlook.focusDescription}</p>
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
            <div className='text-end mt-4'>
                <Button className="btn btn-primary" onClick={() => navigateToNextPage() }>{t('Common.button.next')}</Button>
            </div>
        </div>);
}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character?.currentCharacter
    };
}

export default connect(mapStateToProps)(SoloEarlyOutlookDetailsPage);