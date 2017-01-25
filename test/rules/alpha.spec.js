import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "alpha");


describe("Rules#alpha", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "abcdef",
      "ABCDEF"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "",
      "paragraph paragraph",
      "Hello!",
      "こんにちは",
      "in-dash",
      "in_underscore",
      "0123test",
      "00",
      "@test@"
    ], false);
  });
});
