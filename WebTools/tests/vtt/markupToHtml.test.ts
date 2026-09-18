import { test, expect, describe } from '@jest/globals';
import { markupToHtml } from '../../src/vtt/markupToHtml';

describe('markupToHtml', () => {
  test('renders each paragraph separately with no separator between them', () => {
    const result = markupToHtml('First paragraph.\nSecond paragraph.');

    expect(result).toBe('<p>First paragraph.</p><p>Second paragraph.</p>');
    expect(result).not.toContain(',');
  });

  test('renders bold markup', () => {
    expect(markupToHtml('a **bold** word')).toBe('<p>a <b>bold</b> word</p>');
  });

  test('renders italics markup', () => {
    expect(markupToHtml('a _italic_ word')).toBe('<p>a <i>italic</i> word</p>');
  });

  test('returns an empty string for a null description', () => {
    expect(markupToHtml(null as unknown as string)).toBe('');
  });
});
