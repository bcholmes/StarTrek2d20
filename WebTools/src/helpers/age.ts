
export class AgeLifepathOptions {
    // the number of points that a character of this age should decrease
    decreasePoints: number;
    // the number of focuses that the character gains during the training/academy/education phase
    numberOfFocuses: number;
    focusText: string;

    constructor(decreasePoints: number = 0, numberOfFocuses: number = 3, focusText="") {
        this.decreasePoints = decreasePoints;
        this.numberOfFocuses = numberOfFocuses;
        this.focusText = focusText;
    }
}

export class Age {

    name: string;
    attributes: number[];
    disciplines: number[];
    attributeSum: number;
    disciplineSum: number;
    description: string;
    options: AgeLifepathOptions;

    constructor(name: string, attributes: number[], disciplines: number[], attributeSum: number, disciplineSum: number, options: AgeLifepathOptions = new AgeLifepathOptions(), description: string = "") {
        this.name = name;
        this.attributes = attributes;
        this.disciplines = disciplines;
        this.attributeSum = attributeSum;
        this.disciplineSum = disciplineSum;
        this.description = description;
        this.options = options;
    }
    public toString() {
        return this.name;
    }

    public isAdult() {
        return this.name === "Adult";
    }
    public isChild() {
        return !this.isAdult();
    }
}

class _AgeHelper {

    private ages: Age[] = [
        new Age("Adult", [10, 9, 9, 8, 8, 7], [4, 3, 2, 2, 1, 1], 56, 16),
        new Age("Pre-adolescent Child", [9, 8, 8, 7, 7, 6], [3, 2, 1, 1, 0, 0], 52, 12, 
            new AgeLifepathOptions(2, 1, "You select one focus. This should reflect your areas of interest, one of your hobbies or the school subject you excel at."),
            "You’re young, equivalent to a Human child between the ages of 8 and 12. You’re still learning your way in the world."),
        new Age("Adolescent Child", [9, 9, 8, 8, 7, 7], [3, 2, 2, 1, 1, 0], 53, 13, 
            new AgeLifepathOptions(1, 2, "You select two focuses. These should reflect your areas of interest, your hobbies or the school subjects you excel at."),
            "You’re reaching the point at which you are developing into an adult, equivalent to a Human child between the ages of 13 and 17. You’re trying to exert your independence and your uniqueness, and often struggling against the guiding hand of your parents and teachers as you gain a stronger sense of who you are."),
    ];

    getAllAges() {
        return this.ages;
    }

    getAllChildAges() {
        return [ this.ages[1], this.ages[2] ];
    }

    getAdultAge() {
        return this.ages[0];
    }
}

const AgeHelper = new _AgeHelper();

export default AgeHelper;
