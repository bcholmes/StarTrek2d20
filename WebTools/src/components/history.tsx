import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from '../pages/pageIdentity';

interface IHistoryProperties {
    showHistory: boolean;
}


export class History extends React.Component<IHistoryProperties, {}> {

    render() {
        const pages = character.steps.length > 0
            ? character.steps.map((step, i) => {
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

            return (
                <div className={this.props.showHistory ? 'history history-visible' : 'history history-hidden'}>
                    {pages}
                </div>);
    }

    private goToPage(page: PageIdentity) {
        const history = document.getElementsByClassName("history")[0];
        history.classList.remove("history-visible");
        history.classList.add("history-hidden");

        character.goToStep(page);
        Navigation.navigateToHistoryPage(page);
    }

    private getPageName(page: PageIdentity) {
        switch (page) {
            case PageIdentity.Selection: return "Tool Selection";
            case PageIdentity.Era: return "Era";
            case PageIdentity.ToolSelecton: return "Registry";
            case PageIdentity.Species: return "Species";
            case PageIdentity.SpeciesDetails: return "Species Details";
            case PageIdentity.Environment: return "Environment";
            case PageIdentity.EnvironmentDetails: return "Environment Details";
            case PageIdentity.Upbringing: return "Upbringing";
            case PageIdentity.UpbringingDetails: return "Upbringing Details";
            case PageIdentity.StarfleetAcademy: return "Starfleet Academy";
            case PageIdentity.StarfleetAcademyDetails: return "Starfleet Academy Details";
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