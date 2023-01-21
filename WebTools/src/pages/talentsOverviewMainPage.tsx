import React from "react";
import LcarsFrame from "../components/lcarsFrame";
import { PageIdentity } from "./pageIdentity";
import TalentsOverviewPage from "./talentsOverviewPage";

class TalentsOverviewMainPage extends React.Component<{}, {}> {

    componentDidMount() {
        document.title = "Talents Overview - STAR TREK ADVENTURES";
    }

    render() {
        return (<LcarsFrame activePage={PageIdentity.GamemasterTrackerPage}>
                <div id="app">
                    <TalentsOverviewPage />
                </div>
            </LcarsFrame>);
    }
}

export default TalentsOverviewMainPage;