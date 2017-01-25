import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "match");


describe("Rules#match", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      [10110, { regex: /^\d+$/ }],
      ["CONST_CASE", { regex: /^[A-Z_]+$/ }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      ["", { regex: /^.+/ }],
      ["CONST_CASE", { regex: /^[A-Z]+$/ }],
      ["hoge", { regex: /^fuga/ }]
    ], false);
  });
});
