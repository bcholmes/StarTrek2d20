import i18next from 'i18next';
import { BaseFormFillingSheet } from './baseFormFillingSheet';
import { SheetTag } from './icharactersheet';
import { Column } from './column';
import type { PDFForm, PDFPage } from '@cantoo/pdf-lib';
import { PDFDocument, PDFTextField } from '@cantoo/pdf-lib';
import { SimpleColor } from '../common/colour';
import type { Construct } from '../common/construct';
import { Character } from '../common/character';
import { TextAlign } from './textAlign';
import { staTextFieldAppearanceProvider } from '../helpers/pdfTextFieldAppearance';
import { XYLocation } from '../common/xyLocation';
import { WeaponDescriber } from './weaponDescriber';
import type { IWeaponDiceProvider } from '../common/iWeaponDiceProvider';
import { CareersHelper } from '../helpers/careers';
import { CheckMarkMaker } from './checkMarkMaker';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import { determineIdealFontWidth } from './fontWidthDeterminer';
import { TextBlock } from './textBlock';
import { FontSpecification } from './fontSpecification';
import { blueColour2e, goldColour2e, redColour2e } from './colourProvider2e';
import type { CharacterType } from '../common/characterType';
import { Paragraph } from './paragraph';
import { FontLibrary, FontType } from './fontLibrary';
import type { LogEntry } from '../common/logEntry';
import { FontOptions } from './fontOptions';
import { TokenHelper } from './tokenHelper';
import { fontLoader2e } from './fontLoader';

export class Standard2eCharacterSheet extends BaseFormFillingSheet {
  static labelColour: SimpleColor = SimpleColor.from('#1A82AF');
  static greyColour: SimpleColor = SimpleColor.from('#656668');

  static readonly headingColumn = new Column(436.5, 49, 17.4, 142);
  static readonly personalLogHeadingColumn = new Column(436.5, 53.2, 17.4, 142);

  getName(): string {
    return i18next.t('Sheet.standard2eCharacterSheet');
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/STA_2e_Standard_Character_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/STA_2e_Standard_Character_Sheet.pdf';
  }

  getDefaultFontPath() {
    return '/static/font/OpenSansCondensed-Light.ttf';
  }

  getTags(): SheetTag[] {
    return [
      SheetTag.Portrait,
      SheetTag.Style2e,
      SheetTag.UsLetter,
      SheetTag.LanguageSupport,
    ];
  }

  async initializeFonts(pdf: PDFDocument) {
    await super.initializeFonts(pdf);
    await fontLoader2e(pdf, this.fonts, this.formFont);
    this.headingFont = this.fonts.fontByType(FontType.Heading);
  }

  get stressPill() {
    return 'M 0.727,0 C 0.326,0 0,0.324 0,0.727 v 12.019 c 0,0.399 0.326,0.727 0.727,0.727 h 12.019 c 0.401,0 0.727,-0.328 0.727,-0.727 V 0.727 C 13.473,0.324 13.147,0 12.746,0 Z';
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);

    await this.fillCharacterImage(pdf, construct as Character);

    const character = construct as Character;
    let page2 = null;
    if (character.logEntries?.length) {
      const pdfBytes = await fetch(
        '/static/pdf/STA_2e_Standard_Log_Sheet.pdf',
      ).then((res) => res.arrayBuffer());
      const blankPdf = await PDFDocument.load(pdfBytes);

      const [secondPage] = await pdf.copyPages(blankPdf, [0]);
      page2 = secondPage;
      this.writePage2Labels(page2);

      if (page2) {
        for (let i = 0; i < Math.ceil(character.logEntries?.length / 18); i++) {
          const tempPage = pdf.addPage(page2);
          const [newPage] = await pdf.copyPages(pdf, [pdf.getPageCount() - 1]);
          page2 = newPage;

          const logEntries = character.logEntries;
          for (let j = i * 18; j < (i + 1) * 18 && j < logEntries.length; j++) {
            this.fillLogFields(logEntries[j], tempPage, j % 18);
          }
        }
      }
    }

