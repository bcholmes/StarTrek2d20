import i18next from "i18next";
import { BasicGeneratedSheet } from "./generatedsheet";
import { makeKey } from "../common/translationKey";
import { SheetTag } from "./icharactersheet";
import { PDFDocument, PDFFont, PDFForm, PDFPage, PDFTextField } from "@cantoo/pdf-lib";
import { FontLibrary, FontType } from "./fontLibrary";
import { Starship } from "../common/starship";
import { Column } from "./column";
import { labelWriter, VerticalAlignment } from "./labelWriter";
import { TextAlign } from "./textAlign";
import { blueColour2e, darkGreyColour2e, greyColour2e, labelColourProvider } from "./colourProvider2e";
import { Construct } from "../common/construct";
import { XYLocation } from "../common/xyLocation";
import { SimpleColor } from "../common/colour";
import { FontOptions } from "./fontOptions";
import { WeaponDescriber } from "./weaponDescriber";
import { Paragraph } from "./paragraph";
import { bullet2EWriter } from "./bullet2eWriter";
import { TALENT_NAME_MISSION_POD, TalentsHelper } from "../helpers/talents";
import { ReadableTalentModel, TalentWriter } from "./talentWriter";
import { FontSpecification } from "./fontSpecification";
import { System } from "../helpers/systems";
import { Department } from "../helpers/departments";
import { staTextFieldAppearanceProvider } from "../helpers/pdfTextFieldAppearance";

export class Standard2eStarshipSheet extends BasicGeneratedSheet {

    static readonly talentsColumn2 = new Column(344.6, 516.4, 232.3, 227.8);
    static readonly talentsColumn1 = new Column(107.6, 526.3, 222.4, 227.8, this.talentsColumn2);

    static readonly attacksColumn = new Column(107.6, 420.7, 80.5, 225.4);

    static readonly specialRulesColumn = new Column(345.7, 387.1, 114.1, 226.7);

    static readonly headingColumn = new Column(383, 54.5 - 2, 9.5, 196.1);

    getName(): string {
        return i18next.t(makeKey('Sheet.', "Standard2eCharacterSheet"),
            { "defaultValue": "Standard 2nd Ed.-style Starship Sheet (US Letter)"});
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/STA_2e_Standard_Starship_Sheet.png'
    }
    getPdfUrl(): string {
        return "/static/pdf/STA_2e_Standard_Starship_Sheet.pdf";
    }

    getTags(): SheetTag[] {
        return [ SheetTag.Portrait, SheetTag.Style2e, SheetTag.LanguageSupport, SheetTag.TalentText, SheetTag.UsLetter ];
    }

    fonts: FontLibrary = new FontLibrary();
    headingFont: PDFFont;

    async initializeFonts(pdf: PDFDocument) {
        await super.initializeFonts(pdf);

        const fontBytes = await fetch("/static/font/Michroma-Regular.ttf").then(res => res.arrayBuffer());
        this.headingFont = await pdf.embedFont(fontBytes);

        this.fonts.addFont(FontType.Standard, this.formFont);

        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const boldFont = await pdf.embedFont(boldFontBytes);
        this.fonts.addFont(FontType.Bold, boldFont);

        const italicFontBytes = await fetch("/static/font/OpenSansCondensed-LightItalic.ttf").then(res => res.arrayBuffer());
        const italicFont = await pdf.embedFont(italicFontBytes);
        this.fonts.addFont(FontType.Italic, italicFont);

        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());
        const symbolFont = await pdf.embedFont(symbolFontBytes);
        this.fonts.addFont(FontType.Symbol, symbolFont);
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        const starship = construct as Starship;
        const page = pdf.getPage(0);

        this.writeLabels(page, starship);

        const { SheetOutlineOptions, SpaceframeOutline } = await import(/* webpackChunkName: 'spaceframeOutline' */ "../helpers/spaceframeOutlineHelper");
        SpaceframeOutline.draw(pdf, new SheetOutlineOptions(new XYLocation(98.6, 70.4), blueColour2e.asPdfRbg(), 0.66, 0.8), starship);

        await this.writeTalents(page, starship, Standard2eStarshipSheet.talentsColumn1, blueColour2e);
        await this.writeSpecialRules(page, starship, Standard2eStarshipSheet.specialRulesColumn, blueColour2e);
        this.writeAttacks(page, starship, Standard2eStarshipSheet.attacksColumn, blueColour2e);
        this.writeTitle(page);
        this.writeShields(pdf, page, starship);

