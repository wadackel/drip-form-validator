import { EventEmitter } from 'events';
import invariant = require('invariant');
import forEach = require('lodash.foreach');
import map = require('lodash.map');
import isPlainObject = require('lodash.isplainobject');
import * as dot from 'dot-wild';

import * as EventTypes from './event-types';
import {
  hasProp,
  typeOf,
  isString,
  isFunction,
  isPromise,
  template,
} from './internal/utils';


/**
 * Declarations
 */

// Values
export interface Values {
  [index: string]: any;
}

// Parameters
export interface RuleObjectParams {
  [index: string]: any;
}

export interface ValidationTester {
  (value: any, params: RuleObjectParams, field: string, values: Values): boolean | Promise<any>;
}

export type RuleParams = boolean | ValidationTester | RuleObjectParams;

export interface NormalizeObjectParams {
  [index: string]: any;
}

export interface Normalizer {
  (value: any, params: NormalizeParams, previousValue: any, values: Values, previousValues: Values): any;
}

export type NormalizeParams = boolean | Normalizer | NormalizeObjectParams;



// Messages
export interface MessageCreatorParams extends RuleObjectParams {
  field: string;
}

export interface MessageCreator {
  (field: string, value: any, params: MessageCreatorParams): string;
}

export type Message = string | { [index: string]: string | MessageCreator } | MessageCreator;

export interface Messages {
  [index: string]: Message;
}

export interface InstanceMessages {
  [index: string]: Messages;
}


// Error
export interface ValidateError {
  message: string;
  rule: string;
  params: boolean | { [index: string]: any };
}

export interface ValidateErrorList {
  [index: string]: ValidateError[];
}


// Fields
export interface CustomFields {
  [index: string]: string;
}


// Locale
export interface LocaleMessages extends Messages {
  defaultMessage: string;
}

export interface DefinedLocaleMessages {
  [index: string]: LocaleMessages;
}


// Rules
export interface RuleDepends {
  [index: string]: RuleParams;
}

export type Rule = { [index: string]: RuleParams | ValidationTester };

export interface RuleList {
  [index: string]: Rule;
}

export interface BuiltinRule {
  depends: RuleDepends;
  test: ValidationTester;
  implicit: boolean;
}

export interface BuiltinRuleList {
  [index: string]: BuiltinRule;
}


// Normalizer
export interface Normalizers {
  [index: string]: NormalizeParams;
}

export interface NormalizerDepends extends Normalizers {
}

export interface NormalizerList {
  [index: string]: Normalizers;
}

export interface BuiltinNormalizer {
  depends: NormalizerDepends;
  normalizer: Normalizer;
  before: boolean;
}

export interface BuiltinNormalizerList {
  [index: string]: BuiltinNormalizer;
}


/**
 * Validator
 */
export interface ValidatorOptions {
  messages?: InstanceMessages;
  fields?: CustomFields;
  normalizers?: NormalizerList;
}

const defaultOptions = {
  messages: {},
  normalizers: {},
};

class Validator extends EventEmitter {
  static _locale: string = 'en';
  static _localeMessages: DefinedLocaleMessages = {};
  static _builtinRules: BuiltinRuleList = {};
  static _builtinNormalizers: BuiltinNormalizerList = {};


  /**
   * Locale
   */
  static defineLocale(locale: string, messages: LocaleMessages): void {
    const current = Validator._locale;
    Validator._locale = locale;
    Validator.setMessages(messages);
    Validator._locale = current;
  }

  static hasLocale(locale: string): boolean {
    return hasProp(Validator._localeMessages, locale);
  }

  static getLocale(): string {
    return Validator._locale;
  }

  static setLocale(locale: string): void {
    invariant(
      hasProp(Validator._localeMessages, locale),
      `"${locale}" locale is does not exist`,
    );
    Validator._locale = locale;
  }


  /**
   * Messages
   */
  static getMessages(): LocaleMessages {
    return Validator._localeMessages[Validator.getLocale()];
  }

  static setMessages(messages: LocaleMessages): void {
    invariant(
      hasProp(messages, 'defaultMessage'),
      'Locale messages is required by "defaultMessage" field.',
    );
    Validator._localeMessages[Validator.getLocale()] = messages;
  }

  static getMessage(rule: string, type: string | null = null): string | MessageCreator {
    const messages = Validator.getMessages();
    const { defaultMessage } = messages;
    const msg = <Message | null>dot.get(messages, rule);

    if (isString(msg) || isFunction(msg)) {
      return <string | MessageCreator>msg;

    } else if (isPlainObject(msg)) {
      if (type && dot.has(msg, type)) return <string>dot.get(msg, type);
      if (dot.has(msg, 'defaultMessage')) return <string>dot.get(msg, 'defaultMessage');
    }

    return defaultMessage;
  }

