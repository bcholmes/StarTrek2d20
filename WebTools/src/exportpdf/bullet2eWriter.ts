import { PDFPage } from "@cantoo/pdf-lib";
import { Paragraph } from "./paragraph";
import { SimpleColor } from "../common/colour";

const bulletPath = "M 1.98633,0 C 0.88552,0 0,0.887478 0,1.988281 v 2.52539 C 0,5.614474 0.88552,6.5 1.98633,6.5 H 7.35 C 9.1505,6.5 10.6,5.050496 10.6,3.25 10.6,1.449502 9.1505,0 7.35,0 Z";

export const bullet2EWriter = (page: PDFPage, paragraph: Paragraph, colour: SimpleColor = SimpleColor.from("#000000")) => {
    let column = paragraph.startColumn;
    let location = column.untranslateLocation(page, paragraph.lines[0].location);

    page.moveTo(column.start.x, page.getHeight() - (location.y + 3));
    page.drawSvgPath(bulletPath, {
        color: colour.asPdfRbg(),
        borderWidth: 0
    });
}