import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "lowerCase");


describe("Rules#lowerCase", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "",
      "lowercase__test",
      "test-case"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0,
      "camelCase",
      "UPPERCASE",
      "CONST"
    ], false);
  });
});
