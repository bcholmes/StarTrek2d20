import React from "react";
import { useTranslation } from "react-i18next";
import { Navigation, navigateTo } from "../../common/navigator"
import { Header } from "../../components/header"
import { PageIdentity } from "../../pages/pageIdentity"
import { connect } from "react-redux";
import { SpeciesHelper, SpeciesModel } from "../../helpers/species";
import InstructionText from "../../components/instructionText";
import { IAttributeController } from "../../components/attributeController";
import { Character } from "../../common/character";
import { Attribute } from "../../helpers/attributes";
import AttributeComponent from "../../components/attributeListComponent";
import { Button } from "../../components/button";
import store from "../../state/store";
import { StepContext, modifyCharacterAttribute } from "../../state/characterActions";
import { ISoloCharacterProperties } from "./soloCharacterProperties";
import { Dialog } from "../../components/dialog";

class SoloSpeciesAttributeController implements IAttributeController {

    readonly character: Character;
    readonly species: SpeciesModel;

    constructor(character: Character, species: SpeciesModel) {
        this.character = character;
        this.species = species;
    }

    isShown(attribute: Attribute) {
        return this.species.attributes.indexOf(attribute) >= 0;
    }
    isEditable(attribute: Attribute): boolean {
        return this.species.attributes.length > 3;
    }
    getValue(attribute: Attribute): number {
        return this.character.attributes[attribute].value;
    }
    canIncrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.speciesStep?.attributes?.length < 3 && this.character.speciesStep?.attributes?.indexOf(attribute) < 0;
    }
    canDecrease(attribute: Attribute): boolean {
        return this.isEditable(attribute) && this.character.speciesStep?.attributes?.indexOf(attribute) >= 0;
    }
    onIncrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Species));
    }
    onDecrease(attribute: Attribute): void {
        store.dispatch(modifyCharacterAttribute(attribute, StepContext.Species, false));
    }
    get instructions() {
        return []
    }
}


const SoloSpeciesDetailsPage: React.FC<ISoloCharacterProperties> = ({character}) => {

    const { t } = useTranslation();

    const species = SpeciesHelper.getSpeciesByType(character.speciesStep?.species);
    const controller = new SoloSpeciesAttributeController(character, species);

    const navigateToNextPage = () => {
        if (character.speciesStep?.attributes?.length !== 3) {
            Dialog.show(t('SoloSpeciesPage.errorAttributes'));
        } else {
            Navigation.navigateToPage(PageIdentity.SoloEnvironment);
        }
    }

    return (
        <div className="page container ml-0">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.Home)}>{t('Page.title.home')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SourceSelection)}>{t('Page.title.sourceSelection')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloConstructType)}>{t('Page.title.soloConstructType')}</a></li>
                    <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SoloCharacterEra)}>{t('Page.title.era')}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{t('Page.title.species')}</li>
                </ol>
            </nav>
            <Header>{character.localizedSpeciesName}</Header>

            <div className="row">
                <div className="col-md-6 mt-3">
                    <Header level={2} className="mb-4">{t('Common.text.description')}</Header>
                    <InstructionText text={species.localizedSoloDescription} />
                </div>

                <div className="col-md-6 mt-3">
                    <Header level={2} className="mb-4">{t('Construct.other.attributes') + (species.attributes?.length > 3 ? ' ' + t('SpeciesDetails.selectThree') : "")} </Header>
                    <AttributeComponent controller={controller} />
                </div>
            </div>

            <div className="text-right mt-4">
                <Button buttonType={true} onClick={() => navigateToNextPage()} className="btn btn-primary">{t('Common.button.next')}</Button>
            </div>
        </div>
    )
}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character?.currentCharacter
    };
}

export default connect(mapStateToProps)(SoloSpeciesDetailsPage);