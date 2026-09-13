import { test, expect, describe } from '@jest/globals';
import { textTokenizer } from '../../src/exportpdf/textTokenizer';

describe('test text tokenization', () => {
  test('should handle standard case', () => {
    const tokens = textTokenizer('very basic case');
    expect(tokens.length).toEqual(1);
  });

  test('should find challenge dice notation', () => {
    let tokens = textTokenizer('very basic [D] case');
    expect(tokens.length).toEqual(3);

    tokens = textTokenizer('very basic case [D]');
    expect(tokens.length).toEqual(2);

    tokens = textTokenizer('[D] very basic case');
    expect(tokens.length).toEqual(2);
  });

  test('should find bold markup', () => {
    const tokens = textTokenizer('very basic **case**');
    expect(tokens.length).toEqual(4);
    expect(tokens[1]).toEqual('**');
  });

  test('should find italic markup', () => {
    const tokens = textTokenizer('very basic _case_ here');
    expect(tokens.length).toEqual(5);
  });

  test('should find alternative italic markup', () => {
    const tokens = textTokenizer('very basic *case* here');
    expect(tokens.length).toEqual(5);
  });

  test('should find mixed markup', () => {
    const tokens = textTokenizer(
      'very basic _case_ here, but also with **some** bolding going on',
    );
    expect(tokens.length).toEqual(9);
    expect(tokens[0]).toEqual('very basic ');
    expect(tokens[1]).toEqual('_');
    expect(tokens[2]).toEqual('case');
    expect(tokens[3]).toEqual('_');
  });

  test('should find mixed markup, including single-asterisk italics', () => {
    const tokens = textTokenizer(
      'very basic _case_ here, but also with *some* **bolding** going on',
    );
    expect(tokens.length).toEqual(13);
    expect(tokens[0]).toEqual('very basic ');
    expect(tokens[1]).toEqual('_');
    expect(tokens[2]).toEqual('case');
    expect(tokens[3]).toEqual('_');
    expect(tokens[4]).toEqual(' here, but also with ');
    expect(tokens[5]).toEqual('*');
    expect(tokens[6]).toEqual('some');
    expect(tokens[7]).toEqual('*');
    expect(tokens[8]).toEqual(' ');
    expect(tokens[9]).toEqual('**');
  });
});
