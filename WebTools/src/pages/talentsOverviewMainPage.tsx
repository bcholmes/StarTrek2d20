import React from "react";
import LcarsFrame from "../components/lcarsFrame";
import { PageIdentity } from "./pageIdentity";
import TalentsOverviewPage from "./talentsOverviewPage";

class TalentsOverviewMainPage extends React.Component<{}, {}> {

    render() {
        return (<LcarsFrame activePage={PageIdentity.GamemasterTrackerPage}>
                <div id="app">
                    <TalentsOverviewPage />
                </div>
            </LcarsFrame>);
    }
}

export default TalentsOverviewMainPage;