  static setMessage(rule: string, message: Message): void {
    const messages = Validator.getMessages();

    Validator.setMessages({
      ...messages,
      [rule]: message,
    });
  }


  /**
   * Builtin rules
   */
  static registerRule(rule: string, depends: RuleDepends, test: ValidationTester, implicit: boolean = true): void {
    if (Validator.hasRule(rule)) {
      invariant(false, `"${rule}" rule already exists`);
      return;
    }

    let res = true;

    forEach(depends, (_: any, key: string) => {
      const tmp = Validator.hasRule(key);
      invariant(tmp, `"${key}" rule does not exist`);
      if (res && !tmp) {
        res = false;
      }
    });

    if (!res) return;

    Validator._builtinRules[rule] = {
      depends,
      test,
      implicit,
    };
  }

  static hasRule(rule: string): boolean {
    return hasProp(Validator._builtinRules, rule);
  }

  static getRule(rule: string): BuiltinRule | null {
    return Validator.hasRule(rule) ? Validator._builtinRules[rule] : null;
  }


  /**
   * Builtin normalizer
   */
  static registerNormalizer(name: string, depends: NormalizerDepends, normalizer: Normalizer, before: boolean = true): void {
    if (Validator.hasNormalizer(name)) {
      invariant(false, `"${name}" normalizer already exists`);
      return;
    }

    let res = true;

    forEach(depends, (_: any, key: string) => {
      const tmp = Validator.hasNormalizer(key);
      invariant(tmp, `"${key}" normalizer does not exist`);
      if (res && !tmp) {
        res = false;
      }
    });

    if (!res) return;

    Validator._builtinNormalizers[name] = {
      depends,
      normalizer,
      before,
    };
  }

  static hasNormalizer(name: string): boolean {
    return hasProp(Validator._builtinNormalizers, name);
  }

  static getNormalizer(name: string): BuiltinNormalizer | null {
    return Validator.hasNormalizer(name) ? Validator._builtinNormalizers[name] : null;
  }


  /**
   * Instance
   */
  protected _validating: boolean = false;
  protected _errors: ValidateErrorList = {};
  protected _values: Values;
  protected _rules: RuleList;
  protected _normalizers: NormalizerList = {};
  protected _messages: InstanceMessages = {};
  protected _fields: CustomFields = {};

  constructor(
    values: Values = {},
    rules: RuleList = {},
    options: ValidatorOptions = {},
  ) {
    super();

    const opts = { ...defaultOptions, ...options };

    this.setValues(values);
    this.setRules(rules);

    if (opts.normalizers) this.setNormalizers(opts.normalizers);
    if (opts.messages) this.setMessages(opts.messages);
    if (opts.fields) this.setCustomFields(opts.fields);
  }


  /**
   * Status
   */
  isValidating(): boolean {
    return this._validating;
  }

  isValid(): boolean {
    return Object.keys(this.getAllErrors()).length < 1;
  }


  /**
   * Values
   */
  getValues(): Values {
    return { ...this._values };
  }

  setValues(values: Values): void {
    this._values = {};
    this.mergeValues(values);
  }

  mergeValues(values: Values): void {
    invariant(isPlainObject(values), `"values" must be plain object.`);
    this._values = { ...this._values, ...values };
  }

  clearValues(): void {
    this.setValues({});
  }

  getValue(field: string): any {
    return dot.get(this._values, field, null);
  }

  setValue(field: string, value: any): void {
    this._values = dot.set(this._values, field, value);
  }

  hasValue(field: string): boolean {
    return dot.has(this._values, field);
  }


  /**
   * Messages
   */
  getMessages(): InstanceMessages {
    return { ...this._messages };
  }

  setMessages(messages: InstanceMessages): void {
    this._messages = {};
    this.mergeMessages(messages);
  }

  mergeMessages(messages: InstanceMessages): void {
    invariant(isPlainObject(messages), '"messages" must be plain object.');
    this._messages = { ...this._messages, ...messages };
  }


  /**
   * Fields
   */
  getCustomFields(): CustomFields {
    return { ...this._fields };
  }

  setCustomFields(fields: CustomFields): void {
    this._fields = {};
    this.mergeCustomFields(fields);
  }

  mergeCustomFields(fields: CustomFields): void {
    invariant(isPlainObject(fields), '"fields" must be plain object.');
    this._fields = { ...this._fields, ...fields };
  }

  getFieldTitle(field: string): string {
    let result = field;

    forEach(this._fields, (title: string, key: string) => {
      if (dot.matchPath(key, field)) {
        result = title;
        return false;
      }
      return true;
    });

    return result;
  }


