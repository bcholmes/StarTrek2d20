import * as React from 'react';
import {character} from '../common/character';
import EraSelectionPage from './eraSelectionPage';
import {ToolSelectionPage} from './toolSelectionPage';
import {SpeciesPage} from './speciesPage';
import SpeciesDetailsPage from './speciesDetailsPage';
import {EnvironmentPage} from './environmentPage';
import {EnvironmentDetailsPage} from './environmentDetailsPage';
import {UpbringingPage} from './upbringingPage';
import {UpbringingDetailsPage} from './upbringingDetailsPage';
import {StarfleetAcademyPage} from './starfleetAcademyPage';
import {StarfleetAcademyDetailsPage} from './starfleetAcademyDetailsPage';
import {CareerPage} from './careerPage';
import {CareerDetailsPage} from './careerDetailsPage';
import {CareerEventPage} from './careerEventPage';
import {CareerEventDetailsPage} from './careerEventDetailsPage';
import {AttributesAndDisciplinesPage} from './attributesAndDisciplinesPage';
import {FinishPage} from './finishPage';
import StarshipPage from '../starship/page/starshipPage';
import {SupportingCharacterPage} from './supportingCharacterPage';
import { TalentsOverviewPage } from './talentsOverviewPage';
import { SelectionPage } from './selectionPage';
import { BorgImplantSelection } from './borgImplantSelection';
import { PageIdentity } from './pageIdentity';
import { CharacterTypePage } from './characterTypePage';
import { SimpleCareerPage } from './simpleCareerPage';
import { ChildEducationPage } from './childEducationPage';
import { ChildEducationDetailsPage } from './childEducationDetailsPage';
import { ViewSheetPage } from './viewSheetPage';
import { CadetSeniorityPage } from './cadetSeniorityPage';
import { SystemGenerationPage } from '../mapping/page/systemGenerationPage';
import StarSystemDetailsPage from '../mapping/page/starSystemDetailsPage';
import SectorDetailsPage from '../mapping/page/sectorDetailsPage';
import { CreditsPage } from './creditsPage';
import SpeciesExtraDetailsPage from './speciesExtraDetailsPage';
import { Species } from '../helpers/speciesEnum';
import StarshipTypeSelectionPage from '../starship/page/starshipTypeSelectionPage';
import SimpleStarshipPage from '../starship/page/simpleStarshipPage';
import FinalStarshipDetailsPage from '../starship/page/finalStarshipDetailsPage';
import StarshipTalentsPage from '../starship/page/starshipTalentsPage';
import StarshipWeaponsPage from '../starship/page/starshipWeaponsPage';
import { SelectStarshipToolPage } from '../starship/page/selectStarshipToolPage';
import SmallCraftStatsPage from '../starship/page/smallCraftStatsPage';


export class PageFactory {
    private factories = {};

    constructor() {
        this.factories = {};

        this.factories[PageIdentity.Selection] = () => <SelectionPage />;
        this.factories[PageIdentity.Era] = () => <EraSelectionPage/>;
        this.factories[PageIdentity.ToolSelecton] = () => <ToolSelectionPage/>;
        this.factories[PageIdentity.CharacterType] = () => <CharacterTypePage/>;
        this.factories[PageIdentity.Species] = () => <SpeciesPage/>;
        this.factories[PageIdentity.KobaliExtraSpeciesDetails] = () => <SpeciesExtraDetailsPage species={Species.Kobali} />;
        this.factories[PageIdentity.BorgSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.Borg} />;
        this.factories[PageIdentity.LiberatedBorgSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.LiberatedBorg} />;
        this.factories[PageIdentity.CyberneticallyEnhancedSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.CyberneticallyEnhanced} />;
        this.factories[PageIdentity.SpeciesDetails] = () => <SpeciesDetailsPage/>;
        this.factories[PageIdentity.Environment] = () => <EnvironmentPage/>;
        this.factories[PageIdentity.EnvironmentDetails] = () => <EnvironmentDetailsPage/>;
        this.factories[PageIdentity.Upbringing] = () => <UpbringingPage/>;
        this.factories[PageIdentity.UpbringingDetails] = () => <UpbringingDetailsPage/>;
        this.factories[PageIdentity.StarfleetAcademy] = () => <StarfleetAcademyPage/>;
        this.factories[PageIdentity.StarfleetAcademyDetails] = () => <StarfleetAcademyDetailsPage/>;
        this.factories[PageIdentity.Career] = () => <CareerPage/>;
        this.factories[PageIdentity.CareerDetails] = () => <CareerDetailsPage/>;
        this.factories[PageIdentity.CareerEvent1] = () => <CareerEventPage/>;
        this.factories[PageIdentity.CareerEvent1Details] = () => <CareerEventDetailsPage/>;
        this.factories[PageIdentity.CareerEvent2] = () => <CareerEventPage/>;
        this.factories[PageIdentity.CareerEvent2Details] = () => <CareerEventDetailsPage/>;
        this.factories[PageIdentity.ChildCareer] = () => <SimpleCareerPage talent="Childhood Insight"/>;
        this.factories[PageIdentity.CadetCareer] = () => <SimpleCareerPage talent="Untapped Potential" />;
        this.factories[PageIdentity.CadetSeniority] = () => <CadetSeniorityPage />;
        this.factories[PageIdentity.ChildEducationPage] = () => <ChildEducationPage/>;
        this.factories[PageIdentity.ChildEducationDetailsPage] = () => <ChildEducationDetailsPage/>;
        this.factories[PageIdentity.AttributesAndDisciplines] = () => <AttributesAndDisciplinesPage />;
        this.factories[PageIdentity.BorgImplants] = () => <BorgImplantSelection />;
        this.factories[PageIdentity.Finish] = () => <FinishPage/>;
        this.factories[PageIdentity.SimpleStarship] = () => <SimpleStarshipPage/>;
        this.factories[PageIdentity.SmallCraftStats] = () => <SmallCraftStatsPage/>;
        this.factories[PageIdentity.Starship] = () => <StarshipPage/>;
        this.factories[PageIdentity.StarshipToolSelection] = () => <SelectStarshipToolPage/>;
        this.factories[PageIdentity.StarshipTypeSelection] = () => <StarshipTypeSelectionPage/>;
        this.factories[PageIdentity.StarshipTalentSelection] = () => <StarshipTalentsPage/>;
        this.factories[PageIdentity.StarshipWeaponsSelection] = () => <StarshipWeaponsPage/>;
        this.factories[PageIdentity.FinalStarshipDetails] = () => <FinalStarshipDetailsPage/>;
        this.factories[PageIdentity.SystemGeneration] = () => <SystemGenerationPage />;
        this.factories[PageIdentity.SectorDetails] = () => <SectorDetailsPage />;
        this.factories[PageIdentity.StarSystemDetails] = () => <StarSystemDetailsPage />;
        this.factories[PageIdentity.SupportingCharacter] = () => <SupportingCharacterPage />;
        this.factories[PageIdentity.TalentsOverview] = () => <TalentsOverviewPage />;
        this.factories[PageIdentity.ViewSheet] = () => <ViewSheetPage />;
        this.factories[PageIdentity.CreditsPage] = () => <CreditsPage />;
    }

    createPage(page: PageIdentity) {
        const factory = this.factories[page];
        if (!factory) {
            console.error(`Unable to find a page factory for ${PageIdentity[page]}`);
        }

        character.update();

        return factory ? factory() : undefined;
    }

    isFullscreen(page: PageIdentity) {
        if (page === PageIdentity.Finish) {
            return true;
        }

        return false;
    }
}