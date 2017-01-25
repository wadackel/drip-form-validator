import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "email");


describe("Rules#email", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      "test@mail.com",
      ["Hoge <test@mail.com>", { allow_display_name: true }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      0,
      1,
      "",
      "string",
      ["test@mail.com", { require_display_name: true }],
      "Hoge <test@mail.com>"
    ], false);
  });
});