  /**
   * Errors
   */
  protected getPrecompileErrorMessage(field: string, rule: string, type: string | null = null): string | MessageCreator {
    const path = `${field}.${rule}`;

    if (dot.has(this._messages, path)) {
      const msg = dot.get(this._messages, path);

      if (isString(msg)) {
        return msg;
      } else if (isPlainObject(msg)) {
        return dot.get(msg, type || '', dot.get(msg, 'defaultMessage', ''));
      }

      return msg;
    }

    return Validator.getMessage(rule, type);
  }

  getAllErrors(): ValidateErrorList {
    return { ...this._errors };
  }

  clearAllErrors(): void {
    this._errors = {};
  }

  addError(field: string, rule: string, result: string | boolean, params: RuleParams): void {
    const error: ValidateError = { rule, params, message: '' };
    const value = this.getValue(field);
    const type = typeOf(value);

    if (isString(result)) {
      error.message = result;

    } else {
      const fieldTitle = this.getFieldTitle(field);
      const objParams = {
        field: fieldTitle,
        ...(isPlainObject(params) ? <RuleObjectParams>params : {}),
      };

      const msg = this.getPrecompileErrorMessage(field, rule, type === 'null' ? null : type);
      error.message = isString(msg) ? template(msg, objParams) : msg(
        fieldTitle,
        value,
        objParams,
      );
    }

    const errors = this.getErrors(field);

    this.setErrors(field, [
      ...(errors ? errors : []),
      error,
    ]);
  }

  getErrors(field: string): ValidateError[] | null {
    let result: ValidateError[] | null = null;

    forEach(this._errors, (_: any, k: string) => {
      if (dot.matchPath(field, k)) {
        result = this._errors[k];
        return false;
      }
      return true;
    });

    return result;
  }

  setErrors(field: string, errors: ValidateError[]): void {
    this._errors[field] = errors;
  }

  hasErrors(field: string): boolean {
    return !!this.getErrors(field);
  }

  removeError(field: string, rule: string): void {
    const errors = this.getErrors(field);

    if (errors) {
      this.setErrors(field, errors.filter(o => o.rule !== rule));
    }
  }

  clearErrors(field: string): void {
    if (this.hasErrors(field)) {
      this._errors = dot.remove(this._errors, field);
    }
  }

  getErrorMessages(field: string): string[] | null {
    const errors = this.getErrors(field);
    if (!errors) return null;

    return <string[]>dot.get(errors, '*.message');
  }

  getErrorMessage(field: string, rule: string): string | null {
    const errors = this.getErrors(field);
    if (!errors) return null;

    let result = null;

    forEach(errors, error => {
      if (error.rule === rule) {
        result = error.message;
        return false;
      }
      return true;
    });

    return result;
  }


  /**
   * Rules
   */
  getRules(): RuleList {
    return { ...this._rules };
  }

  setRules(rules: RuleList): void {
    this._rules = {};
    this.mergeRules(rules);
  }

  mergeRules(rules: RuleList): void {
    invariant(isPlainObject(rules), '"rules" must be plain object');
    this._rules = { ...this._rules, ...rules };
  }


  /**
   * Normalizer
   */
  getNormalizers(): NormalizerList {
    return { ...this._normalizers };
  }

  setNormalizers(normalizers: NormalizerList): void {
    this._normalizers = {};
    this.mergeNormalizers(normalizers);
  }

  mergeNormalizers(normalizers: NormalizerList): void {
    invariant(isPlainObject(normalizers), '"normalizers" must be plain object.');
    this._normalizers = { ...this._normalizers, ...normalizers };
  }


  /**
   * Events
   */
  protected beforeValidate(): void {
    this.clearAllErrors();
    this.emit(EventTypes.BEFORE_VALIDATE, this);
    this.normalize(true);
    this._validating = true;
  }

  protected afterValidate(): void {
    this.normalize(false);
    this._validating = false;
    this.emit(EventTypes.AFTER_VALIDATE, this);
    this.emit(this.isValid() ? EventTypes.VALID : EventTypes.INVALID, this);
  }


  /**
   * Normalize
   */
  protected expandNormalizers(): NormalizerList {
    const normalizers: NormalizerList = {};
    const flat = dot.flatten(this._values);

    forEach(this._normalizers, (normalizer: Normalizers, field: string) => {
      if (/\*/.test(field)) {
        forEach(flat, (_: any, k: string) => {
          if (dot.matchPath(field, k)) {
            normalizers[k] = normalizer;
          }
        });
      } else {
        normalizers[field] = normalizer;
      }
    });

    return normalizers;
  }

