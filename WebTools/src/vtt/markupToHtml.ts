import { textTokenizer } from '../exportpdf/textTokenizer';

export const markupToHtml = (description: string) => {
  return description == null
    ? ''
    : description
        .split('\n')
        .map((d) => {
          const parts = textTokenizer(d);
          let result = '<p>';
          let style = '';
          parts.forEach((p) => {
            if (p === '**') {
              if (style === 'b') {
                result += '</b>';
                style = '';
              } else {
                result += '<b>';
                style = 'b';
              }
            } else if (p === '_' || p === '*') {
              if (style === 'i') {
                result += '</i>';
                style = '';
              } else {
                result += '<i>';
                style = 'i';
              }
            } else if (p === '<u>' || p === '</u>') {
              result += p;
            } else {
              result += p;
            }
          });
          return result + '</p>';
        })
        .join();
};
