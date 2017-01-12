/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "alphaDash");


describe("Rules#alphaDash", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "abcde",
      "ABCD",
      "AbCde0123",
      "in-dash",
      "in_underscore"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "",
      "日本語",
      "@test@"
    ], false);
  });
});
