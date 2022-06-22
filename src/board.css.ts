import { ComplexStyleRule, style } from "@vanilla-extract/css";
import { colors } from "./colors";

export const wrapper = style({});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const GREY_900 = "#18181b";
const RED_600 = "#dc2626";
const GREEN_600 = "#16a34a";

const gridStyle: ComplexStyleRule = {
  width: 9 * 55,
  userSelect: "none",
  display: "grid",
  gridTemplateRows: "repeat(9, minmax(0, 1fr))",
  gridTemplateColumns: "repeat(9, minmax(0, 1fr))",
  vars: {
    "--grid-status-color": GREY_900,
  },
  selectors: {
    "&.good": {
      vars: {
        "--grid-status-color": GREEN_600,
      },
    },
    "&.bad": {
      vars: {
        "--grid-status-color": RED_600,
      },
    },
  },
};

export const gridNoHeaders = style(gridStyle);
export const grid = style({
  ...gridStyle,
  width: (gridStyle.width as number) + 35,
  gridTemplateRows: "35px repeat(9, minmax(0, 1fr))",
  gridTemplateColumns: "35px repeat(9, minmax(0, 1fr))",
});

export const cell = style({
  fontSize: 16,
  aspectRatio: "1",
  position: "relative",
});

const abs: ComplexStyleRule = {
  position: "absolute",
  width: "100%",
  height: "100%",
};

export const innerCell = style({
  ...abs,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `0 solid ${GREY_900}`,
  selectors: {
    "&.bt": {
      borderTopWidth: 1,
    },
    "&.bl": {
      borderLeftWidth: 1,
    },
    "&.bb": {
      borderBottomWidth: 1,
    },
    "&.br": {
      borderRightWidth: 1,
    },
    "&.bt-thick": {
      borderTop: `2px solid var(--grid-status-color)`,
    },
    "&.bl-thick": {
      borderLeft: `2px solid var(--grid-status-color)`,
    },
    "&.bb-thick": {
      borderBottom: `2px solid var(--grid-status-color)`,
    },
    "&.br-thick": {
      borderRight: `2px solid var(--grid-status-color)`,
    },
    "&.bg-hovered-group": {
      backgroundColor: colors.grey[200],
    },
    "&.bg-hovered": {
      backgroundColor: colors.blue[200],
    },
  },
});

export const innerCellSelected = style({
  ...abs,
  border: `0 solid ${colors.blue[400]}`,
  selectors: {
    "&.bt": {
      borderTopWidth: 4,
    },
    "&.br": {
      borderRightWidth: 4,
    },
    "&.bb": {
      borderBottomWidth: 4,
    },
    "&.bl": {
      borderLeftWidth: 4,
    },
  },
});

export const innerCellValue = style({
  ...abs,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 32,
  color: colors.grey[900],
  selectors: {
    "&.default": {
      color: colors.blue[900],
    },
  },
});

export const noteItem = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
export const innerCellNote = style({
  ...abs,
  padding: 2,
  color: colors.grey[700],
  display: "grid",
  gridTemplateRows: "repeat(3, minmax(0, 1fr))",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
});
export const innerCellStrongNote = style({
  ...abs,
  padding: 2,
  color: colors.grey[700],
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  selectors: {
    "&.font-sm": {
      fontSize: 14,
    },
    "&.font-xs": {
      fontSize: 12,
    },
    "&.font-xxs": {
      fontSize: 8,
    },
  },
});
