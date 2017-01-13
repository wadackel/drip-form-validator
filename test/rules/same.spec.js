/* eslint-disable no-undefined */
import assert from "power-assert";
import Validator, { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "same");


describe("Rules#same", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      ""
    ], true);

    let v = new Validator({
      password: "testhogefuga",
      passwordConfirm: "testhogefuga"
    }, {
      password: { same: "passwordConfirm" }
    });

    assert(v.validate() === true);

    v = new Validator({
      key: { prop: "obj" },
      other: { prop: "obj" }
    }, {
      key: { same: "other" }
    });

    assert(v.validate() === true);
  });

  it("Should be return false", () => {
    let v = new Validator({
      test: "value"
    }, {
      test: { same: { key: "notfound" } }
    });

    assert(v.validate() === false);

    v = new Validator({
      master: "value1",
      other: "value2"
    }, {
      master: { same: { key: "other" } }
    });

    assert(v.validate() === false);

    v = new Validator({
      key: { prop: "obj" },
      other: { state: ["array"] }
    }, {
      key: { same: { key: "other" } }
    });

    assert(v.validate() === false);
  });
});
