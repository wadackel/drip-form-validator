/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "alphaNumeric");


describe("Rules#alphaNumeric", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "abcde",
      "ABCD",
      "AbCde0123"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "",
      "日本語",
      "in-dash",
      "in_underscore",
      "@test@"
    ], false);
  });
});
