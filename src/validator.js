import invariant from "invariant";
import isPlainObject from "lodash.isplainobject";
import forEach from "lodash.foreach";
import map from "lodash.map";
import {
  hasProp,
  typeOf,
  isString,
  isFunction,
  isPromise,
  template
} from "./utils";


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
    return hasProp(Validator.rules, name);
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

  static getErrorMessage(name, typeString = null) {
    const messages = Validator.getErrorMessages();
    const { defaultMessage } = messages;
    const message = hasProp(messages, name) ? messages[name] : defaultMessage;

    if (isPlainObject(message)) {
      if (typeString == null) return defaultMessage;
      return hasProp(message, typeString) ? message[typeString] : defaultMessage;
    }

    return message;
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
    this.validating = false;
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

  getAllErrors() {
    return this.errors;
  }

  setAllErrors(errors) {
    this.errors = errors;
  }

  clearAllErrors() {
    this.setAllErrors({});
  }

  hasAnyErrors() {
    return Object.keys(this.errors).length > 0;
  }

  getErrors(key) {
    return this.hasErrors(key) ? this.errors[key] : null;
  }

  setErrors(key, errors) {
    this.errors[key] = errors;
  }

  getError(key, rule) {
    const index = this.getErrorIndexByKeyAndRule(key, rule);
    if (index < 0) return null;

    return this.getErrors(key)[index].message;
  }

  addError(key, rule, args) {
    const { result, params, value } = args;
    const error = { rule, params };

    if (isString(result)) {
      error.message = result;

    } else {
      const tmpl = Validator.getErrorMessage(rule, typeOf(value));
      error.message = template(tmpl, params);
    }

    this.setErrors(key, [
      ...(!this.hasErrors(key) ? [] : this.getErrors(key)),
      error
    ]);
  }

  removeError(key, rule) {
    const index = this.getErrorIndexByKeyAndRule(key, rule);
    if (index < 0) return;

    const errors = this.getErrors(key);
    if (errors.length <= 1) {
      this.clearErrors(key);
      return;
    }

    this.setErrors(key, errors.slice(0, index).concat(errors.slice(index + 1)));
  }

  hasErrors(key) {
    return hasProp(this.errors, key);
  }

  hasError(key, rule) {
    return this.getErrorIndexByKeyAndRule(key, rule) > -1;
  }

  getErrorIndexByKeyAndRule(key, rule) {
    const notFound = -1;

    if (!this.hasErrors(key)) return notFound;
    const errors = this.getErrors(key);

    for (let i = 0; i < errors.length; i++) {
      if (errors[i].rule === rule) return i;
    }

    return notFound;
  }

  clearErrors(key) {
    if (this.hasErrors(key)) {
      delete this.errors[key];
    }
  }

  isValidating() {
    return this.validating;
  }

  validate() {
    this.validating = true;
    this.clearAllErrors();

    forEach(this.rules, (validates, key) => {
      const value = this.getValue(key);

      forEach(validates, (params, rule) => {
        const res = this.performTest(rule, key, value, params, this.values);
        if (res === true) return;

        this.addError(key, rule, { result: res, params, value });
      });
    });

    this.validating = false;
    return !this.hasAnyErrors();
  }

  asyncValidate() {
    this.validating = true;
    this.clearAllErrors();

    return Promise.all(map(this.rules, (validates, key) => {
      const value = this.getValue(key);

      return Promise.all(map(validates, (params, rule) =>
        this.performAsyncTest(rule, key, value, params, this.values)
      ));
    }))
      .then(() => {
        this.validating = false;
        return Promise.resolve(this.getValues());
      })
      .catch(() => {
        this.validating = false;
        return Promise.reject(this.getAllErrors());
      });
  }

  performAsyncTest(rule, key, value, params, values) {
    const res = this.performTest(rule, key, value, params, values);

    if (res === true) return Promise.resolve();

    if (!isPromise(res)) {
      this.addError(key, rule, { result: res, params, value });
      return Promise.reject();
    }

    return res.catch(message => {
      this.addError(key, rule, { result: message, params, value });
      return Promise.reject();
    });
  }

  performTest(rule, key, value, params, values) {
    const isObjParams = isPlainObject(params);
    const isCallable = isFunction(params);
    if (!isCallable && !isObjParams && params !== true) return true;

    if (Validator.hasRule(rule)) {
      return this.performBuiltInTest(
        rule,
        key,
        value,
        isObjParams ? params : null,
        values
      );

    } else if (isCallable) {
      return this.performInlineTest(
        params,
        key,
        value,
        values
      );
    }
  }

  performBuiltInTest(rule, key, value, params, values) {
    const { test, depends } = Validator.getRule(rule);
    let passDepends = true;

    forEach(depends, (p, k) => {
      if (!this.performTest(k, key, value, p, values)) {
        passDepends = false;
        return false;
      }
    });

    return passDepends ? test(value, params, key, values, this) : true;
  }

  performInlineTest(test, key, value, values) {
    return test(value, null, key, values, this);
  }
}


export default Validator;
