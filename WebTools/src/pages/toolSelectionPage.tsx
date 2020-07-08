import * as React from 'react';
import {Navigation} from '../common/navigator';
import {SetHeaderText} from '../common/extensions';
import {PageIdentity} from './pageFactory';
import {Button} from '../components/button';

export class ToolSelectionPage extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);

        SetHeaderText("REGISTRY");
    }

    render() {
        return (
            <div className="page">
                <div className="page-text">
                    Welcome to Starfleet.
                    What do you want to register?
                </div>
                <div className="button-container">
                    <Button className="button" text="Starfleet Personnel" onClick={() => { this.goToPage(PageIdentity.Species); } } />
                    <Button className="button" text="Starship" onClick={() => { this.goToPage(PageIdentity.Starship); } } />
                    <Button className="button" text="Supporting Character" onClick={() => { this.goToPage(PageIdentity.SupportingCharacter); } } />
                </div>
            </div>
        );
    }

    private goToPage(page: PageIdentity) {
        Navigation.navigateToPage(page);
    }
}