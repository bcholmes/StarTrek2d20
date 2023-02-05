import React from "react";
import { StarSystem } from "../table/starSystem";

export interface ISystemMapViewProperties {
    system: StarSystem;
}

export class SystemMapView extends React.Component<ISystemMapViewProperties, {}> {

    static START_X = 90;
    static DISPLAY_WIDTH = 970 - SystemMapView.START_X;

    findAllOrbits() {
        let { system } = this.props;
        let orbits = system.worlds?.map(w => w.orbitalRadius) ?? [];
        if (system.gardenZoneInnerRadius) {
            orbits.push(system.gardenZoneInnerRadius);
        }
        if (system.gardenZoneOuterRadius) {
            orbits.push(system.gardenZoneOuterRadius);
        }
        orbits = orbits.sort((a, b) => {
            if (a === b) {
                return 0;
            } else {
                return a < b ? -1 : 1;
            }
        });
        return orbits;
    }


    calculateOrbitX(orbitInAus: number, orbits: number[]) {
        if (orbits?.length) {
            let firstOrbitInAus = orbits[0];
            let firstOrbit = Math.log1p(firstOrbitInAus);
            let lastOrbit = Math.log1p(orbits[orbits.length - 1]);

            return SystemMapView.START_X + (SystemMapView.DISPLAY_WIDTH) / (lastOrbit - firstOrbit) * (Math.log1p(orbitInAus) - firstOrbit);
        } else {
            return 0;
        }
    }
}

