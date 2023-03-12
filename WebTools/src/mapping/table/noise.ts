import { D20 } from "../../common/die";

export const addNoiseToValue = (value: number, magnitude: number = 1) => {
    let roll1 = (D20.roll() - 10) * 0.001;
    let roll2 = (D20.roll() - 10) * (D20.roll() === 20 ? 0.05 : 0.01);

    let variance = roll1 + roll2;
    return value + (variance * value * magnitude);
}
