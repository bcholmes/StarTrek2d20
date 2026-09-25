import { Canvg, presets } from 'canvg';
import type { TokenConfig } from '../common/character';

export class TokenHelper {
  private static async toPngBytes(data) {
    const preset = presets.offscreen();
    const { width, height, svg } = data;
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const v = await Canvg.from(ctx, svg, preset);

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
