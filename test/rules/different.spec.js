/* eslint-disable no-undefined */
import assert from "power-assert";
import Validator, { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "different");


describe("Rules#different", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      ""
    ], true);

    let v = new Validator({ k1: "v1", k2: "v2" }, {
      k1: { different: { key: "k2" } }
    });

    assert(v.validate() === true);

    v = new Validator({ k1: [1, 2], k2: [3, 4] }, {
      k1: { different: { key: "k2" } }
    });

    assert(v.validate() === true);
  });

  it("Should be return false", () => {
    let v = new Validator({ k1: "v1", k2: "v1" }, {
      k1: { different: { key: "k2" } }
    });

    assert(v.validate() === false);

    v = new Validator({ k1: [1, 2], k2: [1, 2] }, {
      k1: { different: { key: "k2" } }
    });

    assert(v.validate() === false);
  });
});
