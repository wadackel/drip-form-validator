/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "integer");


describe("Rules#integer", () => {
  it("Should be return true", () => {
    tester([
      0,
      0.0,
      12,
      985,
      -777
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0.1,
      0.01,
      625.68,
      "10"
    ], false);
  });
});
