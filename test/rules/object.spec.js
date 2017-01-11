/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "object");


describe("Rules#object", () => {
  it("Should be return true", () => {
    tester([
      {},
      { key: "value" }
    ], true);
  });

  it("Should be return false", () => {
    tester([
      null,
      undefined,
      0,
      "",
      new Date(),
      [[], true],
      () => {}
    ], false);
  });
});
