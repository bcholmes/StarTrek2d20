import type { PDFDocument, PDFPage } from '@cantoo/pdf-lib';
import { BasicGeneratedSheet } from './generatedsheet';
import { TextBlock } from './textBlock';
import { FontSpecification } from './fontSpecification';
import { Column } from './column';
import { SimpleColor } from '../common/colour';
import type { Construct } from '../common/construct';
import { DepartmentsHelper, Department } from '../helpers/department';
import { Attribute, AttributesHelper } from '../helpers/attributes';
import i18next from 'i18next';
import { makeKey } from '../common/translationKey';
import { Character } from '../common/character';
import { System, allSystems } from '../helpers/systems';
import { Paragraph } from './paragraph';
import { FontType } from './fontLibrary';
import { FontOptions } from './fontOptions';
import { WeaponDescriber } from './weaponDescriber';
import { bullet2EWriter } from './bullet2eWriter';
import { tealColour2e } from './colourProvider2e';
import { fontLoader2e } from './fontLoader';

export abstract class BaseNonForm2eSheet extends BasicGeneratedSheet {
  static readonly greyColour: SimpleColor = SimpleColor.from('#979696');

  static readonly bulletPath =
    'M 1.98633,0 C 0.88552,0 0,0.887478 0,1.988281 v 2.52539 C 0,5.614474 0.88552,6.5 1.98633,6.5 H 7.35 C 9.1505,6.5 10.6,5.050496 10.6,3.25 10.6,1.449502 9.1505,0 7.35,0 Z';

  async initializeFonts(pdf: PDFDocument) {
    await super.initializeFonts(pdf);

    await fontLoader2e(pdf, this.fonts, this.formFont);
    this.headingFont = this.fonts.fontByType(FontType.Heading);
  }

  get boldFont() {
    return this.fonts.fontByType(FontType.Bold);
  }

  get textFont() {
    return this.fonts.fontByType(FontType.Standard);
  }

  get nameColumn() {
    return new Column(75, 48, 15, 550 - 90);
  }

  writeLabel(
    page: PDFPage,
    originalText: string,
    column: Column,
    font: FontSpecification,
    colour: SimpleColor,
  ) {
    originalText = originalText.toLocaleUpperCase();
    let textBlock = TextBlock.create(originalText, font, false);

    let text = originalText;
    let width = font.font.widthOfTextAtSize(text, font.size);
    while (width > column.width) {
      text = text.substring(0, text.length - 1);
      width = font.font.widthOfTextAtSize(text + '...', font.size);
    }

    if (text !== originalText) {
      text += '...';
      textBlock = TextBlock.create(text, font, false);
    }

    const y = column.end.y - 1 - (column.height - textBlock.height) / 2;
    const x = column.start.x + (column.width - textBlock.width);
    textBlock.writeToPage(x, page.getHeight() - y, page, colour);
  }

  determineAllStatLabels(construct: Construct) {
    const text = [];
    if (construct instanceof Character) {
      DepartmentsHelper.instance
        .getDepartments()
        .forEach((s) =>
          text.push(i18next.t(makeKey('Construct.discipline.', Department[s]))),
        );
      AttributesHelper.getAllAttributes().forEach((a) =>
        text.push(i18next.t(makeKey('Construct.attribute.', Attribute[a]))),
      );
    } else {
      DepartmentsHelper.instance
        .getDepartments()
        .forEach((d) =>
          text.push(i18next.t(makeKey('Construct.department.', Department[d]))),
        );
      allSystems().forEach((s) =>
        text.push(i18next.t(makeKey('Construct.system.', System[s]))),
      );
    }
    return text;
  }

  determineFontSizeForWidth(text: string[], minWidth: number) {
    let fontSize = 5.5;
    for (let i = 8.5; i >= 5.5; i -= 0.25) {
      let ok = true;
      for (const t of text) {
        const block = TextBlock.create(
          t,
          new FontSpecification(this.boldFont, i),
        );
        if (block.width > minWidth - 4) {
          ok = false;
          break;
        }
      }

      if (ok) {
        fontSize = i;
        break;
      }
    }
    return fontSize;
  }

  writeSubTitle(page: PDFPage, text: string, block: Column) {
    if (block.height > 13) {
      block = block.topBefore(13);
    }
    const font = new FontSpecification(this.headingFont, 9);
    const textBlock = TextBlock.create(text.toLocaleUpperCase(), font, 0);

    let lead = (block.width - textBlock.width) / 2;
    lead = Math.min(12, lead - 4);

    const x = block.start.x + lead + 4;
    const y = block.end.y - 1 - (block.height - textBlock.height) / 2;
    textBlock.writeToPage(
      x,
      page.getHeight() - y,
      page,
      SimpleColor.from('#000000'),
    );

    page.drawLine({
      start: {
        x: block.start.x,
        y: page.getHeight() - (y + 3 - block.height / 2),
      },
      end: {
        x: block.start.x + lead,
        y: page.getHeight() - (y + 3 - block.height / 2),
      },
      thickness: 1,
      color: BaseNonForm2eSheet.greyColour.asPdfRbg(),
    });

    const end = block.start.x + lead + 4 + textBlock.width + 4;
    if (end < block.end.x) {
      page.drawLine({
        start: { x: end, y: page.getHeight() - (y + 3 - block.height / 2) },
        end: {
          x: block.end.x,
          y: page.getHeight() - (y + 3 - block.height / 2),
        },
        thickness: 1,
        color: BaseNonForm2eSheet.greyColour.asPdfRbg(),
      });
    }
  }

  valueBlock(block: Column) {
    return new Column(block.end.x + 1, block.start.y, block.height, 10);
  }

  writeAttacks(
    page: PDFPage,
    construct: Construct,
    column: Column,
    colour: SimpleColor = tealColour2e,
  ) {
    const bold = new FontOptions(9, FontType.Bold);
    const standard = new FontOptions(9);
    let paragraph = null;
    let bottom = column.start;

    construct.determineWeapons().forEach((w) => {
      const text = new WeaponDescriber(construct.version, false).describeFully(
        w,
        construct,
      );

      paragraph =
        paragraph == null
          ? new Paragraph(page, column, this.fonts)
          : paragraph.nextParagraph(0);
      paragraph?.indent(15);
      if (w.escalation) {
        paragraph?.append(
          i18next.t('Weapon.common.escalation', { value: w.escalation }) + ': ',
          bold,
          colour,
        );
      }
      paragraph?.append(w.name + ': ', bold);
      paragraph?.append(text, standard);
      paragraph?.write();

      if (paragraph?.lines?.length) {
        bullet2EWriter(page, paragraph, colour);
      }

      bottom = paragraph?.bottom;
    });

    return bottom ? column.bottomAfter(bottom.y - column.start.y) : null;
  }
}
