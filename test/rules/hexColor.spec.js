import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "hexColor");


describe("Rules#hexColor", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "#fff",
      "#939",
      "#aabbcc",
      "#FFF",
      "#939",
      "#AABBCC",
      "333",
      "abcdef",
      "ABCDEF"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "",
      "#0",
      "yyccdd"
    ], false);
  });
});
