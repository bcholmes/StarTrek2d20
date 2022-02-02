
export class Age {

    name: string;
    attributes: number[];
    disciplines: number[];

    constructor(name: string, attributes: number[], disciplines: number[]) {
        this.name = name;
        this.attributes = attributes;
        this.disciplines = disciplines;
    }
    public toString() {
        return this.name;
    }
}

class _AgeHelper {

    private ages: Age[] = [
        new Age("Adult", [10, 9, 9, 8, 8, 7], [4, 3, 2, 2, 1, 1]),
        new Age("Pre-adolescent Child", [9, 8, 8, 7, 7, 6], [3, 2, 1, 1, 0, 0]),
        new Age("Adolescent Child", [9, 9, 8, 8, 7, 7], [3, 2, 2, 1, 1, 0]),
    ];

    getAllAges() {
        return this.ages;
    }

    getAdultAge() {
        return this.ages[0];
    }
}

const AgeHelper = new _AgeHelper();

export default AgeHelper;
