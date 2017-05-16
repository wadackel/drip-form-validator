import * as assert from 'power-assert';
import * as utils from '../../src/internal/utils';


describe('Internal#Utilities', () => {
  it('hasProp()', () => {
    class Foo { bar = 'baz'; }

    assert(utils.hasProp({ hoge: 'foo' }, 'hoge'));
    assert(utils.hasProp((new Foo()), 'bar'));
    assert(utils.hasProp({}, 'hoge') === false);
  });


  it('typeOf()', () => {
    class Hoge { fuga() { return 'value'; } }

    assert(utils.typeOf(null) === 'null');
    assert(utils.typeOf(undefined) === 'undefined');
    assert(utils.typeOf('str') === 'string');
    assert(utils.typeOf(0) === 'number');
    assert(utils.weakTypeOf(0xff) === 'number');
    assert(utils.typeOf(NaN) === 'number');
    assert(utils.typeOf({}) === 'object');
    assert(utils.typeOf([]) === 'array');
    assert(utils.typeOf(() => {}) === 'function');
    assert(utils.typeOf(new Date()) === 'date');
    assert(utils.typeOf(new Hoge()) === 'hoge');
  });


  it('weakTypeOf()', () => {
    class Hoge { fuga() { return 'value'; } }

    assert(utils.weakTypeOf(null) === 'null');
    assert(utils.weakTypeOf(undefined) === 'undefined');
    assert(utils.weakTypeOf('str') === 'string');
    assert(utils.weakTypeOf('foo') === 'string');
    assert(utils.weakTypeOf(0) === 'number');
    assert(utils.weakTypeOf(0xff) === 'number');
    assert(utils.weakTypeOf('123') === 'number');
    assert(utils.weakTypeOf('+123') === 'number');
    assert(utils.weakTypeOf('-123') === 'number');
    assert(utils.weakTypeOf('0xff') === 'number');
    assert(utils.weakTypeOf(NaN) === 'number');
    assert(utils.weakTypeOf({}) === 'object');
    assert(utils.weakTypeOf([]) === 'array');
    assert(utils.weakTypeOf(() => {}) === 'function');
    assert(utils.weakTypeOf(new Date()) === 'date');
    assert(utils.weakTypeOf(new Hoge()) === 'hoge');
  });


  it('isBoolean()', () => {
    assert(utils.isBoolean(true));
    assert(utils.isBoolean(false));
    assert(utils.isBoolean('true') === false);
    assert(utils.isBoolean(0) === false);
  });


  it('isString()', () => {
    assert(utils.isString('str'));
    assert(utils.isString('0'));
    assert(utils.isString(0) === false);
    assert(utils.isString({}) === false);
    assert(utils.isString([]) === false);
  });


  it('isNumber()', () => {
    assert(utils.isNumber(0));
    assert(utils.isNumber(123));
    assert(utils.isNumber(NaN));
    assert(utils.isNumber('123') === false);
    assert(utils.isNumber({}) === false);
  });


  it('isArray()', () => {
    assert(utils.isArray([]));
    assert(utils.isArray({}) === false);
    assert(utils.isArray(() => {}) === false);
    assert(utils.isArray('str') === false);
    assert(utils.isArray(0) === false);
    assert(utils.isArray(null) === false);
    assert(utils.isArray(undefined) === false);
  });


  it('isFunction()', () => {
    function foo() {}
    class Bar {}

    assert(utils.isFunction(foo));
    assert(utils.isFunction(Bar));
    assert(utils.isFunction(() => {}));
    assert(utils.isFunction(0) === false);
    assert(utils.isFunction('str') === false);
    assert(utils.isFunction({}) === false);
    assert(utils.isFunction([]) === false);
    assert(utils.isFunction(null) === false);
    assert(utils.isFunction(undefined) === false);
  });


  it('isPromise()', () => {
    assert(utils.isPromise(Promise.resolve()));
    assert(utils.isPromise(Promise.resolve(new Error())));
    assert(utils.isPromise(new Promise(() => Promise.resolve())));
    assert(utils.isPromise(() => {}) === false);
    assert(utils.isPromise(NaN) === false);
    assert(utils.isPromise(null) === false);
    assert(utils.isPromise(undefined) === false);
  });


  it('isDate()', () => {
    assert(utils.isDate(new Date()));
    assert(utils.isDate('2017-01-01 00:00:00') === false);
    assert(utils.isDate('2017-01-01') === false);
    assert(utils.isDate('2017') === false);
    assert(utils.isDate('00:00:00') === false);
    assert(utils.isDate('string') === false);
    assert(utils.isDate(2017) === false);
    assert(utils.isDate(null) === false);
    assert(utils.isDate(undefined) === false);
  });


  it('isArray()', () => {
    assert(utils.isArray([]));
    assert(utils.isArray(new Array()));
    assert(utils.isArray(new Date()) === false);
    assert(utils.isArray('string') === false);
    assert(utils.isArray(2017) === false);
    assert(utils.isArray(null) === false);
    assert(utils.isArray(undefined) === false);
  });


  it('isNumeric()', () => {
    assert(utils.isNumeric(0));
    assert(utils.isNumeric(10));
    assert(utils.isNumeric(1.12));
    assert(utils.isNumeric(-12.28));
    assert(utils.isNumeric('10'));
    assert(utils.isNumeric('02'));
    assert(utils.isNumeric('-2888.2122'));
    assert(utils.isNumeric('+120'));
    assert(utils.isNumeric(NaN) === false);
    assert(utils.isNumeric(null) === false);
    assert(utils.isNumeric(undefined) === false);
    assert(utils.isNumeric([]) === false);
    assert(utils.isNumeric({}) === false);
    assert(utils.isNumeric('0.0.0') === false);
    assert(utils.isNumeric('+-1289.82') === false);
  });


  it('isInteger()', () => {
    assert(utils.isInteger(0));
    assert(utils.isInteger(120));
    assert(utils.isInteger(-12));
    assert(utils.isInteger(NaN) === false);
    assert(utils.isInteger(null) === false);
    assert(utils.isInteger(undefined) === false);
    assert(utils.isInteger([]) === false);
    assert(utils.isInteger({}) === false);
    assert(utils.isInteger(85.02) === false);
    assert(utils.isInteger('622') === false);
  });


  it('isEmpty()', () => {
    assert(utils.isEmpty(false));
    assert(utils.isEmpty(0));
    assert(utils.isEmpty(null));
    assert(utils.isEmpty(undefined));
    assert(utils.isEmpty(NaN));
    assert(utils.isEmpty({}));
    assert(utils.isEmpty([]));
    assert(utils.isEmpty(true) === false);
    assert(utils.isEmpty(1) === false);
    assert(utils.isEmpty({ foo: 'bar' }) === false);
    assert(utils.isEmpty(['val']) === false);
    assert(utils.isEmpty(new Date()) === false);
  });


  it('template()', () => {
    const tests = [
      {
        tmpl: 'My name is {{name}}!!',
        data: { name: 'Tsuyoshi Wada', hoge: 'fuga' },
        expected: 'My name is Tsuyoshi Wada!!',
      },
      {
        tmpl: '{{key1}} {{key2}} {{key3}}',
        data: {},
        expected: '  ',
      },
      {
        tmpl: '{fuga}{hoge}',
        data: { fuga: 'test', hoge: 'test' },
        expected: '{fuga}{hoge}',
      },
      {
        tmpl: '{{tmpl-_+}key!!}}!!',
        data: { 'tmpl-_+}key!!': 'value' },
        expected: 'value!!',
      },
      {
        tmpl: '{{key}}',
        data: null,
        expected: '',
      },
    ];

    tests.forEach(({ tmpl, data, expected }) => {
      assert(utils.template(tmpl, data) === expected);
    });
  });
});
