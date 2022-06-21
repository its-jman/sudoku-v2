import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSnapshot } from "valtio";
import { SudokuInstance } from "./state/sudoku-instance";
import boards from "./sample-boards";

import * as s from "./board.css";
import { gcn, useOutsideClick } from "./utils";

type SudokuBoardProps = { instance: SudokuInstance };

const ADD_HEADERS = true;
const HEADERS = Array.from({ length: 10 }, (_, i) => i || null);
const getRandomBoard = (): (number | null)[] => {
  const list = Object.values(boards);
  const board = list[Math.floor(Math.random() * list.length)];
  const boardValues = board.split("").map((c) => {
    const val = Number(c);
    return val < 1 || val > 9 ? null : val;
  });
  return boardValues;
};

const getRowColSquare = (i: number) => {
  if (i === -1) {
    return { row: -1, col: -1, square: -1 };
  }
  const row = Math.floor(i / 9);
  const col = i % 9;
  const square = Math.floor(row / 3) * 3 + Math.floor(col / 3);
  return { row, col, square };
};

export const SudokuBoard: FC<SudokuBoardProps> = (props) => {
  const { instance: writeInstance } = props;
  const readInstance = useSnapshot(writeInstance);
  const [hoveredCell, setHoveredCell] = useState<number>(-1);
  const [selectedCell, setSelectedCell] = useState<number>(-1);

  const {
    row: hrow,
    col: hcol,
    square: hsquare,
  } = getRowColSquare(selectedCell);

  useEffect(() => {
    writeInstance.setBoard(getRandomBoard());
  }, []);

  const gridRef = useRef<HTMLDivElement>();
  useOutsideClick(
    gridRef,
    useCallback(() => {
      setSelectedCell(-1);
    }, [setSelectedCell])
  );

  return (
    <div className={s.wrapper}>
      <button onClick={() => writeInstance.setBoard(getRandomBoard())}>
        Set
      </button>
      <div
        ref={gridRef}
        className={gcn(ADD_HEADERS ? s.grid : s.gridNoHeaders)}
        onMouseOut={() => setHoveredCell(-1)}
      >
        {ADD_HEADERS &&
          HEADERS.map((c, i) => (
            <div key={i} className={s.header}>
              {c}
            </div>
          ))}
        {readInstance.cells.map((cell, i) => {
          const { row, col, square } = getRowColSquare(i);

          return (
            <Fragment key={i}>
              {ADD_HEADERS && i % 9 === 0 && (
                <div className={s.header}>
                  {String.fromCharCode("A".charCodeAt(0) + Math.floor(i / 9))}
                </div>
              )}
              <div
                className={s.cell}
                onMouseOver={() => setHoveredCell(i)}
                onClick={() => setSelectedCell(i)}
              >
                <div
                  className={gcn(
                    s.innerCell,
                    "bt",
                    "bl",
                    row === 8 && "bb-thick",
                    row % 3 === 0 && "bt-thick",
                    i % 3 === 0 && "bl-thick",
                    i % 9 === 8 && "br-thick",
                    (hrow === row || hcol === col || hsquare === square) &&
                      "bg-hovered-group",
                    hrow === row && hcol === col && "bg-hovered"
                  )}
                >
                  {cell.value ? (
                    <div
                      className={gcn(s.innerCellValue, cell.value && "default")}
                    >
                      {cell.value}
                    </div>
                  ) : (
                    <>
                      <div className={s.innerCellNote}>
                        {[...cell.notes].map((note) => (
                          <div key={note}>{note}</div>
                        ))}
                      </div>
                      <div className={s.innerCellStrongNote}>
                        {cell.strongNotes}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
