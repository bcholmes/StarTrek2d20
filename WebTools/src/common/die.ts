
class D20Dice {

    roll(count: number = 1) {
        let result = 0;
        while (count--) {
            result += (Math.floor(Math.random() * 20) + 1);
        }
        return result;
    }
}

class D6RollResult {
    
    // the 1-6 value
    private faceValue: number;

    constructor(faceValue: number) {
        this.faceValue = faceValue;
    }

    get value() {
        if (this.faceValue === 3 || this.faceValue === 4) {
            return 0;
        } else if (this.faceValue === 2) {
            return 2;
        } else {
            return 1;
        }
    }

    get isEffect() {
        return this.faceValue >= 5;
    }
}

class D6Dice {

    rollFace() {
        let result = Math.floor(Math.random() * 6) + 1;
        return new D6RollResult(result);
    }
}

export const D20 = new D20Dice();
export const D6 = new D6Dice();

