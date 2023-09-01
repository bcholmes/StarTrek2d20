import { connect } from "react-redux";
import { Header } from "../../components/header";
import { navigateTo } from "../../common/navigator";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";
import { Environment, EnvironmentsHelper } from "../../helpers/environments";
import { CharacterType } from "../../common/characterType";
import { Button } from "../../components/button";
import { IAttributeController } from "../../components/attributeController";
import { Character } from "../../common/character";
import { Attribute } from "../../helpers/attributes";
import store from "../../state/store";
import { StepContext, modifyCharacterAttribute, modifyCharacterDiscipline, setCharacterEnvironment } from "../../state/characterActions";
import AttributeListComponent from "../../components/attributeListComponent";
import InstructionText from "../../components/instructionText";
import { SpeciesHelper } from "../../helpers/species";
import { DropDownElement, DropDownSelect } from "../../components/dropDownInput";
import DisciplineListComponent, { IDisciplineController } from "../../components/disciplineListComponent";
import { Skill } from "../../helpers/skills";
import SoloValueInput from "../component/soloValueInput";
import { ISoloCharacterProperties } from "./soloCharacterProperties";
import { Species } from "../../helpers/speciesEnum";

class SoloEnvironmentAttributeController implements IAttributeController {

    readonly character: Character;
    readonly attributes: Attribute[];

    constructor(character: Character, attributes: Attribute[]) {
        this.character = character;
        this.attributes = attributes;
    }

    isShown(attribute: Attribute) {
        return this.attributes.indexOf(attribute) >= 0;
    }
    isEditable(attribute: Attribute): boolean {
        return this.isShown(attribute);
    }
    getValue(attribute: Attribute): number {
        return this.character.attributes[attribute].value;
    }
    canIncrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.environmentStep?.attribute == null;
    }
    canDecrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.environmentStep?.attribute === attribute;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Environment));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Environment, false));
    }
    get instructions() {
        return []
    }
}

class SoloEnvironmentDisciplineController implements IDisciplineController {

    readonly character: Character;
    readonly disciplines: Skill[];

    constructor(character: Character, disciplines: Skill[]) {
        this.character = character;
        this.disciplines = disciplines;
        console.log(disciplines);
    }

    isShown(discipline: Skill) {
        return this.disciplines.indexOf(discipline) >= 0;
    }
    isEditable(discipline: Skill): boolean {
        return this.isShown(discipline);
    }
    getValue(discipline: Skill): number {
        return this.character.skills[discipline].expertise;
    }
    canIncrease(discipline: Skill): boolean {
        return this.isEditable(discipline) && this.character.environmentStep?.discipline == null;
    }
    canDecrease(discipline: Skill): boolean {
        return this.isEditable(discipline) && this.character.environmentStep?.discipline === discipline;
    }
    onIncrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.Environment));
    }
    onDecrease(discipline: Skill): void {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.Environment, false));
    }
}

const SoloEnvironmentDetailsPage: React.FC<ISoloCharacterProperties> = ({character}) => {
    const { t } = useTranslation();

    const environment = EnvironmentsHelper.getEnvironment(character.environmentStep?.environment, CharacterType.Starfleet);
    let attributes = environment.attributes;
    if (environment.id === Environment.Homeworld) {
        let species = SpeciesHelper.getSpeciesByType(character.speciesStep?.species);
        attributes = species.attributes;
    } else if (environment.id === Environment.AnotherSpeciesWorld && character.environmentStep?.otherSpecies) {
        let species = SpeciesHelper.getSpeciesByType(character.environmentStep?.otherSpecies);
        attributes = species?.attributes;
    }

    const controller = new SoloEnvironmentAttributeController(character, attributes);
    const disciplineController = new SoloEnvironmentDisciplineController(character, environment.disciplines);

    const selectOtherSpecies = (s: Species) => {
        store.dispatch(setCharacterEnvironment(Environment.AnotherSpeciesWorld, s));
    }

    const navigateToNextStep = () => {

    }

    const isSpeciesSelectionNeeded = () => {
        return environment.id === Environment.AnotherSpeciesWorld && character.environmentStep?.otherSpecies == null;
    }

    let speciesList = SpeciesHelper.getCaptainsLogSpecies().filter(s => s.id !== character.speciesStep?.species).map(s => new DropDownElement(s.id, s.localizedName));
    speciesList.unshift(new DropDownElement("", t('Common.text.select')));

    return (
        <div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCharacterEra)}>{t('Page.title.era')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloSpecies)}>{t('Page.title.species')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.environment')}</li>
                </ol>
            </nav>

            <Header>{environment.localizedName}</Header>
                <p>{environment.localizedDescription}</p>
                <div className="row">
                    {environment.id === Environment.AnotherSpeciesWorld
                    ? (<div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.species')}</Header>
                        <InstructionText text={t('SoloEnvironmentDetailsPage.speciesText')} />

                        <div className="mt-3">
                            <DropDownSelect items={speciesList} defaultValue={character.environmentStep?.otherSpecies ?? ""}
                                onChange={s => {if (s !== "") {selectOtherSpecies(s as Species)} }} />
                        </div>
                    </div>)
                    : undefined}

                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.attributes')} ({t('Common.text.selectOne')})</Header>
                        {isSpeciesSelectionNeeded()
                            ? undefined
                            : (<AttributeListComponent controller={controller} />)}
                    </div>
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.disciplines')} ({t('Common.text.selectOne')})</Header>

                        <DisciplineListComponent controller={disciplineController} />
                    </div>
                    <div className="col-md-6 my-3">
                        <Header level={2} className="mb-3">{t('Construct.other.value')}</Header>

                        <SoloValueInput textDescription={t('Value.environment.text')} onValueChanged={(string) => {}}/>
                    </div>
                </div>
                <div className='text-right mt-4'>
                    <Button text={t('Common.button.next')} buttonType={true} className="btn btn-primary" onClick={() => navigateToNextStep() }/>
                </div>
        </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character?.currentCharacter
    };
}

export default connect(mapStateToProps)(SoloEnvironmentDetailsPage);