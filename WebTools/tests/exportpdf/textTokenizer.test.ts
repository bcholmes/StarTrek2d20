import { test, expect, describe } from '@jest/globals'
import { textTokenizer } from '../../src/exportpdf/textTokenizer';

describe('test text tokenization', () => {
    test('should handle standard case', () => {

        let tokens = textTokenizer("very basic case");
        expect(tokens.length).toEqual(1);
    });

    test('should find challenge dice notation', () => {

        let tokens = textTokenizer("very basic [D] case");
        expect(tokens.length).toEqual(3);

        tokens = textTokenizer("very basic case [D]");
        expect(tokens.length).toEqual(2);

        tokens = textTokenizer("[D] very basic case");
        expect(tokens.length).toEqual(2);

    });

    test('should find bold markup', () => {

        let tokens = textTokenizer("very basic **case**");
        expect(tokens.length).toEqual(4);

    });

    test('should find italic markup', () => {

        let tokens = textTokenizer("very basic _case_ here");
        expect(tokens.length).toEqual(5);

    });

    test('should find mixed markup', () => {

        let tokens = textTokenizer("very basic _case_ here, but also with **some** bolding going on");
        expect(tokens.length).toEqual(9);
        expect(tokens[0]).toEqual("very basic ");
        expect(tokens[1]).toEqual("_");
        expect(tokens[2]).toEqual("case");
        expect(tokens[3]).toEqual("_");

    });
})
