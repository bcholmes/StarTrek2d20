import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { PageIdentity } from "./pageIdentity";
import { withTranslation, WithTranslation } from 'react-i18next';
import LcarsFrame from "../components/lcarsFrame";
import { AccessingView } from "../common/accessingView";

interface ICreditsPageProperties extends WithTranslation {
    history: RouteComponentProps["history"];
}

class CreditsPage extends React.Component<ICreditsPageProperties, {}> {

    render() {
        return (
            <LcarsFrame activePage={PageIdentity.CreditsPage}>
                <div id="app">
                    <div className="page container ml-0">
                        <AccessingView />
                    </div>
                </div>
            </LcarsFrame>);
    }

    goToHome(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        const { history } = this.props;
        history.push("/");
    }
}

export default withTranslation()(withRouter(CreditsPage));