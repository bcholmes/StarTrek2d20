import * as React from 'react';
import {character} from './common/character';
import { Events, EventIdentity } from './common/eventChannel';
import { PageFactory } from './pages/pageFactory';
import { PageIdentity } from './pages/pageIdentity';
import LcarsFrame from './components/lcarsFrame';

import './scss/main.scss';
import { SpeciesHelper } from './helpers/species';
import { Species } from './helpers/speciesEnum';

interface IAppState {
    activePage: PageIdentity;
}

export class CharacterCreationApp extends React.Component<{}, IAppState> {

    constructor(props) {
        super(props);

        this.state = {
            activePage: PageIdentity.Home
        };

        import('./npc/nameGenerator').then(({NameGenerator}) => { console.log(NameGenerator.instance.createName(SpeciesHelper.getSpeciesByType(Species.Human))); } );
    }

    componentDidMount() {

        Events.listen(EventIdentity.ShowPage, (page: any) => {
            this.activatePage(page as PageIdentity, false);
        });

        Events.listen(EventIdentity.HistoryBack, (page: any) => {
            this.activatePage(page as PageIdentity, true);
        });

        document.title = "STAR TREK ADVENTURES";
    }

    componentWillUnmount(): void {
        Events.removeAllListeners();
    }

    private activatePage(page: PageIdentity, isHistory: boolean) {
        document.getElementById("app")!.scrollTop = 0;

        if (page === this.state.activePage) {
            var pageComponent = document.getElementsByClassName('page')[0];
            pageComponent.classList.remove('page-out');
            return;
        }

        this.setState({
            ...this.state,
            activePage: page
        })

        if (!isHistory) {
            character.saveMemento(this.state.activePage);
        }
    }

    render() {
        const page = PageFactory.instance.createPage(this.state.activePage);

        return (<LcarsFrame activePage={this.state.activePage}>
                <div id="app">{page}</div>
            </LcarsFrame>);
    }

}

export default CharacterCreationApp;
