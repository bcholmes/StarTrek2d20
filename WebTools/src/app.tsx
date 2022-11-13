import * as React from 'react';
import {character} from './common/character';
import { Events, EventIdentity } from './common/eventChannel';
import { PageFactory } from './pages/pageFactory';
import { PageIdentity } from './pages/pageIdentity';

import './scss/main.scss';
import { LcarsFrame } from './components/lcarsFrame';

interface IAppState {
    activePage: PageIdentity;
}

export class CharacterCreationApp extends React.Component<{}, IAppState> {

    private pageFactory: PageFactory;
    constructor(props) {
        super(props);

        let url = new URL(window.location.href);
        this.state = {
            activePage: url.pathname === "/view" ? PageIdentity.ViewSheet : PageIdentity.Selection
        };
        this.pageFactory = new PageFactory();
    }

    componentDidMount() {

        Events.listen(EventIdentity.ShowPage, (page: any) => {
            this.activatePage(page as PageIdentity, false);
        });

        Events.listen(EventIdentity.HistoryBack, (page: any) => {
            this.activatePage(page as PageIdentity, true);
        });
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
            character.saveStep(this.state.activePage);
        }
    }

    render() {
        const page = this.pageFactory.createPage(this.state.activePage);

        return (<LcarsFrame activePage={this.state.activePage}>
                <div id="app">{page}</div>
            </LcarsFrame>);
    }

}

export default CharacterCreationApp;
