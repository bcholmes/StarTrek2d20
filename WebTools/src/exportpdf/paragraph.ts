import type { PDFPage } from '@cantoo/pdf-lib';
import type { Column } from './column';
import { SimpleColor } from '../common/colour';
import { XYLocation } from '../common/xyLocation';
import { FontSpecification } from './fontSpecification';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import { TextBlock } from './textBlock';
import type { FontLibrary } from './fontLibrary';
import { FontType } from './fontLibrary';
import { textTokenizer } from './textTokenizer';
import type { FontOptions } from './fontOptions';
import { TextAlign } from './textAlign';
import { PageArea } from './pageArea';

// A line represents one line of text inside a paragrap and/or column of text. The line can
// contain different text blocks (including some blocks that have different fonts or font weights),
// and we need to adjust the overall baseline of the line so that it can accommodate all such
// blocks.
export class Line {
  readonly indentAmount: number;
  blocks: TextBlock[];
  column: Column;
  page: PDFPage;
  location: XYLocation; // represents the upper-left-hand corner of the line

  constructor(
    location: XYLocation,
    page: PDFPage,
    column: Column,
    indentAmount: number = 0,
    blocks?: TextBlock[],
  ) {
    this.location =
      indentAmount > 0
        ? new XYLocation(location.x + indentAmount, location.y)
        : location;
    this.blocks = blocks || [];
    this.column = column;
    this.page = page;
    this.indentAmount = indentAmount;
  }

  height() {
    let h = 0.0;
    this.blocks.forEach((b) => {
      if (b.height > h) h = b.height;
    });
    return h;
  }
  bottom(): XYLocation {
    return new XYLocation(this.location.x, this.location.y - this.height());
  }
  availableWidth() {
    let w = 0.0;
    this.blocks.forEach((b) => (w += b.width));
    return this.column.width - this.indentAmount - w;
  }
  isEmpty() {
    return this.blocks.length === 0;
  }
  append(block: TextBlock) {
    if (this.blocks.length) {
      const lastBlock = this.blocks[this.blocks.length - 1];
      if (
        block.font === lastBlock.font &&
        block.fontSize === lastBlock.fontSize &&
        block.colour?.asHex() === lastBlock.colour?.asHex() &&
        block.descender === lastBlock.descender &&
        block.underlined === lastBlock.underlined
      ) {
        const newBlock = TextBlock.create(
          lastBlock.text + block.text,
          new FontSpecification(block.font, block.fontSize),
          block.descender,
          block.colour,
          block.underlined,
        );
        this.blocks[this.blocks.length - 1] = newBlock;
      } else {
        this.blocks.push(block);
      }
    } else {
      this.blocks.push(block);
    }
  }
  add(block: TextBlock) {
    this.blocks.push(block);
  }
  addAll(blocks: TextBlock[]) {
    Array.prototype.push.apply(this.blocks, blocks);
  }

  nextLine() {
    return new Line(
      new XYLocation(this.bottom().x - this.indentAmount, this.bottom().y),
      this.page,
      this.column,
      this.indentAmount,
    ).moveToNextColumnIfNecessary();
  }

  public moveToNextColumnIfNecessary() {
    if (this.column.contains(this.bottom(), this.page)) {
      return this;
    } else {
      const result = this.column.advanceToNextColumn(this.page);
      if (result) {
        const location = result.column.translatedStart(result.page);
        return new Line(
          location,
          result.page,
          result.column,
          this.indentAmount,
          this.blocks,
        );
      } else {
        return undefined;
      }
    }
  }

  writeTextBlocks(color: SimpleColor, offset: number = 0) {
    let x = this.bottom().x + offset;
    this.blocks.forEach((textBlock) => {
      textBlock.writeToPage(x, this.bottom().y, this.page, color);
      x += textBlock.width;
    });
  }

  get width() {
    let result = 0;
    this.blocks.forEach((b) => (result += b.width));
    return result;
  }
}

export class Paragraph {
  column: Column;
  lines: Line[] = [];
  page: PDFPage;
  indentAmount: number;
  fontLibrary: FontLibrary;
  textAlignment: TextAlign = TextAlign.Left;

