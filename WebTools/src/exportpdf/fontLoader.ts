import { type PDFDocument, type PDFFont } from '@cantoo/pdf-lib';
import { type FontLibrary, FontType } from './fontLibrary';

export const fontLoader2e = async (
  pdf: PDFDocument,
  fonts: FontLibrary,
  formFont?: PDFFont,
) => {
  const fontBytes = await fetch('/static/font/Michroma-Regular.ttf').then(
    (res) => res.arrayBuffer(),
  );
  const headingFont = await pdf.embedFont(fontBytes);
  fonts.addFont(FontType.Heading, headingFont);

  if (formFont != null) {
    fonts.addFont(FontType.Standard, formFont);
  }

  const boldFontBytes = await fetch(
    '/static/font/OpenSansCondensed-Bold.ttf',
  ).then((res) => res.arrayBuffer());
  const boldFont = await pdf.embedFont(boldFontBytes);
  fonts.addFont(FontType.Bold, boldFont);

  const italicFontBytes = await fetch(
    '/static/font/OpenSansCondensed-LightItalic.ttf',
  ).then((res) => res.arrayBuffer());
  const italicFont = await pdf.embedFont(italicFontBytes);
  fonts.addFont(FontType.Italic, italicFont);

  const boldItalicFontBytes = await fetch(
    '/static/font/OpenSansCondensed-BoldItalic.ttf',
  ).then((res) => res.arrayBuffer());
  const boldItalicFont = await pdf.embedFont(boldItalicFontBytes);
  fonts.addFont(FontType.BoldItalic, boldItalicFont);

  const symbolFontBytes = await fetch('/static/font/Trek_Arrowheads.ttf').then(
    (res) => res.arrayBuffer(),
  );
  const symbolFont = await pdf.embedFont(symbolFontBytes);
  fonts.addFont(FontType.Symbol, symbolFont);
};
