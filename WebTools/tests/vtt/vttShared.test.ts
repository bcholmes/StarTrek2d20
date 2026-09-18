import { test, expect, describe } from '@jest/globals';
import {
  normalizeChallengeDice,
  splitToParagraphs,
} from '../../src/vtt/vttShared';

describe('normalizeChallengeDice', () => {
  test('replaces every challenge dice token, not just the first', () => {
    const description =
      'take 3[D] Stress, which inflicts 6[D] damage and 9[D] more';

    expect(normalizeChallengeDice(description)).toBe(
      'take 3CD Stress, which inflicts 6CD damage and 9CD more',
    );
  });

  test('leaves text without challenge dice notation unchanged', () => {
    expect(normalizeChallengeDice('roll a d20')).toBe('roll a d20');
  });

  test('returns an empty string when given no description', () => {
    expect(normalizeChallengeDice(null as unknown as string)).toBe('');
  });
});

describe('splitToParagraphs', () => {
  test('drops empty lines', () => {
    expect(splitToParagraphs('One.\n\nTwo.')).toEqual(['One.', 'Two.']);
  });
});
