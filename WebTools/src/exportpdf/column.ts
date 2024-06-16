import { PDFPage } from "@cantoo/pdf-lib";
import { XYLocation } from "../common/xyLocation";

export class Column {
    start: XYLocation;
    height: number;
    width: number;
    nextColumn?: Column;

    constructor(x: number, y: number, height: number, width: number, nextColumn?: Column) {
        this.start = new XYLocation(x, y);
        this.height = height;
        this.width = width;
        this.nextColumn = nextColumn;
    }

    contains(point: XYLocation, page: PDFPage) {
        return point.x >= this.start.x && point.x <= (this.start.x + this.width)
            && point.y <= (page.getSize().height - this.start.y) && point.y >= (page.getSize().height - this.start.y - this.height);
    }
    translatedStart(page: PDFPage) {
        let x = this.start.x;
        let y = page.getSize().height - this.start.y;
        return new XYLocation(x, y);
    }

    untranslateLocation(page: PDFPage, location: XYLocation) {
        let x = location.x;
        let y = page.getSize().height - location.y;
        return new XYLocation(x, y);
    }

    get end() {
        return new XYLocation(this.start.x + this.width, this.start.y + this.height);
    }

    bottomAfter(deltaY: number) {
        if (deltaY <= this.height) {
            return new Column(this.start.x, this.start.y + deltaY, this.height - deltaY, this.width);
        } else {
            return null;
        }
    }
}


