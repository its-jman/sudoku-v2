import { proxySet } from "../set";

type Group = Cell[];

abstract class Rule {
  abstract initalize(instance: SudokuInstance): void;
  abstract isBoardValid(): void;
}

class StandardSudokuRules extends Rule {
  rows: Group[] = [];
  cols: Group[] = [];
  squares: Group[] = [];

  override initalize(instance: SudokuInstance) {
    for (let i = 0; i < 9; i += 1) {
      const row: Group = (this.rows[i] = []);
      const col: Group = (this.cols[i] = []);
      const square: Group = (this.squares[i] = []);

      const topLeftSquareRow = Math.floor(i / 3) * 3;
      const topLeftSquareCol = Math.floor((i * 3) % 9);

      for (let j = 0; j < 9; j += 1) {
        const rowCell = instance.cells[i * 9 + j];
        rowCell.groups.push(row);
        row[j] = rowCell;

        const colCell = instance.cells[j * 9 + i];
        colCell.groups.push(col);
        col[j] = colCell;

        const innerSquareCol = j % 3;
        const innerSquareRow = Math.floor(j / 3);
        const squareRow = topLeftSquareRow + innerSquareRow;
        const squareCol = topLeftSquareCol + innerSquareCol;

        const squareCell = instance.cells[squareRow * 9 + squareCol];
        squareCell.groups.push(square);
        square[j] = squareCell;
      }
    }
  }
  override isBoardValid() {}
}

class Cell {
  constructor(
    public value: number | null,
    public groups: Group[] = [],
    public notes = proxySet<number>(),
    public strongNotes = proxySet<number>()
  ) {}
}

export class SudokuInstance {
  cells: Cell[] = Array.from({ length: 9 * 9 }, () => new Cell(null));

  constructor(public rules: Rule[] = [new StandardSudokuRules()]) {}

  setBoard(cells: (number | null)[]) {
    if (cells.length !== this.cells.length) {
      throw new Error("Invalid cells length");
    }

    this.cells.forEach((cell, i) => {
      const val = cells[i];
      if (val !== null && (typeof val !== "number" || val < 1 || val > 9)) {
        throw new Error("Invalid cell value");
      }

      cell.value = cells[i];
    });
  }

  checkIsValid() {
    return this.rules.every((rule) => rule.isBoardValid());
  }
}
