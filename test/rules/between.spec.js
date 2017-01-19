/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "between");


describe("Rules#between", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      {},
      [[]],
      [""],
      [10, { min: 10, max: 10 }],
      [2, { min: 1, max: 3 }],
      ["hoge", { min: 4, max: 4 }],
      ["1234567890", { min: 0, max: 10 }],
      ["日本語", { min: 3, max: 3 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      [10, { min: 11, max: 11 }],
      [3, { min: 1, max: 2 }],
      ["foo", { min: 4, max: 15 }],
      ["1234567890", { min: 0, max: 9 }],
      [[3, 2, 1], { min: 4, max: 6 }],
      [[3, 2, 1], { min: 1, max: 2 }]
    ], false);
  });
});
