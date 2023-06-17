import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { PageIdentity } from "../../pages/pageIdentity";
import { nextStarshipWorkflowStep, setStarshipSpaceframe } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import SpaceframeSelection from "../view/spaceframeSelection";
import { withTranslation, WithTranslation } from 'react-i18next';
import InstructionText from "../../components/instructionText";

interface ISpaceframeSelectionPageProperties extends WithTranslation {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

class SpaceframeSelectionPage extends React.Component<ISpaceframeSelectionPageProperties, {}> {
    render() {
        const { t } = this.props;
        return (<div className="page container ml-0">
            <ShipBuildingBreadcrumbs />
            <Header>{t('Page.title.spaceframeSelection')}</Header>
            <InstructionText text={t('SpaceframeSelectionPage.text')} />
            <SpaceframeSelection
                initialSelection={this.props.starship.spaceframeModel}
                starship={this.props.starship}
                serviceYear={this.props.starship.serviceYear}
                type={this.props.starship.type}
                onSelection={(spaceframe) => store.dispatch(setStarshipSpaceframe(spaceframe))} />
            <div className="text-right">
                <Button buttonType={true} onClick={() => this.nextPage()}>{t('Common.button.next')}</Button>
            </div>
        </div>);
    }

    nextPage() {
        if (this.props.starship.spaceframeModel == null) {
            Dialog.show("Please select a spaceframe before proceeding.");
        } else if (this.props.starship.spaceframeModel.isMissionPodAvailable) {
            Navigation.navigateToPage(PageIdentity.MissionPodSelection);
        } else {
            let step = this.props.workflow.peekNextStep();
            store.dispatch(nextStarshipWorkflowStep());
            Navigation.navigateToPage(step.page);
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default withTranslation()(connect(mapStateToProps)(SpaceframeSelectionPage));