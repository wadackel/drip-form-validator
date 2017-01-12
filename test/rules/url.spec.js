/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "url");


describe("Rules#url", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      {},
      "http://example.com",
      ["//test.com", { allow_protocol_relative_urls: true }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0,
      10,
      "str",
      "//test.com"
    ], false);
  });
});
