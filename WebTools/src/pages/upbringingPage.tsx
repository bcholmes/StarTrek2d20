import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Upbringing, UpbringingsHelper} from '../helpers/upbringings';
import {Button} from '../components/button';
import {UpbringingSelection} from '../components/upbringingSelection';

interface IUpbringingPageState {
    showSelection: boolean;
}

export class UpbringingPage extends React.Component<IPageProperties, IUpbringingPageState> {
    constructor(props: IPageProperties) {
        super(props);

        this.state = {
            showSelection: false
        };
    }

    render() {
        var selectLabel = "Select " +  character.workflow.currentStep().name;
        var rollLabel = "Roll " +  character.workflow.currentStep().name;

        var instruction = character.workflow.currentStep().description.map((s, i) => {
            return (
                <div className="page-text">{s}</div>
            );
        });

        var content = !this.state.showSelection ?
            (
                <div>
                    {instruction}
                    <div className="button-container">
                        <Button className="button" text={selectLabel} onClick={() => this.showUpbringings() } />
                        <Button className="button" text={rollLabel} onClick={() => this.rollUpbringing() } />
                    </div>
                </div>
            )
            : (
                <div>
                    <UpbringingSelection
                        onSelection={(env) => this.selectUpbringing(env) }
                        onCancel={() => this.hideUpbringings() } />
                </div>
            );

        return (
            <div className="page">
                {content}
            </div>
        );
    }

    private rollUpbringing() {
        var upbringing = UpbringingsHelper.generateUpbringing();
        this.selectUpbringing(upbringing);
    }

    private showUpbringings() {
        this.setState({ showSelection: true });
    }

    private hideUpbringings() {
        this.setState({ showSelection: false });
    }

    private selectUpbringing(upbringing: Upbringing) {
        character.upbringing = upbringing;
        Navigation.navigateToPage(PageIdentity.UpbringingDetails);
    }
}
