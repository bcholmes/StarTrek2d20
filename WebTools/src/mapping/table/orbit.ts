import { D20 } from "../../common/die";
import { LuminosityTable } from "./luminosityTable";
import { CompanionType, StarSystem } from "./starSystem";
import { World } from "./world";

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

    public primaryWorldOrbit: number;
    public orbits: Orbit[] = [];

    between(inner: number, outer: number) {
        return this.orbits.filter(o => o.radius >= inner && o.radius < outer);
    }

    static createOrbits(numberOfWorlds: number, system: StarSystem) {
        let orbits = new Orbits();
        let initialOrbit = this.determineInitialOrbit(system);
        if (initialOrbit < LuminosityTable.tenabilityRadius(system.luminosityValue)) {
            initialOrbit = LuminosityTable.tenabilityRadius(system.luminosityValue) * 1.05;
        }
        let bodeConstant = (D20.roll() / 4) * 0.1;
        let hasGardenZoneOrbit = false;

        orbits.primaryWorldOrbit =  Math.min(numberOfWorlds, Math.ceil(D20.roll() / 4.0));

        if (orbits.primaryWorldOrbit > 1) {
            let idealBode = (system.gardenZoneIdealRadius - initialOrbit) / (Math.pow(BLAGG_CONSTANT, orbits.primaryWorldOrbit - 1));

            if (idealBode < 0.001 || system.gardenZoneIdealRadius < 0.05) {
                orbits.primaryWorldOrbit = 1;
                initialOrbit = system.gardenZoneIdealRadius;

                let orderOfMagnitude = Math.max(0, Math.floor(Math.log(system.gardenZoneIdealRadius) / Math.log(10)));
                bodeConstant = D20.roll() / 10 * Math.pow(10, orderOfMagnitude);
            } else {
                bodeConstant = idealBode;
            }
        } else {
            initialOrbit = system.gardenZoneIdealRadius;
            let orderOfMagnitude = Math.max(0, Math.round(Math.log(system.gardenZoneIdealRadius) / Math.log(10)));
            bodeConstant = D20.roll() / 10 * Math.pow(10, orderOfMagnitude);
        }

        let bodeIndex = 0;
        for (let i = 1; i <= numberOfWorlds; i++) {

            let orbitalRadius = this.determineRadius(bodeIndex++, initialOrbit, bodeConstant);

            if (D20.roll() === 20 && (hasGardenZoneOrbit || system.gardenZoneOuterRadius < orbitalRadius)) {
                // consider the calculated radius to be an "empty" orbit
                orbitalRadius = this.determineRadius(bodeIndex++, initialOrbit, bodeConstant);
            }

            if (system.isInGardenZone(orbitalRadius)) {
                hasGardenZoneOrbit = true;
            }

            orbits.orbits.push(Orbit.createStandardOrbit(i, orbitalRadius));
        }

        if (system.companionStar != null && system.companionType === CompanionType.Distant) {
            let orbitalRadius = this.determineRadius(bodeIndex + 2, initialOrbit, bodeConstant);
            system.companionOrbitalRadius = orbitalRadius;
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