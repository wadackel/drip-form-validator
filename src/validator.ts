import { EventEmitter } from 'events';
import invariant = require('invariant');
import forEach = require('lodash.foreach');
import map = require('lodash.map');
import isPlainObject = require('lodash.isplainobject');
import * as dot from 'dot-wild';

import * as EventTypes from './event-types';
import {
  hasProp,
  weakTypeOf,
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

export interface InternalValidationTester<T> {
  (value: any, params: RuleObjectParams, field: string, values: Values): T;
}

export type SyncValidationTester = InternalValidationTester<boolean | string>;
export type AsyncValidationTester = InternalValidationTester<Promise<any>>;
export type ValidationTester = SyncValidationTester | AsyncValidationTester;

export type RuleParams = SyncValidationTester | any;

export interface NormalizeObjectParams {
  [index: string]: any;
}

export interface Normalizer {
  (value: any, params: NormalizeParams, previousValue: any, values: Values, previousValues: Values): any;
}

export type NormalizeParams = Normalizer | any;



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

export type FieldErrorMessageList = string[];

export interface ErrorMessageList {
  [index: string]: FieldErrorMessageList;
}


// Field labels
export interface Labels {
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

export interface MapArgsToParams {
  (args: any): any;
}

export interface BuiltinRuleOptions {
  implicit?: boolean;
  depends?: RuleDepends;
  override?: boolean;
  mapArgsToParams?: MapArgsToParams;
}

export interface BuiltinRule {
  sync: boolean;
  depends: RuleDepends;
  test: ValidationTester;
  implicit: boolean;
  mapArgsToParams: MapArgsToParams;
}

export interface BuiltinRuleList {
  [index: string]: BuiltinRule;
}

export interface InternalRuleKeysCallback {
  (field: string, ruleName: string, rule: Rule | null, params: RuleParams | ValidationTester): boolean;
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

export interface BuiltinNormalizerOptions {
  depends?: NormalizerDepends;
  override?: boolean;
}

export interface BuiltinNormalizer {
  depends: NormalizerDepends;
  normalizer: Normalizer;
}

export interface BuiltinNormalizerList {
  [index: string]: BuiltinNormalizer;
}


/**
 * Validator
 */
export interface ValidatorOptions {
  messages?: InstanceMessages;
  labels?: Labels;
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
  private static internalRegisterRule(sync: boolean, rule: string, test: ValidationTester, options: BuiltinRuleOptions): void {
    const {
      implicit = true,
      depends = {},
      mapArgsToParams = (arg: any) => arg,
      override = false,
    } = options;

    if (!override && Validator.hasRule(rule)) {
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
      sync,
      test,
      depends,
      implicit,
      mapArgsToParams,
    };
  }

  static registerRule(rule: string, test: SyncValidationTester, options: BuiltinRuleOptions = {}): void {
    this.internalRegisterRule(true, rule, test, options);
  }

  static registerAsyncRule(rule: string, test: AsyncValidationTester, options: BuiltinRuleOptions = {}): void {
    this.internalRegisterRule(false, rule, test, options);
  }

  static hasRule(rule: string): boolean {
    return hasProp(Validator._builtinRules, rule);
  }

  static getRule(rule: string): BuiltinRule | null {
    return Validator.hasRule(rule) ? Validator._builtinRules[rule] : null;
  }

  static isValidParams(value: any): boolean {
    return value !== undefined && value !== null && value !== false;
  }


  /**
   * Builtin normalizer
   */
  static registerNormalizer(name: string, normalizer: Normalizer, options: BuiltinNormalizerOptions = {}): void {
    const {
      depends = {},
      override = false,
    } = options;

    if (!override && Validator.hasNormalizer(name)) {
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
  protected _labels: Labels = {};

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
    if (opts.labels) this.setLabels(opts.labels);
  }


  /**
   * Status
   */
  isValidating(): boolean {
    return this._validating;
  }

  isValid(filter?: string | string[] | null): boolean {
    const filters = (isString(filter) ? [filter] : filter) || null;

    if (!filters) {
      return Object.keys(this.getAllErrors()).length < 1;
    }

    return filters.every(field => (
      !this.getErrors(field)
    ));
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

  getFilteredValues(filters: string[] = []): Values {
    let values = {};

    filters.forEach(filter => {
      dot.forEach(this._values, filter, (value: any, _: any, __: any, path: string) => {
        values = dot.set(values, path, value);
      });
    });

    return values;
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
   * Field labels
   */
  getLabels(): Labels {
    return { ...this._labels };
  }

  setLabels(labels: Labels): void {
    this._labels = {};
    this.mergeLabels(labels);
  }

  mergeLabels(labels: Labels): void {
    invariant(isPlainObject(labels), '"labels" must be plain object.');
    this._labels = { ...this._labels, ...labels };
  }

  getLabel(field: string): string {
    let result = field;

    forEach(this._labels, (title: string, key: string) => {
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

  getAllErrorMessages(): ErrorMessageList {
    const errors = this.getAllErrors();
    const results: ErrorMessageList = {};

    forEach(errors, (obj, field) => {
      results[<string>field] = obj.map(error => error.message);
    });

    return results;
  }

  clearAllErrors(): void {
    this._errors = {};
  }

  addError(field: string, rule: string, result: string | boolean, params: RuleParams): void {
    const error: ValidateError = { rule, params, message: '' };
    const value = this.getValue(field);
    const type = weakTypeOf(value);

    if (isString(result)) {
      error.message = result;

    } else {
      const label = this.getLabel(field);
      const objParams = {
        field: label,
        ...(isPlainObject(params) ? <RuleObjectParams>params : {}),
      };

      const msg = this.getPrecompileErrorMessage(field, rule, type === 'null' ? null : type);
      error.message = isString(msg) ? template(msg, objParams) : msg(
        label,
        value,
        objParams,
      );
    }

    this.removeError(field, rule);

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

    const results: RuleList = { ...this._rules, ...rules };

    forEach(rules, (list: Rule, field: string) => {
      forEach(list, (params: RuleParams | ValidationTester, ruleName: string) => {
        const rule = Validator.getRule(ruleName);

        if (rule) {
          results[field] = {
            ...(results[field] || {}),
            [ruleName]: rule.mapArgsToParams(params),
          };
        }
      });
    });

    this._rules = results;
  }

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
  protected beforeValidate(filters: string[] | null): void {
    if (filters) {
      filters.forEach(filter => {
        this.clearErrors(filter);
      });
    } else {
      this.clearAllErrors();
    }
    this.emit(EventTypes.BEFORE_VALIDATE, this, filters);
    this._validating = true;
  }

  protected afterValidate(filters: string[] | null): void {
    this._validating = false;
    this.emit(EventTypes.AFTER_VALIDATE, this, filters);
    this.emit(this.isValid() ? EventTypes.VALID : EventTypes.INVALID, this);
  }


  /**
   * Normalize
   */
  protected expandNormalizers(filters?: string[]): NormalizerList {
    const values = filters ? this.getFilteredValues(filters) : this._values;
    const normalizers: NormalizerList = {};

    forEach(this._normalizers, (normalizer: any, field: string) => {
      if (!dot.has(values, field)) {
        return;
      } else if (dot.containWildcardToken(field)) {
        dot.forEach(values, field, (_: any, __: any, ___: any, path: string) => {
          normalizers[path] = normalizer;
        });

      } else {
        normalizers[field] = normalizer;
      }
    });

    return normalizers;
  }

  normalize(filters?: string | string[]): void {
    const normalizers = this.expandNormalizers(isString(filters) ? [filters] : filters);
    const previousValues = this.getValues();

    forEach(normalizers, (list: Normalizers, field: string) => {
      const previousValue = this.getValue(field);
      let value = previousValue;

      forEach(list, (params: NormalizeParams | Normalizer, name: string) => {
        value = this.executeNormalize(
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
    name: string,
    field: string,
    value: any,
    params: NormalizeParams,
    previousValue: any,
    previousValues: Values,
  ): any {
    const isInline = isFunction(params);

    if (!isInline && !Validator.isValidParams(params)) {
      return value;
    }

    const values = dot.set(previousValues, field, value);

    if (isInline) {
      const inline = <Normalizer>params;
      return inline(value, {}, previousValue, values, previousValues);
    }

    if (!Validator.hasNormalizer(name)) {
      return value;
    }

    const { normalizer, depends } = <BuiltinNormalizer>Validator.getNormalizer(name);

    let result = value;

    forEach(depends, (p: NormalizeParams, n: string) => {
      result = this.executeNormalize(n, field, result, p, previousValue, previousValues);
    });

    return normalizer(result, params, previousValue, values, previousValues);
  }


  /**
   * Validate
   */
  protected expandRules(filters: string[] | null): RuleList {
    const values = filters ? this.getFilteredValues(filters) : this._values;
    const rules: RuleList = {};
    const matchField = (field: string): boolean => (
      !filters ? true : filters.some(filter => dot.matchPath(field, filter))
    );

    forEach(this._rules, (rule: Rule, field: string) => {
      if (!dot.has(values, field) || !dot.containWildcardToken(field)) {
        if (matchField(field)) {
          rules[field] = rule;
        }
      } else {
        dot.forEach(values, field, (_: any, __: any, ___: any, path: string): void => {
          if (matchField(path)) {
            rules[path] = rule;
          }
        });
      }
    });

    return rules;
  }

  validate(filter?: string | string[]): boolean {
    const filters = (isString(filter) ? [filter] : filter) || null;

    this.beforeValidate(filters);

    const rules = this.expandRules(filters);

    forEach(rules, (fieldRules: Rule, field: string) => {
      const value = this.getValue(field);

      forEach(fieldRules, (params: RuleParams, rule: string) => {
        const result = this.syncExecuteTest(rule, field, value, params);

        if (result === true) {
          this.removeError(field, rule);
        } else {
          this.addError(field, rule, result, params);
        }
      });
    });

    this.afterValidate(filters);

    return this.isValid(filters);
  }

  asyncValidate(filter?: string | string[]): Promise<Values> {
    const filters = (isString(filter) ? [filter] : filter) || null;

    this.beforeValidate(filters);

    const rules = this.expandRules(filters);

    return Promise.all(map(rules, (fieldRules: Rule, field: string) => {
      const value = this.getValue(field);

      return Promise.all(map(fieldRules, (params: RuleParams, rule: string) =>
        this.asyncExecuteTest(rule, field, value, params),
      ))
        .then(() => Promise.resolve())
        .catch(() => Promise.resolve());
    }))
      .then(() => {
        this.afterValidate(filters);

        return this.isValid(filters)
          ? Promise.resolve(this.getValues())
          : Promise.reject(this.getAllErrors());
      });
  }

  protected syncExecuteTest(rule: string, field: string, value: any, params: RuleParams): boolean | string {
    const result = this.executeTest(true, rule, field, value, params);

    return isPromise(result) ? true : <boolean | string>result;
  }

  protected asyncExecuteTest(rule: string, field: string, value: any, params: RuleParams): Promise<void> {
    const result = this.executeTest(false, rule, field, value, params);

    const resolve = () => {
      this.removeError(field, rule);
      return Promise.resolve();
    };

    const reject = (res: string | boolean) => {
      this.addError(field, rule, res, params);
      return Promise.reject(null);
    };

    if (result === true) {
      return resolve();
    }

    if (!isPromise(result)) {
      return reject(<string | boolean>result);
    }

    return (<Promise<string | void>>result)
      .then(() => resolve())
      .catch(message => reject(isString(message) ? message : false));
  }

  protected executeTest(
    sync: boolean,
    rule: string,
    field: string,
    value: any,
    params: RuleParams,
    force: boolean = false,
  ): boolean | string | Promise<string | void> {
    const isInline = isFunction(params);
    if (!Validator.isValidParams(params) && !isInline) return true;

    // inline test
    if (isInline) {
      const inline = <SyncValidationTester>params;
      return sync ? inline(value, <RuleParams>true, field, this._values) : true;

    // search rule
    } else if (!Validator.hasRule(rule)) {
      return false;
    }

    // registered rule
    const {
      sync: syncRule,
      test,
      depends,
      implicit,
    } = <BuiltinRule>Validator.getRule(rule);

    if (sync !== syncRule && !force) {
      return true;
    }

    if (implicit && (!dot.has(this._values, field) || value === null)) {
      return true;
    }

    if (sync) {
      let passDepends = true;

      forEach(depends, (p: any, r: string) => {
        const result = this.syncExecuteTest(r, field, value, p);

        if (result !== true) {
          passDepends = false;
          return false;
        }

        return true;
      });

      return !passDepends
        ? false
        : test(value, params, field, this._values);
    }

    return Promise
      .all(map(depends, (p: any, r: string): Promise<any> => {
        const result = this.executeTest(sync, r, field, value, p, true);

        if (isPromise(result)) {
          return <Promise<any>>result;
        }

        return result === true ? Promise.resolve() : Promise.reject(null);
      }))
      .then(() => test(value, params, field, this._values))
      .catch(message => Promise.reject(message));
  }
}


export default Validator;
