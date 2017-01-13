/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "maxLength");


describe("Rules#maxLength", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      0,
      ["str", { max: 3 }],
      ["こんにちは", { max: 5 }],
      ["1234567890", { max: 10 }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      ["str", { max: 2 }],
      ["Hello", { max: 4 }],
      ["1234567890", { max: 9 }]
    ], false);
  });
});
