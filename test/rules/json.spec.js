/* eslint-disable no-undefined, quotes */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "json");


describe("Rules#json", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      0,
      '{"key": "value"}',
      '{"arr": [{"key": "value", "key2": "val2"}]}'
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "",
      'key: value',
      "{key: value}",
      '{key: "value"}',
      '{"key": [[]}'
    ], false);
  });
});
