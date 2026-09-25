// MD5 (RFC 1321) of a byte array, as lower-case hex. MapTool names every image
// asset by the MD5 of its bytes, so the MapTool exporter needs this; the browser's
// Web Crypto API doesn't offer MD5.

const SHIFTS = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
  9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
  16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15,
  21,
];

const CONSTANTS = Array.from(
  { length: 64 },
  (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0,
);

export function md5Hex(input: Uint8Array): string {
  const length = input.length;
  const paddedLength = (((length + 8) >>> 6) + 1) << 6;
  const bytes = new Uint8Array(paddedLength);
  bytes.set(input);
  bytes[length] = 0x80;
  const view = new DataView(bytes.buffer);
  view.setUint32(paddedLength - 8, (length << 3) >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(length / 0x20000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const words = new Uint32Array(16);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i++) {
      words[i] = view.getUint32(offset + i * 4, true);
    }
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;
    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      const sum = (a + f + CONSTANTS[i] + words[g]) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + ((sum << SHIFTS[i]) | (sum >>> (32 - SHIFTS[i])))) >>> 0;
    }
    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const out = new DataView(new ArrayBuffer(16));
  out.setUint32(0, a0, true);
  out.setUint32(4, b0, true);
  out.setUint32(8, c0, true);
  out.setUint32(12, d0, true);
  let hex = '';
  for (let i = 0; i < 16; i++) {
    hex += out.getUint8(i).toString(16).padStart(2, '0');
  }
  return hex;
}
