import { connect } from "react-redux";
import { Header } from "../../components/header";
import { Navigation, navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/button";
import store from "../../state/store";
import { StepContext, modifyCharacterAttribute, modifyCharacterDiscipline, setCharacterFocus } from "../../state/characterActions";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import { CareerEventsHelper } from "../../helpers/careerEvents";
import { CharacterType } from "../../common/characterType";
import InstructionText from "../../components/instructionText";
import { InputFieldAndLabel } from "../../common/inputFieldAndLabel";
import { AttributeView } from "../../components/attribute";
import { Attribute, AttributesHelper } from "../../helpers/attributes";
import { Skill } from "../../helpers/skills";
import { makeKey } from "../../common/translationKey";
import DisciplineListComponent, { IDisciplineController } from "../../components/disciplineListComponent";
import { CareerEventStep, Character } from "../../common/character";
import { IAttributeController } from "../../components/attributeController";
import AttributeListComponent from "../../components/attributeListComponent";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import { Dialog } from "../../components/dialog";

class SoloCareerEventDisciplineController implements IDisciplineController {

    readonly character: Character;
    readonly careerEventStep: CareerEventStep;
    readonly context: StepContext;
    readonly disciplines: Skill[];

    constructor(character: Character, careerEventStep: CareerEventStep, context: StepContext, disciplines: Skill[]) {
        this.character = character;
        this.disciplines = disciplines;
        this.context = context;
        this.careerEventStep = careerEventStep;
    }

    isShown(discipline: Skill) {
        return this.disciplines.indexOf(discipline) >= 0;
    }
    isEditable(discipline: Skill): boolean {
        return true;
    }
    getValue(discipline: Skill): number {
        return this.character.skills[discipline].expertise;
    }
    canIncrease(discipline: Skill): boolean {
        return this.getValue(discipline) < Character.maxDiscipline(this.character) &&
            (this.getValue(discipline) < (Character.maxDiscipline(this.character) - 1) || !this.character.hasMaxedSkill())
            && this.careerEventStep.discipline == null;
    }
    canDecrease(discipline: Skill): boolean {
        return this.careerEventStep?.discipline === discipline;
    }
    onIncrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, this.context, true));
    }
    onDecrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, this.context, false));
    }
}

class SoloCareerEventAttributeController implements IAttributeController {

    readonly character: Character;
    readonly careerEventStep: CareerEventStep;
    readonly context: StepContext;
    readonly attributes: Attribute[];

    constructor(character: Character, careerEventStep: CareerEventStep, context: StepContext, attributes: Attribute[]) {
        this.character = character;
        this.attributes = attributes;
        this.context = context;
        this.careerEventStep = careerEventStep;
    }

    isShown(attribute: Attribute) {
        return this.attributes.indexOf(attribute) >= 0;
    }
    isEditable(attribute: Attribute): boolean {
        return true;
    }
    getValue(attribute: Attribute): number {
        return this.character.attributes[attribute].value;
    }
    canIncrease(attribute: Attribute): boolean {
        return this.getValue(attribute) < Character.maxAttribute(this.character) &&
            (this.getValue(attribute) < (Character.maxAttribute(this.character) - 1) || !this.character.hasMaxedAttribute())
            && this.careerEventStep.attribute == null;
    }
    canDecrease(attribute: Attribute): boolean {
        return this.careerEventStep?.attribute === attribute;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, this.context, true));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, this.context, false));
    }
    get instructions() {
        return []
    }
}

interface ISoloCareerEventProperties extends ISoloCharacterProperties {
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
            Dialog.show(t('SoloCareerEventDetailsPage.errorAttribute'));
        } else if (careerEventStep.discipline == null) {
            Dialog.show(t('SoloCareerEventDetailsPage.errorDiscipline'));
        } else if (!careerEventStep.focus) {
            Dialog.show(t('SoloCareerEventDetailsPage.errorFocus'));
        } else if (context === StepContext.CareerEvent2) {
            Navigation.navigateToPage(PageIdentity.SoloFinishingTouches);
        } else {
            Navigation.navigateToPage(PageIdentity.SoloCareerEvent2);
        }
    }

    const attributeController = new SoloCareerEventAttributeController(character, careerEventStep, context, careerEvent.attributes);
    const disciplineController = new SoloCareerEventDisciplineController(character, careerEventStep, context, careerEvent.disciplines);

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={context === StepContext.CareerEvent2 ? PageIdentity.SoloCareerEvent2 : PageIdentity.SoloCareerEvent1} />

            <Header>{careerEvent.name}</Header>
                <InstructionText text={careerEvent.description} />
                <div className="row">
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.attribute')}</Header>
                        {careerEvent.attributes.length === 1
                            ? (<div>
                                    <AttributeView name={AttributesHelper.getAttributeName(careerEvent.attributes[0]) } points={1} value={character.attributes[careerEvent.attributes[0]].value}/>
                                </div>)
                            : (<AttributeListComponent controller={attributeController} />)}
                    </div>
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.discipline')}</Header>
                        {careerEvent.disciplines.length === 1
                        ? (<div>
                                <AttributeView name={t(makeKey('Construct.discipline.', Skill[careerEvent.disciplines[0]])) } points={1} value={character.skills[careerEvent.disciplines[0]].expertise}/>
                            </div>)
                        : (<DisciplineListComponent controller={disciplineController} />)}
                    </div>
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.focus')}</Header>
                        <InputFieldAndLabel id="focus1" labelName={t('Construct.other.focus1')}
                            value={careerEventStep?.focus || ""}
                            onChange={(f) => store.dispatch(setCharacterFocus(f, context))} />
                    </div>
                </div>
                <div className='text-right mt-4'>
                    <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextStep() }/>
                </div>
        </div>);

}


export default connect(soloCharacterMapStateToProperties)(SoloCareerEventDetailsPage);