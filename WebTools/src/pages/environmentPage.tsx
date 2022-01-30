import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Environment, EnvironmentsHelper} from '../helpers/environments';
import {Button} from '../components/button';
import {EnvironmentSelection} from '../components/environmentSelection';
import InstructionText from '../components/instructionText';
import { Source } from '../helpers/sources';

interface IEnvironmentPageState {
    showSelection: boolean;
    alternate: boolean;
}

export class EnvironmentPage extends React.Component<IPageProperties, IEnvironmentPageState> {
    constructor(props: IPageProperties) {
        super(props);

        this.state = {
            showSelection: false,
            alternate: false
        };
    }

    render() {
        let selectAlt = (character.hasSource(Source.PlayersGuide)) ? (<Button className="button" text="Select Alternate Environment" onClick={() => this.showAlternateEnvironments()} />) : null;
        let rollAlt = (character.hasSource(Source.PlayersGuide)) ? (<Button className="button" text="Roll Alternate Environment" onClick={() => this.rollAlternateEnvironment()} />) : null;

        var content = !this.state.showSelection ?
            (
                <div>
                    <InstructionText text={character.workflow.currentStep().description} />
                    <div className="page-text">
                        Either select or roll your Environment.
                    </div>
                    <div className="button-container">
                        <Button className="button" text="Select Environment" onClick={() => this.showEnvironments() } />
                        {selectAlt}
                        <Button className="button" text="Roll Environment" onClick={() => this.rollEnvironment() } />
                        {rollAlt}
                    </div>
                </div>
            )
            : (
                <div>
                    <EnvironmentSelection
                        alternate={this.state.alternate}
                        onSelection={(env, name) => this.selectEnvironment(env, name) }
                        onCancel={() => this.hideEnvironments() } />
                </div>
            );

        return (
            <div className="page">
                {content}
            </div>
        );
    }

    private rollEnvironment() {
        let env = EnvironmentsHelper.generateEnvironment();
        this.selectEnvironment(env, "");
    }

    private rollAlternateEnvironment() {
        let env = EnvironmentsHelper.generateAlternateEnvironment();
        this.selectEnvironment(env, "");
    }

    private showEnvironments() {
        this.setState({ showSelection: true, alternate: false });
    }

    private showAlternateEnvironments() {
        this.setState({ showSelection: true, alternate: true });
    }

    private hideEnvironments() {
        this.setState({ showSelection: false });
    }

    private selectEnvironment(env: Environment, name: string) {
        character.environment = env;

        var n = name.indexOf("Another Species' World");
        if (n > -1) {
            character.otherSpeciesWorld = name.substring(name.indexOf("(") + 1, name.indexOf(")")); 
        }

        Navigation.navigateToPage(PageIdentity.EnvironmentDetails);
    }
}