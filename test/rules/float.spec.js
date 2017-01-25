import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "float");


describe("Rules#float", () => {
  it("Should be return true", () => {
    tester([
      0.1,
      23.85,
      777.000000007
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0.0,
      -0,
      0,
      48,
      -48
    ], false);
  });
});
