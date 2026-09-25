import type { Character } from '../common/character';
import { Division } from '../common/character';
import { CharacterType } from '../common/characterType';
import type { Starship } from '../common/starship';
import { TokenHelper } from '../exportpdf/tokenHelper';
import type { MapToolTokenImage } from './mapToolVttExporter';

// Pictures for MapTool tokens. A character made in the Token Creator uses its
// portrait; anything else gets a round badge with its initials.

const TOKEN_SIZE = 512;
const THUMBNAIL_SIZE = 50;
const LARGE_THUMBNAIL_SIZE = 500;

function initials(name: string) {
  const words = (name ?? '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length);
  if (words.length === 0) {
    return '?';
  } else if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  } else {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
}

function escapeSvg(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function badgeSvg(text: string, ringColor: string, fillColor: string) {
  const size = TOKEN_SIZE;
  const middle = size / 2;
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 ' +
    size +
    ' ' +
    size +
    '">' +
    '<circle cx="' +
    middle +
    '" cy="' +
    middle +
    '" r="' +
    (middle - 8) +
    '" fill="' +
    fillColor +
    '" stroke="' +
    ringColor +
    '" stroke-width="28"/>' +
    '<text x="' +
    middle +
    '" y="' +
    (middle + 64) +
    '" font-family="Helvetica, Arial, sans-serif" font-size="180" font-weight="bold" text-anchor="middle" fill="#f5f5f5">' +
    escapeSvg(text) +
    '</text></svg>'
  );
}

function divisionColor(character: Character) {
  if (character.type !== CharacterType.Starfleet) {
    return '#8a8f98';
  }
  switch (character.division) {
    case Division.Command:
      return '#c1272d';
    case Division.Operations:
      return '#d9a520';
    case Division.Science:
      return '#2f7f9e';
    default:
      return '#8a8f98';
  }
}

async function toBytes(buffer: ArrayBuffer) {
  return new Uint8Array(buffer);
}

async function scale(png: Uint8Array, size: number, original: number) {
  const target = Math.min(size, original);
  const bitmap = await createImageBitmap(
    new Blob([png], { type: 'image/png' }),
  );
  const canvas = new OffscreenCanvas(target, target);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, target, target);
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return new Uint8Array(await blob.arrayBuffer());
}

async function withThumbnails(
  png: Uint8Array,
  size: number,
  shape: MapToolTokenImage['shape'],
): Promise<MapToolTokenImage> {
  return {
    png,
    width: size,
    height: size,
    shape,
    thumbnail: await scale(png, THUMBNAIL_SIZE, size),
    thumbnailLarge: await scale(png, LARGE_THUMBNAIL_SIZE, size),
  };
}

export async function renderCharacterTokenImage(
  character: Character,
): Promise<MapToolTokenImage> {
  if (character.token) {
    const png = await toBytes(
      await TokenHelper.renderToken(character.token, TOKEN_SIZE),
    );
    return withThumbnails(
      png,
      TOKEN_SIZE,
      character.token.rounded ? 'CIRCLE' : 'SQUARE',
    );
  } else {
    const png = await toBytes(
      await TokenHelper.renderSvg(
        badgeSvg(
          initials(character.name || 'Unnamed Character'),
          divisionColor(character),
          '#1d2533',
        ),
        TOKEN_SIZE,
        TOKEN_SIZE,
      ),
    );
    return withThumbnails(png, TOKEN_SIZE, 'CIRCLE');
  }
}

export async function renderStarshipTokenImage(
  starship: Starship,
): Promise<MapToolTokenImage> {
  const png = await toBytes(
    await TokenHelper.renderSvg(
      badgeSvg(
        initials(starship.name || starship.className || 'Starship'),
        '#9aa3ad',
        '#2b3440',
      ),
      TOKEN_SIZE,
      TOKEN_SIZE,
    ),
  );
  return withThumbnails(png, TOKEN_SIZE, 'TOP_DOWN');
}
