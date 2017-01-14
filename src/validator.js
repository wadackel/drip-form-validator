import invariant from "invariant";
import isPlainObject from "lodash.isplainobject";
import forEach from "lodash.foreach";
import { hasProp, template } from "./utils";


class Validator {
  static locale =  "en";
  static errorMessages = {};
  static rules = {};

  static addRule(name, depends, test) {
    if (Validator.hasRule(name)) {
      invariant(false, `"${name}" rule already exists`);
      return;
    }

    const isDependsObj = isPlainObject(depends);

    if (isDependsObj) {
      let res = true;
      forEach(depends, (params, key) => {
        res = Validator.hasRule(key);
        invariant(res, `"${key}" rule does not exist`);
      });

      if (!res) return;
    }

    const finalDepends = isDependsObj ? depends : [];
    const finalTest = isDependsObj ? test : depends;

    Validator.rules[name] = {
      depends: finalDepends,
      test: finalTest
    };
  }

  static hasRule(name) {
    return Validator.rules.hasOwnProperty(name);
  }

  static getRule(name) {
    if (!Validator.hasRule(name)) {
      invariant(false, `"${name}" rule does not exist`);
    } else {
      return Validator.rules[name];
    }
  }

  static defineLocale(locale, messages) {
    const currentLocale = Validator.getLocale();
    Validator.locale = locale;
    Validator.setErrorMessages(messages);
    Validator.locale = currentLocale;
  }

  static getLocale() {
    return Validator.locale;
  }

  static setLocale(locale) {
    invariant(
      hasProp(Validator.errorMessages, locale),
      `"${locale}" locale is does not exist`
    );
    Validator.locale = locale;
  }

  static getErrorMessage(name) {
    const messages = Validator.getErrorMessages();
    return messages.hasOwnProperty(name) ? messages[name] : messages.defaultMessage;
  }

  static getErrorMessages() {
    return Validator.errorMessages[Validator.getLocale()];
  }

  static setErrorMessages(messages) {
    invariant(
      hasProp(messages, "defaultMessage"),
      "locale messages is required by 'defaultMessage' field"
    );
    Validator.errorMessages[Validator.getLocale()] = messages;
  }

  static addErrorMessage(name, message) {
    const messages = Validator.getErrorMessages();

    invariant(
      !hasProp(messages, name),
      `"${name}" error message already exists`
    );

    Validator.setErrorMessages({ ...messages, [name]: message });
  }

  constructor(values = {}, rules = {}) {
    this.setRules(rules);
    this.setValues(values);
    this.errors = {};
  }

  setRules(rules) {
    this.rules = {};
    this.mergeRules(rules);
  }

  mergeRules(rules) {
    invariant(isPlainObject(rules), "`rules` must be plain object");
    this.rules = { ...this.rules, ...rules };
  }

  getValues() {
    return this.values;
  }

  setValues(values) {
    this.values = {};
    this.mergeValues(values);
  }

  mergeValues(values) {
    invariant(isPlainObject(values), "`values` must be plain object");
    this.values = { ...this.values, ...values };
  }

  getValue(key) {
    return this.hasValue(key) ? this.values[key] : null;
  }

  setValue(key, value) {
    this.values[key] = value;
  }

  hasValue(key) {
    return hasProp(this.values, key);
  }

  getErrors() {
    return this.errors;
  }

  setErrors(errors) {
    this.errors = errors;
  }

  getError(key) {
    return this.hasError(key) ? this.errors[key] : null;
  }

  setError(key, params = null) {
    const tmpl = Validator.getErrorMessage(key);
    this.errors[key] = template(tmpl, params);
  }

  hasError(key) {
    return hasProp(this.errors, key);
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  clearError(key) {
    if (this.hasError(key)) {
      delete this.errors[key];
    }
  }

  clearErrors() {
    this.errors = {};
  }

  validate() {
    this.setErrors({});

    forEach(this.values, (value, key) => {
      if (!hasProp(this.rules, key)) return false;
      const validates = this.rules[key];

      forEach(validates, (params, ruleName) => {
        if (this.execTest(ruleName, key, value, params, this.values)) return;
        this.setError(key, params);
        return false;
      });
    });

    return !this.hasErrors();
  }

  execTest(ruleName, key, value, params, values) {
    const isObj = isPlainObject(params);
    if (!isObj && params !== true) return true;

    const finalParams = isObj ? params : null;
    const { test, depends } = Validator.getRule(ruleName);
    let passDepends = true;

    forEach(depends, (p, k) => {
      if (!this.execTest(k, key, value, p, values)) {
        passDepends = false;
        return false;
      }
    });

    return passDepends ? test(value, finalParams, key, values, this) : true;
  }
}


export default Validator;
