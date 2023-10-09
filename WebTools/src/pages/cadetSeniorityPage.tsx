import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import InstructionText from '../components/instructionText';

export const CadetSeniorityPage = () => {

    const goToFinishingTouches = () => {
        character.workflow.next();
        Navigation.navigateToPage(character.workflow.currentStep().page);
    }

    const goToPage = (page: PageIdentity) => {
        Navigation.navigateToPage(page);
    }

    return (
        <div className="page">
            <CharacterCreationBreadcrumbs />

            <InstructionText text={["Are you a junior or senior cadet?"]} />
            <div className="button-container">
                <Button className="button" text="Junior" onClick={() => { goToFinishingTouches(); } } />
                <Button className="button" text="Senior" onClick={() => { goToPage(PageIdentity.CareerEvent1); } } />
            </div>
        </div>
    );
}
