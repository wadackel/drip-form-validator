/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "max");


describe("Rules#max", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "string",
      [10, { max: 10 }],
      [2, { max: 3 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      [10, { max: 9 }],
      [3, { max: 2 }]
    ], false);
  });
});
