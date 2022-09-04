import { D20 } from "../../common/die";
import { LuminosityTable } from "./luminosityTable";
import { StarSystem, World } from "./star";

const BLAGG_CONSTANT = 1.7275;

export class Orbit {
    public index: number;
    public radius: number;
    public world: World;

    static createStandardOrbit(index: number, radius: number) {
        let result = new Orbit();
        result.index = index;
        result.radius = radius;
        return result;
    }
}

export class Orbits {

    public orbits: Orbit[] = [];

    between(inner: number, outer: number) {
        return this.orbits.filter(o => o.radius >= inner && o.radius < outer);
    }

    static createOrbits(numberOfWorlds: number, system: StarSystem) {
        let orbits = new Orbits();
        let initialOrbit = this.determineInitialOrbit(system);
        let bodeConstant = (D20.roll() / 4) * 0.1;
        let hasGardenZoneOrbit = false;

        let bodeIndex = 0;
        for (let i = 1; i <= numberOfWorlds; i++) {

            let orbitalRadius = this.determineRadius(bodeIndex++, initialOrbit, bodeConstant);

            while (orbitalRadius < LuminosityTable.tenabilityRadius(system.star.luminosityValue)) {
                // skip over non-viable orbits
                orbitalRadius = this.determineRadius(bodeIndex++, initialOrbit, bodeConstant);
            }
            if (D20.roll() === 20 && (hasGardenZoneOrbit || !system.isInGardenZone(orbitalRadius))) {
                // consider the calculated radius to be an "empty" orbit
                orbitalRadius = this.determineRadius(bodeIndex++, initialOrbit, bodeConstant);
            }

            if (system.isInGardenZone(orbitalRadius)) {
                hasGardenZoneOrbit = true;
            }

            orbits.orbits.push(Orbit.createStandardOrbit(i, orbitalRadius));
        }
        return orbits;
    }

    static determineRadius(orbitIndex: number, initialOrbit: number, bodeConstant: number) {
        return (orbitIndex === 0) 
            ? initialOrbit
            : initialOrbit + Math.pow(BLAGG_CONSTANT, orbitIndex) * bodeConstant;
    }

    static determineInitialOrbit(system: StarSystem) {
        return D20.roll() / 20;
    }
}