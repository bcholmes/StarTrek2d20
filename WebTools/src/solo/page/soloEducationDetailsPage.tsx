import { useTranslation } from "react-i18next";
import { ICharacterProperties, characterMapStateToProperties } from "./soloCharacterProperties";
import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import {TracksHelper } from "../../helpers/tracks";
import InstructionText from "../../components/instructionText";
import { StepContext, setCharacterFocus, setCharacterValue } from "../../state/characterActions";
import store from "../../state/store";
import AttributeListComponent from "../../components/attributeListComponent";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import { Button } from "../../components/button";
import SoloValueInput from "../component/soloValueInput";
import DisciplineListComponent from "../../components/disciplineListComponent";
import { Dialog } from "../../components/dialog";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import D20IconButton from "../component/d20IconButton";
import { ValueRandomTable } from "../table/valueRandomTable";
import { FocusRandomTable } from "../table/focusRandomTable";
import { EducationAttributeController, EducationPrimaryDisciplineController, EducationSecondaryDisciplineController } from "../../components/educationControllers";

const SoloEducationDetailsPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const track = TracksHelper.instance.getSoloTrack(character.educationStep?.track);
    const attributeController = new EducationAttributeController(character, track);
    const primaryDisciplineController = new EducationPrimaryDisciplineController(character, track);
    const secondaryDisciplineController = new EducationSecondaryDisciplineController(character, track);

    const navigateToNextPage = () => {
        if (character.educationStep?.attributes?.length < 3) {
            Dialog.show(t("SoloEducationDetailsPage.errorAttributes"));
        } else if (character.educationStep?.disciplines?.length < 2 || character.educationStep?.primaryDiscipline == null ||
            (character.educationStep?.decrementDisciplines?.length > 0 && character.educationStep?.disciplines?.length < 3)) {
            Dialog.show(t("SoloEducationDetailsPage.errorDisciplines"));
        } else if (character.educationStep?.focuses?.filter(f => !!f).length < 3) {
            Dialog.show(t("SoloEducationDetailsPage.errorFocuses"));
        } else if (!character.educationStep?.value) {
            Dialog.show(t("SoloEducationDetailsPage.errorValue"));
        } else {
            Navigation.navigateToPage(PageIdentity.CareerLength);
        }
    }

    const randomValue = () => {
        let done = false;
        while (!done) {
            let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
            if (character.values.indexOf(value) < 0) {
                done = true;
                store.dispatch(setCharacterValue(value, StepContext.Education));
            }
        }
    }


    const selectRandomFocus = (index: number) => {
        let done = false;
        while (!done) {
            let focus = FocusRandomTable(character.educationStep?.primaryDiscipline);
            if (character.focuses.indexOf(focus) < 0) {
                done = true;
                store.dispatch(setCharacterFocus(focus, StepContext.Education, index));
            }
        }
    }

    return (
        <div className="page container ms-0">
            <SoloCharacterBreadcrumbs  pageIdentity={PageIdentity.SoloEducationDetailsPage}/>
            <Header>{track.localizedName}</Header>
            <InstructionText text={track.localizedDescription} />

            <div className="row">
                <div className="col-lg-6 my-3">
                    <Header level={2}>{t('Construct.other.attributes') + ' ' + t('SoloEducationDetailsPage.selectThree')}</Header>
                    <AttributeListComponent controller={attributeController} />

                    {track.attributesRule ? (<p>{track.attributesRule?.describe()}</p>) : undefined}
                </div>
                <div className="col-lg-6 my-3">
                    <Header level={2}>{t('SoloEducationDetailsPage.primaryDiscipline')}</Header>
                    <DisciplineListComponent controller={primaryDisciplineController} />

                    <Header level={2} className="mt-3">{t('SoloEducationDetailsPage.secondaryDiscipline')}</Header>
                    <DisciplineListComponent controller={secondaryDisciplineController} />

                    {track.skillsRule ? (<p>{track.skillsRule?.describe()}</p>) : undefined}
                </div>
                <div className="my-3 col-lg-6">
                    <Header level={2}>{t('Construct.other.focus')}</Header>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                            value={character.educationStep?.focuses[0] || ""} className="mt-1"
                            onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 0))} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomFocus(0)}/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <InputFieldAndLabel id="focus2" labelName={t('Construct.other.focus2')}
                            value={character.educationStep?.focuses[1] || ""} className="mt-1"
                            onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 1))} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomFocus(1)}/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <InputFieldAndLabel id="focus3" labelName={t('Construct.other.focus3')}
                            value={character.educationStep?.focuses[2] || ""} className="mt-1"
                            onChange={(v) => store.dispatch(setCharacterFocus(v, StepContext.Education, 2))} />
                        <div style={{ flexShrink: 0 }} className="mt-1">
                            <D20IconButton onClick={() => selectRandomFocus(2)}/>
                        </div>
                    </div>
                    <div className="mt-3 text-white"><b>{t('Common.text.suggestions')}:</b> {track.focusSuggestions.join(", ")}</div>
                </div>
                <div className="my-3 col-lg-6">
                    <Header level={2}>{t('Construct.other.value')}</Header>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <SoloValueInput value={character.educationStep?.value}
                            onValueChanged={(string) => {store.dispatch(setCharacterValue(string, StepContext.Education))}}/>
                        <div style={{ flexShrink: 0 }} className="mt-2">
                            <D20IconButton onClick={() => randomValue() }/>
                        </div>
                    </div>
                    <div className="py-1 text-white">{t('Value.otherTraining.text')}</div>
                </div>
            </div>
            <div className='text-end mt-4'>
                <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextPage() }/>
            </div>
        </div>);
}

export default connect(characterMapStateToProperties)(SoloEducationDetailsPage);