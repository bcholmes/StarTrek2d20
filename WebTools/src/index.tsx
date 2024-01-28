import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CharacterCreationApp from "./app";
import GMTrackerPage from './tracker/gmTrackerPage';
import { Provider } from "react-redux";
import store from './state/store';
import './i18n/config';
import ModificationFramePage from './modify/page/modificationFramePage';
import React, { Suspense } from 'react';
import LoadingPage from './pages/loadingPage';
import { Toaster } from 'react-hot-toast';
import { PageIdentity } from './pages/pageIdentity';
import { PageFactory } from './pages/pageFactory';
import ImportTablePage from './table/page/importTablePage';

const CreditsPage = React.lazy(() => import('./pages/creditsPage'));
const TalentsOverviewMainPage = React.lazy(() => import('./pages/talentsOverviewMainPage'));
const ViewSheetPage = React.lazy(() => import(/* webpackChunkName: 'view' */ './view/viewSheetPage'));
const TokenCreationPage = React.lazy(() => import(/* webpackChunkName: 'token' */ './token/tokenCreationPage'));
const SectorContainerPage = React.lazy(async () => {
    await PageFactory.instance.loadSystemGenerationFactory();
    return import(/* webpackChunkName: 'sector' */ './mapping/page/sectorContainerPage');
});
const TableListPage = React.lazy(() => import(/* webpackChunkName: 'table' */ './table/page/tableListPage'));
const ViewTablePage = React.lazy(() => import(/* webpackChunkName: 'table' */ './table/page/viewTablePage'));

let root = createRoot(document.getElementById("mainBody"));
root.render(
    <Provider store={store}>
        <Router>
            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    <Route path="/modify" element={<ModificationFramePage />} />
                    <Route path="/gmtracker" element={<GMTrackerPage />} />
                    <Route path="/talents" element={<TalentsOverviewMainPage />} />
                    <Route path="/view" element={<ViewSheetPage />} />
                    <Route path="/credits" element={<CreditsPage />} />
                    <Route path="/systemGenerator" element={<SectorContainerPage activePage={PageIdentity.SystemGeneration} />} />
                    <Route path="/sectorDetails" element={<SectorContainerPage activePage={PageIdentity.SectorDetails} />} />
                    <Route path="/starSystemDetails" element={<SectorContainerPage activePage={PageIdentity.StarSystemDetails} />} />
                    <Route path="/token" element={<TokenCreationPage />} />
                    <Route path="/table/list" element={<TableListPage />} />
                    <Route path="/table/view" element={<ViewTablePage />} />
                    <Route path="/table/import" element={<ImportTablePage />} />
                    <Route path="*" element={<CharacterCreationApp />} />
                </Routes>
            </Suspense>
        </Router>
        <Toaster
            position="bottom-center"
            reverseOrder={false} />
    </Provider>
);