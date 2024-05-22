import React, { useState } from 'react';
import i18n from 'i18next';
import { PDFDocument } from '@cantoo/pdf-lib'
import {Button} from './button';
import { ModalControl } from './modal';
import { Construct } from '../common/construct';
import { getNavigatorLanguage } from '../i18n/config';
import { ICharacterSheet, SheetTag } from '../exportpdf/icharactersheet';
import { SelectablePill } from './selectablePill';
import { makeKey } from '../common/translationKey';
import { useTranslation } from 'react-i18next';

declare function download(bytes: any, fileName: any, contentType: any): any;

interface ICharacterSheetDialogProperties {
    sheets: ICharacterSheet[];
    suffix: string;
    construct: Construct;
}

const _CharacterSheetDialog: React.FC<ICharacterSheetDialogProperties> = ({sheets, suffix, construct}) => {

    const [selection, setSelection] = useState(sheets[0]);
    const [tags, setTags] = useState([]);
    const { t } = useTranslation();

    const selectTemplate = (sheet: ICharacterSheet) => {
        setSelection(sheet);
    }

    const  exportPdf = async () => {
        const sheet: ICharacterSheet = selection;
        if (sheet) {

            const existingPdfBytes = await fetch(sheet.getPdfUrl()).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)
            await sheet.populate(pdfDoc, construct);

            const pdfBytes = await pdfDoc.save();

            // Trigger the browser to download the PDF document
            download(pdfBytes, sheet.createFileName(suffix, construct), "application/pdf");
        }

        CharacterSheetDialog.hide();
    }

    const toggleTag = (tag: SheetTag, active: boolean) => {
        if (active) {
            if (tags.indexOf(tag) < 0) {
                let newTags = [...tags];
                newTags.push(tag);
                setTags(newTags);

                let sheets = filteredSheets(newTags);
                if (sheets.length && sheets.indexOf(selection) < 0) {
                    setSelection(sheets[0])
                }
            }
        } else {
            if (tags.indexOf(tag) >= 0) {
                let newTags = [...tags];
                newTags.splice(newTags.indexOf(tag), 1);
                setTags(newTags);

                let sheets = filteredSheets(newTags);
                if (sheets.length && sheets.indexOf(selection) < 0) {
                    setSelection(sheets[0])
                }
            }
        }
    }

    const filteredSheets = (selectedTags: SheetTag[]) => {
        return sheets.filter(s => {
            let result = true;
            selectedTags.forEach(t => result = result && (s.getTags().indexOf(t) >= 0));
            return result;
        });
    }

    let allTags = [];
    sheets.forEach(s => s.getTags().forEach(t => {
        if (allTags.indexOf(t) < 0) {
            allTags.push(t);
        }
    }));
    allTags.sort((t1, t2) => t(makeKey('SheetTag.', SheetTag[t1])).localeCompare(t(makeKey('SheetTag.', SheetTag[t2]))) );
    let filtered = filteredSheets(tags);

    const sheetList = filtered.map((s, i) => {
        const selected = (s.getName() === selection.getName()) ? "sheet-selection-item selected" : "sheet-selection-item";
        const overlay = (s.getName() === selection.getName()) ? <img className="overlay" src="/static/img/check.png" alt="checkmark" /> : undefined;


        return (
            <div className={selected} onClick={(e) => { e.stopPropagation(); selectTemplate(s); } } key={'character-sheet-' + i}>
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
            <div className="mb-3">
                {allTags.map(type => <SelectablePill name={t(makeKey('SheetTag.', SheetTag[type]))} onClick={(active) => toggleTag(type, active)} key={"tag-" + SheetTag[type]} />)}
            </div>
            <div className="style-selections">
                {sheetList}
            </div>
            <div className="text-center">
                <Button className="btn btn-primary mt-4" onClick={() => { exportPdf() } } enabled={filtered.length > 0}>{i18n.t('Common.button.exportPdf')}</Button>
            </div>
        </div>
    );

}

class CharacterSheetDialogControl {

    show(sheets: ICharacterSheet[], suffix: string, c: Construct) {
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