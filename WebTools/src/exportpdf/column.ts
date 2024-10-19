import { PDFPage } from "@cantoo/pdf-lib";
import { XYLocation } from "../common/xyLocation";
import { IPageAndColumn } from "./pageAndColumn";

export class Column {
    start: XYLocation;
    height: number;
    width: number;
    nextColumnHelper?: Column|(() => IPageAndColumn);

    constructor(x: number, y: number, height: number, width: number, nextColumn?: (Column|(() => IPageAndColumn))) {
        this.start = new XYLocation(x, y);
        this.height = height;
        this.width = width;
        this.nextColumnHelper = nextColumn;
    }

    indent(indentAmount: number) {
        return new Column(this.start.x + indentAmount, this.start.y, this.height, this.width - indentAmount);
    }

    unindent(indentAmount: number) {
        return new Column(this.start.x - indentAmount, this.start.y, this.height, this.width + indentAmount);
    }

    contains(point: XYLocation, page: PDFPage) {
        let untranslatedPoint = this.untranslateLocation(page, point);
        return untranslatedPoint.x >= this.start.x && untranslatedPoint.x <= (this.start.x + this.width)
            && untranslatedPoint.y >= this.start.y && untranslatedPoint.y <= (this.start.y + this.height);
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

    get isNextColumnAvailable() {
        return this.nextColumnHelper != null;
    }

    advanceToNextColumn(currentPage: PDFPage): IPageAndColumn|undefined {
        if (this.nextColumnHelper == null) {
            return undefined;
        } else if (this.nextColumnHelper instanceof Column) {
            return {
                page: currentPage,
                column: this.nextColumnHelper as Column
            }
        } else if (typeof this.nextColumnHelper === 'function') {
            return this.nextColumnHelper();
        } else {
            return undefined;
        }
    }

    bottomAfter(deltaY: number) {
        if (deltaY <= this.height) {
            return new Column(this.start.x, this.start.y + deltaY, this.height - deltaY, this.width, this.nextColumnHelper);
        } else {
            return null;
        }
    }

    topBefore(deltaY: number) {
        if (deltaY <= this.height) {
            return new Column(this.start.x, this.start.y, deltaY, this.width);
        } else {
            return null;
        }
    }
}


