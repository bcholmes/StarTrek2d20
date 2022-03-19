import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {Button} from '../components/button';
import {CareerEventSelection} from '../components/careerEventSelection';
import InstructionText from '../components/instructionText';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';

interface ICareerEventPageState {
    showSelection: boolean;
}

export class CareerEventPage extends React.Component<IPageProperties, ICareerEventPageState> {
    constructor(props: IPageProperties) {
        super(props);

        this.state = {
            showSelection: false
        };
    }

    render() {
        var content = !this.state.showSelection ?
            (
                <div>
                    <InstructionText text={character.workflow.currentStep().description} />
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
                <CharacterCreationBreadcrumbs />
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
