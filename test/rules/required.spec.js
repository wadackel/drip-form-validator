import assert from "power-assert";
import Validator, { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "required");


describe("Rules#required", () => {
  it("Should be return true", () => {
    tester([
      "test",
      [["hoge"], true],
      { key: "value" },
      1.2,
      0,
      0.0,
      -90.2,
      "0",
      true,
      new Date()
    ], true);
  });

  it("Should be return false", () => {
    tester([
      null,
      undefined,
      {},
      [[], true],
      false,
      ""
    ], false);

    // key does not exist
    const v = new Validator({}, {
      key: { required: true }
    });

    assert(v.validate() === false);
  });
});
