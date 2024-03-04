import React from 'react';
import i18n from 'i18next';
import { PDFDocument } from '@cantoo/pdf-lib'
import { ICharacterSheet } from '../helpers/sheets';
import {Button} from './button';
import { ModalControl } from './modal';
import { character } from '../common/character';
import { Construct } from '../common/construct';
import { getNavigatorLanguage } from '../i18n/config';
import fontkit from '@pdf-lib/fontkit';

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
            const overlay = (s.getName() === selection.getName()) ? <img className="overlay" src="/static/img/check.png" alt="checkmark" /> : undefined;
            return (
                <div className={selected} onClick={(e) => { e.stopPropagation(); this.selectTemplate(s); } } key={'character-sheet-' + i}>
                    <div className="sheet-selection-item-name">
                        {s.getName()}
                    </div>
                    <div className="sheet-selection-item-thumbnail">
                        <img className="thumbnail" src={s.getThumbnailUrl()} alt={i18n.t('CharacterSheetDialog.thumbnail')} />
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
                <div className="text-center">
                    <Button className="btn btn-primary mt-4" onClick={() => { this.exportPdf() } }>{i18n.t('Common.button.exportPdf')}</Button>
                </div>
            </div>
        );
    }

    private selectTemplate(sheet: ICharacterSheet) {
        this.setState({ selection: sheet });
    }

    private async exportPdf() {
        const sheet: ICharacterSheet = this.state['selection'];
        if (sheet) {

            const existingPdfBytes = await fetch(sheet.getPdfUrl()).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)

            if (sheet.getLanguage() === 'ru') {
                pdfDoc.registerFontkit(fontkit);
                const lcarsFontBytes = await fetch("/static/font/bebas-neue-cyr.ttf").then(res => res.arrayBuffer());
                const lcarsFont =  await pdfDoc.embedFont(lcarsFontBytes)
                const form = pdfDoc.getForm()
                const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
                form.updateFieldAppearances = function () {
                    return rawUpdateFieldAppearances(lcarsFont);
                };
            }

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
        let browserLanguage = getNavigatorLanguage();
        let filteredSheets = sheets.filter(s => s.getLanguage() === "en" || browserLanguage.indexOf(s.getLanguage()) === 0);

        ModalControl.show("xl", () => {}, React.createElement(_CharacterSheetDialog, {
            sheets: filteredSheets,
            suffix: suffix,
            construct: c
        }), i18n.t('CharacterSheetDialog.title') )
    }

    hide() {
        ModalControl.hide();
    }

}
export const CharacterSheetDialog = new CharacterSheetDialogControl();