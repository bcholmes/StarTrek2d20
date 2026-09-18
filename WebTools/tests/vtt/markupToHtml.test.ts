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

  test('drops blank lines so they do not emit empty paragraphs', () => {
    const result = markupToHtml('First paragraph.\n\nSecond paragraph.');

    expect(result).toBe('<p>First paragraph.</p><p>Second paragraph.</p>');
    expect(result).not.toContain('<p></p>');
  });

  test('drops a trailing newline instead of emitting an empty paragraph', () => {
    expect(markupToHtml('Only paragraph.\n')).toBe('<p>Only paragraph.</p>');
  });

  test('returns an empty string for an empty description', () => {
    expect(markupToHtml('')).toBe('');
  });
});
