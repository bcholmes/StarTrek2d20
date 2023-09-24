import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import CharacterCreationApp from "./app";
import GMTrackerPage from './tracker/gmTrackerPage';
import { Provider } from "react-redux";
import store from './state/store';
import './i18n/config';
import ModificationFramePage from './modify/page/modificationFramePage';
import React, { Suspense } from 'react';
import LoadingPage from './pages/loadingPage';

const CreditsPage = React.lazy(() => import('./pages/creditsPage'));
const TalentsOverviewMainPage = React.lazy(() => import('./pages/talentsOverviewMainPage'));
const ViewSheetPage = React.lazy(() => import(/* webpackChunkName: 'view' */ './view/viewSheetPage'));
const TokenCreationPage = React.lazy(() => import(/* webpackChunkName: 'token' */ './token/tokenCreationPage'));

let root = createRoot(document.getElementById("mainBody"));
root.render(
    <Provider store={store}>
        <Router>
            <Suspense fallback={<LoadingPage />}>
                <Switch>
                    <Route path="/modify" component={ModificationFramePage} />
                    <Route path="/gmtracker" component={GMTrackerPage} />
                    <Route path="/talents" component={TalentsOverviewMainPage} />
                    <Route path="/view" component={ViewSheetPage} />
                    <Route path="/credits" component={CreditsPage} />
                    <Route path="/token" component={TokenCreationPage} />
                    <Route path="/" component={CharacterCreationApp} />
                </Switch>
            </Suspense>
        </Router>
    </Provider>
);