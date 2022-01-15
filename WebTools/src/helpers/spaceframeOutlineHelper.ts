import { PDFDocument, rgb } from "pdf-lib";
import { DEFAULT_OUTLINE, SpaceframeViewModel } from "./spaceframes";

class SpaceframeOutlineHelper {

    draw(pdf: PDFDocument, spaceframe?: SpaceframeViewModel, serviceYear?: number) {
        if (spaceframe) {
            this.drawOutline(pdf, spaceframe.outline);
        } else {
            this.drawOutline(pdf, DEFAULT_OUTLINE);
        }

    }

    drawOutline(pdf: PDFDocument, outline: string) {
        const page = pdf.getPage(0);
        page.moveTo(0, page.getHeight());

        const orange = rgb(245.0/255, 157.0/255.0, 8.0/255.0);

        if (outline.charAt(0) === 'm') {
            // SVG edited using Inkscape end up using a px-based measures
            page.drawSvgPath(outline, { borderColor: orange, borderWidth: 1.3, scale: 0.75 })
        } else {
            // SVG created by Illustrator ends us using a pt-based measure
            page.drawSvgPath(outline, { borderColor: orange, borderWidth: 1 })
        }
    }
}

export const SpaceframeOutline = new SpaceframeOutlineHelper();