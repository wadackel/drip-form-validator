import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "creditCard");


describe("Rules#creditCard", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "5555555555554444",
      "5555-5555-5555-4444",
      "5555 5555 5555 4444",
      "510-510-510-510-5100",
      "510 510 510 510 5100",
      "4111111111111111",
      "4012888888881881",
      "3530111333300000",
      "3566002020360505",
      "30569309025904",
      "38520000023237",
      "378282246310005",
      "371449635398431",
      "378734493671000",
      "6011111111111117",
      "6011000990139424"
    ], true);
  });

  it("Should be return false", () => {
    tester([
      "",
      "hoge",
      "411111111111111108888880"
    ], false);
  });
});
