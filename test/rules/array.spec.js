import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "array");


describe("Rules#array", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      [[], true],
      [["test"], true],
      [[{ key: "value" }], true]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0,
      "",
      {},
      new Date()
    ], false);
  });
});
