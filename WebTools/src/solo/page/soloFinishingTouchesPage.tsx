import { useTranslation } from "react-i18next";
import { ISoloCharacterProperties, soloCharacterMapStateToProperties } from "./soloCharacterProperties";
import { Navigation, navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import { connect } from "react-redux";
import { Button } from "../../components/button";
import SoloValueInput from "../component/soloValueInput";
import store from "../../state/store";
import { StepContext, modifyCharacterDiscipline, setCharacterValue } from "../../state/characterActions";
import { Dialog } from "../../components/dialog";
import DisciplineListComponent, { IDisciplineController } from "../../components/disciplineListComponent";
import { Character } from "../../common/character";
import { Skill } from "../../helpers/skills";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";

class SoloEnvironmentDisciplineController implements IDisciplineController {

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
            && this.character.finishingStep?.disciplines.length < this.count;
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

    const navigateToNextPage = () => {
        if (!character.finishValue) {
            Dialog.show(t('SoloFinishingTouchesPage.errorValue'));
        } else {
            Navigation.navigateToPage(PageIdentity.SoloFinalPage);
        }
    }

    const disciplineController = new SoloEnvironmentDisciplineController(character);

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloFinishingTouches} />

            <Header>{t('Page.title.soloFinish')}</Header>

            <div className="row">
                <div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.attribute')}</Header>
                </div>
                <div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.discipline')}</Header>
                    <DisciplineListComponent controller={disciplineController} />
                </div>
                <div className="col-md-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.value')}</Header>

                    <SoloValueInput textDescription={t('Value.final.text')}
                        onValueChanged={(string) => {store.dispatch(setCharacterValue(string, StepContext.FinishingTouches))}}/>
                </div>

            </div>
            <div className='text-right mt-4'>
                <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextPage() }/>
            </div>
        </div>);

}


export default connect(soloCharacterMapStateToProperties)(SoloFinishingTouchesPage);