import React from "react";
import { Color } from "../../common/colour";
import { IPageProperties } from "../../pages/iPageProperties";
import { Sector, StarSystem } from "../table/star";

interface ISectorMapViewProperties extends IPageProperties {
    sector?: Sector;
    onClick: { (s: StarSystem) : void }
}

class SectorMapView extends React.Component<ISectorMapViewProperties, {}> {

    render() {

        let purple = "#9179B7";

        return this.props.sector ?(<div className="sectorMap">
            <svg
                viewBox="0 0 450 450"
                xmlns="<http://www.w3.org/2000/svg>"
                >
		    	<path strokeWidth="1" strokeOpacity="50%" fill="none" stroke={purple} d="M105,25 L105,425 M185,25 L185,425 M265,25 L265,425 M345,25 L345,425" />
		    	<path strokeWidth="1" strokeOpacity="50%" fill="none" stroke={purple} d="M25,105 L425,105 M25,185 L425,185 M25,265 L425,265 M25,345 L425,345 " />
		    	<path strokeWidth="1.5" stroke={purple} fill="none" d="M25,25 L25,425 L425,425 L425,25 Z" />

                {this.renderStarSystems()}
            </svg>
        </div>) : null;
    }

    renderStarSystems() {
        let systems = [ ...this.props.sector.systems ];
        systems.sort((a, b) => {
            if (a.sectorCoordinates.z !== b.sectorCoordinates.z) {
                return a.sectorCoordinates.z - b.sectorCoordinates.z;
            } else if (a.sectorCoordinates.y !== b.sectorCoordinates.y) {
                return a.sectorCoordinates.y - b.sectorCoordinates.y;
            } else {
                return a.sectorCoordinates.x - b.sectorCoordinates.x;
            }
        });

        return systems.map((s, i) => {

            let z = s.sectorCoordinates.z / 20 * 0.75 + 0.25;
            let baseColour = s.star.spectralClass.colour;
            let colour = baseColour.blend(new Color(0, 0, 0), 1-z);

            let r = Math.max(1, Math.sqrt(s.star.spectralClass.radius.midpoint * 50));

            if (s.isBinary) {

                let r1 = r * 0.75;

                let baseColour2 = s.companionStar.spectralClass.colour;
                let colour2 = baseColour2.blend(new Color(0, 0, 0), 1-z);

                let r2 = Math.max(1, Math.sqrt(s.companionStar.spectralClass.radius.midpoint * 50));

                r = Math.max(r, r2);

                r2 = r2 * 0.75;

                return (<g key={'system-' + i} onClick={() => this.props.onClick(s)} style={{ cursor: "pointer" }}>
                    <circle cx={this.mapCoordinateSpaceX(s.sectorCoordinates.x) - r1/2} cy={this.mapCoordinateSpaceY(s.sectorCoordinates.y) - r1/2} stroke="black" strokeWidth={0.25} fill={colour.asHex()} r={r1} />
                    <circle cx={this.mapCoordinateSpaceX(s.sectorCoordinates.x) + r2/2} cy={this.mapCoordinateSpaceY(s.sectorCoordinates.y) + r2/2} stroke="black" strokeWidth={0.25} fill={colour2.asHex()} r={r2} />
                    <circle cx={this.mapCoordinateSpaceX(s.sectorCoordinates.x)} cy={this.mapCoordinateSpaceY(s.sectorCoordinates.y)} strokeWidth="1" stroke={colour.asHex()} fill="none" r={r+5} />
                </g>);

            } else {

                return (<g key={'system-' + i} onClick={() => this.props.onClick(s)} style={{ cursor: "pointer" }}>
                    <circle cx={this.mapCoordinateSpaceX(s.sectorCoordinates.x)} cy={this.mapCoordinateSpaceY(s.sectorCoordinates.y)} stroke="black" strokeWidth={0.25} fill={colour.asHex()} r={r} />
                    <circle cx={this.mapCoordinateSpaceX(s.sectorCoordinates.x)} cy={this.mapCoordinateSpaceY(s.sectorCoordinates.y)} strokeWidth="1" stroke={colour.asHex()} fill="none" r={r+5} />
                </g>);
            }
        });
    }

    mapCoordinateSpaceX(x: number) {
        return x * 20 + 25;
    }

    mapCoordinateSpaceY(y: number) {
        return y * 20 + 25;
    }
}

export default SectorMapView;