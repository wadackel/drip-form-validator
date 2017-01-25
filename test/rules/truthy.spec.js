import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "truthy");


describe("Rules#truthy", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      1,
      true,
      "OK",
      "Ok",
      "ok"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0,
      "",
      "NO",
      "No",
      "no"
    ], false);
  });
});
