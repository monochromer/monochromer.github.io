import { createCanvas, ImageData } from '@napi-rs/canvas';

export default {
  data: {
    permalink: '/assets/noise.png',
    tileSize: 64
  },

  // Нужно использовать `async`. https://github.com/11ty/eleventy/issues/3629
  async render(data) {
    const tileSize = data.tileSize ?? 64;
    const black = new Uint8ClampedArray([0, 0, 0, 255]);
    const white = new Uint8ClampedArray([255, 255, 255, 255]);
    const result = new Uint8ClampedArray(tileSize * tileSize * 4);

    for (let row = 0; row < tileSize; row++) {
      for (let column = 0; column < tileSize; column++) {
        result.set(Math.random() > 0.5 ? white : black, (row * tileSize + column) * 4);
      }
    }

    const canvas = createCanvas(tileSize, tileSize);
    const context = canvas.getContext('2d');
    context.putImageData(new ImageData(result, tileSize, tileSize), 0, 0);

    return canvas.toBuffer('image/png');
  }
}