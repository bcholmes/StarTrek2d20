import type { PDFFont, PDFPage, Rotation } from '@cantoo/pdf-lib';
import { degrees } from '@cantoo/pdf-lib';
import type { SimpleColor } from '../common/colour';
import type { FontSpecification } from './fontSpecification';

export class TextBlock {
  text: string;
  fontSize: number;
  font: PDFFont;
  height: number;
  width: number;
  colour?: SimpleColor;
  descender: number;
  underlined: boolean = false;

  static create(
    text: string,
    fontSpec: FontSpecification,
    descender: boolean | number = false,
    colour?: SimpleColor,
    underlined: boolean = false,
  ) {
    let weight = 0.5;
    if (typeof descender === 'boolean') {
      if (descender === true) {
        weight = 1;
      }
    } else {
      weight = descender;
    }

    const textBlock = new TextBlock();
    textBlock.text = text;
    const textWidth = fontSpec.font.widthOfTextAtSize(text, fontSpec.size);
    const textHeight =
      fontSpec.font.heightAtSize(fontSpec.size, { descender: false }) +
      this.descenderFor(fontSpec) * weight;
    textBlock.height = textHeight;
    textBlock.width = textWidth;
    textBlock.font = fontSpec.font;
    textBlock.fontSize = fontSpec.size;
    textBlock.colour = colour;
    textBlock.descender = weight;
    textBlock.underlined = underlined;
    return textBlock;
  }

  static descenderFor(fontSpec: FontSpecification) {
    return (
      fontSpec.font.heightAtSize(fontSpec.size) -
      fontSpec.font.heightAtSize(fontSpec.size, { descender: false })
    );
  }

  writeToPage(
    x: number,
    y: number,
    page: PDFPage,
    color: SimpleColor,
    rotate: Rotation = degrees(0),
  ) {
    page.drawText(this.text, {
      x: x,
      y: y,
      size: this.fontSize,
      font: this.font,
      color: this.colour == null ? color.asPdfRbg() : this.colour.asPdfRbg(),
      rotate: rotate,
    });

    if (this.underlined) {
      page.drawLine({
        start: { x: x, y: y - 1 },
        end: { x: x + this.width, y: y - 1 },
        thickness: 0.5,
        color: this.colour == null ? color.asPdfRbg() : this.colour.asPdfRbg(),
      });
    }
  }
}
