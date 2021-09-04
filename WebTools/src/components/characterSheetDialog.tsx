import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {character} from '../common/character';
import { PDFDocument } from 'pdf-lib'
import { ICharacterSheet } from '../helpers/sheets';
import {Button} from './button';
import {CharacterSheetRegistry} from '../helpers/sheets';

declare function download(bytes: any, fileName: any, contentType: any): any;


interface ICharacterSheetDialogProperties {
    sheets: ICharacterSheet[];
    suffix: string,
    isVisible: boolean;
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
        const {sheets, isVisible} = this.props;
        const selection = this.state['selection'];

        const sheetList = sheets.map((s, i) => {
            const selected = (s.getName() == selection.getName()) ? "sheet-selection-item selected" : "sheet-selection-item"; 
            const overlay = (s.getName() == selection.getName()) ? <img className="overlay" src="./res/img/check.png" /> : undefined;
            return (
                <div className={selected} onClick={() => this.selectTemplate(s)}>
                    <div className="sheet-selection-item-name">
                        {s.getName()}
                    </div>
                    <div className="sheet-selection-item-thumbnail">
                        <img className="thumbnail" src={s.getThumbnailUrl()} />
                        {overlay}
                    </div>
                </div>
            );
        });

        const visibilityClass = isVisible
            ? "dialog-visible"
            : "dialog-hidden";

        const containerClass = isVisible
            ? "dialog-container dialog-container-visible dialog-container-lg"
            : "dialog-container dialog-container-lg";

        return (
            <div className={visibilityClass}>
                <div className="dialog-bg"></div>
                <div className={containerClass}>
                    <button className="close" onClick={() => { CharacterSheetDialog.hide() } }>x</button>
                    <div className="dialog-header">
                        <h3>Choose Template</h3>
                    </div>
                    <div className="style-selections">
                        {sheetList}
                    </div>
                    <div className="button-container-centered">
                        <Button text="Export to PDF" className="button" onClick={() => { this.exportPdf() } } />
                    </div>
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

            sheet.populate(pdfDoc)

            const pdfBytes = await pdfDoc.save()

            // Trigger the browser to download the PDF document
            download(pdfBytes, this.createFileName(character.name), "application/pdf");
        }
        
        CharacterSheetDialog.hide();
    }

    private createFileName(name: string): string {
        if (name == null || name.length == 0) {
            return this.props.suffix + ".pdf";
        } else {
            var escaped = name.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s/g, '_');
            return escaped + '-'  + this.props.suffix + ".pdf";
        }
    }
}

class CharacterSheetDialogControl {
    private _sheets: ICharacterSheet[];
    private _suffix: string;

    show(sheets: ICharacterSheet[], suffix: string) {
        this._sheets = sheets;
        this._suffix = suffix;
        this.render(true);
    }

    hide() {
        this.render(false);
    }

    private render(visible: boolean) {
        ReactDOM.render(
            React.createElement(_CharacterSheetDialog, {
                sheets: this._sheets,
                suffix: this._suffix,
                isVisible: visible
            }),
            document.getElementById("dialog")
        );
    }
}
export const CharacterSheetDialog = new CharacterSheetDialogControl();