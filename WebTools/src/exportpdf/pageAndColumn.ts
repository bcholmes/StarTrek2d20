import { PDFPage } from "@cantoo/pdf-lib";
import { Column } from "./column";

export interface IPageAndColumn {
    column: Column;
    page: PDFPage;
}