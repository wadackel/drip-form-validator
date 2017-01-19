/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "max");


describe("Rules#max", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      {},
      [[]],
      [10, { max: 10 }],
      [2, { max: 3 }],
      ["str", { max: 3 }],
      ["こんにちは", { max: 5 }],
      ["1234567890", { max: 10 }],
      [[0, 1, 2], { max: 3 }],
      [[1], { max: 2 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      [10, { max: 9 }],
      [3, { max: 2 }],
      ["str", { max: 2 }],
      ["Hello", { max: 4 }],
      ["1234567890", { max: 9 }],
      [[0, 1, 2], { max: 2 }],
      [[1], { max: 0 }]
    ], false);
  });
});
