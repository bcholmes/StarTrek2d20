import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Events, EventIdentity} from './common/eventChannel';
import {character} from './common/character';
import {PageIdentity} from './pages/pageFactory';
import {Page} from './pages/pageBase';
import {History} from './components/history';
import {sheet} from './components/characterSheet';

class Application {
    private _activePage: PageIdentity;

    constructor() {
        this._activePage = PageIdentity.Selection;
    }

    start() {
        this.initialize();
        this.render();
    }

    private initialize() {
        Events.listen(EventIdentity.ShowPage, (page: PageIdentity) => {
            this.activatePage(page, false);
        });

        Events.listen(EventIdentity.HistoryBack, (page: PageIdentity) => {
            this.activatePage(page, true);
        });
    }

    private activatePage(page: PageIdentity, isHistory: boolean) {
        document.getElementById("app").scrollTop = 0;

        if (page === this._activePage) {
            var pageComponent = document.getElementsByClassName('page')[0];
            pageComponent.classList.remove('page-out');
            return;
        }

        this._activePage = page;

        if (!isHistory) {
            character.saveStep(this._activePage);
        }

        sheet.mount();

        this.render();
    }

    private render() {
        ReactDOM.render(
            React.createElement(Page, {
                page: this._activePage
            }),
            document.getElementById("app")
        );

        ReactDOM.render(
            React.createElement(History),
            document.getElementById("history-container")
        );
    }
}

const app = new Application();
app.start();