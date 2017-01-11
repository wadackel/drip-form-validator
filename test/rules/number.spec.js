/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "number");


describe("Rules#number", () => {
  it("Should be return true", () => {
    tester([
      10,
      2.89,
      -12.23,
      NaN
    ], true);
  });

  it("Should be return false", () => {
    tester([
      null,
      undefined,
      "",
      "string",
      {}
    ], false);
  });
});
