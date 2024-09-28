import { Division } from "../common/character";
import { SimpleColor } from "../common/colour"
import { Era } from "../helpers/eras";

export const romulanGreenColour2e: SimpleColor = SimpleColor.from("#1A6847");
export const orionGreenColour2e: SimpleColor = SimpleColor.from("#84C98B");
export const ferengiOrangeColour2e: SimpleColor = SimpleColor.from("#E76E24");
export const cardassianBrownColour2e: SimpleColor = SimpleColor.from("#603826");
export const klingonRedColour2e: SimpleColor = SimpleColor.from("#C9242B");

export const tealColour2e: SimpleColor = SimpleColor.from("#39AAA3");
export const greyColour2e: SimpleColor = SimpleColor.from("#979696");

export const goldColour2e: SimpleColor = SimpleColor.from("#D49F00");
export const redColour2e: SimpleColor = SimpleColor.from("#C51A1B");
export const blueColour2e: SimpleColor = SimpleColor.from("#2384B3");

export const labelColourProvider = (era: Era, label: string) => {
    if (label === "Construct.discipline.command" ||
        label === "Construct.discipline.conn") {
        return era === Era.NextGeneration ? redColour2e : goldColour2e;
    } else if (label === "Construct.discipline.engineering" ||
            label === "Construct.discipline.security") {
        return era === Era.NextGeneration ? goldColour2e : redColour2e;
    } else if (label === "Construct.discipline.medicine" ||
            label === "Construct.discipline.science") {
        return blueColour2e;
    } else {
        return tealColour2e;
    }
}


export const divisionColour2e = (era: Era, division?: Division) => {
    if (era === Era.NextGeneration) {
        switch (division) {
        case Division.Command:
            return redColour2e;
        case Division.Operations:
            return goldColour2e;
        case Division.Science:
            return blueColour2e;
        default:
            return tealColour2e;
        }
    } else {
        switch (division) {
        case Division.Command:
            return goldColour2e;
        case Division.Operations:
            return redColour2e;
        case Division.Science:
            return blueColour2e;
        default:
            return tealColour2e;
        }
    }
}