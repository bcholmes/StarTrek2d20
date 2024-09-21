import { PDFDocument, PDFPage } from "@cantoo/pdf-lib";
import { Column } from "./column";
import { SimpleColor } from "../common/colour";

const stressPill2e = "m 1,0 h 7.5 c 0.554,0 1,0.446 1,1 v 7.5 c 0,0.554 -0.446,1 -1,1 H 1 C 0.446,9.5 0,9.054 0,8.5 V 1 C 0,0.446 0.446,0 1,0 Z";

export class CheckMarkMaker {

    page: PDFPage;
    pdf: PDFDocument;

    constructor(page: PDFPage, pdf: PDFDocument) {
        this.page = page;
        this.pdf = pdf;
    }

    createCheckMarksAndBoxes(pills: Column[], prefix: string, colour: SimpleColor) {

        pills.forEach(column => {
            let x = column.translatedStart(this.page).x;
            const y = column.translatedStart(this.page).y;

            this.page.moveTo(x, y);
            this.page.drawSvgPath(stressPill2e, {
                borderColor: colour.asPdfRbg(),
                borderWidth: 0.5
            });
        });

        this.createCheckMarks(pills, prefix);
    }

    createCheckMarks(pills: Column[], prefix: string = "Determination ") {
        let form = this.pdf.getForm();
        pills.forEach((block, i) => {

            let checkbox = form.createCheckBox(prefix + (i+1));
            checkbox.addToPage(this.page, {
                x: block.start.x + 2,
                y: this.page.getHeight() - block.start.y - (block.height - 1),
                width: block.width - 4,
                height: block.height - 2,
                textColor: SimpleColor.from("#000000").asPdfRbg(),
                borderWidth: 0
            });
        });
    }
}