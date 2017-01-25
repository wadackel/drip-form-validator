import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "string");


describe("Rules#string", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "",
      "string"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0,
      [[], true],
      {},
      new Date()
    ], false);
  });
});
