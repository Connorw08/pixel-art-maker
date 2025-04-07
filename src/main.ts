/** Implementation file for pixel art maker */

import { DrawingTool, PixelArtMakerEngine } from "./engine";

// Main engine instance
const engine = new PixelArtMakerEngine();

// Tracks if mouse is pressed
let isMouseDown = false;

// Cell highlight cursor
const cellCursor = document.createElement("div");
cellCursor.style.backgroundColor = "white";
cellCursor.style.opacity = "0.3";
cellCursor.style.width = "100%";
cellCursor.style.height = "100%";

/**
 * Updates HTML canvas to match engine state
 */
const syncCanvasWithEngine = () => {
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const cell = document.getElementById(`r${row}_c${col}`);
      if (cell != null) {
        cell.style.backgroundColor = engine.canvas[row][col];
      }
    }
  }
};

// Initialize canvas
syncCanvasWithEngine();

// Mouse state tracking
document.addEventListener("mousedown", () => {
  isMouseDown = true;
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

document.addEventListener("mouseleave", () => {
  isMouseDown = false;
});

// Cell event handlers for drawing
for (let row = 0; row < 16; row++) {
  for (let col = 0; col < 16; col++) {
    const cell = document.getElementById(`r${row}_c${col}`);
    if (cell != null) {
      cell.addEventListener("mousedown", () => {
        engine.paintCell(row, col);
        if (engine.activeTool === DrawingTool.Bucket) {
          syncCanvasWithEngine();
        } else {
          cell.style.backgroundColor = engine.canvas[row][col];
        }
        if (cellCursor.parentElement === cell) {
          cell.removeChild(cellCursor);
        }
      });

      cell.addEventListener("mousemove", () => {
        if (isMouseDown) {
          engine.paintCell(row, col);
          cell.style.backgroundColor = engine.canvas[row][col];
          if (cellCursor.parentElement === cell) {
            cell.removeChild(cellCursor);
          }
        }
      });

      cell.addEventListener("mouseover", () => {
        if (!isMouseDown) {
          cell.appendChild(cellCursor);
        }
      });

      cell.addEventListener("mouseout", () => {
        if (cellCursor.parentElement === cell) {
          cell.removeChild(cellCursor);
        }
      });
    }
  }
}

// Color picker handler
const colorPicker = document.getElementById("color-picker");
const colorIcon = document.getElementById("color-icon");

colorPicker?.addEventListener("change", (event) => {
  const newColor = (event.target as HTMLInputElement).value;
  engine.activeColor = newColor;
  if (colorIcon != null) {
    colorIcon.style.color = newColor;
  }
});

// Tool selection handlers
const pencilButton = document.getElementById("pencil");
const bucketButton = document.getElementById("bucket");
const eraserButton = document.getElementById("eraser");

pencilButton?.addEventListener("click", () => {
  engine.activeTool = DrawingTool.Pencil;
  pencilButton.style.backgroundColor = "#f2f2f2";
  if (bucketButton && eraserButton != null) {
    bucketButton.style.backgroundColor = "#ffffff";
    eraserButton.style.backgroundColor = "#ffffff";
  }
});

bucketButton?.addEventListener("click", () => {
  engine.activeTool = DrawingTool.Bucket;
  bucketButton.style.backgroundColor = "#f2f2f2";
  if (pencilButton && eraserButton != null) {
    eraserButton.style.backgroundColor = "#ffffff";
    pencilButton.style.backgroundColor = "#ffffff";
  }
});

eraserButton?.addEventListener("click", () => {
  engine.activeTool = DrawingTool.Eraser;
  if (pencilButton && bucketButton != null) {
    bucketButton.style.backgroundColor = "#ffffff";
    pencilButton.style.backgroundColor = "#ffffff";
  }
  eraserButton.style.backgroundColor = "#f2f2f2";
});

// Save button handler
const saveButton = document.getElementById("save");
if (saveButton != null) {
  saveButton.addEventListener("click", () => {
    engine.downloadImageFromCanvas();
  });
}

// Clear button handler with confirmation
const clearButton = document.getElementById("clear");
if (clearButton != null) {
  clearButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      engine.clearCanvas();
      syncCanvasWithEngine();
    }
  });
}
