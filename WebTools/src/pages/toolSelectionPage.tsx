import * as React from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import {Source} from '../helpers/sources';
import {WorkflowsHelper} from '../helpers/workflows';

export class ToolSelectionPage extends React.Component<{}, {}> {

    render() {
        let additionalOptions = character.hasSource(Source.KlingonCore)
            ? <Button className="button" text="Klingon Warrior" onClick={() => { this.startKlingonCharacterWorkflow(); } } />
            : <div></div>;

        return (
            <div className="page">
                <div className="page-text">
                    What do you want to register?
                </div>
                <div className="button-container">
                    <Button className="button" text="Starfleet Personnel" onClick={() => { this.startStarfleetWorkflow(); } } />
                    <Button className="button" text="Starship" onClick={() => { this.goToPage(PageIdentity.Starship); } } />
                    <Button className="button" text="Supporting Character" onClick={() => { this.goToPage(PageIdentity.SupportingCharacter); } } />
                    {additionalOptions}
                </div>
            </div>
        );
    }

    private startKlingonCharacterWorkflow() {
        character.type = CharacterType.KlingonWarrior;
        character.workflow = WorkflowsHelper.klingonWarriorWorkflow;
        this.goToPage(PageIdentity.Species);
    }

    private startStarfleetWorkflow() {
        character.type = CharacterType.Starfleet;
        character.workflow = WorkflowsHelper.starfleetWorkflow;
        this.goToPage(PageIdentity.Species);
    }


    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}
