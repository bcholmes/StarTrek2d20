import * as React from 'react';
import { SpaceframeOutline } from '../helpers/spaceframeOutlineHelper';
import { SpaceframeViewModel } from '../helpers/spaceframes';

interface IOutlineImageProperties {
    serviceYear?: number
    spaceframe?: SpaceframeViewModel
}

export class OutlineImage extends React.Component<IOutlineImageProperties, {}> {
    render() {
        if (this.props.spaceframe && this.props.serviceYear) {
            const svg = SpaceframeOutline.renderFullSvg(this.props.spaceframe, this.props.serviceYear);
            return svg ? (<div className='d-none d-md-block text-center'><img src={'data:image/svg+xml;base64,' + btoa(svg)} alt={this.props.spaceframe.name} width="327" height="84"/></div>) : null;
        } else {
            return null;
        }
    }
}