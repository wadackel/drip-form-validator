/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "notIn");


describe("Rules#notIn", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "",
      ["vue", { values: ["vanilla", "angular", "react"] }],
      [3, { values: [10, 8, 6, 4, 2, 0] }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      ["react", { values: ["vanilla", "angular", "react"] }],
      [0, { values: [10, 8, 6, 4, 2, 0] }]
    ], false);
  });
});
