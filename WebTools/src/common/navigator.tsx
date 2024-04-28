import { PageIdentity } from '../pages/pageIdentity';
import { Events, EventIdentity } from './eventChannel';

export class Navigator {

    navigateToPage(pageId: PageIdentity) {
        var page = document.getElementsByClassName('page')[0];
        page.classList.add('page-out');

        setTimeout(() => {
            Events.signal(EventIdentity.ShowPage, pageId);
        },
        400);
    }

    navigateToHistoryPage(pageId: PageIdentity) {
        var page = document.getElementsByClassName('page')[0];
        page.classList.add('page-out');

        setTimeout(() => {
            Events.signal(EventIdentity.HistoryBack, pageId);
        },
        400);
    }
}

export const Navigation = new Navigator();

export const preventDefaultAnchorEvent = (event: React.MouseEvent<HTMLAnchorElement>, completion: () => void = () => {}) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    completion();
}

export function navigateTo(event: React.MouseEvent<HTMLAnchorElement>, page: PageIdentity) {
    preventDefaultAnchorEvent(event, () => Navigation.navigateToPage(page));
}