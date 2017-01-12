/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "ip");


describe("Rules#ip", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "2001:0db8:bd05:01d2:288a:1fc0:0001:10ee",
      "ABCD:EF01:2345:6789:ABCD:EF01:2345:6789",
      "2001:DB8:0:0:8:800:200C:417A",
      "FF01:0:0:0:0:0:0:101",
      "0:0:0:0:0:0:0:1",
      "69.89.31.226",
      "19.117.63.253",
      "255.255.253.0"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "",
      "string",
      "0:0:0:0:0:0:0:1:0",
      "255.256.253.0"
    ], false);
  });
});
