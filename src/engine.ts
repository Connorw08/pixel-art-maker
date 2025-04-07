/**
 * Core functionality for the pixel art maker
 */

import { hexToRgb } from "./utils";

/** Supported drawing tools */
export enum DrawingTool {
  Pencil,
  Bucket,
  Eraser,
}

/**
 * Manages state and functionality for the pixel art maker
 */
export class PixelArtMakerEngine {
  /** Current selected tool */
  activeTool: DrawingTool = DrawingTool.Pencil;

  /** Current selected color */
  activeColor: string = "#000000";

  /**
   * Canvas state as 2D array of hex colors (16x16)
   * Access with canvas[row][column]
   */
  private _canvas: string[][] = [];
  get canvas() {
    return this._canvas;
  }
  private set canvas(value: string[][]) {
    this._canvas = value;
  }

  constructor() {
    this.loadCanvas();
  }

  /**
   * Changes cell color based on active tool
   */
  paintCell(r: number, c: number): void {
    switch (this.activeTool) {
      case DrawingTool.Pencil:
        this.canvas[r][c] = this.activeColor;
        this.saveCanvas();
        break;
      case DrawingTool.Bucket:
        for (let r = 0; r < 16; r++) {
          for (let c = 0; c < 16; c++) {
            this.canvas[r][c] = this.activeColor;
          }
        }
        this.saveCanvas();
        break;
      case DrawingTool.Eraser:
        const color = this.blankCellColor(r, c);
        this.canvas[r][c] = color;
        this.saveCanvas();
        break;
    }
  }

  /** Resets canvas to default pattern */
  clearCanvas(): void {
    let blankCanvas: string[][] = [];
    for (let r = 0; r < 16; r++) {
      let blankRow: string[] = [];
      for (let c = 0; c < 16; c++) {
        blankRow.push(this.blankCellColor(r, c));
      }
      blankCanvas.push(blankRow);
    }
    this.canvas = blankCanvas;
    this.saveCanvas();
  }

  /** Exports canvas as PNG file */
  downloadImageFromCanvas(): void {
    let data = this.canvas.flat();
    let rgbData = data.map((hex) => hexToRgb(hex));
    let expandedRgbData = rgbData.map((rgb) => [rgb.r, rgb.g, rgb.b, rgb.a]);
    let encodedData = expandedRgbData.flat();

    let canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;

    let context = canvas.getContext("2d")!;
    let imageData = context.createImageData(16, 16);
    encodedData.forEach((value, i) => {
      imageData.data[i] = value;
    });

    canvas.getContext("2d")!.putImageData(imageData, 0, 0);
    let imageUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "pixel-art.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /** Determines checkerboard pattern color */
  private blankCellColor(r: number, c: number): string {
    if (r % 2 === 0) {
      return c % 2 === 0 ? "#dedede" : "#ffffff";
    } else {
      return c % 2 === 0 ? "#ffffff" : "#dedede";
    }
  }

  /** Loads canvas from local storage */
  private loadCanvas(): void {
    const storedCanvas = localStorage.getItem("a03-canvas");
    if (storedCanvas) {
      this.canvas = JSON.parse(storedCanvas) as string[][];
    } else {
      this.clearCanvas();
    }
  }

  /** Saves canvas to local storage */
  private saveCanvas(): void {
    localStorage.setItem("a03-canvas", JSON.stringify(this.canvas));
  }
}
