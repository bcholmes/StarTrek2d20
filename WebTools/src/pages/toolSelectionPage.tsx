import * as React from 'react';
import {character} from '../common/character';
import { CharacterType } from '../common/characterType';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {Button} from '../components/button';
import {Source} from '../helpers/sources';
import {WorkflowsHelper} from '../helpers/workflows';
import { context } from '../common/context';

export class ToolSelectionPage extends React.Component<{}, {}> {

    render() {
        return (
            <div className="page">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Character/Starship Creation</li>
                    </ol>
                </nav>

                <div className="page-text">
                    What do you want to register?
                </div>
                <div className="button-container">
                    <Button className="button" text="Main Character" onClick={() => { this.startStarfleetWorkflow(); } } />
                    <Button className="button" text="Supporting Character" onClick={() => { this.goToPage(PageIdentity.SupportingCharacter); } } />
                    <Button className="button" text="Starship" onClick={() => { this.goToPage(PageIdentity.Starship); } } />
                    {this.renderSystemGenerationButton()}
                </div>
            </div>
        );
    }

    renderSystemGenerationButton() {
        if (context.hasSource(Source.ShackletonExpanse)) {
            return (<Button className="button" text="Star System" onClick={() => { this.goToPage(PageIdentity.SystemGeneration); } } />);
        } else {
            return undefined;
        }
    }

    private startStarfleetWorkflow() {
        if (context.hasSource(Source.KlingonCore) || context.hasSource(Source.PlayersGuide)) {
            this.goToPage(PageIdentity.CharacterType);
        } else {
            character.type = CharacterType.Starfleet;
            character.workflow = WorkflowsHelper.starfleetWorkflow;
            this.goToPage(PageIdentity.Species);
        }
    }


    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}
