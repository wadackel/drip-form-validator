/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "lowerCase");


describe("Rules#lowerCase", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      0,
      "",
      "lowercase__test",
      "test-case"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "camelCase",
      "UPPERCASE",
      "CONST"
    ], false);
  });
});
