import { PDFDocument, PDFPage } from "@cantoo/pdf-lib";
import { Column } from "./column";
import { SimpleColor } from "../common/colour";

export class CheckMarkMaker {

    page: PDFPage;
    pdf: PDFDocument;

    constructor(page: PDFPage, pdf: PDFDocument) {
        this.page = page;
        this.pdf = pdf;
    }

    createCheckMarks(determinationPills: Column[]) {
        let form = this.pdf.getForm();
        determinationPills.forEach((block, i) => {

            let checkbox = form.createCheckBox("Determination " + (i+1));
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