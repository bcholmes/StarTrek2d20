import React from "react";
import {Helmet} from "react-helmet";
import LcarsFrame from "../components/lcarsFrame";
import { PageIdentity } from "./pageIdentity";
import TalentsOverviewPage from "./talentsOverviewPage";

class TalentsOverviewMainPage extends React.Component<{}, {}> {

    render() {
        return (<>
            <Helmet>
                <title>Talents Overview - STAR TREK ADVENTURES</title>
            </Helmet>
            <LcarsFrame activePage={PageIdentity.GamemasterTrackerPage}>
                <div id="app">
                    <TalentsOverviewPage />
                </div>
            </LcarsFrame>
        </>);
    }
}

export default TalentsOverviewMainPage;