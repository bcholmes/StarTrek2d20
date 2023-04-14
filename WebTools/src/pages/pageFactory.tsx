import * as React from 'react';
import {character} from '../common/character';
import EraSelectionPage from './eraSelectionPage';
import ToolSelectionPage from './toolSelectionPage';
import SpeciesPage from './speciesPage';
import SpeciesDetailsPage from './speciesDetailsPage';
import EnvironmentPage from './environmentPage';
import EnvironmentDetailsPage from './environmentDetailsPage';
import {UpbringingPage} from './upbringingPage';
import {UpbringingDetailsPage} from './upbringingDetailsPage';
import {StarfleetAcademyPage} from './starfleetAcademyPage';
import {StarfleetAcademyDetailsPage} from './starfleetAcademyDetailsPage';
import CareerPage from './careerPage';
import CareerDetailsPage from './careerDetailsPage';
import {CareerEventPage} from './careerEventPage';
import {CareerEventDetailsPage} from './careerEventDetailsPage';
import {AttributesAndDisciplinesPage} from './attributesAndDisciplinesPage';
import FinishPage from './finishPage';
import SupportingCharacterPage from '../supportingcharacters/supportingCharacterPage';
import SelectionPage from './selectionPage';
import { BorgImplantSelection } from './borgImplantSelection';
import { PageIdentity } from './pageIdentity';
import CharacterTypePage from './characterTypePage';
import SimpleCareerPage from './simpleCareerPage';
import { ChildEducationPage } from './childEducationPage';
import { ChildEducationDetailsPage } from './childEducationDetailsPage';
import { CadetSeniorityPage } from './cadetSeniorityPage';
import SpeciesExtraDetailsPage from './speciesExtraDetailsPage';
import { Species } from '../helpers/speciesEnum';
import { ExtraFocusPage } from './extraFocusPage';
import CustomSpeciesDetailsPage from './customSpeciesDetailsPage';
import ModificationTypeSelectionPage from '../modify/page/modificationTypeSelectionPage';
import ReputationChangePage from '../modify/page/reputationChangePage';
import ModificationCompletePage from '../modify/page/modificationCompletePage';
import PromotionPage from '../modify/page/promotionPage';
import MilestonePage from '../modify/page/milestonePage';
import { MilestoneType } from '../modify/model/milestoneType';

export interface IPageFactoryRegistry {
    findFactory(page: PageIdentity);
}

export class PageFactory {

    private static _instance;

    static get instance() {
        if (PageFactory._instance == null) {
            PageFactory._instance = new PageFactory();
        }
        return PageFactory._instance;
    }

    private factories = {};
    private pageFactories = {};

    constructor() {
        this.factories = {};

        this.factories[PageIdentity.Home] = () => <SelectionPage />;
        this.factories[PageIdentity.Era] = () => <EraSelectionPage/>;
        this.factories[PageIdentity.ToolSelection] = () => <ToolSelectionPage/>;
        this.factories[PageIdentity.CharacterType] = () => <CharacterTypePage/>;
        this.factories[PageIdentity.Species] = () => <SpeciesPage/>;
        this.factories[PageIdentity.KobaliExtraSpeciesDetails] = () => <SpeciesExtraDetailsPage species={Species.Kobali} />;
        this.factories[PageIdentity.BorgSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.Borg} />;
        this.factories[PageIdentity.LiberatedBorgSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.LiberatedBorg} />;
        this.factories[PageIdentity.CyberneticallyEnhancedSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.CyberneticallyEnhanced} />;
        this.factories[PageIdentity.SpeciesDetails] = () => <SpeciesDetailsPage/>;
        this.factories[PageIdentity.CustomSpeciesDetails] = () => <CustomSpeciesDetailsPage/>;
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
        this.factories[PageIdentity.ExtraFocus] = () => <ExtraFocusPage />;
        this.factories[PageIdentity.Finish] = () => <FinishPage/>;
        this.factories[PageIdentity.SupportingCharacter] = () => <SupportingCharacterPage />;
        this.factories[PageIdentity.ModificationTypeSelection] = () => <ModificationTypeSelectionPage />;
        this.factories[PageIdentity.ReputationChange] = () => <ReputationChangePage />;
        this.factories[PageIdentity.Promotion] = () => <PromotionPage />;
        this.factories[PageIdentity.NormalMilestone] = () => <MilestonePage milestoneType={MilestoneType.NormalMilestone} />;
        this.factories[PageIdentity.ModificationCompletePage] = () => <ModificationCompletePage />;
    }

    createPage(page: PageIdentity) {
        let factory = this.factories[page];

        for (let key of Object.keys(this.pageFactories)) {
            let pageFactory = this.pageFactories[key];
            let temp = pageFactory.findFactory(page);
            if (temp != null) {
                factory = temp;
                break;
            }
        }

        if (!factory) {
            console.error(`Unable to find a page factory for ${PageIdentity[page]}`);
        }

        character.update();

        return factory ? factory() : undefined;
    }

    loadSystemGenerationFactory(completion: () => void = () => {}) {
        if (this.pageFactories["system"] == null) {
            import(/* webpackChunkName: 'sector' */'../mapping/page/systemPageFactory').then(({SystemPageFactory}) => {
                this.pageFactories["system"] = SystemPageFactory.instance;
                completion();
            });
        } else {
            completion();
        }
    }


    loadStarshipFactory(completion: () => void = () => {}) {
        if (this.pageFactories["starship"] == null) {
            import(/* webpackChunkName: 'starship' */'../starship/page/starshipPageFactory').then(({StarshipPageFactory}) => {
                this.pageFactories["starship"] = StarshipPageFactory.instance;
                completion();
            });
        } else {
            completion();
        }
    }

    loadNpcFactory(completion: () => void = () => {}) {
        if (this.pageFactories["npc"] == null) {
            import(/* webpackChunkName: 'npc' */ '../npc/page/npcPageFactory').then(({NpcPageFactory}) => {
                this.pageFactories["npc"] = NpcPageFactory.instance;
                completion();
            });
        } else {
            completion();
        }
    }

}