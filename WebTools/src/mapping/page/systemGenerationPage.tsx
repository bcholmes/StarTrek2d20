import * as React from 'react';
import {IPageProperties} from '../../pages/iPageProperties';
import { Button } from '../../components/button';
import { SystemGenerationTable } from '../table/systemGenerator';
import { Navigation } from '../../common/navigator';
import { PageIdentity } from '../../pages/pageIdentity';

export class SystemGenerationPage extends React.Component<IPageProperties, {}> {

    render() {
        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">System Generation</li>
                    </ol>
                </nav>

                <div className="page-text mt-3">
                    Select tool.
                </div>
                <div className="button-container">
                    <Button text="Generate Sector" buttonType={true} className="button" onClick={() => { this.generateSystem(); }} />
                </div>
            </div>
        );
    }

    private generateSystem() {
        SystemGenerationTable.generateSector();
        Navigation.navigateToPage(PageIdentity.SectorDetails);
    }
}
