import { IPageFactoryRegistry } from "../../pages/pageFactory";
import { PageIdentity } from "../../pages/pageIdentity";
import NpcConfigurationPage from "./npcConfigurationPage";

export class NpcPageFactory implements IPageFactoryRegistry {

    private static _instance;

    static get instance() {
        if (NpcPageFactory._instance == null) {
            NpcPageFactory._instance = new NpcPageFactory();
        }
        return NpcPageFactory._instance;
    }

    private factories = {};

    constructor() {
        this.factories = {};

        this.factories[PageIdentity.NpcConfiguration] = () => <NpcConfigurationPage/>;
    }

    findFactory(page: PageIdentity) {
        return this.factories[page];
    }
}