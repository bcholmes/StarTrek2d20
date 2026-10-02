import type { PDFDocument, PDFPage } from '@cantoo/pdf-lib';
import { Column } from './column';
import { SimpleColor } from '../common/colour';
import { determineIdealFontWidth } from './fontWidthDeterminer';
import type { Construct } from '../common/construct';
import { labelColourProvider, tealColour2e } from './colourProvider2e';
import { LandscapeSheetDecorations } from './landscapeSheetDecorations';
import type { Creature } from '../creature/model/creature';
import { Paragraph } from './paragraph';
import { FontOptions } from './fontOptions';
import { BaseNonForm2eSheet } from './generated2eBaseSheet';
import i18next from 'i18next';
import { XYLocation } from '../common/xyLocation';
import { Attribute } from '../helpers/attributes';
import { makeKey } from '../common/translationKey';
import { Department } from '../helpers/department';
import { labelWriter, VerticalAlignment } from './labelWriter';
import { TextAlign } from './textAlign';
import { FontSpecification } from './fontSpecification';
import { ReadableTalentModel, TalentWriter } from './talentWriter';
import type { RoleModel } from '../helpers/roles';
import { bullet2EWriter } from './bullet2eWriter';
import { PageArea } from './pageArea';
import type { CharacterType } from '../common/characterType';
import type { SpeciesAbilityAndOptions } from './generatedsheet';
import { SubTitle } from './subTitle';

export class Landscape2eCreatureSheet extends BaseNonForm2eSheet {
  static readonly column3 = new Column(
    216.1 + 216.1 + 55.6 + 20,
    72.6,
    479.3,
    216.1,
  );
  static readonly column2 = new Column(216.1 + 55.6 + 10, 72.6, 479.3, 216.1);
  static readonly column1 = new Column(
    55.6,
    72.6,
    479.3,
    216.1,
    Landscape2eCreatureSheet.column2,
  );

  static readonly headingColumn = new Column(73.8, 45, 8.8, 200);

  getLanguage(): string {
    return 'en';
  }
  getName(): string {
    return 'Creature Sheet';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/STA_2e_Creature_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/STA_2e_Landscape_Sheet_blank.pdf';
  }

  getDefaultFontPath() {
    return '/static/font/OpenSansCondensed-Light.ttf';
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);

    const page = pdf.getPage(0);

    new LandscapeSheetDecorations().drawSheetDecorations(page, tealColour2e);
    this.writeTitle(construct.name, page, tealColour2e);
    let area = this.writeDescription(
      new PageArea(Landscape2eCreatureSheet.column1, page),
      construct as Creature,
    );

    area = this.writeDetails(area, construct as Creature);
    area = area.bottomAfter(16).areaWithAtLeast(120);
    area = this.writeStatBoxes(area, construct as Creature);

    let column = area.areaWithAtLeast(40)?.column;
    const remainingArea = SubTitle.create(
      new PageArea(column, page),
      i18next.t('Construct.other.attacks'),
      this.headingFont,
    );
    column = remainingArea?.column;
    column = this.writeAttacks(page, construct, column);
    column = column.bottomAfter(16);

