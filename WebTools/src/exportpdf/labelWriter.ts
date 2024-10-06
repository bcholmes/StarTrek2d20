import { PDFFont, PDFPage } from "@cantoo/pdf-lib";
import { Column } from "./column";
import i18next from "i18next";
import { SimpleColor } from "../common/colour";
import { TextAlign } from "./textAlign";
import { TextBlock } from "./textBlock";
import { FontSpecification } from "./fontSpecification";

const changeLabelForVersion = (key: string, version: number) => {
    if (key === "Construct.other.departments" && version === 1) {
        return "Construct.other.disciplines";
    } else {
        return key;
    }
}

export enum VerticalAlignment {
    Baseline,
    Middle
}

export const labelWriter = (page: PDFPage, locations: {[key: string]: Column},
    version: number, font: PDFFont, originalFontSize: number,
    colour: SimpleColor|((label: string) => SimpleColor) = SimpleColor.from("#000000"),
    textAlign: TextAlign = TextAlign.Left,
    suffix: string = "", verticalAlignment: VerticalAlignment = VerticalAlignment.Baseline) => {

    const minimumFontSize = originalFontSize * 0.75;
    let colourProvider = (label: string) => SimpleColor.from("#000000");
    if (colour instanceof SimpleColor) {
        colourProvider = (label: string) => (colour as SimpleColor);
    } else {
        colourProvider = colour;
    }

    let fontSize = originalFontSize;

    Object.keys(locations).forEach(key => {
        let block = locations[key];
        key = changeLabelForVersion(key, version);
        const originalText = i18next.t(key).toLocaleUpperCase();
        let text = originalText + suffix;
        let width = font.widthOfTextAtSize(text, fontSize);
        while (width > block.width) {
            fontSize -= 0.25;
            width = font.widthOfTextAtSize(text, fontSize);
            if (fontSize < minimumFontSize) {
                break;
            }
        }
    })

    Object.keys(locations).forEach(key => {
        let column = locations[key];
        key = changeLabelForVersion(key, version);

        const originalText = i18next.t(key).toLocaleUpperCase();
        let text = originalText;
        let width = font.widthOfTextAtSize(text, fontSize);

        while (width > column.width) {
            text = text.substring(0, text.length-1);
            width = font.widthOfTextAtSize(text + "...", fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        text += suffix;

        let x = column.start.x;
        if (textAlign === TextAlign.Centre) {
            x = column.start.x + ((column.width - width) / 2);
        } else if (textAlign === TextAlign.Right) {
            x = column.end.x - width - 2;
        }

        let y = column.end.y;
        if (verticalAlignment === VerticalAlignment.Middle) {
            const block = TextBlock.create(text, new FontSpecification(font, fontSize), false);
            console.log(column.height, font.heightAtSize(fontSize));
            y = column.end.y - 1 - ((column.height - block.height) / 2)
        }

        page.drawText(text, {
            x: x,
            y: page.getHeight() - y,
            color: colourProvider(key).asPdfRbg(),
            font: font,
            size: fontSize
        });
    });

}