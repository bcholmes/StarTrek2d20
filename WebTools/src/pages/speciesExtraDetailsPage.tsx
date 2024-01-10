import React from "react";
import { Navigation } from "../common/navigator";
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Header } from "../components/header";
import InstructionText from "../components/instructionText";
import { SimpleSpeciesSelection } from "../components/simpleSpeciesSelection";
import { SpeciesHelper, SpeciesModel } from "../helpers/species";
import { Species } from "../helpers/speciesEnum";
import { PageIdentity } from "./pageIdentity";
import { ICharacterProperties, characterMapStateToProperties } from "../solo/page/soloCharacterProperties";
import { connect } from "react-redux";
import store from "../state/store";
import { setCharacterSpecies } from "../state/characterActions";

interface ISpeciesExtraDetailsPageProperties extends ICharacterProperties {
    species: Species;
    pageIdentity: PageIdentity;
}
const SpeciesExtraDetailsPage: React.FC<ISpeciesExtraDetailsPageProperties> = ({character, species}) => {

    const getInstructions = () => {
        if (species === Species.Kobali) {
            return ["The Kobali collect the corpses of other species and use an advanced from of genetic engineering to modify "
                + "these deceased individuals, converting them into Kobali.", "The species of the original body can be selected below."];
        } else if (species === Species.CyberneticallyEnhanced) {
            return ["Before being cybernetically enhanced, this individual was a member of another species. Please select that species, below."];
        } else {
            return ["Before being assimilated by the Borg, the Borg drone was a member of another species. That species can be selected below."];
        }
    }

    const selectOriginalSpecies = (speciesModel: SpeciesModel) => {
        if (species === Species.CyberneticallyEnhanced) {
            store.dispatch(setCharacterSpecies(character.speciesStep?.species, character.speciesStep?.attributes, speciesModel.id));
        } else if (species === Species.Kobali) {
            store.dispatch(setCharacterSpecies(character.speciesStep?.species, speciesModel.attributes.length <= 3 ? speciesModel.attributes : undefined, undefined, speciesModel.id));
        } else {
            store.dispatch(setCharacterSpecies(character.speciesStep?.species, character.speciesStep?.attributes, undefined, speciesModel.id));
        }
        Navigation.navigateToPage(PageIdentity.SpeciesDetails);
    }

    let speciesModel = SpeciesHelper.getSpeciesByType(species);

    return (<div className="page">
        <div className="container ml-0">
            <CharacterCreationBreadcrumbs />
            <main>
                <Header>{speciesModel.localizedName + ' '} Original Species Type</Header>
                <InstructionText text={getInstructions()} />

                <div className="mt-4">
                    <SimpleSpeciesSelection onSelection={(species) => selectOriginalSpecies(species)}
                        character={character}
                        species={SpeciesHelper.getPrimarySpecies(character.type, true, character)} />
                </div>
            </main>
        </div>
    </div>);

}

export default connect(characterMapStateToProperties)(SpeciesExtraDetailsPage);