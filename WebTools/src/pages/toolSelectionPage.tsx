import * as React from 'react';
import {character, CharacterType} from '../common/character';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity} from './pageFactory';
import {Button} from '../components/button';
import {Era} from '../helpers/eras';
import {Source} from '../helpers/sources';
import {Species, SpeciesHelper} from '../helpers/species';
import {WorkflowsHelper} from '../helpers/workflows';

export class ToolSelectionPage extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);

        SetHeaderText("REGISTRY");
    }

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
