import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { CharacterCreationApp } from './app';
import { Provider } from 'react-redux';
import { store } from './state/store';
import './i18n/config';
import React, { Suspense } from 'react';
import { LoadingPage } from './pages/loadingPage';
import { Toaster } from 'react-hot-toast';
import { ImportTablePage } from './table/page/importTablePage';
import { OtherToolsPage } from './pages/otherToolsPage';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

const CreditsPage = React.lazy(() =>
  import('./pages/creditsPage').then((m) => ({ default: m.CreditsPage })),
);
const TalentsOverviewMainPage = React.lazy(() =>
  import('./pages/talentsOverviewMainPage').then((m) => ({
    default: m.TalentsOverviewMainPage,
  })),
);
const ViewSheetPage = React.lazy(() =>
  import(/* webpackChunkName: 'view' */ './view/viewSheetPage').then((m) => ({
    default: m.ViewSheetPage,
  })),
);
const TokenCreationPage = React.lazy(() =>
  import(/* webpackChunkName: 'token' */ './token/tokenCreationPage').then(
    (m) => ({ default: m.TokenCreationPage }),
  ),
);
const TableListPage = React.lazy(() =>
  import(/* webpackChunkName: 'table' */ './table/page/tableListPage').then(
    (m) => ({ default: m.TableListPage }),
  ),
);
const ViewTablePage = React.lazy(() =>
  import(/* webpackChunkName: 'table' */ './table/page/viewTablePage').then(
    (m) => ({ default: m.ViewTablePage }),
  ),
);
const EditTablePage = React.lazy(() =>
  import(/* webpackChunkName: 'table' */ './table/page/editTablePage').then(
    (m) => ({ default: m.EditTablePage }),
  ),
);
const SafetyChecklistPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'safety' */ './safety/page/safetyChecklistPage'
  ).then((m) => ({ default: m.SafetyChecklistPage })),
);
const RandomStarshipPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'starship' */ './starship/page/randomStarshipPage'
  ).then((m) => ({ default: m.RandomStarshipPage })),
);
const RandomCreaturePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'npc' */ './creature/page/randomCreatureConfigurationPage'
  ).then((m) => ({ default: m.RandomCreatureConfigurationPage })),
);
const TacticalAssetsPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'statc' */ './asset/page/tacticalAssetsPage'
  ).then((m) => ({ default: m.TacticalAssetsPage })),
);
const ModifySupportCharacterPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'modify' */ './supportingcharacters/modify/modifySupportCharacterPage'
  ).then((m) => ({ default: m.ModifySupportingCharacterPage })),
);
const ModifyCharacterPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'modify' */ './modify/page/modifyMainCharacterPage'
  ).then((m) => ({ default: m.ModifyMainCharacterPage })),
);
const ModifyStarshipPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'modify' */ './modify/page/modifyStarshipPage'
  ).then((m) => ({ default: m.ModifyStarshipPage })),
);
const SwapMissionPodPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'modify' */ './modify/page/swapMissionPodPage'
  ).then((m) => ({ default: m.SwapMissionPodPage })),
);
const NpcBuilderPage = React.lazy(() =>
  import(/* webpackChunkName: 'npc' */ './npc/page/npcBuilderPage').then(
    (m) => ({ default: m.NpcBuilderPage }),
  ),
);
const NpcSpeciesSelectionPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'npc' */ './npc/page/npcSpeciesSelectionPage'
  ).then((m) => ({ default: m.NpcSpeciesSelectionPage })),
);
const NpcSpeciesDetailsPage = React.lazy(() =>
  import(/* webpackChunkName: 'npc' */ './npc/page/npcSpeciesDetailsPage').then(
    (m) => ({ default: m.NpcSpeciesDetailsPage }),
  ),
);
const NpcStatsPage = React.lazy(() =>
  import(/* webpackChunkName: 'npc' */ './npc/page/npcStatsPage').then((m) => ({
    default: m.NpcStatsPage,
  })),
);
const NpcSpecialRulesPage = React.lazy(() =>
  import(/* webpackChunkName: 'npc' */ './npc/page/npcSpecialRulesPage').then(
    (m) => ({ default: m.NpcSpecialRulesPage }),
  ),
);
const NpcFinalPage = React.lazy(() =>
  import(/* webpackChunkName: 'npc' */ './npc/page/npcFinalPage').then((m) => ({
    default: m.NpcFinalPage,
  })),
);
const GMTrackerPage = React.lazy(() =>
  import(/* webpackChunkName: 'tracker' */ './tracker/gmTrackerPage').then(
    (m) => ({ default: m.GMTrackerPage }),
  ),
);
const SystemGenerationPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'sector' */ './mapping/page/systemGenerationPage'
  ).then((m) => ({ default: m.SystemGenerationPage })),
);
const SectorDetailsPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'sector' */ './mapping/page/sectorDetailsPage'
  ).then((m) => ({ default: m.SectorDetailsPage })),
);
const StarSystemDetailsPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'sector' */ './mapping/page/starSystemDetailsPage'
  ).then((m) => ({ default: m.StarSystemDetailsPage })),
);
const StationIndexPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'starship' */ './station/page/stationIndexPage'
  ).then((m) => ({ default: m.StationIndexPage })),
);
const StationSpaceframePage = React.lazy(() =>
  import(
    /* webpackChunkName: 'starship' */ './station/page/stationSpaceframePage'
  ).then((m) => ({ default: m.StationSpaceframePage })),
);
const StationMissionProfileSelectionPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'starship' */ './station/page/stationMissionProfileSelectionPage'
  ).then((m) => ({ default: m.StationMissionProfileSelectionPage })),
);
const StationWeaponsPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'starship' */ './station/page/stationWeaponsPage'
  ).then((m) => ({ default: m.StationWeaponsPage })),
);
const StationFinalPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'starship' */ './station/page/stationFinalPage'
  ).then((m) => ({ default: m.StationFinalPage })),
);
const StationTalentsPage = React.lazy(() =>
  import(
    /* webpackChunkName: 'starship' */ './station/page/stationTalentsPage'
  ).then((m) => ({ default: m.StationTalentsPage })),
);

