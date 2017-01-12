/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "uuid");


describe("Rules#uuid", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "83a82e9a-d8e5-11e6-bf26-cec0c932ce01",
      "85baf263-0f3c-44fd-94e9-144d1ff2e61c",
      "5fcbe4f7-98e3-4254-b3a2-464312b1af80",
      "b2a1060e-d8e5-11e6-bf26-cec0c932ce01"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "",
      "8c90f050-d8e5-11e6-test-hoge",
      "plaintext"
    ], false);
  });
});
