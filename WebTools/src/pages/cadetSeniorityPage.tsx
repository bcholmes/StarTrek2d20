import * as React from 'react';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import InstructionText from '../components/instructionText';

export const CadetSeniorityPage = () => {

    const goToFinishingTouches = () => {
        Navigation.navigateToPage(PageIdentity.AttributesAndDisciplines);
    }

    const goToPage = (page: PageIdentity) => {
        Navigation.navigateToPage(page);
    }

    return (
        <div className="page">
            <CharacterCreationBreadcrumbs />

            <InstructionText text={["Are you a junior or senior cadet?"]} />
            <div className="button-column">
                <Button className="btn btn-primary mt-4" onClick={() => { goToFinishingTouches(); } } >Junior</Button>
                <Button className="btn btn-primary mt-4" onClick={() => { goToPage(PageIdentity.CareerEvent1); } }>Senior</Button>
            </div>
        </div>
    );
}
