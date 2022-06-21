import React from "react";
import { proxy } from "valtio";
import { SudokuInstance } from "./state/sudoku-instance";
import { SudokuBoard } from "./board";

const instance = proxy(new SudokuInstance());
export const App = () => {
  return <SudokuBoard instance={instance} />;
};
