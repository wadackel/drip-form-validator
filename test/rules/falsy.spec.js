/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "falsy");


describe("Rules#falsy", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      0,
      "NO",
      "No",
      "no"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      1,
      true,
      "OK",
      "Ok",
      "ok",
      [[], true],
      {},
      new Date()
    ], false);
  });
});