  // in PDF coordinate system
  private start?: XYLocation;

  constructor(page: PDFPage, column: Column, fontLibrary: FontLibrary) {
    this.column = column;
    this.page = page;
    this.fontLibrary = fontLibrary;
  }

  static create(pageArea: PageArea, fontLibrary: FontLibrary) {
    return new Paragraph(pageArea.page, pageArea.column, fontLibrary);
  }

  get symbolFont() {
    return this.fontLibrary.fontByType(FontType.Symbol);
  }

  get startColumn(): Column {
    if (this.lines?.length) {
      const firstLine = this.lines[0];
      return firstLine.column;
    } else {
      return this.column;
    }
  }

  get endColumn(): Column {
    if (this.lines?.length) {
      const lastLine = this.lines[this.lines.length - 1];
      return lastLine.column;
    } else {
      return this.column;
    }
  }

  get endPage(): PDFPage {
    if (this.lines?.length) {
      const lastLine = this.lines[this.lines.length - 1];
      return lastLine.page;
    } else {
      return this.page;
    }
  }

  private currentLine() {
    if (this.lines.length === 0) {
      const column = this.column;
      let start = this.start;
      if (start == null) {
        start = column.translatedStart(this.page);
      }
      return new Line(start, this.page, column, this.indentAmount);
    } else {
      return this.lines[this.lines.length - 1];
    }
  }

  get spansColumns() {
    if (this.lines?.length === 1) {
      return false;
    } else if (this.lines?.length) {
      const firstLine = this.lines[0];
      const lastLine = this.lines[this.lines.length - 1];

      return !(
        firstLine.column.start.x === lastLine.column.start.x &&
        firstLine.column.start.y === lastLine.column.start.y &&
        firstLine.column.height === lastLine.column.height &&
        firstLine.column.width === lastLine.column.width
      );
    } else {
      return false;
    }
  }

  indent(amount: number) {
    this.indentAmount = amount;
  }

  append(
    text: string | number,
    font: FontSpecification | FontOptions,
    colour?: SimpleColor,
  ) {
    let fontSpecification = null;
    let options = null;
    if (font instanceof FontSpecification) {
      fontSpecification = font as FontSpecification;
    } else {
      options = font as FontOptions;
      const pdfFont = this.fontLibrary.fontByType(options.fontType);
      fontSpecification = new FontSpecification(pdfFont, options.size);
    }
    this.lines = this.createLines(
      '' + text,
      fontSpecification,
      options,
      this.page,
      colour,
    );
  }

  write(colour: SimpleColor = SimpleColor.from('#000000')) {
    this.lines.forEach((t) => {
      let offset = 0;
      if (this.textAlignment === TextAlign.Centre) {
        offset = t.availableWidth() / 2;
      }
      t.writeTextBlocks(colour, offset);
    });
  }

  // Provide the remaining column area "underneath" the paragraph.
  nextColumn() {
    const bottom = this.bottom;
    const column = this.endColumn;
    return column?.bottomAfter(bottom.y - column.start.y);
  }

  nextArea(currentPage: PDFPage, minimumHeight?: number): PageArea | undefined {
    if (this.lines?.length) {
      const column = this.nextColumn();
      const page = this.lines[this.lines.length - 1].page;

      if (minimumHeight != null) {
        return column.columnWithAtLeast(minimumHeight, page);
      } else {
        return new PageArea(column, page);
      }
    } else {
      return new PageArea(this.column, currentPage);
    }
  }

  nextParagraph(blankLine: number = 0.5) {
    let result = new Paragraph(this.endPage, this.endColumn, this.fontLibrary);
    if (this.lines.length > 0) {
      let line = this.lines[this.lines.length - 1];
      let newLocation = line.location;
      newLocation = new XYLocation(
        line.bottom().x - line.indentAmount,
        line.bottom().y - blankLine * line.height(),
      );

      if (newLocation && line.column) {
        const currentColumn = line.column;
        const newLine = new Line(
          newLocation,
          this.endPage,
          currentColumn,
          this.indentAmount,
        );
        line = newLine.moveToNextColumnIfNecessary();
        if (line) {
          newLocation = new XYLocation(
            line.bottom().x - line.indentAmount,
            line.bottom().y,
          );
        }
      }

      if (line) {
        result = new Paragraph(line.page, line.column, this.fontLibrary);
        result.start = newLocation;
        if (this.indentAmount) {
          result.indent(this.indentAmount);
        }
      } else {
        result = null;
      }
    }

    return result;
  }

