import React from 'react';
import EraSelectionPage from './eraSelectionPage';
import ToolSelectionPage from './toolSelectionPage';
import SpeciesPage from './speciesPage';
import SpeciesDetailsPage from './speciesDetailsPage';
import EnvironmentPage from './environmentPage';
import EnvironmentDetailsPage from './environmentDetailsPage';
import EarlyOutlookPage from './earlyOutlookPage';
import EarlyOutlookDetailsPage from './earlyOutlookDetailsPage';
import EducationPage from './educationPage';
import EducationDetailsPage from './educationDetailsPage';
import CareerLengthPage from './careerLengthPage';
import CareerLengthDetailsPage from './careerLengthDetailsPage';
import CareerEventPage from './careerEventPage';
import CareerEventDetailsPage from './careerEventDetailsPage';
import AttributesAndDisciplinesPage from './attributesAndDisciplinesPage';
import FinishPage from './finishPage';
import SupportingCharacterPage from '../supportingcharacters/supportingCharacterPage';
import SelectionPage from './selectionPage';
import { PageIdentity } from './pageIdentity';
import CharacterTypePage from './characterTypePage';
import SimpleCareerPage from './simpleCareerPage';
import ChildEducationPage from './childEducationPage';
import ChildEducationDetailsPage from './childEducationDetailsPage';
import { CadetSeniorityPage } from './cadetSeniorityPage';
import SpeciesExtraDetailsPage from './speciesExtraDetailsPage';
import { Species } from '../helpers/speciesEnum';
import CustomSpeciesDetailsPage from './customSpeciesDetailsPage';
import ModificationTypeSelectionPage from '../modify/page/modificationTypeSelectionPage';
import ReputationChangePage from '../modify/page/reputationChangePage';
import ModificationCompletePage from '../modify/page/modificationCompletePage';
import PromotionPage from '../modify/page/promotionPage';
import MilestonePage from '../modify/page/milestonePage';
import { MilestoneType } from '../modify/model/milestoneType';
import SourceSelectionPage from './sourceSelectionPage';
import { StepContext } from '../state/characterActions';
import toast from 'react-hot-toast';
import ExtraTalentChoicesPage from './extraTalentChoicesPage';
import OtherToolsPage from './otherToolsPage';

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
        this.factories[PageIdentity.SourceSelection] = () => <SourceSelectionPage/>;
        this.factories[PageIdentity.Era] = () => <EraSelectionPage/>;
        this.factories[PageIdentity.ToolSelection] = () => <ToolSelectionPage/>;
        this.factories[PageIdentity.CharacterType] = () => <CharacterTypePage/>;
        this.factories[PageIdentity.Species] = () => <SpeciesPage/>;
        this.factories[PageIdentity.KobaliExtraSpeciesDetails] = () => <SpeciesExtraDetailsPage species={Species.Kobali} pageIdentity={PageIdentity.KobaliExtraSpeciesDetails} />;
        this.factories[PageIdentity.BorgSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.Borg}  pageIdentity={PageIdentity.BorgSpeciesExtraDetails}/>;
        this.factories[PageIdentity.LiberatedBorgSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.LiberatedBorg}  pageIdentity={PageIdentity.LiberatedBorgSpeciesExtraDetails}/>;
        this.factories[PageIdentity.CyberneticallyEnhancedSpeciesExtraDetails] = () => <SpeciesExtraDetailsPage species={Species.CyberneticallyEnhanced}  pageIdentity={PageIdentity.CyberneticallyEnhancedSpeciesExtraDetails}/>;
        this.factories[PageIdentity.SpeciesDetails] = () => <SpeciesDetailsPage/>;
        this.factories[PageIdentity.CustomSpeciesDetails] = () => <CustomSpeciesDetailsPage/>;
        this.factories[PageIdentity.Environment] = () => <EnvironmentPage/>;
        this.factories[PageIdentity.EnvironmentDetails] = () => <EnvironmentDetailsPage/>;
        this.factories[PageIdentity.Upbringing] = () => <EarlyOutlookPage/>;
        this.factories[PageIdentity.UpbringingDetails] = () => <EarlyOutlookDetailsPage/>;
        this.factories[PageIdentity.Education] = () => <EducationPage/>;
        this.factories[PageIdentity.EducationDetails] = () => <EducationDetailsPage/>;
        this.factories[PageIdentity.CareerLength] = () => <CareerLengthPage/>;
        this.factories[PageIdentity.CareerLengthDetails] = () => <CareerLengthDetailsPage/>;
        this.factories[PageIdentity.CareerEvent1] = () => <CareerEventPage context={StepContext.CareerEvent1}/>;
        this.factories[PageIdentity.CareerEvent1Details] = () => <CareerEventDetailsPage context={StepContext.CareerEvent1}/>;
        this.factories[PageIdentity.CareerEvent2] = () => <CareerEventPage context={StepContext.CareerEvent2}/>;
        this.factories[PageIdentity.CareerEvent2Details] = () => <CareerEventDetailsPage context={StepContext.CareerEvent2}/>;
        this.factories[PageIdentity.ChildCareer] = () => <SimpleCareerPage talent="Childhood Insight" nextPage={PageIdentity.AttributesAndDisciplines}/>;
        this.factories[PageIdentity.CadetCareer] = () => <SimpleCareerPage talent="Untapped Potential"  nextPage={PageIdentity.CadetSeniority} />;
        this.factories[PageIdentity.CadetSeniority] = () => <CadetSeniorityPage />;
        this.factories[PageIdentity.ChildEducationPage] = () => <ChildEducationPage/>;
        this.factories[PageIdentity.ChildEducationDetailsPage] = () => <ChildEducationDetailsPage/>;
        this.factories[PageIdentity.AttributesAndDisciplines] = () => <AttributesAndDisciplinesPage />;
        this.factories[PageIdentity.ExtraTalentDetails] = () => <ExtraTalentChoicesPage />;
        this.factories[PageIdentity.Finish] = () => <FinishPage/>;
        this.factories[PageIdentity.SupportingCharacter] = () => <SupportingCharacterPage />;
        this.factories[PageIdentity.ModificationTypeSelection] = () => <ModificationTypeSelectionPage />;
        this.factories[PageIdentity.ReputationChange] = () => <ReputationChangePage />;
        this.factories[PageIdentity.Promotion] = () => <PromotionPage />;
        this.factories[PageIdentity.NormalMilestone] = () => <MilestonePage milestoneType={MilestoneType.NormalMilestone} />;
        this.factories[PageIdentity.ModificationCompletePage] = () => <ModificationCompletePage />;
        this.factories[PageIdentity.OtherTools] = () => <OtherToolsPage />;
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

        return factory ? factory() : undefined;
    }

    async loadSystemGenerationFactory(completion: () => void = () => {}) {
        if (this.pageFactories["system"] == null) {
            import(/* webpackChunkName: 'sector' */'../mapping/page/systemPageFactory').then(({SystemPageFactory}) => {
                this.pageFactories["system"] = SystemPageFactory.instance;
                completion();
            }).catch((error) => toast("Ooops. Something bad happened", { className: 'bg-danger' }));
        } else {
            completion();
        }
    }


    loadStarshipFactory(completion: () => void = () => {}) {
        if (this.pageFactories["starship"] == null) {
            import(/* webpackChunkName: 'starship' */'../starship/page/starshipPageFactory').then(({StarshipPageFactory}) => {
                this.pageFactories["starship"] = StarshipPageFactory.instance;
                completion();
            }).catch((error) => toast("Ooops. Something bad happened", { className: 'bg-danger' }));
        } else {
            completion();
        }
    }

    loadNpcFactory(completion: () => void = () => {}) {
        if (this.pageFactories["npc"] == null) {
            import(/* webpackChunkName: 'npc' */ '../npc/page/npcPageFactory').then(({NpcPageFactory}) => {
                this.pageFactories["npc"] = NpcPageFactory.instance;
                completion();
            }).catch((error) => toast("Ooops. Something bad happened", { className: 'bg-danger' }));
        } else {
            completion();
        }
    }

    loadCaptainsLogFactory(completion: () => void = () => {}) {
        if (this.pageFactories["captainsLog"] == null) {
            import(/* webpackChunkName: 'captainsLog' */ '../solo/page/captainsLogPageFactory').then(({CaptainsLogPageFactory}) => {
                this.pageFactories["captainsLog"] = CaptainsLogPageFactory.instance;
                completion();
            }).catch((error) => toast("Ooops. Something bad happened", { className: 'bg-danger' }));
        } else {
            completion();
        }
    }
}