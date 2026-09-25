import { test, expect, describe } from '@jest/globals';
import { md5Hex } from '../../src/vtt/md5';

const bytes = (text: string) => new TextEncoder().encode(text);

describe('md5Hex', () => {
  // Test suite from RFC 1321, appendix A.5
  test.each([
    ['', 'd41d8cd98f00b204e9800998ecf8427e'],
    ['a', '0cc175b9c0f1b6a831c399e269772661'],
    ['abc', '900150983cd24fb0d6963f7d28e17f72'],
    ['message digest', 'f96b697d7cb7938d525a2f31aaf161d0'],
    ['abcdefghijklmnopqrstuvwxyz', 'c3fcd3d76192e4007dfb496cca67e13b'],
    [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      'd174ab98d277d9f5a5611c2c9f419d9f',
    ],
    [
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
      '57edf4a22be3c955ac49da2e2107b67a',
    ],
  ])('md5 of "%s"', (input, expected) => {
    expect(md5Hex(bytes(input))).toBe(expected);
  });

  test('handles input around the 64-byte block boundary', () => {
    expect(md5Hex(bytes('a'.repeat(55)))).toBe(
      'ef1772b6dff9a122358552954ad0df65',
    );
    expect(md5Hex(bytes('a'.repeat(56)))).toBe(
      '3b0c8ac703f828b04c6c197006d17218',
    );
    expect(md5Hex(bytes('a'.repeat(64)))).toBe(
      '014842d480b571495a4a0363793f7367',
    );
  });
});