const root = createRoot(document.getElementById('mainBody'));
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <Router>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/modify/main" element={<ModifyCharacterPage />} />
            <Route path="/modify/starship" element={<ModifyStarshipPage />} />
            <Route
              path="/modify/starship/pod"
              element={<SwapMissionPodPage />}
            />
            <Route
              path="/modify/supporting"
              element={<ModifySupportCharacterPage />}
            />
            <Route path="/talents" element={<TalentsOverviewMainPage />} />
            <Route path="/view" element={<ViewSheetPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/npc" element={<NpcBuilderPage />} />
            <Route path="/npc/species" element={<NpcSpeciesSelectionPage />} />
            <Route
              path="/npc/species/details"
              element={<NpcSpeciesDetailsPage />}
            />
            <Route path="/npc/stats" element={<NpcStatsPage />} />
            <Route path="/npc/specialrules" element={<NpcSpecialRulesPage />} />
            <Route path="/npc/final" element={<NpcFinalPage />} />
            <Route
              path="/tools/sector/generator"
              element={<SystemGenerationPage />}
            />
            <Route
              path="/tools/sector/details"
              element={<SectorDetailsPage />}
            />
            <Route
              path="/tools/sector/starSystem"
              element={<StarSystemDetailsPage />}
            />
            <Route path="/starship/generate" element={<RandomStarshipPage />} />
            <Route path="/station" element={<StationIndexPage />} />
            <Route path="/station/frame" element={<StationSpaceframePage />} />
            <Route
              path="/station/profile"
              element={<StationMissionProfileSelectionPage />}
            />
            <Route path="/station/weapons" element={<StationWeaponsPage />} />
            <Route path="/station/talents" element={<StationTalentsPage />} />
            <Route path="/station/final" element={<StationFinalPage />} />
            <Route path="/random/creature" element={<RandomCreaturePage />} />
            <Route path="/tactical" element={<TacticalAssetsPage />} />
            <Route path="/tools" element={<OtherToolsPage />} />
            <Route path="/tools/safety" element={<SafetyChecklistPage />} />
            <Route path="/token" element={<TokenCreationPage />} />
            <Route path="/tools/table" element={<TableListPage />} />
            <Route path="/tools/table/view" element={<ViewTablePage />} />
            <Route path="/tools/table/edit" element={<EditTablePage />} />
            <Route path="/tools/table/import" element={<ImportTablePage />} />
            <Route path="/tools/gmtracker" element={<GMTrackerPage />} />
            <Route path="*" element={<CharacterCreationApp />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </Provider>
  </HelmetProvider>,
);
