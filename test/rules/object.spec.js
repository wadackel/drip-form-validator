import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "object");


describe("Rules#object", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      {},
      { key: "value" }
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0,
      "",
      new Date(),
      [[], true],
      () => {}
    ], false);
  });
});
