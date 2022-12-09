import React from "react";
import { navigateTo } from "../common/navigator";
import { PageIdentity } from "../pages/pageIdentity";
import AppVersion from "./appVersion";
import { CharacterSheet } from "./characterSheet";
import History, { HistoryType } from "./history";
import News from "./news";
import { PageHeader } from "./pageHeader";
import { RandomLcarsReadout } from "./randomLcarsReadout";

interface ILcarsFrameState {
    showNews: boolean;
    showHistory: boolean;
    showProfile: boolean;
}

interface ILcarsFrameProperties {
    activePage: PageIdentity;
}

export class LcarsFrame extends React.Component<ILcarsFrameProperties,ILcarsFrameState> {

    constructor(props) {
        super(props);
        this.state = {
            showNews: false,
            showHistory: false,
            showProfile: false
        };
    }

    render() {
        return [
            <div className="lcar-container" key="main-container">
                <div className="lcar-header">
                    <div className="lcar-header-start"><a href="index.html"><img src="./static/img/logo.png" className="logo" alt="Star Trek Adventures Logo"/></a></div>
                    <div></div>
                    <div className="lcar-header-middle"></div>
                    <PageHeader page={this.props.activePage} />
                    <div className="lcar-header-end"></div>
                </div>
                <div className="lcar-content">
                    <div className="lcar-content-start">
                        <div className="lcar-content-start-top"></div>
                        <div className="lcar-content-action">
                            <div id="history-button" className="lcar-content-history" onClick={ () => this.toggleHistory() }>History</div>
                            <div id="history-container" className="history-container-hidden">
                                <History showHistory={this.state.showHistory} type={this.isStarshipPage() ? HistoryType.Starship : HistoryType.Character} />
                            </div>
                        </div>
                        <div className="lcar-content-action">
                            <div id="profile-button" className={'lcar-content-profile ' + (this.isProfileSupportedForPage() ? '' : 'd-none')} onClick={ () => this.toggleProfile() }>Profile</div>
                            <CharacterSheet showProfile={this.state.showProfile}/>
                        </div>
                        <div className="lcar-content-feedback" onClick={ () => this.showFeedbackPage() }>Feedback</div>
                        <div className="lcar-content-news" onClick={() => this.showNews()}>
                            <div id="news-button" className="lcar-news">News</div>
                        </div>
                        <div></div>
                    </div>
                    <div className="lcar-content-round"></div>
                    {this.props.children}
                </div>
                <div className="lcar-footer">
                    <div className="lcar-footer-start"></div>
                    <div className="lcar-footer-end"><RandomLcarsReadout page={this.props.activePage} /></div>
                </div>
                <div className="row">
                    <div className="col-md-8 offset-md-2 text-primary text-center">
                        TM &amp; &copy; 2022 CBS Studios Inc. STAR TREK and related marks and logos are trademarks of CBS Studios Inc. All Rights Reserved.
                    </div>
                    <div className="col-md-2 text-right pr-4">
                        <a href="./index.html" className="text-primary" onClick={(e) => navigateTo(e, PageIdentity.CreditsPage)} style={{ paddingRight: "10px"}}>About</a>
                    </div>
                </div>
            </div>,
            <AppVersion key="app-version"/>,
            <div id="dialog" key="modal-dialog"></div>,
            <News showModal={this.state.showNews} onClose={() => {this.hideNews()}} key="news"/>
        ];
    }

    isStarshipPage() {
        if (this.props.activePage === PageIdentity.SmallCraftStats ||
            this.props.activePage === PageIdentity.MissionPodSelection ||
            this.props.activePage === PageIdentity.MissionProfileSelection ||
            this.props.activePage === PageIdentity.MissionProfileTalentSelection ||
            this.props.activePage === PageIdentity.SpaceframeOption ||
            this.props.activePage === PageIdentity.SpaceframeSelection ||
            this.props.activePage === PageIdentity.Starship ||
            this.props.activePage === PageIdentity.StarshipRefits ||
            this.props.activePage === PageIdentity.StarshipToolSelection ||
            this.props.activePage === PageIdentity.StarshipTypeSelection ||
            this.props.activePage === PageIdentity.StarshipWeaponsSelection ||
            this.props.activePage === PageIdentity.StarshipTalentSelection ||
            this.props.activePage === PageIdentity.FinalStarshipDetails ||
            this.props.activePage === PageIdentity.SimpleStarship) {
            return true;
        } else {
            return false;
        }
    }

    isProfileSupportedForPage() {
        if (this.props.activePage === PageIdentity.ViewSheet ||
            this.props.activePage === PageIdentity.SystemGeneration ||
            this.props.activePage === PageIdentity.SectorDetails ||
            this.props.activePage === PageIdentity.StarSystemDetails ||
            this.isStarshipPage()) {
            return false;
        } else {
            return true;
        }
    }

    showFeedbackPage() {
        window.open("https://github.com/bcholmes/StarTrek2d20/discussions", "_blank");
    }

    toggleHistory() {
        this.setState({
            ...this.state,
            showHistory: !this.state.showHistory
        })
    }

    toggleProfile() {
        this.setState({
            ...this.state,
            showProfile: !this.state.showProfile
        })
    }

    showNews() {
        this.setState({
            ...this.state,
            showNews: true
        })
    }

    hideNews() {
        this.setState({
            ...this.state,
            showNews: false
        })
    }

}