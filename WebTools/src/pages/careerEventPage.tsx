import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity, IPageProperties} from './pageFactory';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {CareerEventSelection} from '../components/careerEventSelection';

interface ICareerEventPageState {
    showSelection: boolean;
}

export class CareerEventPage extends React.Component<IPageProperties, ICareerEventPageState> {
    constructor(props: IPageProperties) {
        super(props);

        SetHeaderText(character.workflow.currentStep().name);

        this.state = {
            showSelection: false
        };
    }

    render() {
        var content = !this.state.showSelection ?
            (
                <div>
                    <div className="page-text">
                        Your career is a tapestry of events and experiences, but amongst this, a few will have been pivotal moments in your life. Define which moments of your life are important in retrospect, and what seemed definitive to an ensign in their early 20s may be inconsequential to that same officer decades later.
                        <br /><br />
                        Either select or roll a Career Event.
                    </div>
                    <div className="button-container">
                        <Button className="button" text="Select Career Event" onClick={() => this.showCareerEvent() } />
                        <Button className="button" text="Roll Career Event" onClick={() => this.rollCareerEvent() } />
                    </div>
                </div>
            )
            : (
                <div>
                    <CareerEventSelection
                        onSelection={(event) => this.selectCareerEvent(event) }
                        onCancel={() => this.hideCareerEvent() } />
                </div>
            );

        return (
            <div className="page">
                {content}
            </div>
        );
    }

    private rollCareerEvent() {
        var event = CareerEventsHelper.generateEvent();
        this.selectCareerEvent(event.roll);
    }

    private showCareerEvent() {
        this.setState({ showSelection: true });
    }

    private hideCareerEvent() {
        this.setState({ showSelection: false });
    }

    private selectCareerEvent(event: number) {
        character.careerEvents.push(event);
        CareerEventsHelper.applyCareerEvent(event);

        if (character.careerEvents.length === 1) {
            Navigation.navigateToPage(PageIdentity.CareerEvent1Details);
        }
        else {
            Navigation.navigateToPage(PageIdentity.CareerEvent2Details);
        }
    }
}
