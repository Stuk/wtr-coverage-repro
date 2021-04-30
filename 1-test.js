// Don't import from `index` for coverage to work:
import { Good } from "./index.js";
// import { Good } from "./good.js";

it("calls Good's method", () => {
    const good = new Good();
    good.method();
});
