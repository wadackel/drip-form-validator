/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "minLength");


describe("Rules#minLength", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      0,
      ["str", { min: 3 }],
      ["こんにちは", { min: 5 }],
      ["1234567890", { min: 10 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      ["", { min: 1 }],
      ["Hello", { min: 6 }],
      ["1234567890", { min: 11 }]
    ], false);
  });
});
