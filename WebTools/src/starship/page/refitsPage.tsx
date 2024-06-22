import React from "react";
import { connect } from "react-redux";
import { Navigation } from "../../common/navigator";
import { refitCalculator, Starship } from "../../common/starship";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Header } from "../../components/header";
import Refits from "../../components/refits";
import { System } from "../../helpers/systems";
import { addStarshipRefit, deleteStarshipRefit, nextStarshipWorkflowStep } from "../../state/starshipActions";
import store from "../../state/store";
import { ShipBuildWorkflow } from "../model/shipBuildWorkflow";
import ShipBuildingBreadcrumbs from "../view/shipBuildingBreadcrumbs";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface IRefitPageProperties {
    starship: Starship;
    workflow: ShipBuildWorkflow;
    refitCount: number;
}

const RefitPage: React.FC<IRefitPageProperties> = ({starship, refitCount, workflow}) => {

    const { t } = useTranslation();

    const addRefit = (system: System) => {
        store.dispatch(addStarshipRefit(system));
    }

    const removeRefit = (system: System) => {
        store.dispatch(deleteStarshipRefit(system));
    }

    const nextPage = () => {
        if (starship.refits.length !== starship.numberOfRefits) {
            Dialog.show("Please choose all refits.");
        } else {
            let step = workflow.peekNextStep();
            store.dispatch(nextStarshipWorkflowStep());
            Navigation.navigateToPage(step.page);
        }
    }


    return (<div className="page container ms-0">
        <ShipBuildingBreadcrumbs />
        <Header>{t('Construct.other.refits')}</Header>

        <ReactMarkdown>{t('StarshipRefits.instruction_one', {count: refitCount})}</ReactMarkdown>

        <Refits refits={starship.refits} points={refitCount} starship={starship}
                    onIncrease={(s) => { addRefit(s)} } onDecrease={(s) => { removeRefit(s); } }/>

        <div className="text-end">
            <Button onClick={() => nextPage()}>{t('Common.button.next')}</Button>
        </div>
    </div>);
}

function mapStateToProps(state, ownProps) {
    return {
        starship: state.starship.starship,
        refitCount: refitCalculator(state.starship.starship),
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(RefitPage);