import * as React from 'react';
import { SpaceframeOutline } from '../helpers/spaceframeOutlineHelper';
import { SpaceframeModel } from '../helpers/spaceframes';

interface IOutlineImageProperties {
    serviceYear?: number
    spaceframe?: SpaceframeModel
    size?: string
}

export class OutlineImage extends React.Component<IOutlineImageProperties, {}> {
    render() {
        let width = this.props.size === 'lg' ? (327 * 1.8) : 327;
        let height = this.props.size === 'lg' ? (84 * 1.8) : 84;
        if (this.props.spaceframe && this.props.serviceYear) {
            const svg = SpaceframeOutline.renderFullSvg(this.props.spaceframe, this.props.serviceYear);
            return svg ? (<div className='d-none d-md-block text-center'><img src={'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64')} alt={this.props.spaceframe.name} width={width} height={height} style={{maxWidth: "100%"}}/></div>) : null;
        } else {
            return null;
        }
    }
}