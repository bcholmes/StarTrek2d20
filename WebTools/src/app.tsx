import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Events, EventIdentity } from './common/eventChannel';
import {
  popPage,
  pushPage,
  workflowStepIndexForPage,
} from './common/pageHistory';
import { PageFactory } from './pages/pageFactory';
import { PageIdentity } from './pages/pageIdentity';
import { LcarsFrame } from './components/lcarsFrame';
import { PageHistoryProvider } from './components/pageHistoryContext';
import { rewindToStarshipWorkflowStep } from './state/starshipActions';
import { store } from './state/store';

import '@mdxeditor/editor/style.css';
import './scss/main.scss';

interface IAppState {
  activePage: PageIdentity;
  pageHistory: PageIdentity[];
}

export class CharacterCreationApp extends React.Component<{}, IAppState> {
  constructor(props) {
    super(props);

    this.state = {
      activePage: PageIdentity.Home,
      pageHistory: [],
    };
  }

  componentDidMount() {
    Events.listen(EventIdentity.ShowPage, (page: PageIdentity) => {
      this.goForward(page);
    });

    Events.listen(EventIdentity.HistoryBack, (page: PageIdentity) => {
      this.goForward(page);
    });

    document.title = 'STAR TREK ADVENTURES';
  }

  componentWillUnmount(): void {
    Events.removeAllListeners();
  }

  private goForward(page: PageIdentity) {
    if (
      page === this.state.activePage ||
      ([PageIdentity.CareerEvent1, PageIdentity.CareerEvent2].includes(page) &&
        [PageIdentity.CareerEvent1, PageIdentity.CareerEvent2].includes(
          this.state.activePage,
        ))
    ) {
      const pageComponent = document.getElementsByClassName('page')[0];
      pageComponent.classList.remove('page-out');
      if (page === this.state.activePage) {
        return;
      }
    }

    this.activatePage(
      page,
      pushPage(this.state.pageHistory, this.state.activePage, page),
    );
  }

  private goBack() {
    const previous = popPage(this.state.pageHistory);
    if (previous == null) {
      return;
    }

    this.activatePage(previous.page, previous.history, true);
  }

  private activatePage(
    page: PageIdentity,
    pageHistory: PageIdentity[],
    syncWorkflow: boolean = false,
  ) {
    document.getElementById('app')!.scrollTop = 0;

    this.setState({
      ...this.state,
      activePage: page,
      pageHistory,
    });

    if (syncWorkflow) {
      this.syncWorkflowStep(page);
    }
  }

  private syncWorkflowStep(page: PageIdentity) {
    const workflow = store.getState().starship?.workflow;
    const index = workflowStepIndexForPage(workflow, page);
    if (index != null) {
      store.dispatch(rewindToStarshipWorkflowStep(index));
    }
  }

  render() {
    const page = PageFactory.instance.createPage(this.state.activePage);

    return (
      <>
        <Helmet>
          <title>STAR TREK Adventures Character Creator</title>
          <meta
            property="og:title"
            content="The Star Trek Adventures Character Creator"
          />
          <meta
            property="og:description"
            content="A free application that you can use to create characters, ships, and tokens for Modiphius' Star Trek Adventures RPG (and the Captain's Log Solo RPG game)."
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/static/img/bannerImage.png" />
          <meta property="og:url" content="https://sta.bcholmes.org" />
        </Helmet>
        <PageHistoryProvider
          activePage={this.state.activePage}
          canGoBack={this.state.pageHistory.length > 0}
          onBack={() => this.goBack()}
        >
          <LcarsFrame
            activePage={this.state.activePage}
            canGoBack={this.state.pageHistory.length > 0}
            onBack={() => this.goBack()}
          >
            <div id="app">{page}</div>
          </LcarsFrame>
        </PageHistoryProvider>
      </>
    );
  }
}
