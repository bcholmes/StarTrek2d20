import React from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "../../common/navigator"
import { Header } from "../../components/header"
import { PageIdentity } from "../../pages/pageIdentity"
import { connect } from "react-redux";
import { SpeciesHelper } from "../../helpers/species";
import InstructionText from "../../components/instructionText";
import AttributeListComponent from "../../components/attributeListComponent";
import { Button } from "../../components/button";
import { ICharacterProperties } from "./soloCharacterProperties";
import { Dialog } from "../../components/dialog";
import SoloCharacterBreadcrumbs from "../component/soloCharacterBreadcrumbs";
import { SpeciesAttributeController } from "../../components/speciesController";

const SoloSpeciesDetailsPage: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();

    const species = SpeciesHelper.getSpeciesByType(character.speciesStep?.species);
    const controller = new SpeciesAttributeController(character, species);

    const navigateToNextPage = () => {
        if (character.speciesStep?.attributes?.length !== 3) {
            Dialog.show(t('SoloSpeciesPage.errorAttributes'));
        } else {
            Navigation.navigateToPage(PageIdentity.SoloEnvironment);
        }
    }

    return (
        <div className="page container ml-0">
            <SoloCharacterBreadcrumbs pageIdentity={PageIdentity.SoloSpeciesDetails}/>
            <Header>{character.localizedSpeciesName}</Header>

            <div className="row">
                <div className="col-md-6 mt-3">
                    <Header level={2} className="mb-4">{t('Common.text.description')}</Header>
                    <InstructionText text={species.localizedSoloDescription} />
                </div>

                <div className="col-md-6 mt-3">
                    <Header level={2} className="mb-4"><>{t('Construct.other.attributes') + (species.attributes?.length > 3 ? ' ' + t('SpeciesDetails.selectThree') : "")} </></Header>
                    <AttributeListComponent controller={controller} />
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