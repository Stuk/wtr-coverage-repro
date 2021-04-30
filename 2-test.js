// Rename this file to 0-test.js for coverage to work
import { Bad } from "./bad.js";

it("calls Bads's method", () => {
  const bad = new Bad();
  bad.method();
});
