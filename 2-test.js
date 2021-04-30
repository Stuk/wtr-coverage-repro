// Rename this file to 0-test.js for coverage of B to work
// import { Bad } from "./bad.js";
import { Bad } from "./index.js";

it("calls Bads's method", () => {
  const bad = new Bad();
  bad.method();
});
