import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Upbringing, UpbringingsHelper} from '../helpers/upbringings';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {UpbringingSelection} from '../components/upbringingSelection';

interface IUpbringingPageState {
    showSelection: boolean;
}

export class UpbringingPage extends React.Component<IPageProperties, IUpbringingPageState> {
    constructor(props: IPageProperties) {
        super(props);

        SetHeaderText("UPBRINGING");

        this.state = {
            showSelection: false
        };
    }

    render() {
        var content = !this.state.showSelection ?
            (
                <div>
                    <div className="page-text">
                        The nature of a person’s family and their surroundings as they grew up can have a massive impact upon them, and, whether they accept this influence or rebelled against it, it will shape the rest of their lives.
                        <br /><br />
                        Either select or roll your Upbringing.
                    </div>
                    <div className="button-container">
                        <Button className="button" text="Select Upbringing" onClick={() => this.showUpbringings() } />
                        <Button className="button" text="Roll Upbringing" onClick={() => this.rollUpbringing() } />
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