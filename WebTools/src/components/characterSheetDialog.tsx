import * as React from 'react';
import { PDFDocument } from 'pdf-lib'
import { ICharacterSheet } from '../helpers/sheets';
import {Button} from './button';
import { ModalControl } from './modal';
import { character } from '../common/character';
import { Construct } from '../common/construct';

declare function download(bytes: any, fileName: any, contentType: any): any;

interface ICharacterSheetDialogProperties {
    sheets: ICharacterSheet[];
    suffix: string;
    construct: Construct;
}

class _CharacterSheetDialog extends React.Component<ICharacterSheetDialogProperties, {}> {
    constructor(props: ICharacterSheetDialogProperties) {
        super(props);

        const { sheets } = this.props;
        if (sheets) {
            this.state = { selection: sheets[0] }
        }
    }

    render() {
        const {sheets } = this.props;
        const selection = this.state['selection'];

        const sheetList = sheets.map((s, i) => {
            const selected = (s.getName() === selection.getName()) ? "sheet-selection-item selected" : "sheet-selection-item"; 
            const overlay = (s.getName() === selection.getName()) ? <img className="overlay" src="./static/img/check.png" alt="checkmark" /> : undefined;
            return (
                <div className={selected} onClick={(e) => { e.stopPropagation(); this.selectTemplate(s); } } key={'character-sheet-' + i}>
                    <div className="sheet-selection-item-name">
                        {s.getName()}
                    </div>
                    <div className="sheet-selection-item-thumbnail">
                        <img className="thumbnail" src={s.getThumbnailUrl()} alt="Thumbnail" />
                        {overlay}
                    </div>
                </div>
            );
        });

        return (
            <div>
                <div className="style-selections">
                    {sheetList}
                </div>
                <div className="button-container-centered">
                    <Button text="Export to PDF" className="button" onClick={() => { this.exportPdf() } } />
                </div>
            </div>
        );
    }

    private selectTemplate(sheet: ICharacterSheet) {
        this.setState({ selection: sheet });
    }

    private async exportPdf() {
        const sheet = this.state['selection'];
        if (sheet) {

            const existingPdfBytes = await fetch(sheet.getPdfUrl()).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)

            await sheet.populate(pdfDoc, this.props.construct);

            const pdfBytes = await pdfDoc.save();

            // Trigger the browser to download the PDF document
            download(pdfBytes, sheet.createFileName(this.props.suffix, this.props.construct), "application/pdf");
        }
        
        CharacterSheetDialog.hide();
    }
}

class CharacterSheetDialogControl {

    show(sheets: ICharacterSheet[], suffix: string, c: Construct = character) {
        ModalControl.show("lg", () => {}, React.createElement(_CharacterSheetDialog, {
            sheets: sheets,
            suffix: suffix,
            construct: c
        }), "Choose Template" )
    }

    hide() {
        ModalControl.hide();
    }

}
export const CharacterSheetDialog = new CharacterSheetDialogControl();