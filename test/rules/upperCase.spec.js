import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "upperCase");


describe("Rules#upperCase", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "UPPERCASE",
      "UPPER_CASE",
      "UPPER-CASE",
      "UPPER CASE"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0,
      true,
      false,
      [[], true],
      {},
      new Date(),
      "Upper",
      "lower"
    ], false);
  });
});
