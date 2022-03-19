import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {UpbringingModel, UpbringingsHelper} from '../helpers/upbringings';
import {Button} from '../components/button';
import {UpbringingSelection} from '../components/upbringingSelection';
import InstructionText from '../components/instructionText';
import { Source } from '../helpers/sources';
import { CheckBox } from '../components/checkBox';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';

interface IUpbringingPageState {
    showSelection: boolean;
    alternate: boolean;
    showAlternates: boolean;
}


export class UpbringingPage extends React.Component<IPageProperties, IUpbringingPageState> {
    constructor(props: IPageProperties) {
        super(props);

        this.state = {
            showSelection: false,
            alternate: false,
            showAlternates: false
        };
    }

    render() {
        var selectLabel = "Select " +  character.workflow.currentStep().name;
        var rollLabel = "Roll " +  character.workflow.currentStep().name;

        let showAlt = (character.hasSource(Source.PlayersGuide)) ? (<CheckBox isChecked={this.state.showAlternates} value={'alternates'} text="Allow alternate Upbringings (GM's decision)" onChanged={val => { this.setState(state => ({...state, showAlternates: !state.showAlternates}) ) }} />) : null;

        let alt = (this.state.showAlternates) 
                ? (<div className="pl-2 pr-2">
                    <Button className="button" text={'Select Alternate ' + character.workflow.currentStep().name} onClick={() => this.showAlternateUpbringings()} />
                    <Button className="button" text={'Roll Alternate ' + character.workflow.currentStep().name} onClick={() => this.rollAlternateUpbringing()} />
                   </div>) 
                : null;

        var content = !this.state.showSelection ?
            (
                <div>
                    <InstructionText text={character.workflow.currentStep().description} />
                    {showAlt}
                    <div className="row row-cols-md-3">
                        <div className="pl-2 pr-2">
                            <Button className="button" text={selectLabel} onClick={() => this.showUpbringings() } />
                            <Button className="button" text={rollLabel} onClick={() => this.rollUpbringing() } />
                        </div>
                        {alt}
                    </div>
                </div>
            )
            : (
                <div>
                    <UpbringingSelection
                        alternate={this.state.alternate}
                        onSelection={(env) => this.selectUpbringing(env) }
                        onCancel={() => this.hideUpbringings() } />
                </div>
            );

        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />
                {content}
            </div>
        );
    }

    private rollUpbringing() {
        var upbringing = UpbringingsHelper.generateUpbringing(false);
        this.selectUpbringing(upbringing);
    }

    private rollAlternateUpbringing() {
        let upbringing = UpbringingsHelper.generateUpbringing(true);
        this.selectUpbringing(upbringing);
    }

    private showAlternateUpbringings() {
        this.setState((state) => ({ ...state, showSelection: true, alternate: true }));
    }

    private showUpbringings() {
        this.setState((state) => ({ ...state, showSelection: true }));
    }

    private hideUpbringings() {
        this.setState((state) => ({ ...state, showSelection: false }));
    }

    private selectUpbringing(upbringing: UpbringingModel) {
        character.upbringing = upbringing;
        Navigation.navigateToPage(PageIdentity.UpbringingDetails);
    }
}
