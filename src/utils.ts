/**
 * Helper functions for the pixel art maker
 */

/** RGB color interface */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Converts hex color to RGB
 */
export const hexToRgb = (hex: string): RgbColor => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255,
      }
    : {
        r: 0,
        g: 0,
        b: 0,
        a: 255,
      };
};
