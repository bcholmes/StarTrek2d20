import React from 'react';
import { connect } from 'react-redux';
import {Character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {Navigation} from '../common/navigator';
import {PageIdentity} from '../pages/pageIdentity';
import { ShipBuildWorkflow, ShipBuildWorkflowStep } from '../starship/model/shipBuildWorkflow';
import { rewindToStarshipWorkflowStep } from '../state/starshipActions';
import store from '../state/store';
import { withTranslation, WithTranslation } from 'react-i18next';
import { getPageTitle } from './pageHeader';

export enum HistoryType {
    Character, SoloCharacter, Starship
}


interface IHistoryProperties extends WithTranslation {
    showHistory: boolean;
    type: HistoryType;
    workflow: ShipBuildWorkflow;
    close: () => void;
}


class History extends React.Component<IHistoryProperties, {}> {

    renderHistoryByType() {
        if (this.props.type === HistoryType.Starship) {
            return this.renderStarshipHistory();
        } else if (this.props.type === HistoryType.SoloCharacter) {
            return this.renderSoloCharacterHistory();
        } else {
            return this.renderCharacterHistory();
        }
    }

    render() {

        return (<>
                <div className="sheet-bg" style={{ display: this.props.showHistory ? 'block' : "none" }} onClick={() => this.props.close()}></div>
                <div className={this.props.showHistory ? 'history history-visible' : 'history history-hidden'}>
                    {this.renderHistoryByType()}
                </div>
            </>);
    }


    renderCharacterHistory() {
        const { t } = this.props;
        let character = store.getState().character.currentCharacter as Character;
        if (character == null) {
            return (<div>{t('Lcars.noHistory')}</div>);
        } else {
            return (<>
                {character?.speciesStep ? this.renderPageTitleLink(PageIdentity.Species) : (<div>No history</div>)}
                {character?.environmentStep ? this.renderPageTitleLink(PageIdentity.Environment) : undefined}
                {character?.upbringingStep ? this.renderPageTitleLink(PageIdentity.Upbringing) : undefined}
                {character?.educationStep
                    ? (character.type === CharacterType.Child ? this.renderPageTitleLink(PageIdentity.ChildEducationPage) : this.renderPageTitleLink(PageIdentity.Career))
                    : undefined}
                {character?.careerStep != null ? this.renderPageTitleLink(PageIdentity.CareerLength) : undefined}
                {character?.careerEvents?.length > 0 ? this.renderPageTitleLink(PageIdentity.CareerEvent1) : undefined}
                {character?.careerEvents?.length > 1 ? this.renderPageTitleLink(PageIdentity.CareerEvent2) : undefined}
                {character?.finishingStep ? this.renderPageTitleLink(PageIdentity.AttributesAndDisciplines) : undefined}
            </>);
        }
    }

    renderPageTitleLink(page: PageIdentity) {
        let {t} = this.props;
        return (
            <div className="history-item" key={page as number} onClick={() => this.goToPage(page) }>
                {getPageTitle(t, page)}
            </div>
        );
    }

    renderSoloCharacterHistory() {
        let character = store.getState().character.currentCharacter as Character;
        return (<>
            {character?.speciesStep ? this.renderPageTitleLink(PageIdentity.SoloSpecies) : undefined}
            {character?.environmentStep ? this.renderPageTitleLink(PageIdentity.Environment) : undefined}
            {character?.upbringingStep ? this.renderPageTitleLink(PageIdentity.SoloEarlyOutlook) : undefined}
            {character?.educationStep ? this.renderPageTitleLink(PageIdentity.SoloEducationType) : undefined}
            {character?.careerStep != null ? this.renderPageTitleLink(PageIdentity.CareerLength) : undefined}
            {character?.careerEvents?.length > 0 ? this.renderPageTitleLink(PageIdentity.SoloCareerEvent1) : undefined}
            {character?.careerEvents?.length > 1 ? this.renderPageTitleLink(PageIdentity.SoloCareerEvent2) : undefined}
            {character?.finishingStep ? this.renderPageTitleLink(PageIdentity.SoloFinishingTouches) : undefined}
        </>);
    }

    renderStarshipHistory() {
        return (<>
            <div className="history-item" key='pre-0' onClick={() => this.goToPage(PageIdentity.Era)}>Era</div>
            <div className="history-item" key='pre-1' onClick={() => this.goToPage(PageIdentity.ToolSelection)}>Registry</div>
            {this.props.workflow?.steps.map((s, i) => {
                if (i < this.props.workflow.currentStepIndex) {
                    return (<div className="history-item" key={'ship-' + i} onClick={() => this.goToStep(s, i)}>{s.name}</div>);
                } else {
                    return undefined;
                }
            })}
        </>);
    }

    goToStep(step: ShipBuildWorkflowStep, stepNumber: number) {
        const history = document.getElementsByClassName("history")[0];
        history.classList.remove("history-visible");
        history.classList.add("history-hidden");

        this.props.close();
        store.dispatch(rewindToStarshipWorkflowStep(stepNumber));
        Navigation.navigateToPage(step.page);
    }


    private goToPage(page: PageIdentity) {
        const history = document.getElementsByClassName("history")[0];
        history.classList.remove("history-visible");
        history.classList.add("history-hidden");

        this.props.close();
        Navigation.navigateToHistoryPage(page);
    }

}

function mapStateToProps(state, ownProps) {
    return {
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(withTranslation()(History));