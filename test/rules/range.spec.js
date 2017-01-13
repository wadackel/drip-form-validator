/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "range");


describe("Rules#range", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "string",
      [10, { min: 10, max: 10 }],
      [2, { min: 1, max: 3 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      [10, { min: 11, max: 11 }],
      [3, { min: 1, max: 2 }]
    ], false);
  });
});
