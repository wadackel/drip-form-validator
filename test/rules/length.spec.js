/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "length");


describe("Rules#length", () => {
  it("Should be return true", () => {
    tester([
      ["hoge", { min: 4, max: 4 }],
      ["1234567890", { min: 0, max: 10 }],
      ["日本語", { min: 3, max: 3 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      [null, { min: 3, max: 15 }],
      [undefined, { min: 3, max: 15 }],
      [[], { min: 3, max: 15 }],
      [{}, { min: 3, max: 15 }],
      ["foo", { min: 4, max: 15 }],
      ["1234567890", { min: 0, max: 9 }]
    ], false);
  });
});