  protected normalize(before: boolean): void {
    const normalizers = this.expandNormalizers();
    const previousValues = this.getValues();

    forEach(normalizers, (list: Normalizers, field: string) => {
      const previousValue = this.getValue(field);
      let value = previousValue;

      forEach(list, (params: NormalizeParams | Normalizer, name: string) => {
        value = this.executeNormalize(
          before,
          name,
          field,
          value,
          params,
          previousValue,
          previousValues,
        );
      });

      this.setValue(field, value);
    });
  }

  protected executeNormalize(
    before: boolean,
    name: string,
    field: string,
    value: any,
    params: NormalizeParams,
    previousValue: any,
    previousValues: Values,
  ): any {
    const isObjParams = isPlainObject(params);
    const isInline = isFunction(params);

    if (!isObjParams && !isInline && params !== true) {
      return value;
    }

    const values = dot.set(previousValues, field, value);

    if (isInline) {
      const inline = <Normalizer>params;
      return !before ? value : inline(value, {}, previousValue, values, previousValues);
    }

    if (!Validator.hasNormalizer(name)) {
      return value;
    }

    const { normalizer, depends, before: b } = <BuiltinNormalizer>Validator.getNormalizer(name);

    if (b !== before) {
      return value;
    }

    let result = value;

    forEach(depends, (p: NormalizeParams, n: string) => {
      result = this.executeNormalize(before, n, field, result, p, previousValue, previousValues);
    });

    return normalizer(result, isObjParams ? params : {}, previousValue, values, previousValues);
  }


  /**
   * Validate
   */
  protected expandRules(): RuleList {
    const rules: RuleList = {};
    const flat = dot.flatten(this._values);

    forEach(this._rules, (rule: Rule, field: string): void => {
      if (/\*/.test(field)) {
        forEach(flat, (_: any, k: string) => {
          if (dot.matchPath(field, k)) {
            rules[k] = rule;
          }
        });
      } else {
        rules[field] = rule;
      }
    });

    return rules;
  }

  validate(): boolean {
    this.beforeValidate();

    const rules = this.expandRules();

    forEach(rules, (fieldRules: Rule, field: string) => {
      const value = this.getValue(field);

      forEach(fieldRules, (params: RuleParams, rule: string) => {
        const result = this.syncExecuteTest(rule, field, value, params);
        if (result === true) return;

        this.addError(field, rule, result, params);
      });
    });

    this.afterValidate();

    return this.isValid();
  }

  asyncValidate(): Promise<Values> {
    this.beforeValidate();

    const rules = this.expandRules();

    return Promise.all(map(rules, (fieldRules: Rule, field: string) => {
      const value = this.getValue(field);

      return Promise.all(map(fieldRules, (params: RuleParams, rule: string) =>
        this.asyncExecuteTest(rule, field, value, params),
      ));
    }))
      .then(() => {
        this.afterValidate();
        return Promise.resolve(this.getValues());
      })
      .catch(() => {
        this.afterValidate();
        return Promise.reject(this.getAllErrors());
      });
  }

  protected syncExecuteTest(rule: string, field: string, value: any, params: RuleParams): boolean | string {
    const result = this.executeTest(rule, field, value, params);

    return isPromise(result) ? true : <boolean | string>result;
  }

  protected asyncExecuteTest(rule: string, field: string, value: any, params: RuleParams): Promise<void> {
    let result = this.executeTest(rule, field, value, params);

    if (result === true) {
      return Promise.resolve();
    }

    if (!isPromise(result)) {
      this.addError(field, rule, <string | boolean>result, params);
      return Promise.reject(null);
    }

    result = <Promise<string | void>>result;

    return result.catch(message => {
      this.addError(field, rule, isString(message) ? message : false, params);
      return Promise.reject(null);
    });
  }

  protected executeTest(rule: string, field: string, value: any, params: RuleParams): boolean | string | Promise<string | void> {
    const isObjParams = isPlainObject(params);
    const isInline = isFunction(params);
    if (!isObjParams && !isInline && params !== true) return true;

    // inline test
    if (isInline) {
      const inline = <ValidationTester>params;
      return inline(value, {}, field, this._values);

    // search rule
    } else if (!Validator.hasRule(rule)) {
      return false;
    }

    // registered rule
    const { test, depends, implicit } = <BuiltinRule>Validator.getRule(rule);
    let passDepends = true;

    if (implicit && (!dot.has(this._values, field) || value === null)) {
      return true;
    }

    forEach(depends, (p: any, r: string) => {
      const result = this.executeTest(r, field, value, p);

      if (result !== true || isPromise(result)) {
        passDepends = false;
        return false;
      }

      return true;
    });

    return !passDepends
      ? false
      : test(value, isObjParams ? <RuleObjectParams>params : {}, field, this._values);
  }
}


export default Validator;