  get bottom() {
    if (this.lines.length > 0) {
      const line = this.lines[this.lines.length - 1];
      return this.column.untranslateLocation(this.page, line.bottom());
    } else {
      return this.column.start;
    }
  }

  private createLines(
    text: string,
    initialFont: FontSpecification,
    options: FontOptions,
    page: PDFPage,
    colour?: SimpleColor,
  ) {
    const result: Line[] = [...this.lines];
    let fontSpec = initialFont;
    let fontType = options?.fontType;
    if (result.length === 0) {
      const temp = this.currentLine();
      if (temp != null) {
        result.push(temp);
      }
    }

    let tokens = textTokenizer(text);
    let skipSpace = false;
    let underline = false;
    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];
      if (
        token === '_' ||
        token === '**' ||
        token === '*' ||
        token === '<u>' ||
        token === '</u>'
      ) {
        skipSpace = true;
        if (options != null) {
          if (token === '**') {
            if (fontType === FontType.Italic) {
              fontType = FontType.BoldItalic;
            } else if (fontType === FontType.BoldItalic) {
              fontType = FontType.Italic;
            } else if (fontType === FontType.Bold) {
              fontType = options.fontType;
            } else {
              fontType = FontType.Bold;
            }
            const font = this.fontLibrary.fontByType(fontType);
            if (font != null) {
              fontSpec = new FontSpecification(font, options.size);
            }
          } else if (token === '_' || token === '*') {
            if (fontType === FontType.Bold) {
              fontType = FontType.BoldItalic;
            } else if (fontType === FontType.BoldItalic) {
              fontType = FontType.Bold;
            } else if (fontType === FontType.Italic) {
              fontType = options.fontType;
            } else {
              fontType = FontType.Italic;
            }
            const font = this.fontLibrary.fontByType(fontType);
            if (font != null) {
              fontSpec = new FontSpecification(font, options.size);
            }
          } else if (token === '<u>' || token === '</u>') {
            underline = token === '<u>';
          }
        }
      } else if (token === CHALLENGE_DICE_NOTATION) {
        const block = TextBlock.create(
          'A',
          new FontSpecification(
            this.fontLibrary.fontByType(FontType.Symbol),
            fontSpec.size,
          ),
          false,
          colour,
        );
        let line = result[result.length - 1];
        if (block.width < line.availableWidth()) {
          line.append(block);
        } else {
          line = line.nextLine();
          if (line != null) {
            result.push(line);
            line.append(block);

            // maybe the latest changes required a column change
            const newLine = line.moveToNextColumnIfNecessary();
            if (newLine == null) {
              // skip it
            } else if (newLine !== line) {
              result[result.length - 1] = newLine;
            }
          } else {
            break;
          }
        }
      } else {
        const words = token.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
          let line = result[result.length - 1];

          if (line) {
            let word = words[i];
            if (!line?.isEmpty() && !skipSpace) {
              word = ' ' + word;
            } else {
              skipSpace = false;
            }
            const block = TextBlock.create(
              word,
              fontSpec,
              false,
              colour,
              underline,
            );

            if (block.width < line.availableWidth()) {
              line.append(block);
            } else {
              line = line.nextLine();
              if (line != null) {
                result.push(line);

                line.append(
                  TextBlock.create(
                    word.trim(),
                    fontSpec,
                    false,
                    colour,
                    underline,
                  ),
                );
              } else {
                tokens = [];
                break;
              }
            }

            // maybe the latest changes required a column change
            const newLine = line.moveToNextColumnIfNecessary();
            if (newLine != null && newLine !== line) {
              result[result.length - 1] = newLine;
            }
          } else {
            break;
          }
        }
      }
    }

    return result;
  }
}
