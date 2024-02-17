import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/button";
import store from "../../state/store";
import { StepContext, setCharacterFinishingTouches, setCharacterFocus } from "../../state/characterActions";
import { ICharacterProperties, characterMapStateToProperties } from "./soloCharacterProperties";
import { CareerEventsHelper } from "../../helpers/careerEvents";
import { CharacterType } from "../../common/characterType";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import { AttributeView } from "../../components/attribute";
import { AttributesHelper } from "../../helpers/attributes";
import { Skill } from "../../helpers/skills";
import { makeKey } from "../../common/translationKey";
import DisciplineListComponent from "../../components/disciplineListComponent";
import AttributeListComponent from "../../components/attributeListComponent";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import { Dialog } from "../../components/dialog";
import D20IconButton from "../component/d20IconButton";
import { FocusRandomTable } from "../table/focusRandomTable";
import { CareerEventAttributeController, CareerEventDisciplineController } from "../../components/careerEventDetailsControllers";
import ReactMarkdown from "react-markdown";
import { localizedFocus } from "../../components/focusHelper";

interface ISoloCareerEventProperties extends ICharacterProperties {
    context: StepContext;
}

const SoloCareerEventDetailsPage: React.FC<ISoloCareerEventProperties> = ({character, context}) => {
    const { t } = useTranslation();

    const careerEventStep = context === StepContext.CareerEvent1
        ? character.careerEvents[0]
        : character.careerEvents[1];

    const careerEvent = CareerEventsHelper.getCareerEvent(careerEventStep?.id, CharacterType.Starfleet);

    const navigateToNextStep = () => {
        if (careerEventStep.attribute == null) {
            Dialog.show(t('CareerEventDetails.errorAttribute'));
        } else if (careerEventStep.discipline == null) {
            Dialog.show(t('CareerEventDetails.errorDiscipline'));
        } else if (!careerEventStep.focus) {
            Dialog.show(t('CareerEventDetails.errorFocus'));
        } else if (context === StepContext.CareerEvent2) {
            store.dispatch(setCharacterFinishingTouches());
            Navigation.navigateToPage(PageIdentity.SoloFinishingTouches);
        } else {
            Navigation.navigateToPage(PageIdentity.SoloCareerEvent2);
        }
    }

    const selectRandomFocus = () => {
        let done = false;
        while (!done) {
            let focus = localizedFocus(FocusRandomTable(careerEventStep.discipline));
            if (character.focuses.indexOf(focus) < 0) {
                done = true;
                store.dispatch(setCharacterFocus(focus, context));
            }
        }
    }

    const attributeController = new CareerEventAttributeController(character, careerEventStep, context, careerEvent.attributes);
    const disciplineController = new CareerEventDisciplineController(character, careerEventStep, context, careerEvent.disciplines);

    return (
        <div className="page container ms-0">
            <SoloCharacterBreadcrumbs pageIdentity={context === StepContext.CareerEvent2 ? PageIdentity.SoloCareerEvent2 : PageIdentity.SoloCareerEvent1} />

            <Header>{careerEvent.localizedName}</Header>
                <ReactMarkdown>{careerEvent.localizedDescription}</ReactMarkdown>
                <div className="row">
                    <div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.attribute')}</Header>
                        {careerEvent.attributes.length === 1
                            ? (<div>
                                    <AttributeView name={AttributesHelper.getAttributeName(careerEvent.attributes[0]) } points={1} value={character.attributes[careerEvent.attributes[0]].value}/>
                                </div>)
                            : (<AttributeListComponent controller={attributeController} />)}
                    </div>
                    <div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.discipline')}</Header>
                        {careerEvent.disciplines.length === 1
                        ? (<div>
                                <AttributeView name={t(makeKey('Construct.discipline.', Skill[careerEvent.disciplines[0]])) } points={1} value={character.skills[careerEvent.disciplines[0]].expertise}/>
                            </div>)
                        : (<DisciplineListComponent controller={disciplineController} />)}
                    </div>
                    <div className="col-lg-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.focus')}</Header>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                                value={careerEventStep?.focus || ""}
                                onChange={(f) => store.dispatch(setCharacterFocus(f, context))} />
                            <div style={{ flexShrink: 0 }} className="mt-2">
                                <D20IconButton onClick={() => selectRandomFocus()}/>
                            </div>
                        </div>
                        <div className="mt-3 text-white"><b>{t('Common.text.suggestions')}:</b> {careerEvent.localizedFocusSuggestion}</div>
                    </div>
                </div>
                <div className='text-end mt-4'>
                    <Button className="btn btn-primary" onClick={() => navigateToNextStep() }>{t('Common.button.next')}</Button>
                </div>
        </div>);

}


export default connect(characterMapStateToProperties)(SoloCareerEventDetailsPage);