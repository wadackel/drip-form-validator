import invariant from "invariant";
import isPlainObject from "lodash.isplainobject";
import forEach from "lodash.foreach";
import { hasProp, template } from "./utils";


class Validator {
  static locale =  "en";
  static errorMessages = {};
  static rules = {};

  static addRule(name, test) {
    if (Validator.hasRule(name)) {
      invariant(false, `"${name}" rule already exists`);
    } else {
      Validator.rules[name] = test;
    }
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
    Validator.setLocale(locale);
    Validator.setErrorMessages(messages);
    Validator.setLocale(currentLocale);
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

      forEach(validates, rules => {
        forEach(rules, (params, ruleName) => {
          const isObj = isPlainObject(params);
          if (!isObj && params !== true) return;

          const test = Validator.getRule(ruleName);
          const res = test(value, isObj ? params : null, key, this.values, this);
          if (res) return;

          this.setError(key, params);
          return false;
        });
      });
    });

    return !this.hasErrors();
  }
}


export default Validator;
