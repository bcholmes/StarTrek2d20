import { textTokenizer } from '../exportpdf/textTokenizer';
import { splitToParagraphs } from './vttShared';

export const markupToHtml = (description: string) => {
  return description == null
    ? ''
    : splitToParagraphs(description)
        .map((d) => {
          const parts = textTokenizer(d);
          let result = '<p>';
          let style = '';
          parts.forEach((p) => {
            if (p === '**') {
              if (style === 'b' || style === 'bi') {
                result += '</b>';
                style = style === 'bi' ? 'i' : '';
              } else if (style === 'i') {
                result += '<b>';
                style = 'bi';
              } else {
                result += '<b>';
                style = 'b';
              }
            } else if (p === '_' || p === '*') {
              if (style === 'i' || style === 'bi') {
                result += '</i>';
                style = style === 'bi' ? 'b' : '';
              } else if (style === 'b') {
                result += '<i>';
                style = 'bi';
              } else {
                result += '<i>';
                style = 'i';
              }
            } else {
              result += p;
            }
          });
          return result + '</p>';
        })
        .join('');
};
