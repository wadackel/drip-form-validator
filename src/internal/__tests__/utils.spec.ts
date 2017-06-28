import * as utils from '../utils';


describe('Internal#Utilities', () => {
  test('hasProp()', () => {
    class Foo { bar = 'baz'; }

    expect(utils.hasProp({ hoge: 'foo' }, 'hoge')).toBe(true);
    expect(utils.hasProp((new Foo()), 'bar')).toBe(true);
    expect(utils.hasProp({}, 'hoge')).toBe(false);
  });


  test('typeOf()', () => {
    class Hoge { fuga() { return 'value'; } }

    expect(utils.typeOf(null)).toBe('null');
    expect(utils.typeOf(undefined)).toBe('undefined');
    expect(utils.typeOf('str')).toBe('string');
    expect(utils.typeOf(0)).toBe('number');
    expect(utils.weakTypeOf(0xff)).toBe('number');
    expect(utils.typeOf(NaN)).toBe('number');
    expect(utils.typeOf({})).toBe('object');
    expect(utils.typeOf([])).toBe('array');
    expect(utils.typeOf(() => {})).toBe('function');
    expect(utils.typeOf(new Date())).toBe('date');
    expect(utils.typeOf(new Hoge())).toBe('hoge');
  });


  test('weakTypeOf()', () => {
    class Hoge { fuga() { return 'value'; } }

    expect(utils.weakTypeOf(null)).toBe('null');
    expect(utils.weakTypeOf(undefined)).toBe('undefined');
    expect(utils.weakTypeOf('str')).toBe('string');
    expect(utils.weakTypeOf('foo')).toBe('string');
    expect(utils.weakTypeOf(0)).toBe('number');
    expect(utils.weakTypeOf(0xff)).toBe('number');
    expect(utils.weakTypeOf('123')).toBe('number');
    expect(utils.weakTypeOf('+123')).toBe('number');
    expect(utils.weakTypeOf('-123')).toBe('number');
    expect(utils.weakTypeOf('0xff')).toBe('number');
    expect(utils.weakTypeOf(NaN)).toBe('number');
    expect(utils.weakTypeOf({})).toBe('object');
    expect(utils.weakTypeOf([])).toBe('array');
    expect(utils.weakTypeOf(() => {})).toBe('function');
    expect(utils.weakTypeOf(new Date())).toBe('date');
    expect(utils.weakTypeOf(new Hoge())).toBe('hoge');
  });


  test('isBoolean()', () => {
    expect(utils.isBoolean(true)).toBe(true);
    expect(utils.isBoolean(false)).toBe(true);
    expect(utils.isBoolean('true')).toBe(false);
    expect(utils.isBoolean(0)).toBe(false);
  });


  test('isString()', () => {
    expect(utils.isString('str')).toBe(true);
    expect(utils.isString('0')).toBe(true);
    expect(utils.isString(0)).toBe(false);
    expect(utils.isString({})).toBe(false);
    expect(utils.isString([])).toBe(false);
  });


  test('isNumber()', () => {
    expect(utils.isNumber(0)).toBe(true);
    expect(utils.isNumber(123)).toBe(true);
    expect(utils.isNumber(NaN)).toBe(true);
    expect(utils.isNumber('123')).toBe(false);
    expect(utils.isNumber({})).toBe(false);
  });


  test('isArray()', () => {
    expect(utils.isArray([])).toBe(true);
    expect(utils.isArray({})).toBe(false);
    expect(utils.isArray(() => {})).toBe(false);
    expect(utils.isArray('str')).toBe(false);
    expect(utils.isArray(0)).toBe(false);
    expect(utils.isArray(null)).toBe(false);
    expect(utils.isArray(undefined)).toBe(false);
  });


  test('isFunction()', () => {
    function foo() {}
    class Bar {}

    expect(utils.isFunction(foo)).toBe(true);
    expect(utils.isFunction(Bar)).toBe(true);
    expect(utils.isFunction(() => {})).toBe(true);
    expect(utils.isFunction(0)).toBe(false);
    expect(utils.isFunction('str')).toBe(false);
    expect(utils.isFunction({})).toBe(false);
    expect(utils.isFunction([])).toBe(false);
    expect(utils.isFunction(null)).toBe(false);
    expect(utils.isFunction(undefined)).toBe(false);
  });


  test('isPromise()', () => {
    expect(utils.isPromise(Promise.resolve())).toBe(true);
    expect(utils.isPromise(Promise.resolve(new Error()))).toBe(true);
    expect(utils.isPromise(new Promise(() => Promise.resolve()))).toBe(true);
    expect(utils.isPromise(() => {})).toBe(false);
    expect(utils.isPromise(NaN)).toBe(false);
    expect(utils.isPromise(null)).toBe(false);
    expect(utils.isPromise(undefined)).toBe(false);
  });


  test('isDate()', () => {
    expect(utils.isDate(new Date())).toBe(true);
    expect(utils.isDate('2017-01-01 00:00:00')).toBe(false);
    expect(utils.isDate('2017-01-01')).toBe(false);
    expect(utils.isDate('2017')).toBe(false);
    expect(utils.isDate('00:00:00')).toBe(false);
    expect(utils.isDate('string')).toBe(false);
    expect(utils.isDate(2017)).toBe(false);
    expect(utils.isDate(null)).toBe(false);
    expect(utils.isDate(undefined)).toBe(false);
  });


  test('isArray()', () => {
    expect(utils.isArray([])).toBe(true);
    expect(utils.isArray(new Array())).toBe(true);
    expect(utils.isArray(new Date())).toBe(false);
    expect(utils.isArray('string')).toBe(false);
    expect(utils.isArray(2017)).toBe(false);
    expect(utils.isArray(null)).toBe(false);
    expect(utils.isArray(undefined)).toBe(false);
  });


  test('isNumeric()', () => {
    expect(utils.isNumeric(0)).toBe(true);
    expect(utils.isNumeric(10)).toBe(true);
    expect(utils.isNumeric(1.12)).toBe(true);
    expect(utils.isNumeric(-12.28)).toBe(true);
    expect(utils.isNumeric('10')).toBe(true);
    expect(utils.isNumeric('02')).toBe(true);
    expect(utils.isNumeric('-2888.2122')).toBe(true);
    expect(utils.isNumeric('+120')).toBe(true);
    expect(utils.isNumeric(NaN)).toBe(false);
    expect(utils.isNumeric(null)).toBe(false);
    expect(utils.isNumeric(undefined)).toBe(false);
    expect(utils.isNumeric([])).toBe(false);
    expect(utils.isNumeric({})).toBe(false);
    expect(utils.isNumeric('0.0.0')).toBe(false);
    expect(utils.isNumeric('+-1289.82')).toBe(false);
  });


  test('isInteger()', () => {
    expect(utils.isInteger(0)).toBe(true);
    expect(utils.isInteger(120)).toBe(true);
    expect(utils.isInteger(-12)).toBe(true);
    expect(utils.isInteger(NaN)).toBe(false);
    expect(utils.isInteger(null)).toBe(false);
    expect(utils.isInteger(undefined)).toBe(false);
    expect(utils.isInteger([])).toBe(false);
    expect(utils.isInteger({})).toBe(false);
    expect(utils.isInteger(85.02)).toBe(false);
    expect(utils.isInteger('622')).toBe(false);
  });


  test('isEmpty()', () => {
    expect(utils.isEmpty(false)).toBe(true);
    expect(utils.isEmpty(0)).toBe(true);
    expect(utils.isEmpty(null)).toBe(true);
    expect(utils.isEmpty(undefined)).toBe(true);
    expect(utils.isEmpty(NaN)).toBe(true);
    expect(utils.isEmpty({})).toBe(true);
    expect(utils.isEmpty([])).toBe(true);
    expect(utils.isEmpty(true)).toBe(false);
    expect(utils.isEmpty(1)).toBe(false);
    expect(utils.isEmpty({ foo: 'bar' })).toBe(false);
    expect(utils.isEmpty(['val'])).toBe(false);
    expect(utils.isEmpty(new Date())).toBe(false);
  });


  test('template()', () => {
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
      expect(utils.template(tmpl, data)).toBe(expected);
    });
  });
});
