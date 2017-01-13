/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "min");


describe("Rules#min", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "string",
      [10, { min: 10 }],
      [2, { min: 1 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      [10, { min: 11 }],
      [3, { min: 4 }]
    ], false);
  });
});
