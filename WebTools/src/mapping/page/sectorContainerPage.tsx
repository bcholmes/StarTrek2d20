import * as React from 'react';
import { PageFactory } from '../../pages/pageFactory';
import { PageIdentity } from '../../pages/pageIdentity';
import LcarsFrame from '../../components/lcarsFrame';

interface ISectorContainerPageProperties {
    activePage: PageIdentity;
}

export class SectorContainerPage extends React.Component<ISectorContainerPageProperties, {}> {

    render() {
        const page = PageFactory.instance.createPage(this.props.activePage);

        return (<LcarsFrame activePage={this.props.activePage}>
                <div id="app">{page}</div>
            </LcarsFrame>);
    }

}

export default SectorContainerPage;