    const page = pdf.getPage(0);
    this.writeSubTitles(page, construct);
    this.writeDetailLabels(page);

    this.writeStatLabels(page, character, TextAlign.Left, 5, 3.5);
    this.writeTitle(page);
    this.writeStress(pdf, page, character);

    new CheckMarkMaker(page, pdf).createCheckMarks(this.determinationPills);
  }

  async fillCharacterImage(pdf: PDFDocument, character: Character) {
    if (character.token) {
      const tokenBytes = await TokenHelper.renderToken(character.token);
      const image = await pdf.embedPng(tokenBytes);
      try {
        pdf.getForm().getButton('Image2_af_image').setImage(image);
      } catch {
        // name changed...? ignore it.
        console.log('Image button not found in PDF');
      }
    }
  }

  fillLogFields(logEntry: LogEntry, page: PDFPage, index: number) {
    const height = 31;
    const gap = 134 - 97 - height;

    const y = 97 + index * (height + gap);

    if (logEntry.id != null) {
      const column = new Column(32.9, y, height, 43.1);
      const paragraph = new Paragraph(page, column, this.fonts);
      paragraph.textAlignment = TextAlign.Centre;
      paragraph.append(logEntry.id, new FontOptions(9, FontType.Bold));
      paragraph.write();
    }

    if (logEntry.adventureTitle?.length) {
      const column = new Column(81.4, y, height, 176);
      let paragraph = new Paragraph(page, column, this.fonts);
      paragraph.append(
        logEntry.adventureTitle,
        new FontOptions(9, FontType.Bold),
      );
      paragraph.write();

      if (logEntry.missionDescription?.length) {
        paragraph = paragraph.nextParagraph(0);
        if (paragraph) {
          paragraph.append(logEntry.missionDescription, new FontOptions(9));
          paragraph.write();
        }
      }
    }

    if (logEntry.valuesUsed?.length || logEntry.directivesUsed?.length) {
      const column = new Column(264.7, y, height, 92.2);
      let paragraph = new Paragraph(page, column, this.fonts);
      logEntry.valuesUsed?.forEach((v) => {
        if (paragraph) {
          paragraph.append(v.prefix + v.value, new FontOptions(9));
          paragraph.write();
          paragraph = paragraph.nextParagraph();
        }
      });
      logEntry.directivesUsed?.forEach((d) => {
        if (paragraph) {
          paragraph.append(d, new FontOptions(9));
          paragraph.write();
          paragraph = paragraph.nextParagraph();
        }
      });
    }

    if (logEntry.notes?.length) {
      const column = new Column(365.8, y, height, 212.7);
      const paragraph = new Paragraph(page, column, this.fonts);
      paragraph.append(logEntry.notes, new FontOptions(9));
      paragraph.write();
    }
  }

  get detailLabels() {
    return {
      'Construct.other.name': new Column(209, 80.7, 5.7, 150),
      'Construct.other.rank': new Column(209, 113.1, 5.7, 150),
      'Construct.other.pronouns': new Column(487.9, 80.7, 5.7, 60),
      'Construct.other.assignment': new Column(397.3, 113.1, 5.7, 150),
      'Construct.other.characterRole': new Column(209, 145.6, 5.7, 100),
      'Construct.other.reputation': new Column(487.9, 145.6, 5.7, 100),
      'Construct.other.speciesAndTraits': new Column(209, 178, 5.7, 200),
      'Construct.other.environment': new Column(209, 210.5, 5.7, 150),
      'Construct.other.upbringing': new Column(397.3, 210.5, 5.7, 150),
      'Construct.other.careerPath': new Column(209, 269, 5.7, 150),
      'Construct.other.experience': new Column(397.3, 269, 5.7, 150),
      'Construct.other.careerEvent1': new Column(209, 327.7, 5.7, 150),
      'Construct.other.careerEvent2': new Column(397.3, 327.7, 5.7, 150),
      'Construct.other.values': new Column(109.2, 464.1, 5.7, 150),
      'Construct.other.speciesAbility': new Column(350, 464.1, 5.7, 150),
      'Construct.other.focuses': new Column(109.2, 548.6, 5.7, 150),
      'Construct.other.talents': new Column(350, 509.6, 5.7, 150),
      'Construct.other.pastimes': new Column(109.2, 646.1, 5.7, 150),
      'Construct.other.specialRules': new Column(350, 659.2, 5.7, 150),
      'Construct.other.attacks': new Column(109.2, 691.7, 5.7, 150),
      'Construct.other.equipment': new Column(350, 704.9, 5.7, 150),
      'Construct.other.determination': new Column(44.4, 249.2, 5.7, 100),
      'Construct.other.protection': new Column(93.1, 282.1, 5.7, 150),
      'Construct.other.stress': new Column(44.4, 295.3, 5.7, 50),
    };
  }

  get subTitleLocations() {
    return {
      'Construct.other.attributes': new Column(110.7, 387.5, 9.5, 219.4),
      'Construct.other.departments': new Column(350, 387.5, 9.5, 219.4),
    };
  }

  get statLocations() {
    return {
      'Construct.attribute.control': new Column(111.6, 408.9, 5.7, 43.5),
      'Construct.attribute.daring': new Column(111.6, 434.9, 5.7, 43.5),
      'Construct.attribute.fitness': new Column(187.8, 408.9, 5.7, 43.5),
      'Construct.attribute.insight': new Column(187.8, 434.9, 5.7, 43.5),
      'Construct.attribute.presence': new Column(263.9, 408.9, 5.7, 43.5),
      'Construct.attribute.reason': new Column(263.9, 434.9, 5.7, 43.5),

      'Construct.discipline.command': new Column(352.6, 408.9, 5.7, 43.5),
      'Construct.discipline.conn': new Column(352.6, 434.9, 5.7, 43.5),
      'Construct.discipline.engineering': new Column(428.7, 408.9, 5.7, 43.5),
      'Construct.discipline.security': new Column(428.7, 434.9, 5.7, 43.5),
      'Construct.discipline.science': new Column(504.8, 408.9, 5.7, 43.5),
      'Construct.discipline.medicine': new Column(504.8, 434.9, 5.7, 43.5),
    };
  }

  get stressPillLocations() {
    return [
      new XYLocation(90.2, 312.3),
      new XYLocation(112.6, 312.3),
      new XYLocation(135.1, 312.3),
      new XYLocation(157.6, 312.3),
      new XYLocation(180, 312.3),

      new XYLocation(45.3, 333.5),
      new XYLocation(67.7, 333.5),
      new XYLocation(90.2, 333.5),
      new XYLocation(112.6, 333.5),
      new XYLocation(135.1, 333.5),
      new XYLocation(157.6, 333.5),
      new XYLocation(180, 333.5),

      new XYLocation(45.3, 354.7),
      new XYLocation(67.7, 354.7),
      new XYLocation(90.2, 354.7),
      new XYLocation(112.6, 354.7),
      new XYLocation(135.1, 354.7),
      new XYLocation(157.6, 354.7),
      new XYLocation(180, 354.7),
    ];
  }

  get determinationPills() {
    return [
      new Column(135.6, 245, 13.5, 13.5),
      new Column(158.5, 245, 13.5, 13.5),
      new Column(181.3, 245, 13.5, 13.5),
    ];
  }

  writePage2Labels(page: PDFPage) {
    const headerLabels = [
      new Column(29.9, 74.3, 19.8, 78 - 29.9),
      new Column(78, 74.3, 19.8, 260.8 - 78),
      new Column(260.8, 74.3, 19.8, 360.6 - 260.8),
      new Column(360.6, 78.3, 15.8, 552.1 + 29.9 - 360.6),
    ];

    const heading1 = new Paragraph(page, headerLabels[0], new FontLibrary());
    heading1.textAlignment = TextAlign.Centre;
    heading1.append(
      i18next.t('Sheet.text.log.entryNumber').toLocaleUpperCase(),
      new FontSpecification(this.headingFont, 6.25),
      SimpleColor.from('#ffffff'),
    );
    heading1.write();

    const heading2 = new Paragraph(page, headerLabels[1], new FontLibrary());
    heading2.textAlignment = TextAlign.Centre;
    heading2.append(
      i18next.t('Sheet.text.log.adventureTitle').toLocaleUpperCase(),
      new FontSpecification(this.headingFont, 6.25),
      SimpleColor.from('#ffffff'),
    );
    heading2.write();

    const heading3 = new Paragraph(page, headerLabels[2], new FontLibrary());
    heading3.textAlignment = TextAlign.Centre;
    heading3.append(
      i18next.t('Sheet.text.log.valuesOrDirectivesUsed').toLocaleUpperCase(),
      new FontSpecification(this.headingFont, 6.25),
      SimpleColor.from('#ffffff'),
    );
    heading3.write();

    const heading4 = new Paragraph(page, headerLabels[3], new FontLibrary());
    heading4.textAlignment = TextAlign.Centre;
    heading4.append(
      i18next.t('Sheet.text.log.notes').toLocaleUpperCase(),
      new FontSpecification(this.headingFont, 6.25),
      SimpleColor.from('#ffffff'),
    );
    heading4.write();

    this.writePersonalLogTitle(page);
  }

  getStatLabelColour(key: string): SimpleColor {
    switch (key) {
      case 'Construct.discipline.command':
      case 'Construct.discipline.conn':
        return goldColour2e;

      case 'Construct.discipline.engineering':
      case 'Construct.discipline.security':
        return redColour2e;

      default:
        return blueColour2e;
    }
  }

  writeSubTitles(page: PDFPage, construct: Construct) {
    const originalFontSize = 9;

    const table = this.subTitleLocations;
    Object.keys(table).forEach((key) => {
      let fontSize = originalFontSize;
      const block = table[key];
      if (key === 'Construct.other.departments' && construct.version === 1) {
        key = 'Construct.other.disciplines';
      }

      const originalText = i18next.t(key).toLocaleUpperCase();
      const text = originalText;
      let width = this.headingFont.widthOfTextAtSize(text, fontSize);
      while (width > block.width) {
        fontSize -= 0.25;
        width = this.headingFont.widthOfTextAtSize(text, fontSize);
        if (fontSize < 7) {
          break;
        }
      }

      page.drawText(text, {
        x: block.start.x + (block.width - width) / 2,
        y: page.getHeight() - block.end.y,
        color: Standard2eCharacterSheet.greyColour.asPdfRbg(),
        font: this.headingFont,
        size: fontSize,
      });
    });
  }

  writeLabel(
    page: PDFPage,
    originalText: string,
    fontSize: number,
    block: Column,
    colour: SimpleColor,
    suffix: string = '',
    rightJustify: boolean = false,
  ) {
    let text = originalText;
    let width = this.headingFont.widthOfTextAtSize(text + suffix, fontSize);
    while (width > block.width) {
      text = text.substring(0, text.length - 1);
      width = this.headingFont.widthOfTextAtSize(
        text + '...' + suffix,
        fontSize,
      );
    }

    if (text !== originalText) {
      text += '...';
    }

    text += suffix;

    const height = this.headingFont.heightAtSize(fontSize, {
      descender: false,
    });
    const offset = Math.max(0, block.height - height) / 2;

    page.drawText(text, {
      x: rightJustify ? block.end.x - width - 2 : block.start.x,
      y: page.getHeight() - (block.end.y - offset),
      color: colour.asPdfRbg(),
      font: this.headingFont,
      size: fontSize,
    });
  }

  determineIdealFontWidthForVariableWidth(
    text: string[],
    maxWidth: Column[],
    idealFontSize: number,
    minimumFontSize: number,
  ) {
    let fontSize = idealFontSize;
    text.forEach((t, i) => {
      let width = this.headingFont.widthOfTextAtSize(t, fontSize);
      while (width > maxWidth[i].width) {
        fontSize -= 0.25;
        width = this.headingFont.widthOfTextAtSize(t, fontSize);
        if (fontSize <= minimumFontSize) {
          break;
        }
      }
    });
    return fontSize;
  }

  writeDetailLabels(
    page: PDFPage,
    colour: SimpleColor = Standard2eCharacterSheet.labelColour,
  ) {
    const fontSize = this.determineIdealFontWidthForVariableWidth(
      Object.keys(this.detailLabels).map((key) =>
        i18next.t(key).toLocaleUpperCase(),
      ),
      Object.values(this.detailLabels),
      5,
      4,
    );

    Object.keys(this.detailLabels).forEach((key) => {
      const block = this.detailLabels[key];
      const originalText = i18next.t(key).toLocaleUpperCase();
      this.writeLabel(page, originalText, fontSize, block, colour);
    });
  }

  writePersonalLogTitle(page: PDFPage) {
    const originalText = i18next.t('Sheet.text.log.title').toLocaleUpperCase();
    let text = originalText;
    const fontSize = determineIdealFontWidth(
      [text],
      Standard2eCharacterSheet.personalLogHeadingColumn.width,
      11,
      8,
      this.headingFont,
    );
    const column = Standard2eCharacterSheet.personalLogHeadingColumn;
    let width = this.headingFont.widthOfTextAtSize(text, fontSize);
    while (width > column.width) {
      text = text.substring(0, text.length - 1);
      width = this.headingFont.widthOfTextAtSize(text + '...', fontSize);
    }

    if (text !== originalText) {
      text += '...';
    }

    const block = TextBlock.create(
      text,
      new FontSpecification(this.headingFont, fontSize),
      false,
    );
    const y = column.end.y - 1 - (column.height - block.height) / 2;

    page.drawText(text, {
      x: column.start.x,
      y: page.getHeight() - y,
      color: SimpleColor.from('#ffffff').asPdfRbg(),
      font: this.headingFont,
      size: fontSize,
    });
  }

  writeTitle(page: PDFPage) {
    const originalText = i18next.t('Sheet.text.title.alt').toLocaleUpperCase();
    let text = originalText;
    const fontSize = determineIdealFontWidth(
      [text],
      Standard2eCharacterSheet.headingColumn.width,
      11,
      8,
      this.headingFont,
    );
    const column = Standard2eCharacterSheet.headingColumn;
    let width = this.headingFont.widthOfTextAtSize(text, fontSize);
    while (width > column.width) {
      text = text.substring(0, text.length - 1);
      width = this.headingFont.widthOfTextAtSize(text + '...', fontSize);
    }

    if (text !== originalText) {
      text += '...';
    }

    const block = TextBlock.create(
      text,
      new FontSpecification(this.headingFont, fontSize),
      false,
    );
    const y = column.end.y - 1 - (column.height - block.height) / 2;

    page.drawText(text, {
      x: column.start.x,
      y: page.getHeight() - y,
      color: SimpleColor.from('#ffffff').asPdfRbg(),
      font: this.headingFont,
      size: fontSize,
    });
  }

  fillReputation(form: PDFForm, character: Character) {
    this.fillField(form, 'Reputation', character.reputation);
  }

  fillCharacterRole(form: PDFForm, character: Character) {
    this.fillField(form, 'Character Role', character.assignmentWithoutShip);
  }

  fillAssignment(form: PDFForm, character: Character): void {
    this.fillField(form, 'Assignment', character.assignedShip ?? '');
  }

  populateForm(form: PDFForm, character: Character) {
    form.getFields().forEach((f) => {
      if (f instanceof PDFTextField) {
        const textField = f as PDFTextField;
        if (
          textField.isMultiline() &&
          (textField.getText() == null || textField.getText().length === 0)
        ) {
          textField.updateAppearances(
            this.formFont,
            staTextFieldAppearanceProvider(8),
          );
        }
      }
    });

    super.populateForm(form, character);

    this.fillCharacterRole(form, character);
    this.fillSpeciesAbility(form, character);
    this.fillTalents(form, character);
    this.fillPastimes(form, character);
    this.fillStressBox(form, character);
    this.fillCareerPath(form, character);
    this.fillExperience(form, character);
  }

  get pillSize() {
    return {
      height: 13.473,
      width: 13.473,
    };
  }

  writeStress(
    pdf: PDFDocument,
    page: PDFPage,
    character: Character,
    colour: SimpleColor = Standard2eCharacterSheet.labelColour,
  ) {
    const form = pdf.getForm();
    const { height, width } = this.pillSize;
    this.stressPillLocations.forEach((pill, i) => {
      if (i >= character.stress) {
        page.moveTo(pill.x, page.getHeight() - pill.y);
        page.drawSvgPath(this.stressPill, {
          color: colour.asPdfRbg(),
          borderColor: colour.asPdfRbg(),
          borderWidth: 1,
        });
      } else {
        const checkbox = form.createCheckBox('Stress ' + (i + 1));
        checkbox.addToPage(page, {
          x: pill.x + (width - 9.5) / 2,
          y: page.getHeight() - pill.y - (height - 3),
          width: 9.5,
          height: 8.5,
          textColor: SimpleColor.from('#000000').asPdfRbg(),
          borderWidth: 0,
        });
      }
    });
  }

  fillTalents(form: PDFForm, character: Character): void {
    const talents = character.rankedTalents
      .map((t) => t.displayNameWithMultiple)
      .join('\n');
    this.fillField(form, 'Talents', talents);
  }

  fillSpeciesAbility(form: PDFForm, character: Character): void {
    const speciesAbility = character.speciesStep?.ability?.name ?? '';
    this.fillField(form, 'Species Ability', speciesAbility);
  }

  fillStressBox(form: PDFForm, character: Character): void {
    if (character.isStressTrackPresent) {
      this.fillField(form, 'Stress', '' + character.stress);
    } else {
      this.fillField(form, 'Stress', '-');
    }
  }

  fillEquipment(form: PDFForm, character: Character): void {
    const equipment = character.equipment.join(', ');
    this.fillField(form, 'Equipment', equipment);
  }

  fillFocuses(form: PDFForm, character: Character): void {
    const focuses = character.focuses.join(', ');
    this.fillField(form, 'Focuses', focuses);
  }

  fillPastimes(form: PDFForm, character: Character): void {
    const pastime = character.pastime?.join(', ') ?? '';
    this.fillField(form, 'Pastimes', pastime);
  }

  fillValues(form: PDFForm, character: Character): void {
    const values = character.values.join('\n');
    this.fillField(form, 'Values', values);
  }

  fillExperience(form: PDFForm, character: Character): void {
    if (character.careerStep?.career != null) {
      const career = CareersHelper.instance.getCareer(
        character.careerStep.career,
        character,
      );
      this.fillField(form, 'Experience', career.localizedName);
    }
  }

  fillWeapons(form: PDFForm, construct: Construct): void {
    const describer = new WeaponDescriber(construct.version, true);

    if (construct instanceof Character) {
      const attacks = construct
        .determineWeapons()
        .map(
          (w) =>
            w.name +
            ': ' +
            describer
              .describeFully(w, construct as IWeaponDiceProvider)
              .replace(CHALLENGE_DICE_NOTATION, '\u25B2'),
        );

      this.fillField(form, 'Attacks', attacks.join('\n'));
    }
  }
}
