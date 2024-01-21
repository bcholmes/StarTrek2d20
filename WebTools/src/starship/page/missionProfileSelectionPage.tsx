import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { PageIdentity } from "../../pages/pageIdentity";
import { setStarshipMissionProfile } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import MissionProfileSelection from "../view/missionProfileSelection";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { withTranslation, WithTranslation } from 'react-i18next';

interface IMissionProfileSelectionPageProperties extends WithTranslation {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class MissionProfileSelectionPage extends React.Component<IMissionProfileSelectionPageProperties, {}> {
    render() {
        const { t } = this.props;
        return (<div className="page container ms-0">
            <ShipBuildingBreadcrumbs />
            <Header>{t('Page.title.missionProfileSelection')}</Header>
            <p>{t('MissionProfileSelectionPage.text')}
            </p>
            <MissionProfileSelection
                initialSelection={this.props.starship.missionProfileModel}
                starship={this.props.starship}
                onSelection={(profile) => store.dispatch(setStarshipMissionProfile(profile))} />
            <div className="text-end">
                <Button buttonType={true} onClick={() => this.nextPage()}>Next</Button>
            </div>
        </div>);
    }

    nextPage() {
        const { t } = this.props;
        if (this.props.starship.missionProfileModel == null) {
            Dialog.show(t('MissionProfileSelectionPage.errorNoSelection'));
        } else {
            Navigation.navigateToPage(PageIdentity.MissionProfileTalentSelection);
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default withTranslation()(connect(mapStateToProps)(MissionProfileSelectionPage));