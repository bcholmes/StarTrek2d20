import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { PageIdentity } from "../pages/pageIdentity";
import AppVersion from "./appVersion";
import CharacterSheet from "./characterSheet";
import History, { HistoryType } from "./history";
import News from "./news";
import PageHeader from "./pageHeader";
import { RandomLcarsReadout } from "./randomLcarsReadout";
import { withTranslation, WithTranslation } from 'react-i18next';

interface ILcarsFrameState {
    showNews: boolean;
    showHistory: boolean;
    showProfile: boolean;
}

interface ILcarsFrameProperties extends WithTranslation {
    history: RouteComponentProps["history"];
    activePage: PageIdentity;
}

class LcarsFrame extends React.Component<ILcarsFrameProperties,ILcarsFrameState> {

    constructor(props) {
        super(props);
        this.state = {
            showNews: false,
            showHistory: false,
            showProfile: false
        };

        document.title = "STAR TREK ADVENTURES";
    }

    render() {
        const { t } = this.props;
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
                            <div id="history-button" className="lcar-content-history" onClick={ () => this.toggleHistory() }>{t('Lcars.history')}</div>
                            <div id="history-container" className="history-container-hidden">
                                <History showHistory={this.state.showHistory} type={this.isStarshipPage() ? HistoryType.Starship : HistoryType.Character}
                                    close={() => this.setState((state) => ({...state, showHistory: false }))} />
                            </div>
                        </div>
                        <div className="lcar-content-action">
                            <div id="profile-button" className={'lcar-content-profile ' + (this.isProfileSupportedForPage() ? '' : 'd-none')} onClick={ () => this.toggleProfile() }>{t('Lcars.profile')}</div>
                            <CharacterSheet showProfile={this.state.showProfile} close={() => this.setState((state) => ({...state, showProfile: false }))} isModify={this.isModifyPage()}/>
                        </div>
                        <div className="lcar-content-feedback" onClick={ () => this.showFeedbackPage() }>{t('Lcars.feedback')}</div>
                        <div className="lcar-content-news" onClick={() => this.showNews()}>
                            <div id="news-button" className="lcar-news">{t('Lcars.news')}</div>
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
                        TM &amp; &copy; 2023 CBS Studios Inc. {t('Lcars.copyright')}
                    </div>
                    <div className="col-md-2 text-right pr-4">
                        <a href="./index.html" className="text-primary" onClick={(e) => this.goToCredits(e)}>{t('Lcars.credits')}</a>
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

    isModifyPage() {
        return this.props.activePage === PageIdentity.ModificationTypeSelection ||
            this.props.activePage === PageIdentity.Promotion ||
            this.props.activePage === PageIdentity.ReputationChange ||
            this.props.activePage === PageIdentity.NormalMilestone ||
            this.props.activePage === PageIdentity.ModificationCompletePage;
    }

    isProfileSupportedForPage() {
        if (this.props.activePage === PageIdentity.ViewSheet ||
            this.props.activePage === PageIdentity.GamemasterTrackerPage ||
            this.props.activePage === PageIdentity.TalentsOverview ||
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
            showNews: false,
            showProfile: false,
            showHistory: !this.state.showHistory
        })
    }

    toggleProfile() {
        this.setState({
            ...this.state,
            showHistory: false,
            showNews: false,
            showProfile: !this.state.showProfile
        })
    }

    showNews() {
        this.setState({
            ...this.state,
            showHistory: false,
            showProfile: false,
            showNews: true
        })
    }

    hideNews() {
        this.setState({
            ...this.state,
            showNews: false
        })
    }

    goToCredits(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        e.stopPropagation();

        const { history } = this.props;
        history.push("/credits");
    }

}

export default withTranslation()(withRouter(LcarsFrame))