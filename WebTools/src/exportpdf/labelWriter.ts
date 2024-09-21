import { PDFFont, PDFPage } from "@cantoo/pdf-lib";
import { Column } from "./column";
import i18next from "i18next";
import { SimpleColor } from "../common/colour";
import { TextAlign } from "./textAlign";

const changeLabelForVersion = (key: string, version: number) => {
    if (key === "Construct.other.departments" && version === 1) {
        return "Construct.other.disciplines";
    } else {
        return key;
    }
}


export const labelWriter = (page: PDFPage, locations: {[key: string]: Column},
    version: number, font: PDFFont, originalFontSize: number,
    colour: SimpleColor|((label: string) => SimpleColor) = SimpleColor.from("#000000"),
    textAlign: TextAlign = TextAlign.Left) => {

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
        let text = originalText;
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
        let block = locations[key];
        key = changeLabelForVersion(key, version);

        const originalText = i18next.t(key).toLocaleUpperCase();
        let text = originalText;
        let width = font.widthOfTextAtSize(text, fontSize);

        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = font.widthOfTextAtSize(text + "...", fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        let x = block.start.x;
        if (textAlign === TextAlign.Centre) {
            x = block.start.x + ((block.width - width) / 2);
        }

        page.drawText(text, {
            x: x,
            y: page.getHeight() - (block.end.y),
            color: colourProvider(key).asPdfRbg(),
            font: font,
            size: fontSize
        });
    });

}