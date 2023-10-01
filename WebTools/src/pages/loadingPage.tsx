import React from "react";
import { PageIdentity } from "./pageIdentity";
import LcarsFrame from "../components/lcarsFrame";
import { AccessingView } from "../common/accessingView";

const CreditsPage = () => {

    return (
        <LcarsFrame activePage={PageIdentity.CreditsPage}>
            <div id="app">
                <div className="page container">
                    <AccessingView />
                </div>
            </div>
        </LcarsFrame>);
}

export default CreditsPage;