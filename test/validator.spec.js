/* eslint-disable max-nested-callbacks */
import assert from "power-assert";
import sinon from "sinon";
import Validator from "../src/";

const defaultMessages = Validator.getErrorMessages();


describe("Validator", () => {
  beforeEach(() => {
    Validator.setLocale("en");
    Validator.setErrorMessages(defaultMessages);
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

        assert(Validator.getLocale() === locale);
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


      it("Should be add error message", () => {
        const locale = "add-error-message";
        Validator.defineLocale(locale, { defaultMessage: "" });
        Validator.setLocale(locale);

        Validator.addErrorMessage("test-error1", "value is {{test}}");
        Validator.addErrorMessage("test-error2", "test!!");
        assert(Validator.getErrorMessage("test-error1") === "value is {{test}}");
        assert(Validator.getErrorMessage("test-error2") === "test!!");

        assert.throws(() => Validator.addErrorMessage("test-error1", ""));
      });
    });


    describe("Rules manipulation", () => {
      it("Should be added rule", () => {
        const addTest = () => false;
        Validator.addRule("testRuleName1", addTest);

        const test = Validator.getRule("testRuleName1");
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
      const v = new Validator();
      assert(v);
    });


    it("Should be throw a error when pass invalid arguments", () => {
      assert.throws(() => new Validator(null));
      assert.throws(() => new Validator(null, null));
    });


    it("Should be manupilate errors", () => {
      const rule = "manupilate-error-false";
      Validator.addRule(rule, () => false);
      Validator.addErrorMessage(rule, "{{key}}");

      const v = new Validator();

      assert.deepStrictEqual(v.getErrors(), {});
      assert(v.getError(rule) == null);

      v.setError(rule, { key: "value" });
      assert(v.getError(rule) === "value");

      v.setError(rule);
      assert(v.getError(rule) === "");

      v.clearError(rule);
      assert(v.getError(rule) == null);

      v.setError(rule);
      v.clearErrors();
      assert.deepStrictEqual(v.getErrors(), {});
    });


    it("Should be called test when validation", () => {
      const rule1 = "pass-test1";
      const rule2 = "pass-test2";
      const test1 = sinon.stub();
      const test2 = sinon.spy();
      const values = {
        username: "tsuyoshiwada",
        password: "hogefuga",
        notcall: "teststring"
      };
      const v = new Validator(values, {
        username: [{ [rule1]: true }],
        password: [{ [rule1]: true }],
        notcall: [{ [rule2]: false }]
      });

      test1.withArgs("tsuyoshiwada", null, "username", values, v).returns(true);
      test1.withArgs("hogefuga", null, "password", values, v).returns(true);

      Validator.addRule(rule1, test1);
      Validator.addRule(rule2, test2);

      assert(v.validate() === true);
      assert(test1.callCount === 2);
      assert(test2.called === false);
    });


    it("Should be arguments passed to test", () => {
      const rule = "arg-pass-test";
      const test = sinon.stub();
      const values = { fuga: "hoge", key: "value" };
      const params = { arg1: "val1", arg2: "val2" };
      const v = new Validator(values, { fuga: [{ [rule]: params }] });

      test.withArgs("hoge", params, "fuga", values, v).returns(true);

      Validator.addRule(rule, test);

      assert(v.validate() === true);
      assert(test.called === true);
    });
  });
});
