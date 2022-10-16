import * as React from 'react';
import { Starship } from '../common/starship';
import { SpaceframeOutline } from '../helpers/spaceframeOutlineHelper';

interface IOutlineImageProperties {
    starship?: Starship
    size?: string
}

export class OutlineImage extends React.Component<IOutlineImageProperties, {}> {
    render() {
        let width = this.props.size === 'lg' ? (327 * 1.8) : 327;
        let height = this.props.size === 'lg' ? (84 * 1.8) : 84;
        if (this.props.starship) {
            const svg = SpaceframeOutline.renderFullSvg(this.props.starship);
            return svg ? (<div className='d-none d-md-block text-center'><img src={'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64')} alt={this.props.starship.className} width={width} height={height} style={{maxWidth: "100%"}}/></div>) : null;
        } else {
            return null;
        }
    }
}