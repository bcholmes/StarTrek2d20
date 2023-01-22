import React from "react";
import { character } from "../common/character";
import { Navigation } from "../common/navigator";
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Header } from "../components/header";
import InstructionText from "../components/instructionText";
import { SimpleSpeciesSelection } from "../components/simpleSpeciesSelection";
import { SpeciesHelper, SpeciesModel } from "../helpers/species";
import { Species } from "../helpers/speciesEnum";
import { IPageProperties } from "./iPageProperties";
import { PageIdentity } from "./pageIdentity";

interface ISpeciesExtraDetailsPageProperties extends IPageProperties {
    species: Species;
}
export class SpeciesExtraDetailsPage extends React.Component<ISpeciesExtraDetailsPageProperties, {}> {

    render() {
        let species = SpeciesHelper.getSpeciesByType(this.props.species);

        return (<div className="page">
            <div className="container ml-0">
                <CharacterCreationBreadcrumbs />
                <Header>{species.name + ' '} Original Species Type</Header>
                <InstructionText text={this.getInstructions()} />

                <div className="mt-4">
                    <SimpleSpeciesSelection onSelection={(species) => this.selectOriginalSpecies(species)}
                        species={SpeciesHelper.getPrimarySpecies(character.type, true)} />
                </div>
            </div>
        </div>);
    }

    getInstructions() {
        if (this.props.species === Species.Kobali) {
            return ["The Kobali collect the corpses of other species and use an advanced from of genetic engineering to modify "
                + "these deceased individuals, converting them into Kobali.", "The species of the original body can be selected below."];
        } else if (this.props.species === Species.CyberneticallyEnhanced) {
            return ["Before being cybernetically enhanced, this individual was a member of another species. Please select that species, below."];
        } else {
            return ["Before being assimilated by the Borg, the Borg drone was a member of another species. That species can be selected below."];
        }
    }

    selectOriginalSpecies(species: SpeciesModel) {
        if (this.props.species === Species.CyberneticallyEnhanced) {
            character.speciesStep.mixedSpecies = species.id;
            SpeciesHelper.applySpecies(character.speciesStep.species, species.id);
        } else {
            character.speciesStep.originalSpecies = species.id;
            SpeciesHelper.applySpecies(character.speciesStep.species, undefined, species.id);
        }
        Navigation.navigateToPage(PageIdentity.SpeciesDetails);
    }
}

export default SpeciesExtraDetailsPage;