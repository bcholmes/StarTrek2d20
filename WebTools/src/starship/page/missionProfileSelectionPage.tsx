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
import { useTranslation } from 'react-i18next';
import { MissionProfileModel } from "../../helpers/missionProfiles";

interface IMissionProfileSelectionPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

const MissionProfileSelectionPage: React.FC<IMissionProfileSelectionPageProperties> = ({ starship }) => {

    const { t } = useTranslation();

    const onSelectProfile = (profile: MissionProfileModel) => {
        const system = profile.systems?.length === 1 ? profile.systems[0] : undefined;
        store.dispatch(setStarshipMissionProfile(profile, system));
    }

    const nextPage = () => {
        if (starship.missionProfileStep?.type == null) {
            Dialog.show(t('MissionProfileSelectionPage.errorNoSelection'));
        } else {
            Navigation.navigateToPage(PageIdentity.MissionProfileTalentSelection);
        }
    }

    return (<div className="page container ms-0">
        <ShipBuildingBreadcrumbs />
        <Header>{t('Page.title.missionProfileSelection')}</Header>
        <p>{t('MissionProfileSelectionPage.text')}
        </p>
        <MissionProfileSelection
            initialSelection={starship.missionProfileStep?.type}
            starship={starship}
            onSelection={(profile) => onSelectProfile(profile)} />
        <div className="text-end mt-4">
            <Button onClick={() => nextPage()}>Next</Button>
        </div>
    </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(MissionProfileSelectionPage);