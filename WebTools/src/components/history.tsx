import * as React from 'react';
import { connect } from 'react-redux';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {Navigation} from '../common/navigator';
import {PageIdentity} from '../pages/pageIdentity';
import { ShipBuildWorkflow, ShipBuildWorkflowStep } from '../starship/model/shipBuildWorkflow';
import { rewindToStarshipWorkflowStep } from '../state/starshipActions';
import store from '../state/store';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';

export enum HistoryType {
    Character, Starship
}


interface IHistoryProperties extends WithTranslation {
    showHistory: boolean;
    type: HistoryType;
    workflow: ShipBuildWorkflow;
    close: () => void;
}


class History extends React.Component<IHistoryProperties, {}> {

    render() {

        return (<>
                <div className="sheet-bg" style={{ display: this.props.showHistory ? 'block' : "none" }} onClick={() => this.props.close()}></div>
                <div className={this.props.showHistory ? 'history history-visible' : 'history history-hidden'}>
                    {this.props.type === HistoryType.Starship
                        ? this.renderStarshipHistory()
                        : this.renderCharacterHistory()}
                </div>
            </>);
    }


    renderCharacterHistory() {
        return character.mementos.length > 0
            ? character.mementos.map((step, i) => {
                const name = this.getPageName(step.page);
                if (name.length > 0) {
                    return (
                        <div className="history-item" key={i} onClick={() => this.goToPage(step.page) }>
                            {name}
                        </div>
                    );
                } else {
                    return undefined;
                }
            })
            : <div>No history.</div>;
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

        store.dispatch(rewindToStarshipWorkflowStep(stepNumber));
        Navigation.navigateToPage(step.page);
    }


    private goToPage(page: PageIdentity) {
        const history = document.getElementsByClassName("history")[0];
        history.classList.remove("history-visible");
        history.classList.add("history-hidden");

        character.goToStep(page);
        Navigation.navigateToHistoryPage(page);
    }

    private getPageName(page: PageIdentity) {
        const { t } = this.props;

        let key = makeKey('Page.title.', PageIdentity[page]);

        switch (page) {
            case PageIdentity.Home:
            case PageIdentity.Era:
            case PageIdentity.ToolSelection:
            case PageIdentity.CharacterType:
            case PageIdentity.CustomSpeciesDetails:
                return t(key);
            case PageIdentity.Species: return "Species";
            case PageIdentity.KobaliExtraSpeciesDetails: return "Species Extra Details";
            case PageIdentity.SpeciesDetails: return "Species Details";
            case PageIdentity.Environment: return "Environment";
            case PageIdentity.EnvironmentDetails: return "Environment Details";
            case PageIdentity.Upbringing: return character.type === CharacterType.KlingonWarrior ? "Caste" : "Upbringing";
            case PageIdentity.UpbringingDetails: return character.type === CharacterType.KlingonWarrior ? "Caste Details" : "Upbringing Details";
            case PageIdentity.ChildEducationPage: return "Education";
            case PageIdentity.ChildEducationDetailsPage: return "Education Details";
            case PageIdentity.StarfleetAcademy: return character.type === CharacterType.Starfleet ? "Starfleet Academy" : "Training";
            case PageIdentity.StarfleetAcademyDetails: return character.type === CharacterType.Starfleet ? "Starfleet Academy Details" : "Training Details";
            case PageIdentity.ChildCareer: return "Career";
            case PageIdentity.CadetCareer: return "Career";
            case PageIdentity.CadetSeniority: return "Cadet Seniority";
            case PageIdentity.Career: return "Career";
            case PageIdentity.CareerDetails: return "Career Details";
            case PageIdentity.CareerEvent1: return "Career Event 1";
            case PageIdentity.CareerEvent1Details: return "Career Event 1 Details";
            case PageIdentity.CareerEvent2: return "Career Event 2";
            case PageIdentity.CareerEvent2Details: return "Career Event 2 Details";
            case PageIdentity.AttributesAndDisciplines: return "Attributes & Disciplines";
            case PageIdentity.Finish: return "Finish";
        }

        return "";
    }
}

function mapStateToProps(state, ownProps) {
    return {
        workflow: state.starship.workflow
    };
}

export default connect(mapStateToProps)(withTranslation()(History));