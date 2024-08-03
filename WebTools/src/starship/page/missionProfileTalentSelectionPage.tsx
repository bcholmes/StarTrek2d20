import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import SingleTalentSelectionList from "../../components/singleTalentSelectionList";
import { TalentsHelper, TalentViewModel, ToViewModel } from "../../helpers/talents";
import { nextStarshipWorkflowStep, setStarshipMissionProfileTalent } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { ITalent } from "../../helpers/italent";

interface IMissionProfileTalentSelectionPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

const MissionProfileTalentSelectionPage: React.FC<IMissionProfileTalentSelectionPageProperties> = ({starship, workflow}) => {
    const { t } = useTranslation();

    const saveTalent = (talent: ITalent) => {
        if (talent) {
            let talentModel = TalentsHelper.getTalent(talent.name);
            store.dispatch(setStarshipMissionProfileTalent(talentModel));
        } else {
            store.dispatch(setStarshipMissionProfileTalent(undefined));
        }
    }

    const getTalents = () => {
        let talents: TalentViewModel[] = [];
        starship?.missionProfileModel?.talents?.forEach(t => {
            if (!t.isSourcePrerequisiteFulfilled(starship)) {
                // skip it
            } else if (!starship.spaceframeModel?.hasTalent(t.name)) {
                talents.push(ToViewModel(t, 1, starship?.type));
            } else if (t.maxRank > 1) {
                talents.push(ToViewModel(t, 2, starship?.type));
            }
        });
        return talents;
    }

    const nextPage = () => {
        if (starship.profileTalent == null) {
            Dialog.show("Please select a talent before proceeding.");
        } else {
            let step = workflow.peekNextStep();
            store.dispatch(nextStarshipWorkflowStep());
            Navigation.navigateToPage(step.page);
        }
    }

    return (<div className="page container ms-0">
        <ShipBuildingBreadcrumbs />
        <Header>{t('Page.title.missionProfileTalentSelection')}</Header>
        <ReactMarkdown>{t('MissionProfileTalentSelection.instruction')}</ReactMarkdown>
        <SingleTalentSelectionList
            talents={getTalents()}
            initialSelection={starship.profileTalent}
            construct={starship}
            onSelection={(talent) => saveTalent(talent)} />
        <div className="text-end mt-4">
            <Button onClick={() => nextPage()}>{t('Common.button.next')}</Button>
        </div>
    </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(MissionProfileTalentSelectionPage);