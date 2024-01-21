import React from "react";

import { Header } from "../components/header";
import LcarsFrame from "../components/lcarsFrame";
import { PageIdentity } from "../pages/pageIdentity";
import { Button } from "../components/button";
import { ModalControl } from "../components/modal";
import AddCharacterView from "./addCharacterView";
import { connect } from "react-redux";
import GmCharacterView from "./gmCharacterView";
import { CharacterWithTracking } from "./model/characterWithTracking";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface IGMTrackerPageProperties {
    characters: CharacterWithTracking[];
}

const GMTrackerPage: React.FC<IGMTrackerPageProperties> = ({characters}) => {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const goToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();

        navigate("/");
    }

    const showAddModal = () => {
        ModalControl.show("lg", () => closeModal(),
            (<AddCharacterView onDone={() => closeModal()} />),
            t('GMTracker.addCharacterModalTitle'));
    }

    const closeModal = () => {
        ModalControl.hide();
    }


    return (<LcarsFrame activePage={PageIdentity.GamemasterTrackerPage}>
            <div id="app">
                <div className="container ms-0">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html" onClick={(e) => goToHome(e) }>{t('Page.title.home')}</a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{t('Page.title.gamemasterTrackerPage')}</li>
                        </ol>
                    </nav>
                    <Header>{t('GMTracker.title')}</Header>
                    <p>{t('GMTracker.instruction')}</p>

                    <div className="text-end">
                        <Button buttonType={true} className="btn btn-link btn-lg" onClick={() => showAddModal()}><i className="bi bi-plus-circle"></i></Button>
                    </div>

                    {characters.map((c, i) => <GmCharacterView tracking={c} key={'character-' + c.id}/>)}

                </div>
            </div>
        </LcarsFrame>);
}

function mapStateToProps(state, ownProps) {
    return {
        characters: state.gmTracker.characters
    };
}

export default connect(mapStateToProps)(GMTrackerPage);