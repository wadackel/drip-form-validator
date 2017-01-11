/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "string");


describe("Rules#string", () => {
  it("Should be return true", () => {
    tester([
      "",
      "string"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      null,
      undefined,
      0,
      [[], true],
      {},
      new Date()
    ], false);
  });
});
