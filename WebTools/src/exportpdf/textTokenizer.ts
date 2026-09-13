import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';

const indexOfToken = (text: string, token: string, start: number) => {
  return {
    index: text.indexOf(token, start),
    length: token.length,
  };
};

export const textTokenizer = (text: string) => {
  const result = [];
  let start = 0;
  while (start < text?.length) {
    const indices = [];
    indices.push(indexOfToken(text, CHALLENGE_DICE_NOTATION, start));
    indices.push(indexOfToken(text, '_', start));
    indices.push(indexOfToken(text, '**', start));
    indices.push(indexOfToken(text, '*', start));
    indices.push(indexOfToken(text, '<u>', start));
    indices.push(indexOfToken(text, '</u>', start));

    indices.sort((a, b) => {
      if (a.index === b.index) {
        return b.length - a.length;
      } else if (a.index >= 0 && b.index < 0) {
        return -1;
      } else if (a.index < 0 && b.index >= 0) {
        return 1;
      } else {
        return a.index - b.index;
      }
    });

    const index = indices[0];

    if (index.index >= start) {
      if (index.index > start) {
        result.push(text.substring(start, index.index));
      }
      result.push(text.substring(index.index, index.index + index.length));
      start = index.index + index.length;
    } else {
      result.push(text.substring(start));
      start = text.length;
    }
  }

  return result;
};
