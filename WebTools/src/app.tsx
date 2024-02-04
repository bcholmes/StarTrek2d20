import React from 'react';
import {Helmet} from "react-helmet";
import { Events, EventIdentity } from './common/eventChannel';
import { PageFactory } from './pages/pageFactory';
import { PageIdentity } from './pages/pageIdentity';
import LcarsFrame from './components/lcarsFrame';

import './scss/main.scss';

interface IAppState {
    activePage: PageIdentity;
}

export class CharacterCreationApp extends React.Component<{}, IAppState> {

    constructor(props) {
        super(props);

        this.state = {
            activePage: PageIdentity.Home
        };
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
    }

    render() {
        const page = PageFactory.instance.createPage(this.state.activePage);

        return (<>
            <Helmet>
                <title>STAR TREK Adventures Character Creator</title>
                <meta property="og:title" content="The Star Trek Adventures Character Creator" />
                <meta property="og:description" content="A free application that you can use to create characters, ships, and tokens for Modiphius' Star Trek Adventures RPG (and the Captain's Log Solo RPG game)." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/static/img/bannerImage.png" />
                <meta property="og:url" content="https://sta.bcholmes.org" />
            </Helmet>
            <LcarsFrame activePage={this.state.activePage}>
                <div id="app">{page}</div>
            </LcarsFrame>
        </>);
    }

}

export default CharacterCreationApp;
