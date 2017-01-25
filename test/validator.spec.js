/* eslint-disable max-nested-callbacks */
import assert from "power-assert";
import sinon from "sinon";
import Validator from "../src/";


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const defaultMessages = Validator.getErrorMessages();
let clock = null;


describe("Validator", () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    Validator.setLocale("en");
    Validator.setErrorMessages(defaultMessages);
  });

  afterEach(() => {
    clock.restore();
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


      it("should throw a error when specify doesn't exist locale", () => {
        assert.throws(() => {
          Validator.setLocale("notfoundlocale");
        });
      });


      it("Should throw a error when missing defaultMessage field", () => {
        assert.throws(() => {
          Validator.defineLocale("hoge", {});
        });
      });


      it("Should be get error message", () => {
        Validator.defineLocale("test1", { defaultMessage: "1", required: "message1" });
        Validator.defineLocale("test2", { defaultMessage: "2", min: { string: "msg2-1", number: "msg2-2" } });

        Validator.setLocale("test1");
        assert(Validator.getErrorMessage("required") === "message1");

        Validator.setLocale("test2");
        assert(Validator.getErrorMessage("min", "string") === "msg2-1");
        assert(Validator.getErrorMessage("min", "number") === "msg2-2");
      });


      it("Should be add error message", () => {
        const locale = "add-error-message";
        Validator.defineLocale(locale, { defaultMessage: "" });
        Validator.setLocale(locale);

        Validator.addErrorMessage("test-error1", "value is {{test}}");
        Validator.addErrorMessage("test-error2", { string: "{{key}}!!", number: "{{key}}??" });
        assert(Validator.getErrorMessage("test-error1") === "value is {{test}}");
        assert(Validator.getErrorMessage("test-error2", "string") === "{{key}}!!");
        assert(Validator.getErrorMessage("test-error2", "number") === "{{key}}??");

        assert.throws(() => Validator.addErrorMessage("test-error1", ""));
      });
    });


    describe("Rules manipulation", () => {
      it("Should be added rule", () => {
        const addTest = () => false;
        Validator.addRule("testRuleName1", addTest);

        const { test } = Validator.getRule("testRuleName1");
        assert(test === addTest);
      });


      it("Should be throw a error when specify duplicate field", () => {
        Validator.addRule("hoge", params => ({ key1: params[0] }), () => true);
        assert.throws(() => {
          Validator.addRule("hoge", null, () => false);
        });
      });


      it("Should be added rule with depends", () => {
        const addTest = () => false;
        const dep = { truthy: true };
        const rule = "testRuleName2";
        Validator.addRule(rule, dep, addTest);

        const { test, depends } = Validator.getRule(rule);
        assert(test === addTest);
        assert.deepStrictEqual(depends, dep);
      });


      it("Should be throw a error when call rule does not exist", () => {
        assert.throws(() => {
          Validator.addRule("passnotfoundrule", { notfound: true }, () => false);
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
      const key = "key";
      const rule = "manupilate-error-false";
      Validator.addRule(rule, () => false);
      Validator.addErrorMessage(rule, "compiled {{key}}");

      const v = new Validator();

      // empty
      assert.deepStrictEqual(v.getAllErrors(), {});
      assert(v.getErrors(key) == null);
      assert(v.getErrors(key, rule) == null);

      // 1 error
      v.addError(key, rule, { result: false, params: { key: "value" } });
      assert.deepStrictEqual(v.getAllErrors(), {
        key: [
          { message: "compiled value", rule, params: { key: "value" } }
        ]
      });
      assert.deepStrictEqual(v.getErrors(key), [
        { message: "compiled value", rule, params: { key: "value" } }
      ]);
      assert(v.getError(key, rule) === "compiled value");

      // remove error
      v.removeError(key, rule);
      assert.deepStrictEqual(v.getAllErrors(), {});
      assert(v.getErrors(key) == null);
      assert(v.getErrors(key, rule) == null);

      // 1 error (no params)
      v.addError(key, rule, { result: false });
      assert(v.getError(key, rule) === "compiled ");

      v.clearErrors(key);
      assert.deepStrictEqual(v.getAllErrors(), {});
      assert(v.getErrors(key) == null);
      assert(v.getErrors(key, rule) == null);
    });


    it("Should be return different error message for each type", () => {
      const rule = "type-message";

      Validator.addRule(rule, () => false);
      Validator.addErrorMessage(rule, {
        string: "string={{fuga}}",
        number: "number={{fuga}}"
      });

      const v = new Validator();

      // string
      v.addError("testKey", rule, {
        result: false,
        params: { fuga: "stringValue" },
        value: "this is string"
      });
      assert(v.getError("testKey", rule) === "string=stringValue");

      v.clearAllErrors();

      // number
      v.addError("testKey", rule, {
        result: false,
        params: { fuga: "numberValue" },
        value: 10.2
      });
      assert(v.getError("testKey", rule) === "number=numberValue");

      v.clearAllErrors();

      // default
      v.addError("testKey", rule, {
        result: false,
        params: { fuga: "numberValue" },
        value: null
      });
      assert(v.getError("testKey", rule) === "This field value is invalid");
    });


    it("Should be return custom error message", () => {
      const v = new Validator({}, {
        hoge: { required: true }
      }, {
        hoge: { required: "Custom error message" }
      });

      const addError = (value = "") => {
        v.removeError("hoge", "required");
        v.addError("hoge", "required", {
          result: false,
          params: null,
          value
        });
      };

      const getError = () => v.getError("hoge", "required");

      // Basic
      addError();
      assert(getError() === "Custom error message");

      // Callback
      const t = sinon.stub();
      t.withArgs("This field is required", "hoge", "", null, v).returns("callback");
      v.setErrorMessages({ hoge: { required: t } });
      addError();
      assert(t.called === true);
      assert(getError() === "callback");

      // Types
      v.setErrorMessages({ hoge: { required: { string: "string message" } } });
      addError();
      assert(getError() === "string message");

      v.setErrorMessages({
        hoge: {
          required: {
            string: "string message",
            array: "array message"
          }
        }
      });
      addError([]);
      assert(getError() === "array message");
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
        username: { [rule1]: true },
        password: { [rule1]: true },
        notcall: { [rule2]: false }
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
      const values = { fuga: "hoge", key: "value" };
      const params = { arg1: "val1", arg2: "val2" };
      const v = new Validator(values, {
        fuga: { [rule]: params }
      });

      const test = sinon.stub()
        // .withArgs("hoge", params, "fuga", values, v)
        .returns(true);

      Validator.addRule(rule, test);

      assert(v.validate() === true);
      assert(test.callCount === 1);
    });


    it("Should be called rules dependent on validation", () => {
      const rule1 = "depend-test-1";
      const rule2 = "depend-test-2";
      const returnTrue = sinon.stub().returns(true);
      const returnFalse = sinon.stub().returns(false);
      const test1 = sinon.stub().returns(true);
      const test2 = sinon.stub().returns(true);
      const v = new Validator(
        { k1: "v1", k2: "v2" },
        { k1: { [rule1]: true }, k2: { [rule2]: true } }
      );

      Validator.addRule("returnTrue", returnTrue);
      Validator.addRule("returnFalse", returnFalse);
      Validator.addRule(rule1, { returnTrue: true }, test1);
      Validator.addRule(rule2, { returnTrue: true, returnFalse: true }, test2);

      assert(v.validate() === false);
      assert(returnTrue.callCount === 2);
      assert(returnFalse.callCount === 1);
      assert(test1.called === true);
      assert(test2.called === false);
    });
  });


  describe("Inline rule", () => {
    it("Should be call inline rule", () => {
      const values = { key: "val" };
      const v = new Validator({ key: "val" });
      const inlineRule = sinon.stub()
        .withArgs("val", null, values, v)
        .returns(true);

      v.mergeRules({
        key: {
          required: true,
          string: true,
          inlineRule
        }
      });

      assert(v.validate() === true);
      assert(inlineRule.callCount === 1);
    });
  });


  describe("Asynchronous validation", () => {
    it("Should be return resolve (success)", done => {
      const passValues = { key: "test" };
      const v = new Validator(passValues, {
        key: {
          accountExist: () => sleep(200)
        }
      });

      assert(v.isValidating() === false);

      const p = v.asyncValidate();

      p.then(values => {
        assert(v.isValidating() === false);
        assert.deepStrictEqual(passValues, values);
        done();
      });

      assert(v.isValidating() === true);
      clock.tick(100);

      assert(v.isValidating() === true);
      clock.tick(100);
    });


    it("Should be return reject (failure)", done => {
      const passValues = { key: "test" };
      const accountExist = () => sleep(100).then(() => Promise.reject("Error!!"));
      const v = new Validator(passValues, {
        key: { accountExist }
      });

      assert(v.isValidating() === false);

      v.asyncValidate()
        .catch(errors => {
          assert(v.isValidating() === false);
          assert.deepStrictEqual(errors, {
            key: [
              { rule: "accountExist", message: "Error!!", params: accountExist }
            ]
          });
          done();
        });

      assert(v.isValidating() === true);
      clock.tick(100);
    });


    it("Should be called sync and async test (success)", done => {
      const passValues = {
        email: "test@mail.com",
        password: "123456"
      };

      const v = new Validator(passValues, {
        email: {
          email: true,
          login: () => sleep(1000)
        },
        password: {
          required: true,
          passFormat: val => /^\d+$/.test(val)
        }
      });

      v.asyncValidate().then(values => {
        assert.deepStrictEqual(passValues, values);
        done();
      });

      clock.tick(1000);
    });


    it("Should be called sync and async test (failure)", done => {
      const passValues = {
        email: "test@mail.com",
        password: ""
      };

      const login = () => sleep(1000).then(() => Promise.reject("Error!!"));
      const passFormat = val => /^\d+$/.test(val);

      const v = new Validator(passValues, {
        email: { email: true, login },
        password: { required: true, passFormat }
      });

      v.asyncValidate().catch(errors => {
        assert.deepStrictEqual(errors, {
          email: [
            { rule: "login", message: "Error!!", params: login }
          ],
          password: [
            { rule: "required", message: "This field is required", params: true },
            { rule: "passFormat", message: "This field value is invalid", params: passFormat }
          ]
        });
        done();
      });

      clock.tick(1000);
    });
  });


  describe("Array", () => {
    const getValues = () => ({
      hoge: "str",
      followers: [
        {
          hoge: [
            { nickname: "" },
            { nickname: "tes" },
            { nickname: "" }
          ]
        },
        {
          hoge: [
            { nickname: "tes" },
            { nickname: "" },
            { nickname: "" }
          ]
        }
      ]
    });


    it("Shoulb be validate to array", () => {
      const v = new Validator(getValues(), {
        hoge: {
          numeric: true
        },
        "followers.*.hoge.*.nickname": {
          required: true
        }
      });

      assert(v.validate() === false);

      assert.deepStrictEqual(v.getAllErrors(), {
        hoge: [
          { rule: "numeric", params: true, message: "This field is must be a number" }
        ],
        "followers.0.hoge.0.nickname": [
          { rule: "required", params: true, message: "This field is required" }
        ],
        "followers.0.hoge.2.nickname": [
          { rule: "required", params: true, message: "This field is required" }
        ],
        "followers.1.hoge.1.nickname": [
          { rule: "required", params: true, message: "This field is required" }
        ],
        "followers.1.hoge.2.nickname": [
          { rule: "required", params: true, message: "This field is required" }
        ]
      });

      assert.deepStrictEqual(v.getErrors("hoge"), [
        { rule: "numeric", params: true, message: "This field is must be a number" }
      ]);

      assert(v.getErrors("followers.0.hoge.1.nickname") == null);
      assert(v.hasErrors("followers.1.hoge.1.nickname") === true);
      assert(v.hasErrors("followers[1]hoge[1]nickname") === true);

      assert.deepStrictEqual(v.getErrors("followers.0.hoge.0.nickname"), [
        { rule: "required", params: true, message: "This field is required" }
      ]);

      assert.deepStrictEqual(v.getErrors("followers[0]hoge[0]nickname"), [
        { rule: "required", params: true, message: "This field is required" }
      ]);

      v.setValues({
        hoge: 10,
        followers: [
          {
            hoge: [
              { nickname: "value" },
              { nickname: "value" },
              { nickname: "value" }
            ]
          }
        ]
      });

      assert(v.validate() === true);
    });


    it("Shoulb be async validate to array", done => {
      const v = new Validator(getValues(), {
        hoge: {
          numeric: true
        },
        "followers.*.hoge.*.nickname": {
          required: true
        }
      });

      v.asyncValidate()
        .catch(errors => {
          assert.deepStrictEqual(errors, {
            hoge: [
              { rule: "numeric", params: true, message: "This field is must be a number" }
            ],
            "followers.0.hoge.0.nickname": [
              { rule: "required", params: true, message: "This field is required" }
            ],
            "followers.0.hoge.2.nickname": [
              { rule: "required", params: true, message: "This field is required" }
            ],
            "followers.1.hoge.1.nickname": [
              { rule: "required", params: true, message: "This field is required" }
            ],
            "followers.1.hoge.2.nickname": [
              { rule: "required", params: true, message: "This field is required" }
            ]
          });

          assert.deepStrictEqual(v.getErrors("hoge"), [
            { rule: "numeric", params: true, message: "This field is must be a number" }
          ]);

          assert(v.getErrors("followers.0.hoge.1.nickname") == null);
          assert(v.hasErrors("followers.1.hoge.1.nickname") === true);
          assert(v.hasErrors("followers[1]hoge[1]nickname") === true);

          assert.deepStrictEqual(v.getErrors("followers.0.hoge.0.nickname"), [
            { rule: "required", params: true, message: "This field is required" }
          ]);

          assert.deepStrictEqual(v.getErrors("followers[0]hoge[0]nickname"), [
            { rule: "required", params: true, message: "This field is required" }
          ]);

          v.setValues({
            hoge: 10,
            followers: [
              {
                hoge: [
                  { nickname: "value" },
                  { nickname: "value" },
                  { nickname: "value" }
                ]
              }
            ]
          });

          return v.asyncValidate();
        })
        .then(values => {
          assert.deepStrictEqual(values, {
            hoge: 10,
            followers: [
              {
                hoge: [
                  { nickname: "value" },
                  { nickname: "value" },
                  { nickname: "value" }
                ]
              }
            ]
          });

          done();
        });
    });
  });
});
