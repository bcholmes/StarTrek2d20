import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import InstructionText from '../components/instructionText';

export class CadetSeniorityPage extends React.Component<{}, {}> {

    render() {
        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />

                <InstructionText text={["Are you a junior or senior cadet?"]} />
                <div className="button-container">
                    <Button className="button" text="Junior" onClick={() => { this.goToFinishingTouches(); } } />
                    <Button className="button" text="Senior" onClick={() => { this.goToPage(PageIdentity.CareerEvent1); } } />
                </div>
            </div>
        );
    }

    private goToFinishingTouches() {
        character.workflow.next();
        Navigation.navigateToPage(character.workflow.currentStep().page);
    }

    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}
