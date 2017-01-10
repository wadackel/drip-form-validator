/* eslint-disable max-nested-callbacks */
import assert from "power-assert";
import Validator from "../src/";


describe("Validator", () => {
  beforeEach(() => {
    Validator.setLocale("en");
  });


  describe("Static", () => {
    describe("Locale", () => {
      it("Should be defined locale messages", () => {
        const locale = "hoge";
        const localeMessages = {
          defaultMessage: "test defined locale messages"
        };

        Validator.defineLocale(locale, localeMessages);
        Validator.setLocale(locale);

        assert(Validator.getLocale(locale));
        assert.deepStrictEqual(Validator.getErrorMessages(), localeMessages);
      });


      it("Should throw a error when missing defaultMessage field", () => {
        assert.throws(() => {
          Validator.defineLocale("hoge", {});
        });
      });


      it("Should be get error message", () => {
        Validator.defineLocale("test1", { defaultMessage: "1", required: "message1" });
        Validator.defineLocale("test2", { defaultMessage: "2", required: "message2" });

        Validator.setLocale("test1");
        assert(Validator.getErrorMessage("required") === "message1");

        Validator.setLocale("test2");
        assert(Validator.getErrorMessage("required") === "message2");
      });
    });


    describe("Rules manipulation", () => {
      it("Should be added rule", () => {
        const addTest = () => false;
        const addMapParams = null;
        Validator.addRule("testRuleName1", addMapParams, addTest);

        const { mapParams, test } = Validator.getRule("testRuleName1");
        assert(mapParams == addMapParams); // eslint-disable-line eqeqeq
        assert(test === addTest);
      });


      it("Should be throw a error when specify duplicate field", () => {
        Validator.addRule("hoge", params => ({ key1: params[0] }), () => true);
        assert.throws(() => {
          Validator.addRule("hoge", null, () => false);
        });
      });
    });
  });


  describe("Instance", () => {
    it("Should be create instance", () => {
      const validator = new Validator();
      assert(validator);
    });


    it("Should be throw a error when pass invalid arguments", () => {
      assert.throws(() => new Validator(null));
      assert.throws(() => new Validator(null, null));
    });
  });
});
