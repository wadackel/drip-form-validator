/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "truthy");


describe("Rules#truthy", () => {
  it("Should be return true", () => {
    tester([
      1,
      true,
      "OK",
      "Ok",
      "ok"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      null,
      undefined,
      0,
      "NO",
      "No",
      "no"
    ], false);
  });
});
