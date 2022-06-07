import { D20 } from "./die";

export function createRandomValue(numberOfDigits: number = 6) {
    const alphaNumeric = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < numberOfDigits; i++) {
        if (D20.roll() === 1) {
            result += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
        } else {
            result += alphaNumeric.charAt(Math.floor(Math.random() * 10));
        }
    }
    return result;
}