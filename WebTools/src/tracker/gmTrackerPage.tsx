import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from 'react-i18next';

import { Header } from "../components/header";
import LcarsFrame from "../components/lcarsFrame";
import { PageIdentity } from "../pages/pageIdentity";
import { Button } from "../components/button";
import { ModalControl } from "../components/modal";
import AddCharacterView from "./addCharacterView";
import { connect } from "react-redux";
import GmCharacterView from "./gmCharacterView";
import { CharacterWithTracking } from "./model/characterWithTracking";

interface IGMTrackerPageProperties extends WithTranslation {
    history: RouteComponentProps["history"];
    characters: CharacterWithTracking[];
}

class GMTrackerPage extends React.Component<IGMTrackerPageProperties, {}> {

    render() {
        const { t } = this.props;
        return (<LcarsFrame activePage={PageIdentity.GamemasterTrackerPage}>
                <div id="app">
                    <div className="container ml-0">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="index.html" onClick={(e) => this.goToHome(e) }>{t('Page.title.home')}</a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">{t('Page.title.gamemasterTrackerPage')}</li>
                            </ol>
                        </nav>
                        <Header>{t('GMTracker.title')}</Header>
                        <p>{t('GMTracker.instruction')}</p>

                        <div className="text-right">
                            <Button buttonType={true} className="btn btn-link btn-lg" onClick={() => this.showAddModal()}><i className="bi bi-plus-circle"></i></Button>
                        </div>

                        {this.props.characters.map((c, i) => <GmCharacterView tracking={c} key={'character-' + c.id}/>)}

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

    showAddModal() {
        const { t } = this.props;
        ModalControl.show("lg", () => this.closeModal(),
            (<AddCharacterView onDone={() => this.closeModal()} />),
            t('GMTracker.addCharacterModalTitle'));
    }

    closeModal() {
        ModalControl.hide();
    }
}

function mapStateToProps(state, ownProps) {
    return {
        characters: state.gmTracker.characters
    };
}

export default withTranslation()(connect(mapStateToProps)(withRouter(GMTrackerPage)));