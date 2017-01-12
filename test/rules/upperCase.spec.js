/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "upperCase");


describe("Rules#upperCase", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      0,
      true,
      false,
      [[], true],
      {},
      new Date(),
      "UPPERCASE",
      "UPPER_CASE",
      "UPPER-CASE",
      "UPPER CASE"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "Upper",
      "lower"
    ], false);
  });
});
