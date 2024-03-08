import React from 'react';
import {Buffer} from 'buffer';
import { Starship } from '../common/starship';
import { SpaceframeOutline } from '../helpers/spaceframeOutlineHelper';

interface IOutlineImageProperties {
    starship?: Starship
    size?: string
}

const OutlineImage: React.FC<IOutlineImageProperties> = ({starship, size}) => {

    let width = size === 'lg' ? (327 * 1.8) : 327;
    let height = size === 'lg' ? (84 * 1.8) : 84;

    if (starship) {
        const svg = SpaceframeOutline.renderFullSvg(starship);
        return svg ? (<div className='d-none d-md-block text-center mb-3'><img src={'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64')} alt={starship.className} width={width} height={height} style={{maxWidth: "100%"}}/></div>) : null;
    } else {
        return null;
    }
}

export default OutlineImage;