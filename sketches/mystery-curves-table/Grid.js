class Grid {
  constructor(cell_w, cell_h, cell_count_x, cell_count_y) {
    this.cells = []
    let total_w = cell_w * cell_count_x
    let total_h = cell_h * cell_count_y

    let grid_x = width * 0.5 - total_w * 0.5;
    let grid_y = height * 0.5 - total_h * 0.5;

    for (let x = 0; x < cell_count_x; x++) {
      for (let y = 0; y < cell_count_y; y++) {
        let cell_x = grid_x + cell_w * x
        let cell_y = grid_y + cell_h * y
        let cell = new Cell(cell_x, cell_y, cell_w, cell_h);
        this.cells.push(cell);
      }
    }
  }
}

class Cell {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.mid_x = x + (w * 0.5);
    this.mid_y = y + (h * 0.5);
  }
}