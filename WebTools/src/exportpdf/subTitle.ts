import type { PDFFont } from '@cantoo/pdf-lib';
import { FontSpecification } from './fontSpecification';
import type { PageArea } from './pageArea';
import { TextBlock } from './textBlock';
import { SimpleColor } from '../common/colour';
import { greyColour2e } from './colourProvider2e';

export class SubTitle {
  static create(pageArea: PageArea, text: string, headingFont: PDFFont) {
    const page = pageArea.page;
    let block = pageArea.column;

    if (block.height > 13) {
      block = block.topBefore(13);
    }
    const font = new FontSpecification(headingFont, 9);
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
      color: greyColour2e.asPdfRbg(),
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
        color: greyColour2e.asPdfRbg(),
      });
    }

    return pageArea.bottomAfter(16);
  }
}
