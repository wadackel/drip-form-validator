import invariant from "invariant";
import isPlainObject from "lodash.isplainobject";
import forEach from "lodash.foreach";

const hasProp = (obj, name) => obj.hasOwnProperty(name);
// TODO
// "minlength:5",
// "maxlength:15",
// "length:5,15",
// "min:5",
// "max:15",
// "range:1,5",
// "regex:/^hoge$/",
// "same:password",
// "different:oldPassword",
// "in:val1,val2",
// "notIn:val1,val2",
// "date",
// "dateFormat:'YYYY-MM-DD HH:mm:ss'",

class Validator {
  static locale =  "en";
  static locales = {};
  static rules = {};

  static addRule(name, mapParams, test) {
    if (Validator.hasRule(name)) {
      invariant(false, `"${name}" rule already exists`);
    } else {
      Validator.rules[name] = { mapParams, test };
    }
  }

  static hasRule(name) {
    return Validator.rules.hasOwnProperty(name);
  }

  static getRule(name) {
    if (!Validator.hasRule(name)) {
      invariant(false, `"${name}" rule does not exist`);
    } else {
      return {
        ...Validator.rules[name],
        errorMessage: Validator.getErrorMessage(name)
      };
    }
  }

  static defineLocale(locale, messages) {
    invariant(
      hasProp(messages, "defaultMessage"),
      "locale messages is required by 'defaultMessage' field"
    );
    Validator.locales[locale] = messages;
  }

  static getLocale() {
    return Validator.locale;
  }

  static setLocale(locale) {
    Validator.locale = locale;
  }

  static getErrorMessage(name) {
    const messages = Validator.getErrorMessages();
    return messages.hasOwnProperty(name) ? messages[name] : messages.defaultMessage;
  }

  static getErrorMessages() {
    return Validator.locales[Validator.locale];
  }

  static parseValidateRule(rule) {
    // TODO
    console.log(rule);
  }

  constructor(values = {}, rules = {}) {
    invariant(isPlainObject(values), "`values` must be plain object");
    this.rules = this.setRules(rules);
    this.values = { ...values };
    this.errors = {};
  }

  setRules(rules) {
    invariant(isPlainObject(rules), "`rules` must be plain object");
    forEach(rule => {
      // TODO
      console.log(rule);
    });
  }

  // TODO
  validate() {
  //   this._errors = {};
  //
  //   forEach(this._rules, (rules, key) => {
  //     const value = this._values[key];
  //
  //     forEach(rules, rule => {
  //       const { test, errorMessage } = Validator.getRule(rule);
  //       const res = test(value, key, null, this._values, this);
  //
  //       if (!res) {
  //         this.setError(key, errorMessage);
  //         return false;
  //       }
  //     });
  //   });
  //
  //   return Object.keys(this._errors).length === 0;
  }
}


export default Validator;
