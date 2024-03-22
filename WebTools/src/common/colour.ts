import Color from 'color';

export class SimpleColor {
    red: number; // 0 - 255
    green: number;
    blue: number;
    alpha: number; // 0 - 1

    constructor(red: number, green: number, blue: number, alpha: number = 1) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    blend(color: SimpleColor, ratio: number) {
        return new SimpleColor(
            Math.round(this.red * (1-ratio) + color.red * ratio),
            Math.round(this.green * (1-ratio) + color.green * ratio),
            Math.round(this.blue * (1-ratio) + color.blue * ratio),
            Math.round(this.alpha * (1-ratio) + color.alpha * ratio));
    }

    asHex() {
        return "#" + this.leftPad(this.red.toString(16)) + this.leftPad(this.green.toString(16)) + this.leftPad(this.blue.toString(16))
            + (this.alpha === 1 ? "" : this.leftPad((this.alpha * 255).toString(16)));
    }

    withAlpha(alpha: number) {
        return new SimpleColor(this.red, this.green, this.blue, alpha);
    }

    get luminance() {
        return (0.299 * this.red + 0.587 * this.green + 0.114 * this.blue)/255;
    }

    get isDark() {
        return this.luminance <= 0.5;
    }

    lighten(amount: number = 0.5) {
        return SimpleColor.from(Color(this.asHex()).lighten(amount).hex());
    }

    darken(amount: number = 0.5) {
        return SimpleColor.from(Color(this.asHex()).darken(amount).hex());
    }

    get isApproximatelyWhite() {
        return this.luminance > 0.92;
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
            return new SimpleColor(red, green, blue);
        }
    }
}