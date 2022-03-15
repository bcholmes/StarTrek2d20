import * as React from 'react';
import { Navigation } from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import { Button } from '../components/button';

enum Tool {
    CharacterGenerator,
    TalentsOverview,
}

export class SelectionPage extends React.Component<IPageProperties, {}> {

    render() {
        return (
            <div className="page">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">Home</li>
                    </ol>
                </nav>
                <div className="page-text mt-3">
                    Select tool.
                </div>
                <div className="button-container">
                    <Button text="Characters &amp; Starships" className="button" onClick={() => { this.selectTool(Tool.CharacterGenerator); }} />
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