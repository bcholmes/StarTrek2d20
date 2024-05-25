import { PDFDocument } from "@cantoo/pdf-lib"
import { SafetyEvaluationType } from "../model/safetyEvaluation";

declare function download(bytes: any, fileName: any, contentType: any): any;

export class SafetyChecklistPdf {


    async export(evaluation: {[category: string]: SafetyEvaluationType}) {
        const existingPdfBytes = await fetch("/static/pdf/Safety_Checklist.pdf").then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        await this.populate(pdfDoc, evaluation);

        const pdfBytes = await pdfDoc.save();

        download(pdfBytes, "Safety_Checklist_filled", "application/pdf");
    }

    async populate(pdf: PDFDocument, evaluation: {[category: string]: SafetyEvaluationType}) {

        let form = pdf.getForm();
        Object.keys(evaluation).forEach(category => {

            try {
                let radioGroup = form.getRadioGroup(category);
                let e = evaluation[category];
                if (radioGroup) {
                    radioGroup.select(SafetyEvaluationType[e]);
                }
            } catch (e) {
                // skip it
            }
        });

    }
}