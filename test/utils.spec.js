/* eslint-disable max-nested-callbacks */
import assert from "power-assert";
import * as utils from "../src/utils";


describe("Utilities", () => {
  describe("getType()", () => {
    it("Should be return true", () => {
      // eslint-disable-next-line brace-style
      class Hoge { fuga() { return "fugaValue"; } }

      assert(utils.typeOf(null) === "null");
      assert(utils.typeOf(undefined) === "undefined");
      assert(utils.typeOf("str") === "string");
      assert(utils.typeOf(0) === "number");
      assert(utils.typeOf({}) === "object");
      assert(utils.typeOf([]) === "array");
      assert(utils.typeOf(() => {}) === "function");
      assert(utils.typeOf(new Date()) === "date");
      assert(utils.typeOf(new Hoge()) === "hoge");
    });
  });

  describe("isNumeric()", () => {
    it("Should be return true", () => {
      assert(utils.isNumeric(0) === true);
      assert(utils.isNumeric(10) === true);
      assert(utils.isNumeric(1.12) === true);
      assert(utils.isNumeric(-12.28) === true);
      assert(utils.isNumeric("10") === true);
      assert(utils.isNumeric("02") === true);
      assert(utils.isNumeric("-2888.2122") === true);
      assert(utils.isNumeric("+120") === true);
    });

    it("Should be return false", () => {
      assert(utils.isNumeric(NaN) === false);
      assert(utils.isNumeric(null) === false);
      assert(utils.isNumeric([]) === false);
      assert(utils.isNumeric({}) === false);
      assert(utils.isNumeric("0.0.0") === false);
      assert(utils.isNumeric("+-1289.82") === false);
    });
  });


  describe("isInteger()", () => {
    it("Should be return true", () => {
      assert(utils.isInteger(0) === true);
      assert(utils.isInteger(120) === true);
      assert(utils.isInteger(-12) === true);
    });

    it("Should be return false", () => {
      assert(utils.isInteger(NaN) === false);
      assert(utils.isInteger(null) === false);
      assert(utils.isInteger([]) === false);
      assert(utils.isInteger({}) === false);
      assert(utils.isInteger(85.202) === false);
      assert(utils.isInteger("622") === false);
    });
  });


  describe("isFloat()", () => {
    it("Should be return true", () => {
      assert(utils.isFloat(-0.27) === true);
      assert(utils.isFloat(85.202) === true);
    });

    it("Should be return false", () => {
      assert(utils.isFloat(NaN) === false);
      assert(utils.isFloat(null) === false);
      assert(utils.isFloat([]) === false);
      assert(utils.isFloat({}) === false);
      assert(utils.isFloat(0) === false);
      assert(utils.isFloat(120) === false);
      assert(utils.isFloat(-12) === false);
      assert(utils.isFloat("0.23") === false);
    });
  });


  describe("isEmpty()", () => {
    it("Should be return true", () => {
      assert(utils.isEmpty(false) === true);
      assert(utils.isEmpty(0) === true);
      assert(utils.isEmpty(null) === true);
      assert(utils.isEmpty(undefined) === true);
      assert(utils.isEmpty(NaN) === true);
      assert(utils.isEmpty({}) === true);
      assert(utils.isEmpty([]) === true);
    });

    it("Should be return false", () => {
      assert(utils.isEmpty(true) === false);
      assert(utils.isEmpty(1) === false);
      assert(utils.isEmpty("0") === false);
      assert(utils.isEmpty({ key: "value" }) === false);
      assert(utils.isEmpty(["val"]) === false);
      assert(utils.isEmpty(new Date()) === false);
    });
  });


  describe("template()", () => {
    it("Should be compile template", () => {
      const tests = [
        {
          tmpl: "My name is {{name}}!!",
          data: { name: "Tsuyoshi Wada", hoge: "fuga" },
          expected: "My name is Tsuyoshi Wada!!"
        },
        {
          tmpl: "{{key1}} {{key2}} {{key3}}",
          data: {},
          expected: "  "
        },
        {
          tmpl: "{fuga}{hoge}",
          data: { fuga: "test", hoge: "test" },
          expected: "{fuga}{hoge}"
        },
        {
          tmpl: "{{tmpl-_+}key!!}}!!",
          data: { "tmpl-_+}key!!": "value" },
          expected: "value!!"
        },
        {
          tmpl: "{{key}}",
          data: null,
          expected: ""
        }
      ];

      tests.forEach(({ tmpl, data, expected }) => {
        assert(utils.template(tmpl, data) === expected);
      });
    });
  });
});
