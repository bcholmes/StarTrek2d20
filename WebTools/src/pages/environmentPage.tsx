import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Environment, EnvironmentsHelper} from '../helpers/environments';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {EnvironmentSelection} from '../components/environmentSelection';

interface IEnvironmentPageState {
    showSelection: boolean;
}

export class EnvironmentPage extends React.Component<IPageProperties, IEnvironmentPageState> {
    constructor(props: IPageProperties) {
        super(props);

        SetHeaderText("ENVIRONMENT");

        this.state = {
            showSelection: false
        };
    }

    render() {
        var content = !this.state.showSelection ?
            (
                <div>
                    <div className="page-text">
                        Regardless of their species, Starfleet officers come from many places, across many worlds. While many Humans (for example) are born on Earth, there are many more who were born on a colonized world elsewhere in the Galaxy, or on a starbase or a starship.
                        <br /><br />
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