/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "date");


describe("Rules#date", () => {
  it("Should be return true", () => {
    tester([
      new Date(),
      "2017-01-01",
      "2017-01-01 00:10:20"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      null,
      undefined,
      0,
      ""
    ], false);
  });
});
