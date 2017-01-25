import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "min");


describe("Rules#min", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      [10, { min: 10 }],
      [2, { min: 1 }],
      [0.82, { min: 0.82 }],
      ["str", { min: 3 }],
      ["こんにちは", { min: 5 }],
      ["1234567890", { min: 10 }],
      [[0, 1, 2], { min: 3 }],
      [[10], { min: 1 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      [{}, { min: 1 }],
      [[], { min: 1 }],
      ["", { min: 1 }],
      [10, { min: 11 }],
      [3, { min: 4 }],
      ["Hello", { min: 6 }],
      ["1234567890", { min: 11 }],
      [[123], { min: 2 }],
      [[0, 1, 2, 3, 4, 5], { min: 7 }]
    ], false);
  });
});
