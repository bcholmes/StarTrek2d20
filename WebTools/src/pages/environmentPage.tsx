import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Environment, EnvironmentsHelper} from '../helpers/environments';
import {Button} from '../components/button';
import {EnvironmentSelection} from '../components/environmentSelection';
import InstructionText from '../components/instructionText';

interface IEnvironmentPageState {
    showSelection: boolean;
}

export class EnvironmentPage extends React.Component<IPageProperties, IEnvironmentPageState> {
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
                    <div className="page-text">
                        Either select or roll your Environment.
                    </div>
                    <div className="button-container">
                        <Button className="button" text="Select Environment" onClick={() => this.showEnvironments() } />
                        <Button className="button" text="Roll Environment" onClick={() => this.rollEnvironment() } />
                    </div>
                </div>
            )
            : (
                <div>
                    <EnvironmentSelection
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
        var env = EnvironmentsHelper.generateEnvironment();
        this.selectEnvironment(env, "");
    }

    private showEnvironments() {
        this.setState({ showSelection: true });
    }

    private hideEnvironments() {
        this.setState({ showSelection: false });
    }

    private selectEnvironment(env: Environment, name: string) {
        character.environment = env;
        EnvironmentsHelper.applyEnvironment(env);

        var n = name.indexOf("Another Species' World");
        if (n > -1) {
            character.otherSpeciesWorld = name.substring(name.indexOf("(") + 1, name.indexOf(")")); 
        }

        Navigation.navigateToPage(PageIdentity.EnvironmentDetails);
    }
}