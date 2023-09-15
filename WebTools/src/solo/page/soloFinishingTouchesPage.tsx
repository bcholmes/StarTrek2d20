import { useTranslation } from "react-i18next";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import { connect } from "react-redux";
import { Button } from "../../components/button";
import SoloValueInput from "../component/soloValueInput";
import store from "../../state/store";
import { StepContext, modifyCharacterAttribute, modifyCharacterDiscipline, setCharacterValue } from "../../state/characterActions";
import { Dialog } from "../../components/dialog";
import DisciplineListComponent, { IDisciplineController } from "../../components/disciplineListComponent";
import { Character } from "../../common/character";
import { Skill } from "../../helpers/skills";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import { IAttributeController } from "../../components/attributeController";
import { Attribute } from "../../helpers/attributes";
import AttributeListComponent from "../../components/attributeListComponent";
import { ValueRandomTable } from "../table/valueRandomTable";
import D20IconButton from "../component/d20IconButton";

class SoloFinishingTouchesAttributeController implements IAttributeController {
    readonly character: Character;
    readonly count: number;

    constructor(character: Character, count: number = 2) {
        this.character = character;
        this.count = count;
    }

    isShown(attribute: Attribute) {
        return true;
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
            && (this.character.finishingStep?.attributes.length < this.count)
            && (this.character.finishingStep?.attributes.filter(a => a === attribute).length < (this.count - 1));
    }
    canDecrease(attribute: Attribute): boolean {
        return this.character.finishingStep?.attributes.indexOf(attribute) >= 0;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.FinishingTouches, true));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.FinishingTouches, false));
    }
    get instructions() {
        return []
    }
}

class SoloFinishingTouchesDisciplineController implements IDisciplineController {

    readonly character: Character;
    readonly count: number;

    constructor(character: Character, count: number = 2) {
        this.character = character;
        this.count = count;
    }

    isShown(discipline: Skill) {
        return true;
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
            && (this.character.finishingStep?.disciplines.length < this.count)
            && (this.character.finishingStep?.disciplines.filter(d => d === discipline).length < (this.count - 1));
    }
    canDecrease(discipline: Skill): boolean {
        return this.character.finishingStep?.disciplines.indexOf(discipline) >= 0;
    }
    onIncrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.FinishingTouches, true));
    }
    onDecrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.FinishingTouches, false));
    }
}


const SoloFinishingTouchesPage: React.FC<ISoloCharacterProperties> = ({character}) => {
    const { t } = useTranslation();

    let attributeTotal = 0;
    character.attributes.forEach(a => attributeTotal += a.value);
    attributeTotal -= (character.finishingStep?.attributes?.length ?? 0);

    const attributeCount = 56 - attributeTotal;

    let disciplineTotal = 0;
    character.skills.forEach(a => disciplineTotal += a.expertise);
    disciplineTotal -= (character.finishingStep?.disciplines?.length ?? 0);

    const disciplineCount = 16 - disciplineTotal;

    const attributeController = new SoloFinishingTouchesAttributeController(character, attributeCount);
    const disciplineController = new SoloFinishingTouchesDisciplineController(character);

    const navigateToNextPage = () => {
        if (character.finishingStep?.attributes.length !== attributeCount) {
            Dialog.show(t('SoloFinishingTouchesPage.errorAttributes', { count: attributeCount}));
        } else if (character.finishingStep?.disciplines.length !== disciplineCount) {
            Dialog.show(t('SoloFinishingTouchesPage.errorDisciplines', { count: disciplineCount}));
        } else if (!character.finishValue) {
            Dialog.show(t('SoloFinishingTouchesPage.errorValue'));
        } else {
            Navigation.navigateToPage(PageIdentity.SoloFinal);
        }
    }

    const randomValue = () => {
        let done = false;
        while (!done) {
            let value = ValueRandomTable();
            if (character.values.indexOf(value) < 0) {
                done = true;
                store.dispatch(setCharacterValue(value, StepContext.FinishingTouches));
            }
        }
    }

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloFinishingTouches} />

            <Header>{t('Page.title.soloFinishingTouches')}</Header>

            <div className="row">
                <div className="col-lg-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.attribute')} {t('SoloFinishingTouchesPage.select', {count: attributeCount})}</Header>
                    <AttributeListComponent controller={attributeController} />
                </div>
                <div className="col-lg-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.discipline')}  {t('SoloFinishingTouchesPage.select', {count: disciplineCount})}</Header>
                    <DisciplineListComponent controller={disciplineController} />
                </div>
                <div className="col-lg-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.value')}</Header>

                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <SoloValueInput value={character?.finishValue}
                            onValueChanged={(string) => {store.dispatch(setCharacterValue(string, StepContext.FinishingTouches))}}/>
                        <div style={{ flexShrink: 0 }} className="mt-2">
                            <D20IconButton onClick={() => randomValue() }/>
                        </div>
                        <div className="py-1 text-white">{t('Value.final.text')}</div>
                    </div>
                </div>

            </div>
            <div className='text-right mt-4'>
                <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextPage() }/>
            </div>
        </div>);

}


export default connect(soloCharacterMapStateToProperties)(SoloFinishingTouchesPage);