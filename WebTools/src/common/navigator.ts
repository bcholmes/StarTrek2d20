import { PageIdentity } from '../pages/pageFactory';
import { Events, EventIdentity } from './eventChannel';
import { character } from './character';

export class Navigator {
    constructor() {
    }

    navigateToPage(pageId: PageIdentity) {
        var page = document.getElementsByClassName('page')[0];
        page.classList.add('page-out');

        setTimeout(() => {
            character.update();
            Events.signal(EventIdentity.ShowPage, pageId);
        },
        400);
    }

    navigateToHistoryPage(pageId: PageIdentity) {
        var page = document.getElementsByClassName('page')[0];
        page.classList.add('page-out');

        setTimeout(() => {
            character.update();
            Events.signal(EventIdentity.HistoryBack, pageId);
        },
        400);
    }
}

export const Navigation = new Navigator();