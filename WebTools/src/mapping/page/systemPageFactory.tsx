import { IPageFactoryRegistry } from "../../pages/pageFactory";
import { PageIdentity } from "../../pages/pageIdentity";
import SectorDetailsPage from "./sectorDetailsPage";
import StarSystemDetailsPage from "./starSystemDetailsPage";
import { SystemGenerationPage } from "./systemGenerationPage";

export class SystemPageFactory implements IPageFactoryRegistry {

    private static _instance;

    static get instance() {
        if (SystemPageFactory._instance == null) {
            SystemPageFactory._instance = new SystemPageFactory();
        }
        return SystemPageFactory._instance;
    }

    private factories = {};

    constructor() {
        this.factories = {};

        this.factories[PageIdentity.SystemGeneration] = () => <SystemGenerationPage />;
        this.factories[PageIdentity.SectorDetails] = () => <SectorDetailsPage />;
        this.factories[PageIdentity.StarSystemDetails] = () => <StarSystemDetailsPage />;
    }

    findFactory(page: PageIdentity) {
        return this.factories[page];
    }
}