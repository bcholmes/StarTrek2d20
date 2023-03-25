import { CharacterType } from "../common/characterType";
import { SpaceframeModel } from "../helpers/spaceframeModel";


class RegistryNumberGenerator {

    static NUMBERS: string = "0123456789";

    importantRegistryNumbers: { [registry: number]: string } = {
        638: "Grissom",
        1031: "Discovery",
        1017: "Constellation",
        1227: "Shenzhou",
        1255: "Kerala",
        1309: "Gagarin",
        1549: "Peregrine",
        1647: "Farragut",
        1657: "Potemkin",
        1664: "Excalibur",
        1672: "Exeter",
        1701: "Enterprise",
        1703: "Hood",
        1709: "Lexington",
        1764: "Defiant",
        1864: "Reliant",
        1975: "New Jersey",
        2000: "Excelsior",
        2893: "Stargazer",
        42296: "Hood",
        53847: "Pegasus",
        65420: "Phoenix",
        70492: "Vancouver",
        71807: "Yamato",
        71832: "Odyssey",
        71201: "Prometheus",
        72504: "Van Citters",
        73811: "Sovereign",
        74205: "Defiant",
        74210: "Valiant",
        74656: "Voyager",
        74705: "Bellerophon",
        74913: "Prometheus",
        75567: "Cerritos",
        76884: "Protostar",
        80102: "Titan",
        82893: "Stargazer",
        86505: "Zheng He"
    }

    serviceYearRegistryNumbers: { [year: number]: number } = {
        2151: 1,
        2264: 1850,
        2285: 2000,
        2326: 2890,
        2360: 71800,
        2370: 74000,
        2371: 74600,
        2380: 75500,
        2385: 76800,
        2400: 82900,
        2409: 97000,
        2450: 120000 // ??? Maybe ????
    }

    generate(serviceYear: number, type: CharacterType, spaceframe: SpaceframeModel) {
        let lower = 0;
        let upper = 999999;

        let keys = Object.keys(this.serviceYearRegistryNumbers);
        keys.sort();

        for (let key of keys) {
            let year = parseInt(key);
            if (serviceYear > year) {
                lower = this.serviceYearRegistryNumbers[key];
            }
            if (year > serviceYear) {
                upper = this.serviceYearRegistryNumbers[key];
                break;
            }
        }

        let result = null;
        while (result == null) {
            let temp = Math.floor(Math.random() * (upper - lower)) + lower;
            if (this.importantRegistryNumbers[temp] == null) {
                result = temp;
            }
        }

        if (type === CharacterType.Starfleet) {
            return "NCC-" + result;
        } else {
            return result;
        }

    }

    generateRandom(numberOfDigits: number) {
        let result = "";
        while (result.length < numberOfDigits) {
            let random = Math.floor(Math.random() * 10);
            if (!(random === 0 && result.length === 0)) {
                let digit = RegistryNumberGenerator.NUMBERS.substring(random, random+1);
                result += digit;
            }
        }
        return result;
    }
}

const RegistryNumber = new RegistryNumberGenerator();

export default RegistryNumber;
