/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "array");


describe("Rules#array", () => {
  it("Should be return true", () => {
    tester([
      [[], true],
      [["test"], true],
      [[{ key: "value" }], true]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      null,
      undefined,
      0,
      "",
      {},
      new Date()
    ], false);
  });
});
