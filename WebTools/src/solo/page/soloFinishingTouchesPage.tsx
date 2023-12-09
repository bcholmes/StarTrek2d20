import { useTranslation } from "react-i18next";
import { ICharacterProperties, characterMapStateToProperties } from "./soloCharacterProperties";
import { Navigation } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { Header } from "../../components/header";
import { connect } from "react-redux";
import { Button } from "../../components/button";
import SoloValueInput from "../component/soloValueInput";
import store from "../../state/store";
import { StepContext, setCharacterValue } from "../../state/characterActions";
import { Dialog } from "../../components/dialog";
import DisciplineListComponent from "../../components/disciplineListComponent";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import AttributeListComponent from "../../components/attributeListComponent";
import { ValueRandomTable } from "../table/valueRandomTable";
import D20IconButton from "../component/d20IconButton";
import { FinishingTouchesAttributeController, FinishingTouchesDisciplineController } from "../../components/finishingTouchesControllers";

const SoloFinishingTouchesPage: React.FC<ICharacterProperties> = ({character}) => {
    const { t } = useTranslation();

    let attributeTotal = 0;
    character.attributes.forEach(a => attributeTotal += a.value);
    attributeTotal -= (character.finishingStep?.attributes?.length ?? 0);

    const attributeCount = 56 - attributeTotal;

    let disciplineTotal = 0;
    character.skills.forEach(a => disciplineTotal += a.expertise);
    disciplineTotal -= (character.finishingStep?.disciplines?.length ?? 0);

    const disciplineCount = 16 - disciplineTotal;

    const attributeController = new FinishingTouchesAttributeController(character, attributeCount);
    const disciplineController = new FinishingTouchesDisciplineController(character, disciplineCount);

    const navigateToNextPage = () => {
        if (character.finishingStep?.attributes.length !== attributeCount) {
            Dialog.show(t('SoloFinishingTouchesPage.errorAttributes', { count: attributeCount}));
        } else if (character.finishingStep?.disciplines.length !== disciplineCount) {
            Dialog.show(t('SoloFinishingTouchesPage.errorDisciplines', { count: disciplineCount}));
        } else if (!character.finishingStep?.value == null) {
            Dialog.show(t('SoloFinishingTouchesPage.errorValue'));
        } else {
            Navigation.navigateToPage(PageIdentity.SoloFinal);
        }
    }

    const randomValue = () => {
        let done = false;
        while (!done) {
            let value = ValueRandomTable(character.speciesStep?.species, character.educationStep?.primaryDiscipline);
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
                    <Header level={2} className="mb-3"><>{t('Construct.other.attribute')} {t('SoloFinishingTouchesPage.select', {count: attributeCount})}</></Header>
                    <AttributeListComponent controller={attributeController} />
                </div>
                <div className="col-lg-6 my-3">
                    <Header level={2} className="mb-3"><>{t('Construct.other.discipline')}  {t('SoloFinishingTouchesPage.select', {count: disciplineCount})}</></Header>
                    <DisciplineListComponent controller={disciplineController} />
                </div>
                <div className="col-lg-6 my-3">
                    <Header level={2} className="mb-3">{t('Construct.other.value')}</Header>

                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <SoloValueInput value={character?.finishingStep?.value ?? ""}
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


export default connect(characterMapStateToProperties)(SoloFinishingTouchesPage);