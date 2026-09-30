import { Canvg, presets } from 'canvg';
import type { TokenConfig } from '../common/character';

// canvg 4.0.3 types OffscreenCanvas.getContext("2d") as non-null, but the DOM
// type includes null. Returning that intersection keeps presets.offscreen()
// assignable to Canvg.from.
function createOffscreenCanvas(width: number, height: number) {
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not create a 2D canvas context');
  }
  return Object.assign(canvas, {
    getContext(contextId: '2d') {
      if (contextId !== '2d') {
        throw new Error('Could not create a 2D canvas context');
      }
      return context;
    },
  });
}

export class TokenHelper {
  private static async toPngBytes(data) {
    const { width, height, svg } = data;
    const canvas = createOffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not create a 2D canvas context');
    }
    const v = await Canvg.from(ctx, svg, {
      ...presets.offscreen(),
      createCanvas: createOffscreenCanvas,
    });

    // Render only first frame, ignoring animations and mouse.
    await v.render();

    const blob = await canvas.convertToBlob();
    return blob.arrayBuffer();
  }

  static async createTokenSvg(tokenConfig: TokenConfig) {
    const token = tokenConfig.token;
    const { TokenSvgBuilder } = await import(
      /* webpackChunkName: 'token' */ '../token/tokenSvgBuilder'
    );
    return await TokenSvgBuilder.loadDependenciesAndCreateSvg(
      token,
      tokenConfig.rounded,
      tokenConfig.rounded && tokenConfig.bordered,
    );
  }

  static async renderToken(tokenConfig: TokenConfig, size: number = 800) {
    const svg = await TokenHelper.createTokenSvg(tokenConfig);

    const bytes = await TokenHelper.toPngBytes({
      width: size,
      height: size,
      svg: svg,
    });
    return bytes;
  }

  static async renderSvg(svg: string, width: number, height: number) {
    return TokenHelper.toPngBytes({ width, height, svg });
  }
}
