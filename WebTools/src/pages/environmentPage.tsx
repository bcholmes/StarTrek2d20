import * as React from 'react';
import {character, EnvironmentStep} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Environment, EnvironmentsHelper} from '../helpers/environments';
import {Button} from '../components/button';
import EnvironmentSelection from '../components/environmentSelection';
import InstructionText from '../components/instructionText';
import { Source } from '../helpers/sources';
import { CheckBox } from '../components/checkBox';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { hasSource } from '../state/contextFunctions';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header } from '../components/header';

interface IEnvironmentPageState {
    showSelection: boolean;
    alternate: boolean;
    showAlternates: boolean;
}

class EnvironmentPage extends React.Component<WithTranslation, IEnvironmentPageState> {
    constructor(props: WithTranslation) {
        super(props);

        this.state = {
            showSelection: false,
            alternate: false,
            showAlternates: false
        };
    }

    render() {
        const { t } = this.props;

        let showAlt = (hasSource(Source.PlayersGuide)) ? (<CheckBox isChecked={this.state.showAlternates} value={'alternates'} text={t('EnvironmentPage.showAlt')} onChanged={val => { this.setState(state => ({...state, showAlternates: !state.showAlternates}) ) }} />) : null;

        let alt = (this.state.showAlternates)
                ? (<div className="pl-2 pr-2">
                    <Button className="button" text={t('EnvironmentPage.button.selectAltEnvironment')} onClick={() => this.showAlternateEnvironments()} />
                    <Button className="button" text={t('EnvironmentPage.button.rollAltEnvironment')} onClick={() => this.rollAlternateEnvironment()} />
                   </div>)
                : null;


        var content = !this.state.showSelection ?
            (
                <div>
                    <InstructionText text={character.workflow.currentStep().description} />
                    <p>
                        {t('EnvironmentPage.simple.instruction')}
                    </p>
                    {showAlt}
                    <div className="row row-cols-md-2">
                        <div className="pl-2 pr-2">
                            <Button className="button" text={t('EnvironmentPage.button.selectEnvironment')} onClick={() => this.showEnvironments() } />
                            <Button className="button" text={t('EnvironmentPage.button.rollEnvironment')} onClick={() => this.rollEnvironment() } />
                        </div>
                        {alt}
                    </div>
                </div>
            )
            : (
                <EnvironmentSelection
                    alternate={this.state.alternate}
                    onSelection={(env, name) => this.selectEnvironment(env, name) }
                    onCancel={() => this.hideEnvironments() }
                    character={character} />
            );

        return (
            <div className="page">
                <div className="container ml-0">
                    <CharacterCreationBreadcrumbs />
                    <Header>{t('Page.title.environment')}</Header>
                    {content}
                </div>
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
       if (env === Environment.AnotherSpeciesWorld) {
            character.environmentStep = new EnvironmentStep(env, name.substring(name.indexOf("(") + 1, name.indexOf(")")));
        } else {
            character.environmentStep = new EnvironmentStep(env);
        }

        Navigation.navigateToPage(PageIdentity.EnvironmentDetails);
    }
}

export default withTranslation()(EnvironmentPage);