        this.populateForm(pdf.getForm(), starship);
    }

    fillField(form: PDFForm, name: string, value: string|number) {
        try {
            const field = form.getTextField(name)
            if (field) {
                field.setText("" + value)
            }
        } catch (e) {
            // ignore it
        }
    }

    populateForm(form: PDFForm, starship: Starship) {

        form.getFields().forEach(f => {
            if (f instanceof PDFTextField) {
                let textField = f as PDFTextField;
                if (textField.isMultiline() && (textField.getText() == null || textField.getText().length === 0)) {
                    textField.updateAppearances(this.formFont, staTextFieldAppearanceProvider(8));
                }
            }
        });


        this.fillField(form, 'Name', starship.name ?? "");
        this.fillField(form, 'Mission Profile', starship.missionProfileStep?.type?.localizedName ?? "");
        this.fillField(form, 'Service Record', starship.serviceRecordStep?.type?.name ?? "");
        this.fillField(form, 'Traits', starship.getAllTraits() ?? "");
        this.fillField(form, 'Registry', starship.registry ?? "");
        this.fillField(form, 'Service Date', starship.serviceYear ?? "");
        this.fillField(form, 'Refits', starship.refitsAsString() ?? "");
        this.fillField(form, 'Resistance', starship.resistance ?? 0);
        this.fillField(form, 'Scale', starship.scale ?? 0);
        this.fillField(form, 'Crew', starship.crewSupport ?? 0);
        this.fillField(form, 'Shields', starship.shields ?? 0);
        this.fillField(form, 'Small Craft', starship.smallCraftReadiness ?? 0);

        this.fillField(form, 'Comms', starship.systems[System.Comms]);
        this.fillField(form, 'Computer', starship.systems[System.Computer]);
        this.fillField(form, 'Engines', starship.systems[System.Engines]);
        this.fillField(form, 'Sensors', starship.systems[System.Sensors]);
        this.fillField(form, 'Structure', starship.systems[System.Structure]);
        this.fillField(form, 'Weapons', starship.systems[System.Weapons]);

        this.fillField(form, 'Command', starship.departments[Department.Command]);
        this.fillField(form, 'Conn', starship.departments[Department.Conn]);
        this.fillField(form, 'Engineering', starship.departments[Department.Engineering]);
        this.fillField(form, 'Security', starship.departments[Department.Security]);
        this.fillField(form, 'Medicine', starship.departments[Department.Medicine]);
        this.fillField(form, 'Science', starship.departments[Department.Science]);
    }

    writeLabels(page: PDFPage, construct: Starship) {
        const subHeadings = {
            "Construct.other.systems": new Column(43.1, 251, 9.5, 222.4),
            "Construct.other.departments": new Column(281.7, 251, 9.5, 220),
        }
        labelWriter(page, subHeadings, 2, this.headingFont, 9, darkGreyColour2e, TextAlign.Centre);

        labelWriter(page, {
            "Construct.system.comms": new Column(44.1, 267.4, 5.7, 50),
            "Construct.system.computer": new Column(44.1, 299.8, 5.7, 50),
            "Construct.system.engines": new Column(120.5, 267.4, 5.7, 50),
            "Construct.system.sensors": new Column(120.5, 299.8, 5.7, 50),
            "Construct.system.structure": new Column(196.8, 267.4, 5.7, 50),
            "Construct.system.weapons": new Column(196.8, 299.8, 5.7, 50),

            "Construct.discipline.command": new Column(283.6, 274.6, 5.7, 50),
            "Construct.discipline.conn": new Column(283.6, 307.1, 5.7, 50),
            "Construct.discipline.engineering": new Column(359, 274.6, 5.7, 50),
            "Construct.discipline.security": new Column(359, 307.1, 5.7, 50),
            "Construct.discipline.medicine": new Column(434.3, 274.6, 5.7, 50),
            "Construct.discipline.science": new Column(434.3, 307.1, 5.7, 50),
        }, 1,
        this.headingFont, 7, ((label) => labelColourProvider(construct.era, label)), TextAlign.Left, "", VerticalAlignment.Middle);

        labelWriter(page, {
            "Construct.other.name": new Column(56.8 + 3, 154.4 + 1, 6, 371 - 5),
            "Construct.other.missionProfile": new Column(56.8 + 3, 186.9 + 2, 6, 224.7 - 5),
            "Construct.other.serviceRecord": new Column(287.4 + 3, 186.9 + 1, 6, 140.4 - 5),
            "Construct.other.traits": new Column(37.3 + 3, 219.2 + 1, 6, 50 - 5),
            "Construct.other.attacks": new Column(103.8 + 3, 407.9 + 1, 6, 232.1 - 5),
            "Construct.other.shuttlebay": new Column(342.1 + 3, 336.6 + 1, 6, 234.1 - 5),
            "Construct.other.specialRules": new Column(342.1 + 3, 375.4 + 1, 6, 234.1 - 5),
            "Construct.other.talents": new Column(103.8 + 3, 511.9 + 1, 6, 472.6 - 5),
            "Construct.other.registry": new Column(434 + 3, 76.4 + 1, 6, 143 - 5),
            "Construct.other.serviceDate": new Column(434 + 3, 102.4 + 1, 6, 143 - 5),
            "Construct.other.refits": new Column(434 + 3, 128.4 + 1, 6, 143 - 5),
            "Construct.other.resistance": new Column(439.6 + 3, 161.1 + 1, 6, 131.4 - 5),
            "Construct.other.scale": new Column(439.6 + 3, 187.1 + 1, 6, 131.4 - 5),
            "Construct.other.crewSupport": new Column(439.6 + 3, 213.1 + 1, 6, 131.4 - 5),
        }, construct.version,
        this.headingFont, 5, blueColour2e);

        labelWriter(page, {
            "Construct.other.shields": new Column(105.1, 347, 5.7, 39.3),
        }, construct.version,
        this.headingFont, 5, blueColour2e, TextAlign.Centre);

        const paragraph = new Paragraph(page, new Column(518.2, 249.9, 19.6, 54.6), this.fonts);
        paragraph.textAlignment = TextAlign.Centre;
        paragraph.append(i18next.t("Construct.other.smallCraftReadiness").toLocaleUpperCase(),
            new FontSpecification(this.headingFont, 5), blueColour2e);
        paragraph.write();

        [
            new Column(44.4, 277, 5.5, 39),
            new Column(120.7, 277, 5.5, 39),
            new Column(197.1, 277, 5.5, 39),
            new Column(44.4, 309.7, 5.5, 39),
            new Column(120.7, 309.7, 5.5, 39),
            new Column(197.1, 309.7, 5.5, 39),
        ].forEach(c =>

            labelWriter(page, {
                "Construct.other.breaches": c,
            }, construct.version,
            this.fonts.fontByType(FontType.Bold), 6, SimpleColor.from("#ffffff"))
        );
    }

    async writeTalents(page: PDFPage, starship: Starship, column: Column, colour: SimpleColor) {
        let talents = [];

        let paragraph = new Paragraph(page, column, this.fonts);
        for (let t of starship.getDistinctTalentNameList()) {

            if (paragraph) {
                paragraph.indent(15);
                const talent = TalentsHelper.getTalent(t);
                if (!talent.specialRule) {
                    let readableTalent = new ReadableTalentModel(starship.type, talent);
                    talents.push(readableTalent);
                    if (talent && talent.maxRank > 1) {
                        let rank = starship.getRankForTalent(t);
                        readableTalent.rank = rank;
                    }

                    if (talent.name === TALENT_NAME_MISSION_POD && starship.missionPodModel) {
                        readableTalent.missionPod = starship.missionPodModel;
                    }
                }
            }
        };

        let writer = new TalentWriter(page, this.fonts, starship.version, colour, true);
        return await writer.writeTalents(talents, column, 8, 8);
    }

    async writeSpecialRules(page: PDFPage, starship: Starship, column: Column, colour: SimpleColor) {
        let talents = [];
        let paragraph = new Paragraph(page, column, this.fonts);
        for (let t of starship.getDistinctTalentNameList()) {

            if (paragraph) {
                paragraph.indent(15);
                const talent = TalentsHelper.getTalent(t);
                if (talent.specialRule) {
                    let readableTalent = new ReadableTalentModel(starship.type, talent);
                    talents.push(readableTalent);
                    if (talent && talent.maxRank > 1) {
                        let rank = starship.getRankForTalent(t);
                        readableTalent.rank = rank;
                    }

                    if (talent.name === TALENT_NAME_MISSION_POD && starship.missionPodModel) {
                        readableTalent.missionPod = starship.missionPodModel;
                    }
                }
            }
        };

        let writer = new TalentWriter(page, this.fonts, starship.version, colour, true);
        return await writer.writeTalents(talents, column, 8, 8);
    }

    writeAttacks(page: PDFPage, construct: Construct, column: Column, colour: SimpleColor = blueColour2e) {

        let bold = new FontOptions(8, FontType.Bold);
        let standard = new FontOptions(8);
        let paragraph = null;
        let bottom = column.start;

        construct.determineWeapons().forEach(w => {
            const text = new WeaponDescriber(construct.version, false).describeFully(w, construct);
            paragraph = paragraph == null ? new Paragraph(page, column, this.fonts) : paragraph.nextParagraph(0);
            paragraph?.indent(15);
            paragraph?.append(w.description + ": ", bold);
            paragraph?.append(text, standard);
            paragraph?.write();

            if (paragraph?.lines?.length) {
                bullet2EWriter(page, paragraph, colour);
            }

            bottom = paragraph?.bottom;
        });

        return bottom ? column.bottomAfter(bottom.y - column.start.y) : null;
    }

    writeTitle(page: PDFPage) {
        const originalText = i18next.t("Sheet.text.title.starship").toLocaleUpperCase();
        let text = originalText;
        const fontSize = this.determineIdealFontWidth([ text ],
            Standard2eStarshipSheet.headingColumn.width, 11, 8, this.headingFont);
        const block = Standard2eStarshipSheet.headingColumn;
        let width = this.headingFont.widthOfTextAtSize(text, fontSize);
        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = this.headingFont.widthOfTextAtSize(text + "...", fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        page.drawText(text, {
            x: block.start.x,
            y: page.getHeight() - (block.end.y),
            color: SimpleColor.from("#ffffff").asPdfRbg(),
            font: this.headingFont,
            size: fontSize
        });
    }

    get pillSize() {
        return {
            height: 13.473,
            width: 13.473
        };
    }

    get shieldPillLocations() {
        return [
            new XYLocation(147.6, 343),
            new XYLocation(166.1, 343),
            new XYLocation(184.6, 343),
            new XYLocation(203.1, 343),
            new XYLocation(221.7, 343),

            new XYLocation(242.7, 343),
            new XYLocation(261.2, 343),
            new XYLocation(279.8, 343),
            new XYLocation(298.3, 343),
            new XYLocation(316.8, 343),


            new XYLocation(147.6, 361.8),
            new XYLocation(166.1, 361.8),
            new XYLocation(184.6, 361.8),
            new XYLocation(203.1, 361.8),
            new XYLocation(221.7, 361.8),

            new XYLocation(242.7, 361.8),
            new XYLocation(261.2, 361.8),
            new XYLocation(279.8, 361.8),
            new XYLocation(298.3, 361.8),
            new XYLocation(316.8, 361.8),


            new XYLocation(147.6, 380.6),
            new XYLocation(166.1, 380.6),
            new XYLocation(184.6, 380.6),
            new XYLocation(203.1, 380.6),
            new XYLocation(221.7, 380.6),

            new XYLocation(242.7, 380.6),
            new XYLocation(261.2, 380.6),
            new XYLocation(279.8, 380.6),
            new XYLocation(298.3, 380.6),
            new XYLocation(316.8, 380.6),
        ];
    }

    get shieldPill() {
        return "M 0.727,0 C 0.326,0 0,0.324 0,0.727 v 12.019 c 0,0.399 0.326,0.727 0.727,0.727 h 12.019 c 0.401,0 0.727,-0.328 0.727,-0.727 V 0.727 C 13.473,0.324 13.147,0 12.746,0 Z";
    }

    writeShields(pdf: PDFDocument, page: PDFPage, starship: Starship, colour: SimpleColor = blueColour2e) {

        let form = pdf.getForm();
        let { height, width } = this.pillSize;
        this.shieldPillLocations.forEach((pill, i) => {

            if (i >= starship.shields) {
                page.moveTo(pill.x, page.getHeight() - pill.y);
                page.drawSvgPath(this.shieldPill, {
                    color: colour.asPdfRbg(),
                    borderColor: colour.asPdfRbg(),
                    borderWidth: 1
                });
            } else {
                let checkbox = form.createCheckBox("Stress " + (i+1));
                checkbox.addToPage(page, {
                    x: pill.x + (width - 9.5) / 2,
                    y: page.getHeight() - pill.y - (height - 3),
                    width: 9.5,
                    height: 8.5,
                    textColor: SimpleColor.from("#000000").asPdfRbg(),
                    borderWidth: 0
                });
            }
        });
    }
}