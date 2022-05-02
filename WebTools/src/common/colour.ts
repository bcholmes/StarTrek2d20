export class Color {
    red: number; // 0 - 255
    green: number;
    blue: number;

    constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    blend(color: Color, ratio: number) {
        return new Color(
            Math.round(this.red * (1-ratio) + color.red * ratio),
            Math.round(this.green * (1-ratio) + color.green * ratio),
            Math.round(this.blue * (1-ratio) + color.blue * ratio));
    }

    asHex() {
        return "#" + this.leftPad(this.red.toString(16)) + this.leftPad(this.green.toString(16)) + this.leftPad(this.blue.toString(16));
    }

    private leftPad(h: string) {
        return ("00" + h).slice(-2);
    }

    public static from(hex: string) {
        if (hex.charAt(0) === '#') {
            hex = hex.substring(1);
        }

        if (hex.length !== 6) {
            return null;
        } else {
            let red = parseInt(hex.substring(0, 2), 16);
            let green = parseInt(hex.substring(2, 4), 16);
            let blue = parseInt(hex.substring(4), 16);
            return new Color(red, green, blue);
        }
    }
}