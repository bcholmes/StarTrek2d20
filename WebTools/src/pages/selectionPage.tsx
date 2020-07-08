import * as React from 'react';
import { Navigation } from '../common/navigator';
import { SetHeaderText } from '../common/extensions';
import { PageIdentity, IPageProperties } from './pageFactory';
import { Button } from '../components/button';

enum Tool {
    CharacterGenerator,
    TalentsOverview,
}

export class SelectionPage extends React.Component<IPageProperties, {}> {
    constructor(props: IPageProperties) {
        super(props);

        SetHeaderText("TOOLS");
    }

    render() {
        return (
            <div className="page">
                <div className="page-text">
                    Select tool.
                </div>
                <div className="button-container">
                    <Button text="Characters & Starships" className="button" onClick={() => { this.selectTool(Tool.CharacterGenerator); }} />
                    <Button text="Talents Overview" className="button" onClick={() => { this.selectTool(Tool.TalentsOverview); }} />
                </div>
            </div>
        );
    }

    private selectTool(tool: Tool) {
        switch (tool) {
            case Tool.CharacterGenerator:
                Navigation.navigateToPage(PageIdentity.Era);
                break;
            case Tool.TalentsOverview:
                Navigation.navigateToPage(PageIdentity.TalentsOverview);
                break;
        }
    }
}