    column = column?.columnWithAtLeast(40, page)?.column;
    if (column) {
      const remainingArea = SubTitle.create(
        new PageArea(column, page),
        i18next.t('Construct.other.specialRules'),
        this.headingFont,
      );
      column = remainingArea?.column;

      await new TalentWriter(
        page,
        this.fonts,
        construct.version,
        tealColour2e,
        true,
      ).writeTalents(
        assembleCreatureTalents(construct as Creature),
        column,
        8,
        9,
        15,
        (paragraph) => bullet2EWriter(page, paragraph, tealColour2e),
      );
    }
  }

  writeDetails(aera: PageArea, creature: Creature) {
    let paragraph = new Paragraph(aera.page, aera.column, this.fonts);
    paragraph.append(
      i18next.t('Construct.creature.habitat').toLocaleUpperCase() + ': ',
      new FontSpecification(this.boldFont, 9),
      tealColour2e,
    );
    paragraph.append(
      creature.habitat?.localizedName ?? '',
      new FontSpecification(this.textFont, 9),
    );
    paragraph.write();

    paragraph = paragraph?.nextParagraph();
    paragraph?.append(
      i18next.t('Construct.creature.creatureType').toLocaleUpperCase() + ': ',
      new FontSpecification(this.boldFont, 9),
      tealColour2e,
    );
    paragraph?.append(
      creature.creatureType?.localizedName,
      new FontSpecification(this.textFont, 9),
    );
    paragraph?.write();

    paragraph = paragraph?.nextParagraph();
    paragraph?.append(
      i18next.t('Construct.creature.dietType').toLocaleUpperCase() + ': ',
      new FontSpecification(this.boldFont, 9),
      tealColour2e,
    );
    paragraph?.append(
      creature.diet?.localizedName,
      new FontSpecification(this.textFont, 9),
    );
    paragraph?.write();

    paragraph = paragraph?.nextParagraph();
    paragraph?.append(
      i18next.t('Construct.creature.size').toLocaleUpperCase() + ': ',
      new FontSpecification(this.boldFont, 9),
      tealColour2e,
    );
    paragraph?.append(
      creature.size?.localizedName,
      new FontSpecification(this.textFont, 9),
    );
    paragraph?.write();

    paragraph = paragraph?.nextParagraph();
    paragraph?.append(
      i18next.t('Construct.creature.locomotion').toLocaleUpperCase() + ': ',
      new FontSpecification(this.boldFont, 9),
      tealColour2e,
    );
    paragraph?.append(
      creature.locomotion.map((l) => l.description).join(', '),
      new FontSpecification(this.textFont, 9),
    );
    paragraph?.write();

    paragraph = paragraph?.nextParagraph();
    paragraph?.append(
      i18next.t('Construct.other.traits').toLocaleUpperCase() + ': ',
      new FontSpecification(this.boldFont, 9),
      tealColour2e,
    );
    paragraph?.append(
      creature.getAllTraits(),
      new FontSpecification(this.textFont, 9),
    );
    paragraph?.write();

    return paragraph?.nextArea(aera.page);
  }

  writeStatBoxes(area: PageArea, creature: Creature) {
    let remainingArea = SubTitle.create(
      area,
      i18next.t('Construct.other.attributes'),
      this.headingFont,
    );
    let column = remainingArea?.column;

    let boxes = new XYLocation(column.start.x, column.start.y);
    const statFrame =
      'M 2.835,0 C 1.269,0 0,1.269 0,2.835 V 9 c 0,1.565 1.269,2.835 2.835,2.835 h 60.567 c 1.565,0 2.835,-1.27 2.835,-2.835 V 2.835 C 66.237,1.269 64.967,0 63.402,0 Z';

    const rowHeight = 16;
    const labels = {};
    const width = 74;
    [
      Attribute.Control,
      Attribute.Fitness,
      Attribute.Presence,
      Attribute.Daring,
      Attribute.Insight,
      Attribute.Reason,
    ].forEach((a, i) => {
      const location = new XYLocation(
        boxes.x + (i % 3) * width,
        boxes.y + Math.floor(i / 3) * rowHeight,
      );
      const x = location.x;
      const y = area.page.getHeight() - location.y;
      area.page.moveTo(x, y);
      area.page.drawSvgPath(statFrame, {
        borderColor: SimpleColor.from('#979696').asPdfRbg(),
        borderWidth: 0.5,
      });

      const labelColumn = new Column(x + 2, location.y, 11.8, 64.5 * 0.8);
      const key = i18next.t(makeKey('Construct.attribute.', Attribute[a]));
      labels[key] = labelColumn;

      this.writeLabel(
        area.page,
        '' + creature.attributes[a],
        this.valueBlock(labelColumn),
        new FontSpecification(this.boldFont, 9),
        tealColour2e,
      );
    });

    column = column.bottomAfter(10 + 2 * rowHeight);
    if (creature.version > 1) {
      let remainingArea = SubTitle.create(
        new PageArea(column, area.page),
        i18next.t('Construct.other.departments'),
        this.headingFont,
      );
      column = remainingArea?.column;
    } else {
      let remainingArea = SubTitle.create(
        new PageArea(column, area.page),
        i18next.t('Construct.other.disciplines'),
        this.headingFont,
      );
      column = remainingArea?.column;
    }

    boxes = new XYLocation(column.start.x, column.start.y);
    [
      Department.Command,
      Department.Engineering,
      Department.Medicine,
      Department.Conn,
      Department.Security,
      Department.Science,
    ].forEach((s, i) => {
      const location = new XYLocation(
        boxes.x + (i % 3) * width,
        boxes.y + Math.floor(i / 3) * rowHeight,
      );
      const x = location.x;
      const y = area.page.getHeight() - location.y;
      area.page.moveTo(x, y);
      area.page.drawSvgPath(statFrame, {
        borderColor: SimpleColor.from('#979696').asPdfRbg(),
        borderWidth: 0.5,
      });

      const labelColumn = new Column(x + 2, location.y, 11.8, 64.5 * 0.8);
      const key = makeKey('Construct.discipline.', Department[s]);
      labels[key] = labelColumn;

      this.writeLabel(
        area.page,
        '' + creature.departments[s],
        this.valueBlock(labelColumn),
        new FontSpecification(this.boldFont, 9),
        labelColourProvider(creature.era, key),
      );
    });

    labelWriter(
      area.page,
      labels,
      creature.version,
      this.boldFont,
      9,
      (key) => labelColourProvider(creature.era, key),
      TextAlign.Right,
      '',
      VerticalAlignment.Middle,
    );

    return new PageArea(column.bottomAfter(10 + 2 * rowHeight), area.page);
  }

  writeDescription(area: PageArea, creature: Creature): PageArea {
    if (creature.description?.length) {
      let paragraph = new Paragraph(area.page, area.column, this.fonts);
      const descriptionParagraphs = creature.description.split('\n');
      const paragraphs = [paragraph];
      descriptionParagraphs.forEach((p, i) => {
        if (i > 0) {
          paragraph = paragraph?.nextParagraph();
          if (paragraph) {
            paragraphs.push(paragraph);
          }
        }
        paragraph?.append(p, new FontOptions(8));
      });

      paragraphs.forEach((p) => p.write());

      if (paragraphs.length) {
        const last = paragraphs.filter((p) => p.lines?.length).slice(-1)[0];
        if (last) {
          area = paragraph.nextArea(area.page).bottomAfter(10);
        }
      }
    }

    return area;
  }

  writeTitle(title: string, page: PDFPage, colour: SimpleColor) {
    const originalText = title.toLocaleUpperCase();
    let text = originalText;
    const fontSize = determineIdealFontWidth(
      [text],
      Landscape2eCreatureSheet.headingColumn.width,
      10,
      7.5,
      this.headingFont,
    );
    const block = Landscape2eCreatureSheet.headingColumn;
    let width = this.headingFont.widthOfTextAtSize(text, fontSize);
    while (width > block.width) {
      text = text.substring(0, text.length - 1);
      width = this.headingFont.widthOfTextAtSize(text + '...', fontSize);
    }

    if (text !== originalText) {
      text += '...';
    }

    const triangle =
      'M 60.232529,54.856579 V 44.842907 l 8.671875,5.009766 z m 0.580078,-1.001953 6.9375,-4.001953 -6.9375,-4.007813 z';

    const widthOfTab = Math.max(146.205, width + 35);
    const startOffset = 54.966797;

    const farthestEdge = widthOfTab + startOffset;
    const circle1 = farthestEdge - (189.83203 - 184.75613);
    const circle2 = farthestEdge - (189.83203 - 178.49414);

    const tab =
      'M 54.966797 40.257812 ' +
      'C 48.704803 40.257812 43.626953 45.333709 43.626953 51.595703 ' +
      'L 43.626953 79.257812 ' +
      'L 44.046875 79.257812 ' +
      'L 44.048828 70.263672 ' +
      'C 44.048828 64.286678 48.911678 59.425781 54.888672 59.425781 ' +
      'L ' +
      farthestEdge +
      ' 59.425781 ' +
      'L ' +
      farthestEdge +
      ' 51.595703 ' +
      'C ' +
      farthestEdge +
      ' 45.333709 ' +
      circle1 +
      ' 40.257812 ' +
      circle2 +
      ' 40.257812 ' +
      'L 54.966797 40.257812 ' +
      'z';

    page.moveTo(0, page.getHeight());

    page.drawSvgPath(tab, {
      borderColor: SimpleColor.from('#000000').asPdfRbg(),
      color: colour.asPdfRbg(),
      borderWidth: 0,
    });

    page.drawSvgPath(triangle, {
      borderColor: SimpleColor.from('#000000').asPdfRbg(),
      color: SimpleColor.from('#ffffff').asPdfRbg(),
      borderWidth: 0,
    });

    page.drawText(text, {
      x: block.start.x,
      y: page.getHeight() - block.end.y,
      color: SimpleColor.from('#ffffff').asPdfRbg(),
      font: this.headingFont,
      size: fontSize,
    });
  }
}

export const assembleCreatureTalents = (creature: Creature) => {
  const result: (ReadableTalentModel | RoleModel | SpeciesAbilityAndOptions)[] =
    [];

  creature.talents.forEach((t) => {
    const talent = t.talentModel;
    if (talent) {
      const readableTalent = new ReadableTalentModel(creature.type, talent);
      readableTalent.x = t.x;
      readableTalent.additionalInformation = t.additionalInformation;
      result.push(readableTalent);
    }
  });

  return result;
};
