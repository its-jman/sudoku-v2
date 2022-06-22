import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import I from "immutable";
import { useSnapshot } from "valtio";
import { SudokuInstance } from "./state/sudoku-instance";
import boards from "./sample-boards";

import * as s from "./board.css";
import {
  gcn,
  rateLimit,
  useMouseDown,
  useOutsideClick,
  useStateRef,
} from "./utils";

type SudokuBoardProps = { instance: SudokuInstance };

function useKeyboardListener({
  down,
  up,
}: {
  down: (e: KeyboardEvent) => void;
  up: (e: KeyboardEvent) => void;
}) {
  useEffect(() => {
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [down]);

  useEffect(() => {
    document.addEventListener("keydown", up);
    return () => document.removeEventListener("keydown", up);
  }, [up]);
}

const ADD_HEADERS = true;
const NOTE_POSITIONS = [0, 4, 1, 6, 8, 7, 2, 5, 3] as const;
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
  const mouseDownRef = useMouseDown();
  const [selectedCells, setSelectedCells] = useState(I.Set<number>());
  // const [selectedCell, setSelectedCell] = useState<number>(-1);
  // const selectedCellRef = useRef(selectedCell);
  // selectedCellRef.current = selectedCell;
  const [modifier, setModifier] = useState<"Shift" | "Control" | "Alt">();

  const {
    row: hrow,
    col: hcol,
    square: hsquare,
  } = getRowColSquare(hoveredCell);

  useEffect(() => {
    writeInstance.setBoard(getRandomBoard());
  }, []);

  console.log(selectedCells);

  /* useKeyboardListener({
    down: useCallback(
      (e) => {
        const { key } = e;
        if (key === "Shift" || key === "Control" || key === "Alt") {
          setModifier(key);
        } else {
          const num = Number(key);
          if (Number.isFinite(num) && num >= 1 && num <= 9) {
            // press... Depending on active modifier, fill in cell, note, or strong note
            const i = selectedCellRef.current;
            if (i !== -1) {
              writeInstance.cells[i].notes.toggle(num);
              writeInstance.cells[i].strongNotes.toggle(num);
            }
          }
        }
      },
      [setModifier]
    ),
    up: useCallback(
      (e) => {
        const { key } = e;
        if (key === "Shift" || key === "Control" || key === "Alt") {
          // Only clear if modifier is the same as the released key
          setModifier((prev) => (prev === key ? undefined : prev));
        }
      },
      [setModifier]
    ),
  }); */

  useEffect(() => {
    const listener = rateLimit((e: MouseEvent) => {
      const cell = (e.target as HTMLElement).closest("[data-cell]");
      if (cell) {
        const i = Number(cell.getAttribute("data-cell"));
        if (Number.isFinite(i) && i >= 0 && i < writeInstance.cells.length) {
          if (mouseDownRef.current) {
            console.log("adding");
            setSelectedCells((prev) => prev.add(i));
          }
          setHoveredCell(i);
          return;
        }
      }
      setHoveredCell(-1);
    }, 10);
    document.addEventListener("mousemove", listener);
    return () => document.removeEventListener("mousemove", listener);
  }, []);
  const gridRef = useRef<HTMLDivElement>();
  // useOutsideClick(
  //   gridRef,
  //   useCallback(() => {
  //     setSelectedCell(-1);
  //   }, [setSelectedCell])
  // );

  return (
    <div className={s.wrapper}>
      <button onClick={() => writeInstance.setBoard(getRandomBoard())}>
        Set
      </button>
      <div
        ref={gridRef}
        className={gcn(ADD_HEADERS ? s.grid : s.gridNoHeaders)}
        // onMouseOut={() => setHoveredCell(-1)}
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
                // onMouseOver={() => setHoveredCell(i)}
                // onClick={() => setSelectedCell(i)}
                data-cell={i}
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
                  <div
                    className={gcn(
                      s.innerCellSelected,
                      ...(selectedCells.has(i)
                        ? [
                            (row === 0 || !selectedCells.has(i - 9)) && "bt",
                            (row === 8 || !selectedCells.has(i + 9)) && "bb",
                            (col === 0 || !selectedCells.has(i - 1)) && "bl",
                            (col === 8 || !selectedCells.has(i + 1)) && "br",
                          ]
                        : [])
                    )}
                  />
                  {cell.value ? (
                    <div
                      className={gcn(s.innerCellValue, cell.value && "default")}
                    >
                      {cell.value}
                    </div>
                  ) : (
                    <>
                      <div className={gcn(s.innerCellNote)}>
                        {NOTE_POSITIONS.map((position) => (
                          <div key={position} className={s.noteItem}>
                            {[...cell.notes.values()][position]}
                          </div>
                        ))}
                      </div>
                      <div
                        className={gcn(
                          s.innerCellStrongNote,
                          cell.notes.size > 3 && "font-sm",
                          cell.notes.size > 5 && "font-xs",
                          cell.notes.size > 7 && "font-xxs"
                        )}
                      >
                        {[...cell.strongNotes].map((note) => (
                          <div key={note} className={s.noteItem}>
                            {note}
                          </div>
                        ))}
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
