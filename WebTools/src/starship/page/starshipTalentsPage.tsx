import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import { TalentsHelper } from "../../helpers/talents";
import { nextStarshipWorkflowStep, removeAllStarshipTalentDetailSelection, setAdditionalTalents } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { StarshipTalentSelectionList } from "../view/starshipTalentSelection";
import { PageIdentity } from "../../pages/pageIdentity";
import { useTranslation } from "react-i18next";

interface ISimpleStarshipPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
}

const StarshipTalentsPage: React.FC<ISimpleStarshipPageProperties> = ({starship, workflow}) => {

    const { t } = useTranslation();

    const nextPage = () => {
        if (starship.freeTalentSlots > starship.additionalTalents.length) {
            Dialog.show("Please select " + starship.freeTalentSlots + ((starship.freeTalentSlots === 1) ? ' talent ' : ' talents ') + " before proceeding.");
        } else if (isExpandedMunitionsPresent()) {
            Navigation.navigateToPage(PageIdentity.ExpandedMunitionsWeaponsSelection);
        } else {
            store.dispatch(removeAllStarshipTalentDetailSelection());
            let step = workflow.peekNextStep();
            store.dispatch(nextStarshipWorkflowStep());
            Navigation.navigateToPage(step.page);
        }
    }

    const isExpandedMunitionsPresent = () => {
        return starship.hasNonSpaceframeTalent("Expanded Munitions");
    }

    return (<div className="page container ms-0">
        <ShipBuildingBreadcrumbs />
        <Header>{t('Page.title.starshipTalentSelection')}</Header>
        <p>Select {starship.freeTalentSlots} {(starship.freeTalentSlots === 1) ? ' talent ' : ' talents '} for your ship.</p>
        {starship.freeTalentSlots > 0
            ? (<StarshipTalentSelectionList
                points={starship.freeTalentSlots}
                talents={TalentsHelper.getStarshipTalents(starship)}
                construct={starship}
                onSelection={(talents) => store.dispatch(setAdditionalTalents(talents))} />)
            : null}
        <div className="text-end mt-3">
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

export default connect(mapStateToProps)(StarshipTalentsPage);