import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

declare global {
  interface Set<T> {
    toggle(val: T): void;
  }
}

Set.prototype.toggle = function <T>(this: Set<T>, val: T) {
  if (this.has(val)) {
    this.delete(val);
  } else {
    this.add(val);
  }
};

const root = createRoot(document.querySelector("#root")!);
root.render(<App />);
