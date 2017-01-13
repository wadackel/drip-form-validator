/* eslint-disable no-undefined */
import assert from "power-assert";
import { makeRuleTester } from "../../src/";

const tester = makeRuleTester(assert, "equals");


describe("Rules#equals", () => {
  it("Should be return true", () => {
    tester([
      null,
      undefined,
      false,
      ["hoge", { value: "hoge" }],
      [821, { value: 821 }],
      [10.91, { value: 10.91 }],
      [["hoge", "fuga"], { value: ["hoge", "fuga"] }],
      [
        { key: "val", nest: { nest: { key: "val2" } } },
        {
          value: { key: "val", nest: { nest: { key: "val2" } } }
        }
      ],
      [new Date("2017-10-10 10:10:10"), { value: new Date("2017-10-10 10:10:10") }]
    ], true);
  });

  it("Should be return false", () => {
    tester([
      ["hoge", { value: "fuga" }],
      [821, { value: "821" }],
      [82, { value: 21 }],
      [10.91, { value: "10.91" }],
      [10.91, { value: 10.87 }],
      [["hoge", "fuga"], { value: ["fuga", "fuga"] }],
      [
        { key: "val", nest: { nest: { key: "val3" } } },
        {
          value: { key: "val", nest: { nest: { key: "val1" } } }
        }
      ],
      [new Date("2017-10-10 10:10:10"), { value: new Date("2017-10-11 10:10:10") }]
    ], false);
  });
});
