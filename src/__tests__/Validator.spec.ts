import * as sinon from 'sinon';
import { Validator, EventTypes } from '../';


describe('Validator', () => {
  const defaultLocale = Validator._locale;
  const defaultRules = { ...Validator._builtinRules };
  const defaultNormalizers = { ...Validator._builtinNormalizers };

  beforeEach(() => {
    Validator._locale = defaultLocale;
    Validator._localeMessages = { [defaultLocale]: Validator._localeMessages[defaultLocale] };
    Validator._builtinRules = { ...defaultRules };
    Validator._builtinNormalizers = { ...defaultNormalizers };
  });


  describe('Static API', () => {
    describe('Locale', () => {
      test('Should be defined locale messages', () => {
        const locale = 'hoge';
        const localeMessages = {
          defaultMessage: 'test defined locale messages',
        };

        Validator.defineLocale(locale, localeMessages);
        Validator.setLocale(locale);

        expect(Validator.getLocale()).toBe(locale);
        expect(Validator.getMessages()).toEqual(localeMessages);
      });


      test('Should throw a error when specify doesn\'t exist locale', () => {
        expect(() => {
          Validator.setLocale('notfoundlocale');
        }).toThrow(/"notfoundlocale" locale is does not exist/);
      });


      test('Should throw a error when missing defaultMessage field', () => {
        expect(() => {
          Validator.defineLocale('hoge', <any>{});
        }).toThrow(/required by "defaultMessage" field/);
      });


      test('Should be get error message', () => {
        Validator.defineLocale('test1', { defaultMessage: '1', required: 'message1' });
        Validator.defineLocale('test2', { defaultMessage: '2', min: { string: 'msg2-1', number: 'msg2-2' } });

        Validator.setLocale('test1');
        expect(Validator.getMessage('required')).toBe('message1');

        Validator.setLocale('test2');
        expect(Validator.getMessage('min', 'string')).toBe('msg2-1');
        expect(Validator.getMessage('min', 'number')).toBe('msg2-2');
      });


      test('Should be set error message', () => {
        const locale = 'hoge';
        Validator.defineLocale(locale, { defaultMessage: 'DEFAULT' });
        Validator.setLocale(locale);

        Validator.setMessage('test-error1', 'value is {{test}}');
        Validator.setMessage('test-error2', { string: '{{key}}!!', number: '{{key}}??' });

        expect(Validator.getMessage('test-error1')).toBe('value is {{test}}');
        expect(Validator.getMessage('test-error2')).toBe('DEFAULT');
        expect(Validator.getMessage('test-error2', 'string')).toBe('{{key}}!!');
        expect(Validator.getMessage('test-error2', 'number')).toBe('{{key}}??');
      });


      test('Should be get default error message', () => {
        const locale = 'fuga';
        Validator.defineLocale(locale, { defaultMessage: 'default!!' });
        Validator.setLocale(locale);

        Validator.setMessage('msg1', 'notuse');
        Validator.setMessage('msg2', { string: 'notuse' });
        Validator.setMessage('msg3', { defaultMessage: 'local!!', number: 'notuse' });

        expect(Validator.getMessage('notfound')).toBe('default!!');
        expect(Validator.getMessage('msg2', 'number')).toBe('default!!');
        expect(Validator.getMessage('msg3')).toBe('local!!');
        expect(Validator.getMessage('msg3', 'string')).toBe('local!!');
      });
    });


    describe('Rules manipulation', () => {
      test('Should be registered', () => {
        let test: any;
        let o: any;

        test = () => false;
        Validator.registerRule('testRule', test, {});

        o = Validator.getRule('testRule');
        expect(o.sync).toBe(true);
        expect(o.test).toBe(test);
        expect(o.implicit).toBe(true);
        expect(o.mapArgsToParams(1)).toBe(1);
        expect(o.depends).toEqual({});

        test = () => true;
        Validator.registerRule('sampleRule', test, {
          implicit: false,
          depends: { string: true, format: /^\d$/ },
          mapArgsToParams: hoge => ({ hoge }),
        });

        o = Validator.getRule('sampleRule');
        expect(o.sync).toBe(true);
        expect(o.test).toBe(test);
        expect(o.implicit).toBe(false);
        expect(o.mapArgsToParams(1)).toEqual({ hoge: 1 });
        expect(o.depends).toEqual({ string: true, format: /^\d$/ });
      });


      test('Should be throw a error when specify duplicate field', () => {
        Validator.registerRule('hoge', () => true);
        expect(() => {
          Validator.registerRule('hoge', () => true);
        }).toThrow(/"hoge" rule already exist/);
      });


      test('Should be override register', () => {
        const test1 = () => false;
        const test2 = () => true;
        const name = 'exampleName';
        let o: any;

        Validator.registerRule(name, test1, {
          depends: {},
          mapArgsToParams: a => a,
        });

        o = Validator.getRule(name);
        expect(o.test).toBe(test1);
        expect(o.depends).toEqual({});
        expect(o.mapArgsToParams(10)).toBe(10);

        Validator.registerRule(name, test2, {
          depends: { string: true },
          mapArgsToParams: foo => ({ foo }),
          override: true,
        });

        o = Validator.getRule(name);
        expect(o.test).toBe(test2);
        expect(o.depends).toEqual({ string: true });
        expect(o.mapArgsToParams(10)).toEqual({ foo: 10 });
      });


      test('Should be throw a error when call rule does not exist', () => {
        expect(() => {
          Validator.registerRule('fuga', () => false, { depends: { notfound: true } });
        }).toThrow(/"notfound" rule does not exist/);
      });
    });


    describe('Asynchronous rules manipulation', () => {
      test('Should be registered', () => {
        let rule: string;
        let test: any;
        let o: any;

        rule = 'asyncRule1';
        test = () => Promise.reject('hoge');
        Validator.registerAsyncRule(rule, test, {});

        o = Validator.getRule(rule);
        expect(o.sync).toBe(false);
        expect(o.test).toBe(test);
        expect(o.implicit).toBe(true);
        expect(o.depends).toEqual({});
        expect(o.mapArgsToParams(10)).toBe(10);

        rule = 'asyncRule2';
        test = () => Promise.resolve();
        Validator.registerAsyncRule(rule, test, {
          implicit: false,
          depends: { string: true },
          mapArgsToParams: hoge => ({ hoge }),
        });

        o = Validator.getRule(rule);
        expect(o.sync).toBe(false);
        expect(o.test).toBe(test);
        expect(o.implicit).toBe(false);
        expect(o.depends).toEqual({ string: true });
        expect(o.mapArgsToParams(10)).toEqual({ hoge: 10 });
      });


      test('Should be throw a error when specify duplicate field', () => {
        Validator.registerAsyncRule('hoge', () => Promise.reject(null));
        expect(() => {
          Validator.registerAsyncRule('hoge', () => Promise.reject(null));
        }).toThrow(/"hoge" rule already exist/);
      });


      test('Should be throw a error when call rule does not exist', () => {
        expect(() => {
          Validator.registerAsyncRule('fuga', () => Promise.reject(null), { depends: { notfound: true } });
        }).toThrow(/"notfound" rule does not exist/);
      });


      test('Should be override register', () => {
        const test1 = () => Promise.resolve();
        const test2 = () => Promise.reject(null);
        const name = 'exampleName';
        let o: any;

        Validator.registerAsyncRule(name, test1, {
          depends: {},
          mapArgsToParams: a => a,
        });

        o = Validator.getRule(name);
        expect(o.test).toBe(test1);
        expect(o.depends).toEqual({});
        expect(o.mapArgsToParams(10)).toBe(10);

        Validator.registerAsyncRule(name, test2, {
          depends: { string: true },
          mapArgsToParams: foo => ({ foo }),
          override: true,
        });

        o = Validator.getRule(name);
        expect(o.test).toBe(test2);
        expect(o.depends).toEqual({ string: true });
        expect(o.mapArgsToParams(10)).toEqual({ foo: 10 });
      });
    });


    describe('Normalizers manipulation', () => {
      test('Should be registered', () => {
        let name: string;
        let normalizer: any;
        let o: any;

        name = 'testNormalizer1';
        Validator.registerNormalizer(name, normalizer);

        o = Validator.getNormalizer(name);
        expect(o.normalizer).toBe(normalizer);
        expect(o.depends).toEqual({});

        name = 'testNormalizer2';
        Validator.registerNormalizer(name, normalizer, {
          depends: { testNormalizer1: true },
        });

        o = Validator.getNormalizer(name);
        expect(o.normalizer).toBe(normalizer);
        expect(o.depends).toEqual({ testNormalizer1: true });
      });


      test('Should be throw a error when specify duplicate field', () => {
        Validator.registerNormalizer('fuga', () => true);
        expect(() => {
          Validator.registerNormalizer('fuga', () => true);
        }).toThrow(/"fuga" normalizer already exist/);
      });


      test('Should be throw a error when call normalizer does not exist', () => {
        expect(() => {
          Validator.registerNormalizer('hoge', () => false, {
            depends: { notfound: true },
          });
        }).toThrow(/"notfound" normalizer does not exist/);
      });


      test('Should be override register', () => {
        const normalizer1 = () => true;
        const normalizer2 = () => false;
        const name = 'exampleNormalizer';
        let o: any;

        Validator.registerNormalizer(name, normalizer1, {
          depends: {},
        });

        o = Validator.getNormalizer(name);
        expect(o.normalizer).toBe(normalizer1);
        expect(o.depends).toEqual({});

        Validator.registerNormalizer(name, normalizer2, {
          depends: { toString: true },
          override: true,
        });

        o = Validator.getNormalizer(name);
        expect(o.normalizer).toBe(normalizer2);
        expect(o.depends).toEqual({ toString: true });
      });
    });
  });


  describe('Instance API', () => {
    describe('Constructor', () => {
      test('Should be create instance', () => {
        const v1 = new Validator();
        expect(v1).toBeTruthy();

        const v2 = new Validator({}, {}, {});
        expect(v2).toBeTruthy();
      });


      test('Should be throw a error when pass invalid arguments', () => {
        expect(() => new Validator(<any>null)).toThrow();
        expect(() => new Validator({}, <any>null)).toThrow();
      });
    });


    describe('Values', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      test('Should be get/set values', () => {
        expect(v.getValues()).toEqual({});
        v.setValues({ key: 'value' });
        expect(v.getValues()).toEqual({ key: 'value' });
        v.setValues({ key2: 'value2' });
        expect(v.getValues()).toEqual({ key2: 'value2' });

        expect(() => v.setValues(<any>null)).toThrow();
        expect(() => v.setValues(<any>'string')).toThrow();
      });


      test('Should be set values with constructor', () => {
        const values = { k1: 'v1', k2: 'v2' };
        const vv = new Validator(values);
        expect(vv.getValues()).toEqual(values);
      });


      test('Should be merge values', () => {
        v.setValues({ key: 'value' });
        v.mergeValues({ key2: 'value2' });
        expect(v.getValues()).toEqual({
          key: 'value',
          key2: 'value2',
        });

        expect(() => v.mergeValues(<any>null)).toThrow();
      });


      test('Should be clear values', () => {
        v.setValues({ k1: 'v1', k2: 'v' });
        v.clearValues();
        expect(v.getValues()).toEqual({});
      });


      test('Should be get value with key', () => {
        v.setValues({ key: 'value', deep: { foo: { bar: 'baz' } } });
        expect(v.getValue('key')).toBe('value');
        expect(v.getValue('deep.foo.bar')).toBe('baz');
        expect(v.getValue('hoge.fuga')).toBe(null);
      });


      test('Should be set value with key', () => {
        v.setValue('foo', 'bar');
        v.setValue('hoge.fuga', 'piyo');
        expect(v.getValue('foo')).toBe('bar');
        expect(v.getValue('hoge')).toEqual({ fuga: 'piyo' });
      });


      test('Should be check exist of value', () => {
        v.setValue('foo', 'bar');
        v.setValue('hoge.fuga', 'piyo');
        expect(v.hasValue('foo')).toBe(true);
        expect(v.hasValue('foo.bar')).toBe(false);
        expect(v.hasValue('hoge')).toBe(true);
        expect(v.hasValue('hoge.fuga')).toBe(true);
        expect(v.hasValue('hoge.fuga.piyo')).toBe(false);
        expect(v.hasValue('notfound')).toBe(false);
      });


      test('Should be get filtered values', () => {
        expect(v.getFilteredValues(['foo', 'bar'])).toEqual({});

        v.setValues({
          foo: 1,
        });

        expect(v.getFilteredValues(['foo', 'bar'])).toEqual({ foo: 1 });

        v.setValues({
          foo: 1,
          bar: 2,
        });

        expect(v.getFilteredValues(['foo', 'bar'])).toEqual({ foo: 1, bar: 2 });

        v.setValues({
          foo: {
            bar: [
              { id: 1, title: 1 },
              { id: 2, title: 2 },
              { id: 3, title: 3 },
            ],
          },
          hoge: {
            fuga: 'test',
          },
        });

        expect(v.getFilteredValues(['foo.bar.*.id', 'hoge', 'fuga'])).toEqual({
          foo: {
            bar: [
              { id: 1 },
              { id: 2 },
              { id: 3 },
            ],
          },
          hoge: {
            fuga: 'test',
          },
        });
      });
    });


    describe('Messages', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      test('Should be get/set messages', () => {
        expect(v.getMessages()).toEqual({});
        v.setMessages({ key: { required: 'msg' } });
        expect(v.getMessages()).toEqual({ key: { required: 'msg' } });
        v.setMessages({ foo: { rule: 'bar' } });
        expect(v.getMessages()).toEqual({ foo: { rule: 'bar' } });

        expect(() => v.setMessages(<any>null)).toThrow();
        expect(() => v.setMessages(<any>'string')).toThrow();
      });


      test('Should be set messages with constructor', () => {
        const messages = { foo: { bar: 'msg1' }, hoge: { fuga: 'msg2' } };
        const vv = new Validator({}, {}, { messages });
        expect(vv.getMessages()).toEqual(messages);
      });


      test('Should be merge messages', () => {
        v.setMessages({ k1: { required: 'msg1' } });
        v.mergeMessages({ k2: { required: 'msg2' } });
        expect(v.getMessages()).toEqual({
          k1: { required: 'msg1' },
          k2: { required: 'msg2' },
        });

        expect(() => v.mergeMessages(<any>null)).toThrow();
      });
    });


    describe('Errors', () => {
      let v: Validator;

      const clear = () => {
        v.clearValues();
        v.clearAllErrors();
        expect(v.getAllErrors()).toEqual({});
      };

      beforeEach(() => {
        v = new Validator();
      });


      test('Should be adding error from global messages.', () => {
        const key = 'testkey';
        const rule = 'foobar';

        // String
        Validator.setMessage(rule, 'global {{key}}');
        v.addError(key, rule, false, { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'global value', params: { key: 'value' } },
        ]);

        clear();

        // Inline
        Validator.setMessage(rule, 'global {{key}}');
        v.addError(key, rule, 'inline error', { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'inline error', params: { key: 'value' } },
        ]);

        clear();

        // Creator (function)
        Validator.setMessage(rule, (key: string, value: any, params: any) => `${key} "${value}" ${params.key}`);
        v.setValue(key, 'value');
        v.addError(key, rule, false, { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: `${key} "value" value`, params: { key: 'value' } },
        ]);

        clear();

        // Type
        Validator.setMessage(rule, {
          defaultMessage: 'default',
          number: 'number',
          string: 'string',
        });

        v.setValue(key, 'str');
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'string', params: {} },
        ]);

        clear();

        v.setValue(key, 10);
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'number', params: {} },
        ]);

        clear();

        v.setValue(key, '10'); // numeric
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'number', params: {} },
        ]);

        clear();

        v.setValue(key, []);
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'default', params: {} },
        ]);
      });


      test('Should be adding error from local messages.', () => {
        const key = 'testkey';
        const rule = 'foobar';

        v = new Validator({}, {}, {
          messages: {
            [key]: {
              [rule]: 'local {{key}}',
            },
          },
        });

        // String
        v.addError(key, rule, false, { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'local value', params: { key: 'value' } },
        ]);

        clear();

        // Inline
        v.addError(key, rule, 'inline error', { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'inline error', params: { key: 'value' } },
        ]);

        clear();

        // Creator (function)
        v.setMessages({
          [key]: {
            [rule]: (key: string, value: any, params: any) => `${key} "${value}" ${params.key}`,
          },
        });
        v.addError(key, rule, false, { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: `${key} "null" value`, params: { key: 'value' } },
        ]);

        clear();

        // Type
        v.setMessages({
          [key]: {
            [rule]: {
              defaultMessage: 'local default',
              number: 'local number',
              string: 'local string',
            },
          },
        });

        v.setValue(key, 'str');
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'local string', params: {} },
        ]);

        clear();

        v.setValue(key, 10);
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'local number', params: {} },
        ]);

        clear();

        v.setValue(key, []);
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'local default', params: {} },
        ]);
      });


      test('Should be manipulate errors', () => {
        v.addError('k1', 'foo', false, {});
        v.addError('k2', 'bar', false, {});

        // Get
        expect(v.getAllErrors()).toEqual({
          k1: [
            { rule: 'foo', message: 'The k1 field is invalid.', params: {} },
          ],
          k2: [
            { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
          ],
        });

        expect(v.getErrors('k1')).toEqual([
          { rule: 'foo', message: 'The k1 field is invalid.', params: {} },
        ]);

        expect(v.getErrors('k2')).toEqual([
          { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
        ]);

        // Exist
        expect(v.hasErrors('k1')).toBe(true);
        expect(v.hasErrors('k2')).toBe(true);

        // Remove
        v.addError('k1', 'baz', false, {});
        v.removeError('k1', 'foo');

        expect(v.getErrors('k1')).toEqual([
          { rule: 'baz', message: 'The k1 field is invalid.', params: {} },
        ]);

        // Clear
        v.clearErrors('k1');

        expect(v.getAllErrors()).toEqual({
          k2: [
            { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
          ],
        });

        v.clearAllErrors();

        expect(v.getAllErrors()).toEqual({});
      });


      test('Should be return whether error exists', () => {
        expect(v.isValid()).toBe(true);
        expect(v.isValid('k1')).toBe(true);
        expect(v.isValid('k2')).toBe(true);
        expect(v.isValid(['k1', 'k2'])).toBe(true);
        expect(v.isValid(['k1', 'notfound'])).toBe(true);
        expect(v.isValid('foo.bar')).toBe(true);
        expect(v.isValid('array.0.key')).toBe(true);
        expect(v.isValid('array.1.key')).toBe(true);
        expect(v.isValid('array.2.key')).toBe(true);
        expect(v.isValid('array.*.key')).toBe(true);
        expect(v.isValid(['array.0.key', 'array.1.key', 'array.2.key'])).toBe(true);

        v.addError('k1', 'foo', false, {});
        v.addError('k2', 'bar', false, {});
        v.addError('foo.bar', 'baz', false, {});
        v.addError('array.0.key', 'hoge', false, {});
        v.addError('array.2.key', 'fuga', false, {});

        expect(v.isValid()).toBe(false);
        expect(v.isValid('k1')).toBe(false);
        expect(v.isValid('k2')).toBe(false);
        expect(v.isValid(['k1', 'k2'])).toBe(false);
        expect(v.isValid(['k1', 'notfound'])).toBe(false);
        expect(v.isValid('foo.bar')).toBe(false);
        expect(v.isValid('array.0.key')).toBe(false);
        expect(v.isValid('array.1.key')).toBe(true);
        expect(v.isValid('array.2.key')).toBe(false);
        expect(v.isValid('array.*.key')).toBe(false);
        expect(v.isValid(['array.0.key', 'array.1.key', 'array.2.key'])).toBe(false);
      });
    });


    describe('Error messages', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();

        v.setErrors('foo', [
          { rule: 'bar1', message: 'foo1', params: true },
          { rule: 'bar2', message: 'foo2', params: true },
        ]);

        v.setErrors('bar', [
          { rule: 'baz1', message: 'bar1', params: true },
        ]);
      });


      test('Should be return all error messages', () => {
        expect(v.getAllErrorMessages()).toEqual({
          foo: ['foo1', 'foo2'],
          bar: ['bar1'],
        });

        v.clearAllErrors();

        expect(v.getAllErrorMessages()).toEqual({});
      });


      test('Should be return error message', () => {
        expect(v.getErrorMessages('notfound')).toBe(null);
        expect(v.getErrorMessages('foo')).toEqual(['foo1', 'foo2']);
        expect(v.getErrorMessages('bar')).toEqual(['bar1']);

        expect(v.getErrorMessage('notfound', 'notfound')).toBe(null);
        expect(v.getErrorMessage('foo', 'notfound')).toBe(null);
        expect(v.getErrorMessage('foo', 'bar1')).toBe('foo1');
        expect(v.getErrorMessage('foo', 'bar2')).toBe('foo2');
        expect(v.getErrorMessage('bar', 'baz1')).toBe('bar1');
      });
    });


    describe('Messages', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      test('Should be get/set messages', () => {
        expect(v.getMessages()).toEqual({});
        v.setMessages({ key: { required: 'msg' } });
        expect(v.getMessages()).toEqual({ key: { required: 'msg' } });
        v.setMessages({ foo: { rule: 'bar' } });
        expect(v.getMessages()).toEqual({ foo: { rule: 'bar' } });

        expect(() => v.setMessages(<any>null)).toThrow();
        expect(() => v.setMessages(<any>'string')).toThrow();
      });


      test('Should be set messages with constructor', () => {
        const messages = { foo: { bar: 'msg1' }, hoge: { fuga: 'msg2' } };
        const vv = new Validator({}, {}, { messages });
        expect(vv.getMessages()).toEqual(messages);
      });


      test('Should be merge messages', () => {
        v.setMessages({ k1: { required: 'msg1' } });
        v.mergeMessages({ k2: { required: 'msg2' } });
        expect(v.getMessages()).toEqual({
          k1: { required: 'msg1' },
          k2: { required: 'msg2' },
        });

        expect(() => v.mergeMessages(<any>null)).toThrow();
      });
    });


    describe('Errors', () => {
      let v: Validator;

      const clear = () => {
        v.clearValues();
        v.clearAllErrors();
        expect(v.getAllErrors()).toEqual({});
      };

      beforeEach(() => {
        v = new Validator();
      });


      test('Should be adding error from global messages.', () => {
        const key = 'testkey';
        const rule = 'foobar';

        // String
        Validator.setMessage(rule, 'global {{key}}');
        v.addError(key, rule, false, { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'global value', params: { key: 'value' } },
        ]);

        clear();

        // Inline
        Validator.setMessage(rule, 'global {{key}}');
        v.addError(key, rule, 'inline error', { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'inline error', params: { key: 'value' } },
        ]);

        clear();

        // Creator (function)
        Validator.setMessage(rule, (key: string, value: any, params: any) => `${key} "${value}" ${params.key}`);
        v.setValue(key, 'value');
        v.addError(key, rule, false, { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: `${key} "value" value`, params: { key: 'value' } },
        ]);

        clear();

        // Type
        Validator.setMessage(rule, {
          defaultMessage: 'default',
          number: 'number',
          string: 'string',
        });

        v.setValue(key, 'str');
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'string', params: {} },
        ]);

        clear();

        v.setValue(key, 10);
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'number', params: {} },
        ]);

        clear();

        v.setValue(key, '10'); // numeric
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'number', params: {} },
        ]);

        clear();

        v.setValue(key, []);
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'default', params: {} },
        ]);
      });


      test('Should be adding error from local messages.', () => {
        const key = 'testkey';
        const rule = 'foobar';

        v = new Validator({}, {}, {
          messages: {
            [key]: {
              [rule]: 'local {{key}}',
            },
          },
        });

        // String
        v.addError(key, rule, false, { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'local value', params: { key: 'value' } },
        ]);

        clear();

        // Inline
        v.addError(key, rule, 'inline error', { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'inline error', params: { key: 'value' } },
        ]);

        clear();

        // Creator (function)
        v.setMessages({
          [key]: {
            [rule]: (key: string, value: any, params: any) => `${key} "${value}" ${params.key}`,
          },
        });
        v.addError(key, rule, false, { key: 'value' });

        expect(v.getErrors(key)).toEqual([
          { rule, message: `${key} "null" value`, params: { key: 'value' } },
        ]);

        clear();

        // Type
        v.setMessages({
          [key]: {
            [rule]: {
              defaultMessage: 'local default',
              number: 'local number',
              string: 'local string',
            },
          },
        });

        v.setValue(key, 'str');
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'local string', params: {} },
        ]);

        clear();

        v.setValue(key, 10);
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'local number', params: {} },
        ]);

        clear();

        v.setValue(key, []);
        v.addError(key, rule, false, {});

        expect(v.getErrors(key)).toEqual([
          { rule, message: 'local default', params: {} },
        ]);
      });


      test('Should be manipulate errors', () => {
        v.addError('k1', 'foo', false, {});
        v.addError('k2', 'bar', false, {});

        // Get
        expect(v.getAllErrors()).toEqual({
          k1: [
            { rule: 'foo', message: 'The k1 field is invalid.', params: {} },
          ],
          k2: [
            { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
          ],
        });

        expect(v.getErrors('k1')).toEqual([
          { rule: 'foo', message: 'The k1 field is invalid.', params: {} },
        ]);

        expect(v.getErrors('k2')).toEqual([
          { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
        ]);

        // Exist
        expect(v.hasErrors('k1')).toBe(true);
        expect(v.hasErrors('k2')).toBe(true);

        // Remove
        v.addError('k1', 'baz', false, {});
        v.removeError('k1', 'foo');

        expect(v.getErrors('k1')).toEqual([
          { rule: 'baz', message: 'The k1 field is invalid.', params: {} },
        ]);

        // Clear
        v.clearErrors('k1');

        expect(v.getAllErrors()).toEqual({
          k2: [
            { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
          ],
        });

        v.clearAllErrors();

        expect(v.getAllErrors()).toEqual({});
      });


      test('Should be return whether error exists', () => {
        expect(v.isValid()).toBe(true);
        expect(v.isValid('k1')).toBe(true);
        expect(v.isValid('k2')).toBe(true);
        expect(v.isValid(['k1', 'k2'])).toBe(true);
        expect(v.isValid(['k1', 'notfound'])).toBe(true);
        expect(v.isValid('foo.bar')).toBe(true);
        expect(v.isValid('array.0.key')).toBe(true);
        expect(v.isValid('array.1.key')).toBe(true);
        expect(v.isValid('array.2.key')).toBe(true);
        expect(v.isValid('array.*.key')).toBe(true);
        expect(v.isValid(['array.0.key', 'array.1.key', 'array.2.key'])).toBe(true);

        v.addError('k1', 'foo', false, {});
        v.addError('k2', 'bar', false, {});
        v.addError('foo.bar', 'baz', false, {});
        v.addError('array.0.key', 'hoge', false, {});
        v.addError('array.2.key', 'fuga', false, {});

        expect(v.isValid()).toBe(false);
        expect(v.isValid('k1')).toBe(false);
        expect(v.isValid('k2')).toBe(false);
        expect(v.isValid(['k1', 'k2'])).toBe(false);
        expect(v.isValid(['k1', 'notfound'])).toBe(false);
        expect(v.isValid('foo.bar')).toBe(false);
        expect(v.isValid('array.0.key')).toBe(false);
        expect(v.isValid('array.1.key')).toBe(true);
        expect(v.isValid('array.2.key')).toBe(false);
        expect(v.isValid('array.*.key')).toBe(false);
        expect(v.isValid(['array.0.key', 'array.1.key', 'array.2.key'])).toBe(false);
      });
    });


    describe('Error messages', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();

        v.setErrors('foo', [
          { rule: 'bar1', message: 'foo1', params: true },
          { rule: 'bar2', message: 'foo2', params: true },
        ]);

        v.setErrors('bar', [
          { rule: 'baz1', message: 'bar1', params: true },
        ]);
      });


      test('Should be return all error messages', () => {
        expect(v.getAllErrorMessages()).toEqual({
          foo: ['foo1', 'foo2'],
          bar: ['bar1'],
        });

        v.clearAllErrors();

        expect(v.getAllErrorMessages()).toEqual({});
      });


      test('Should be return error message', () => {
        expect(v.getErrorMessages('notfound')).toBe(null);
        expect(v.getErrorMessages('foo')).toEqual(['foo1', 'foo2']);
        expect(v.getErrorMessages('bar')).toEqual(['bar1']);

        expect(v.getErrorMessage('notfound', 'notfound')).toBe(null);
        expect(v.getErrorMessage('foo', 'notfound')).toBe(null);
        expect(v.getErrorMessage('foo', 'bar1')).toBe('foo1');
        expect(v.getErrorMessage('foo', 'bar2')).toBe('foo2');
        expect(v.getErrorMessage('bar', 'baz1')).toBe('bar1');
      });
    });


    describe('Rules', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      test('Should be get/set rules', () => {
        expect(v.getRules()).toEqual({});
        v.setRules({ key: { required: true }});
        expect(v.getRules()).toEqual({ key: { required: true } });
        v.setRules({ foo: { required: false }});
        expect(v.getRules()).toEqual({ foo: { required: false } });

        expect(() => v.setRules(<any>null)).toThrow();
        expect(() => v.setRules(<any>10)).toThrow();
      });


      test('Should be set rules with constructor', () => {
        const vv = new Validator({}, {
          foo: {
            required: true,
          },
          bar: {
            rule: {
              param1: 'value',
            },
          },
        });

        expect(vv.getRules()).toEqual({
          foo: {
            required: true,
          },
          bar: {
            rule: { param1: 'value' },
          },
        });
      });


      test('Should be merge rules', () => {
        v.setRules({ k1: { required: true } });
        v.mergeRules({ k2: { required: false } });

        expect(v.getRules()).toEqual({
          k1: { required: true },
          k2: { required: false },
        });

        expect(() => v.mergeRules(<any>null)).toThrow();
      });


      test('Should be map arguments to params', () => {
        Validator.registerRule('rule1', () => true, {
          mapArgsToParams: a => a,
        });

        Validator.registerRule('rule2', () => true, {
          mapArgsToParams: foo => ({ foo }),
        });

        Validator.registerAsyncRule('rule3', () => Promise.resolve(), {
          mapArgsToParams: bar => ({ bar }),
        });

        Validator.registerAsyncRule('rule4', () => Promise.resolve(), {
          mapArgsToParams: (baz: string, v: Validator) => ({ baz, v }),
        });

        Validator.registerAsyncRule('rule5', () => Promise.resolve(), {
          mapArgsToParams: (_: any, v: Validator) => ({ label: v.getLabel('key1') }),
        });

        v.setRules({
          key1: {
            rule1: true,
            rule2: 10,
            rule3: 'key1-rule3',
            rule4: 'key1-rule4',
            rule5: true,
          },
          key2: {
            rule1: true,
            rule2: 20,
            rule3: 'key2-rule3',
            rule4: 'key2-rule4',
          },
        });

        v.mappingRuleParams();

        expect(v.getRules()).toEqual({
          key1: {
            rule1: true,
            rule2: { foo: 10 },
            rule3: { bar: 'key1-rule3' },
            rule4: { baz: 'key1-rule4', v },
            rule5: { label: 'key1' },
          },
          key2: {
            rule1: true,
            rule2: { foo: 20 },
            rule3: { bar: 'key2-rule3' },
            rule4: { baz: 'key2-rule4', v },
          },
        });

        v.setLabels({ key1: 'KEY 1' });
        v.mappingRuleParams();

        expect(v.getRules().key1.rule5).toEqual({ label: 'KEY 1' });

        v.setLabels({ key1: '__key__1' });
        v.mappingRuleParams();

        expect(v.getRules().key1.rule5).toEqual({ label: '__key__1' });
      });


      test('Should be get fields that specifies sync or async rules', () => {
        Validator.registerRule('sync1', () => true);
        Validator.registerRule('sync2', () => true);
        Validator.registerRule('sync3', () => true);
        Validator.registerAsyncRule('async1', () => Promise.resolve());
        Validator.registerAsyncRule('async2', () => Promise.resolve());
        Validator.registerAsyncRule('async3', () => Promise.resolve());

        v.setRules({
          onlySync1: { sync1: true, sync2: true },
          onlySync2: { sync1: true, sync2: false },
          onlySync3: { sync1: false, sync2: false },
          onlyAsync1: { async1: true, async2: true },
          onlyAsync2: { async1: true, async2: false },
          onlyAsync3: { async1: false, async2: false },
          mixed1: { sync1: true, async1: true },
          mixed2: { sync1: true, async1: false },
          mixed3: { sync1: false, async1: true },
          mixed4: { sync1: false, async1: false },
        });

        expect(v.getSyncRuleKeys()).toEqual([
          'onlySync1',
          'onlySync2',
          'mixed1',
          'mixed2',
        ]);

        expect(v.getAsyncRuleKeys()).toEqual([
          'onlyAsync1',
          'onlyAsync2',
          'mixed1',
          'mixed3',
        ]);
      });
    });


    describe('Normalizers', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      test('Should be get/set normalizers', () => {
        expect(v.getNormalizers()).toEqual({});
        v.setNormalizers({ key: { trim: true } });
        expect(v.getNormalizers()).toEqual({ key: { trim: true } });
        v.setNormalizers({ foo: { ltrim: false } });
        expect(v.getNormalizers()).toEqual({ foo: { ltrim: false } });

        expect(() => v.setNormalizers(<any>null)).toThrow();
        expect(() => v.setNormalizers(<any>13)).toThrow();
      });


      test('Should be set nomralizers with constructor', () => {
        const normalizers = { foo: { trim: true }, bar: { rtrim: true } };
        const vv = new Validator({}, {}, { normalizers });
        expect(vv.getNormalizers()).toEqual(normalizers);
      });


      test('Should be merge normalizers', () => {
        v.setNormalizers({ k1: { trim: true } });
        v.mergeNormalizers({ k2: { rtrim: false } });
        expect(v.getNormalizers()).toEqual({
          k1: { trim: true },
          k2: { rtrim: false },
        });

        expect(() => v.mergeNormalizers(<any>null)).toThrow();
      });
    });


    describe('Field labels', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      test('Should be get/set field labels', () => {
        expect(v.getLabels()).toEqual({});
        v.setLabels({ key: 'Custom Key' });
        expect(v.getLabels()).toEqual({ key: 'Custom Key' });
        v.setLabels({ foo: 'Foo Key', bar: 'Bar Key' });
        expect(v.getLabels()).toEqual({ foo: 'Foo Key', bar: 'Bar Key' });

        expect(() => v.setLabels(<any>null)).toThrow();
        expect(() => v.setLabels(<any>13)).toThrow();
      });


      test('Should be set field labels with constructor', () => {
        const labels = { foo: 'Foo123', bar: 'Bar456' };
        const vv = new Validator({}, {}, { labels });
        expect(vv.getLabels()).toEqual(labels);
      });


      test('Should be merge field labels', () => {
        v.setLabels({ k1: 'Key1' });
        v.mergeLabels({ k2: 'Key2' });
        expect(v.getLabels()).toEqual({
          k1: 'Key1',
          k2: 'Key2',
        });

        expect(() => v.mergeLabels(<any>null)).toThrow();
      });


      test('Should be get field label', () => {
        v.setLabels({
          foo: 'Foo123',
          bar: 'Bar456',
          'has.dot.key': 'DotKey1',
          'has.wild.*.key.*': 'DotKey2',
        });

        expect(v.getLabel('foo')).toBe('Foo123');
        expect(v.getLabel('bar')).toBe('Bar456');
        expect(v.getLabel('has.dot.key')).toBe('DotKey1');
        expect(v.getLabel('has.wild.*.key.*')).toBe('DotKey2');
        expect(v.getLabel('has.wild.0.key.0')).toBe('DotKey2');
        expect(v.getLabel('has.wild.0.key.1')).toBe('DotKey2');
        expect(v.getLabel('has.wild.1.key.2')).toBe('DotKey2');
        expect(v.getLabel('has.wild.1.key.3')).toBe('DotKey2');
        expect(v.getLabel('notfound')).toBe('notfound');
      });
    });


    describe('Normalize', () => {
      test('Should be called normalizer', () => {
        const values = { k1: 'v1', k2: 'v2' };

        const func1 = sinon.stub().returns(null);
        func1.withArgs(
          values.k1,
          true,
          values.k1,
          values,
          values,
        ).returns('called func1');

        const func2 = sinon.stub().returns(null);
        func2.withArgs('called func1',
          true,
          values.k1,
          { ...values, k1: 'called func1' },
          values,
        ).returns('called func2');

        Validator.registerNormalizer('func1', func1);
        Validator.registerNormalizer('func2', func2);

        const v = new Validator(
          values,
          {
            k1: {
              inline: (value: any) => value === 'called func2',
            },
          },
          {
            normalizers: {
              k1: { func1: true, func2: true },
              notfound1: { func2: true },
              notfound2: { func2: true },
            },
          },
        );

        v.normalize();

        expect(v.validate()).toBe(true);
        expect(v.getValues()).toEqual({
          k1: 'called func2',
          k2: 'v2',
        });
      });


      test('Should be arguments passed to normalizer', () => {
        const values = { foo: 'bar', hoge: 'fuga' };
        const params = { k1: 'v1', k2: 'v2' };

        const normalizer = sinon.stub().returns(null);
        normalizer.withArgs(
          values.foo,
          params,
          values.foo,
          values,
          values,
        ).returns('called');

        Validator.registerNormalizer('example', normalizer);

        const v = new Validator(values, {}, {
          normalizers: {
            foo: { example: params },
          },
        });

        v.normalize();

        expect(v.validate()).toBe(true);
        expect(normalizer.callCount).toBe(1);
        expect(v.getValue('foo')).toBe('called');
      });


      test('Should be called dependent normalizers', () => {
        const n1 = sinon.stub().returns(1);
        const n2 = sinon.stub().returns(2);
        const n3 = sinon.stub().returns(3);
        const n4 = sinon.stub().returns(4);

        Validator.registerNormalizer('n1', n1);
        Validator.registerNormalizer('n2', n2);
        Validator.registerNormalizer('n3', n3, { depends: { n1: true } });
        Validator.registerNormalizer('n4', n4, { depends: { n1: true, n2: true } });

        const v = new Validator(
          { k1: 'v1', k2: 'v2' },
          {},
          {
            normalizers: {
              k1: { n1: true, n2: true },
              k2: { n3: true, n4: true },
            },
          },
        );

        v.normalize();

        expect(v.validate()).toBe(true);
        expect(n1.callCount).toBe(3);
        expect(n2.callCount).toBe(2);
        expect(n3.callCount).toBe(1);
        expect(n4.callCount).toBe(1);
      });
    });


    describe('Validation', () => {
      test('Should be called test when validation', () => {
        const values = {
          username: 'tsuyoshiwada',
          password: 'hogefuga',
          notcall: 'test',
        };

        const pass1 = sinon.stub().returns(false);
        pass1.withArgs(values.username, true, 'username', values).returns(true);
        pass1.withArgs(values.password, true, 'password', values).returns(true);

        const pass2 = sinon.stub().returns(false);

        Validator.registerRule('pass1', pass1);
        Validator.registerRule('pass2', pass2);

        const v = new Validator(values, {
          username: { pass1: true },
          password: { pass1: true },
          notcall: { pass2: false },
        });

        expect(v.validate()).toBe(true);
        expect(pass1.callCount).toBe(2);
        expect(pass2.callCount).toBe(0);
      });


      test('Should be arguments passed to test', () => {
        const values = { foo: 'bar', hoge: 'fuga' };
        const params = { k1: 'v1', k2: 'v2' };

        const test = sinon.stub().returns(false);
        test.withArgs(values.foo, params, 'foo', values).returns(true);

        const v = new Validator(values, {
          foo: { rule: params },
        });

        Validator.registerRule('rule', test);

        expect(v.validate()).toBe(true);
        expect(test.callCount).toBe(1);
      });


      test('Should be called rules dependent on validation', () => {
        const returnTrue = sinon.stub().returns(true);
        const returnFalse = sinon.stub().returns(false);
        const test1 = sinon.stub().returns(true);
        const test2 = sinon.stub().returns(true);

        const v = new Validator(
          { k1: 'v1', k2: 'v2' },
          { k1: { rule1: true }, k2: { rule2: true } },
        );

        Validator.registerRule('returnTrue', returnTrue);
        Validator.registerRule('returnFalse', returnFalse);
        Validator.registerRule('rule1', test1, { depends: { returnTrue: true } });
        Validator.registerRule('rule2', test2, { depends: {  returnTrue: true, returnFalse: true  } });

        expect(v.validate()).toBe(false);
        expect(returnTrue.callCount).toBe(2);
        expect(returnFalse.callCount).toBe(1);
        expect(test1.callCount).toBe(1);
        expect(test2.callCount).toBe(0);
      });


      test('Should be call inline rule', () => {
        const values = { key: 'val' };
        const other = sinon.stub().returns(true);
        const inline = sinon.stub().returns(false);
        inline.withArgs(values.key, true, 'key', values).returns(true);

        Validator.registerRule('other', other);

        const v = new Validator(values, {
          key: {
            other: true,
            inline,
          },
        });

        expect(v.validate()).toBe(true);
        expect(other.callCount).toBe(1);
        expect(inline.callCount).toBe(1);
      });


      test('Should not be call async validations', () => {
        const test1 = sinon.stub().returns(Promise.reject(null));
        const test2 = sinon.stub().returns(true);
        Validator.registerAsyncRule('returnReject', test1);
        Validator.registerRule('returnTrue', test2);

        const v = new Validator({
          key: 'value',
        }, {
          key: {
            returnReject: true,
            returnTrue: true,
          },
        });

        expect(v.validate()).toBe(true);
        expect(test1.callCount).toBe(0);
        expect(test2.callCount).toBe(1);
      });


      test('Should be always return true for inline async rules', () => {
        const test1 = sinon.stub().returns(Promise.reject(null));
        const test2 = sinon.stub().returns(true);

        const v = new Validator({
          key: 'value',
        }, {
          key: {
            test1,
            test2,
          },
        });

        expect(v.validate()).toBe(true);
        expect(test1.callCount).toBe(1);
        expect(test2.callCount).toBe(1);
      });
    });


    describe('Asynchronous validation', () => {
      test('Should be return resolve (success)', () => {
        expect.assertions(5);

        Validator.registerAsyncRule('returnPromise', () => Promise.resolve());

        const values = { key: 'value' };
        const v = new Validator(values, {
          key: {
            returnPromise: true,
          },
        });

        expect(v.isValidating()).toBe(false);

        const res = v.asyncValidate();

        expect(v.isValidating()).toBe(true);

        return res
          .then(resultValues => {
            expect(v.isValidating()).toBe(false);
            expect(resultValues).toEqual(v.getValues());
            expect(resultValues).toEqual(values);
          })
          .catch(() => {
            throw new Error();
          });
      });


      test('Should be return reject (failure)', () => {
        expect.assertions(4);

        Validator.registerAsyncRule('test', () => Promise.reject('Error!!'));

        const values = { key: 'value' };
        const v = new Validator(values, {
          key: { test: true },
        });

        const res = v.asyncValidate();

        expect(v.isValidating()).toBe(true);

        return res
          .then(() => {
            throw new Error();
          })
          .catch(errors => {
            expect(v.isValidating()).toBe(false);
            expect(errors).toEqual(v.getAllErrors());
            expect(errors).toEqual({
              key: [
                { rule: 'test', message: 'Error!!', params: true },
              ],
            });
          });
      });


      test('Should be called rules dependent on validation', () => {
        expect.assertions(6);

        const returnTrue = sinon.stub().returns(true);
        const returnResolve = sinon.stub().returns(Promise.resolve());
        const returnReject = sinon.stub().returns(Promise.reject(null));
        const test1 = sinon.stub().returns(Promise.resolve());
        const test2 = sinon.stub().returns(Promise.resolve());

        Validator.registerRule('returnTrue', returnTrue);
        Validator.registerAsyncRule('returnResolve', returnResolve);
        Validator.registerAsyncRule('returnReject', returnReject);
        Validator.registerAsyncRule('rule1', test1, { depends: { returnTrue: true, returnResolve: true } });
        Validator.registerAsyncRule('rule2', test2, { depends: { returnTrue: true, returnReject: true } });

        const v = new Validator(
          { k1: 'v1', k2: 'v2' },
          { k1: { rule1: true }, k2: { rule2: true } },
        );

        const res = v.asyncValidate();

        expect(v.isValidating()).toBe(true);

        return res
          .then(() => {
            throw new Error();
          })
          .catch(() => {
            expect(returnTrue.callCount).toBe(2);
            expect(returnResolve.callCount).toBe(1);
            expect(returnReject.callCount).toBe(1);
            expect(test1.callCount).toBe(1);
            expect(test2.callCount).toBe(0);
          });
      });


      test('Should not be call inline rule', () => {
        expect.assertions(3);

        const test1 = sinon.stub().returns(true);
        const test2 = sinon.stub().returns(false);
        const test3 = sinon.stub().returns(Promise.resolve());

        Validator.registerAsyncRule('returnResolve', test3);

        const v = new Validator({
          key: 'value',
        }, {
          key: {
            test1,
            test2,
            returnResolve: true,
          },
        });

        return v.asyncValidate()
          .then(() => {
            expect(test1.callCount).toBe(0);
            expect(test2.callCount).toBe(0);
            expect(test3.callCount).toBe(1);
          })
          .catch(() => {
            throw new Error();
          });
      });
    });


    describe('Sync & Asynchronous validation', () => {
      test('Should be return resolve', () => {
        expect.assertions(8);

        const test1 = sinon.stub().returns(true);
        const test2 = sinon.stub().returns(false);
        const test3 = sinon.stub().returns(Promise.resolve());

        Validator.registerRule('returnTrue', test1);
        Validator.registerRule('returnFalse', test2);
        Validator.registerAsyncRule('checkAccount', test3, { depends: {  returnTrue: true  } });

        const values = {
          email: 'test@mail.com',
          password: '123456',
        };

        const v = new Validator(values, {
          email: {
            returnTrue: true,
            returnFalse: true,
            checkAccount: true,
          },
          password: {
            returnTrue: true,
            returnFalse: true,
            passFormat: (value: any) => /^\d+$/.test(value),
          },
        });

        expect(v.isValidating()).toBe(false);

        const res = v.asyncValidate();

        expect(v.isValidating()).toBe(true);

        return res
          .then(returnValues => {
            expect(v.isValidating()).toBe(false);
            expect(returnValues).toEqual(values);
            expect(returnValues).toEqual(v.getValues());
            expect(test1.callCount).toBe(1);
            expect(test2.callCount).toBe(0);
            expect(test3.callCount).toBe(1);
          })
          .catch(() => {
            throw new Error();
          });
      });


      test('Should be return reject', () => {
        expect.assertions(7);

        const test1 = sinon.stub().returns(true);
        const test2 = sinon.stub().returns(false);
        const test3 = sinon.stub().returns(Promise.reject(null));

        Validator.registerRule('returnTrue', test1);
        Validator.registerRule('returnFalse', test2);
        Validator.registerAsyncRule('checkAccount', test3, { depends: {  returnTrue: true  } });

        const values = {
          email: 'test@mail.com',
          password: '123456',
        };

        const result = {
          email: [
            { rule: 'checkAccount', params: true, message: 'The email field is invalid.' },
          ],
        };

        const v = new Validator(values, {
          email: {
            returnTrue: true,
            returnFalse: true,
            checkAccount: true,
          },
          password: {
            returnTrue: true,
            returnFalse: true,
            passFormat: (value: any) => /^\d+$/.test(value),
          },
        });

        expect(v.isValidating()).toBe(false);

        const res = v.asyncValidate();

        expect(v.isValidating()).toBe(true);

        return res
          .then(() => {
            throw new Error();
          })
          .catch(errors => {
            expect(v.isValidating()).toBe(false);
            expect(errors).toEqual(result);
            expect(test1.callCount).toBe(1);
            expect(test2.callCount).toBe(0);
            expect(test3.callCount).toBe(1);
          });
      });
    });


    describe('Custom error message', () => {
      const returnFalse = () => false;
      const returnTrue = () => true;
      const values = { k1: 'v1', k2: 'v2' };

      beforeEach(() => {
        Validator.registerRule('returnFalse', returnFalse);
        Validator.registerRule('returnTrue', returnTrue);
      });


      test('Should be return custom error message from `messages` field', () => {
        const inline = () => false;

        const v = new Validator(
          values,
          {
            k1: { returnFalse: true },
            k2: { inline },
            k3: { inline },
          },
          {
            messages: {
              k1: { returnFalse: 'messages field' },
              k2: { inline: 'inline message' },
              k3: { inline: '{{field}} message' },
            },
            labels: {
              k3: 'Key3',
            },
          },
        );

        expect(v.validate()).toBe(false);
        expect(v.getAllErrors()).toEqual({
          k1: [
            { rule: 'returnFalse', message: 'messages field', params: true },
          ],
          k2: [
            { rule: 'inline', message: 'inline message', params: inline },
          ],
          k3: [
            { rule: 'inline', message: 'Key3 message', params: inline },
          ],
        });
      });


      test('Should be return custom error message from callback', () => {
        const inline = () => 'callback';
        const v = new Validator(values, {
          k1: { inline },
        });

        expect(v.validate()).toBe(false);
        expect(v.getAllErrors()).toEqual({
          k1: [
            { rule: 'inline', message: 'callback', params: inline },
          ],
        });
      });


      test('Should be return custom error message from async rule', () => {
        expect.assertions(1);

        Validator.registerAsyncRule('asyncError', () => Promise.reject(null));
        Validator.setMessage('asyncError', 'async message');

        const v = new Validator(values, {
          k1: { asyncError: true },
        });

        return v.asyncValidate()
          .then(() => {
            throw new Error();
          })
          .catch(errors => {
            expect(errors).toEqual({
              k1: [
                { rule: 'asyncError', message: 'async message', params: true },
              ],
            });
          });
      });
    });


    describe('Implicit flag', () => {
      test('Should not be called if null or key does not exist', () => {
        const implicit = sinon.stub().returns(false);
        const nonImplicit = sinon.stub().returns(false);

        Validator.registerRule('implicit', implicit, { implicit: true });
        Validator.registerRule('nonImplicit', nonImplicit, { implicit: false });

        const v = new Validator({
          k1: null,
          k2: undefined,
          k3: 0,
          k4: '',
        }, {
          k1: { implicit: true, nonImplicit: true },
          k2: { implicit: true, nonImplicit: true },
          k3: { implicit: true, nonImplicit: true },
          k4: { implicit: true, nonImplicit: true },
          k5: { implicit: true, nonImplicit: true },
        });

        expect(v.validate()).toBe(false);
        expect(implicit.callCount).toBe(3);
        expect(nonImplicit.callCount).toBe(5);
      });
    });


    describe('Events', () => {
      test('Should be fire before and after validate event.', () => {
        expect.assertions(3);

        const v = new Validator({ key: 'value' }, { key: { inline: () => true } });
        let str = '';

        v.on(EventTypes.BEFORE_VALIDATE, (vv: Validator) => {
          str += 'before';
          expect(v).toBe(vv);
        });

        v.on(EventTypes.AFTER_VALIDATE, (vv: Validator) => {
          str += '-after';
          expect(str).toBe('before-after');
          expect(v).toBe(vv);
        });

        v.validate();
      });


      test('Should be fire valid event', () => {
        expect.assertions(1);

        const v = new Validator({ key: 'value' }, { key: { inline: () => true } });

        v.on(EventTypes.VALID, (vv: Validator) => {
          expect(v).toBe(vv);
        });

        v.validate();
      });


      test('Should be fire invalid event', () => {
        expect.assertions(1);

        const v = new Validator({ key: 'value' }, { key: { inline: () => false } });

        v.on(EventTypes.INVALID, (vv: Validator) => {
          expect(v).toBe(vv);
        });

        v.validate();
      });
    });


    describe('Array', () => {
      const getValues = () => ({
        text: 'ok',
        code: 200,
        error: null,
        data: {
          users: [
            {
              id: 1,
              username: 'tsuyoshiwada',
              profile: { age: 24 },
              followers: [2, 3],
            },
            {
              id: 2,
              username: 'tonystark',
              profile: { age: '43' },
              followers: [1],
            },
            {
              id: 3,
              username: 'steverogers',
              profile: { age: 99 },
              followers: ['1', 2],
            },
          ],
        },
      });

      beforeEach(() => {
        const isNumber = (value: any): value is number => typeof value === 'number';
        const isString = (value: any): value is string => typeof value === 'string';

        Validator.registerRule('ok', (value: any) => value === 'ok', { implicit: false });
        Validator.registerRule('num', isNumber, { implicit: false });
        Validator.registerRule('str', isString, { implicit: false });

        Validator.registerAsyncRule('resolve', () => Promise.resolve(), { implicit: false });
        Validator.registerAsyncRule('reject', () => Promise.reject(null), { implicit: false });
      });


      test('Should be validate', () => {
        const v = new Validator(getValues(), {
          text: { ok: true },
          code: { str: true },
          'data.users.*.id': { num: true },
          'data.users.*.profile.age': { num: true },
          'data.users.*.followers.*': { num: true },
        });

        expect(v.validate()).toBe(false);

        expect(v.getAllErrors()).toEqual({
          code: [
            { rule: 'str', message: 'The code field is invalid.', params: true },
          ],
          'data.users.1.profile.age': [
            { rule: 'num', message: 'The data.users.1.profile.age field is invalid.', params: true },
          ],
          'data.users.2.followers.0': [
            { rule: 'num', message: 'The data.users.2.followers.0 field is invalid.', params: true },
          ],
        });

        expect(v.getErrors('data.users.1.profile.age')).toEqual([
          { rule: 'num', message: 'The data.users.1.profile.age field is invalid.', params: true },
        ]);

        expect(v.hasErrors('data.users.1.profile.age')).toBe(true);
        expect(v.hasErrors('data.users[1]profile.age')).toBe(true);
        expect(v.hasErrors('data.users.2.profile.age')).toBe(false);
      });


      test('Should be async validate', () => {
        expect.assertions(1);

        const v = new Validator(getValues(), {
          code: { ok: true },
          'data.users.*.username': { resolve: true },
          'data.users.*.followers.*': { reject: true },
        });

        return v.asyncValidate()
          .then(() => {
            throw new Error();
          })
          .catch(errors => {
            expect(errors).toEqual({
              'data.users.0.followers.0': [
                { rule: 'reject', params: true, message: 'The data.users.0.followers.0 field is invalid.' },
              ],
              'data.users.0.followers.1': [
                { rule: 'reject', params: true, message: 'The data.users.0.followers.1 field is invalid.' },
              ],
              'data.users.1.followers.0': [
                { rule: 'reject', params: true, message: 'The data.users.1.followers.0 field is invalid.' },
              ],
              'data.users.2.followers.0': [
                { rule: 'reject', params: true, message: 'The data.users.2.followers.0 field is invalid.' },
              ],
              'data.users.2.followers.1': [
                { rule: 'reject', params: true, message: 'The data.users.2.followers.1 field is invalid.' },
              ],
            });
          });
      });


      test('Should be called normalizer', () => {
        const n = (value: any) => parseInt(value);

        const v = new Validator(getValues(), {
          'data.users.*.profile.age': { num: true },
        }, {
          normalizers: {
            'data.users.*.profile.age': { n },
            'data.users.*.followers.*': { n },
          },
        });

        v.normalize();

        expect(v.validate()).toBe(true);

        expect(v.getValues().data.users).toEqual([
          {
            id: 1,
            username: 'tsuyoshiwada',
            profile: { age: 24 },
            followers: [2, 3],
          },
          {
            id: 2,
            username: 'tonystark',
            profile: { age: 43 },
            followers: [1],
          },
          {
            id: 3,
            username: 'steverogers',
            profile: { age: 99 },
            followers: [1, 2],
          },
        ]);
      });


      test('Should be called test only for specified field', () => {
        const values = {
          k1: 'v1',
          k2: 'v2',
          k3: {
            foo: [
              { key: 'v1' },
              { key: 'v2' },
              { key: 'v3' },
            ],
            bar: [
              { key: 'v1' },
              { key: 'v2' },
              { key: 'v3' },
            ],
            baz: [
              { key: 'v1' },
              { key: 'v2' },
              { key: 'v3' },
            ],
          },
        };

        const test1 = sinon.stub().returns(true);
        const test2 = sinon.stub().returns(true);
        const test3 = sinon.stub().returns(true);

        Validator.registerRule('test1', test1);
        Validator.registerRule('test2', test2);
        Validator.registerRule('test3', test3);

        const v = new Validator(values, {
          k1: {
            test1: true,
            test2: true,
            test3: true,
          },
          k2: {
            test1: true,
            test2: true,
          },
          'k3.*.*.key': {
            test1: true,
          },
        });

        v.validate('k1');

        expect(test1.callCount).toBe(1);
        expect(test2.callCount).toBe(1);
        expect(test3.callCount).toBe(1);

        v.validate('k2');

        expect(test1.callCount).toBe(2);
        expect(test2.callCount).toBe(2);
        expect(test3.callCount).toBe(1);

        v.validate(['k1', 'k2']);

        expect(test1.callCount).toBe(4);
        expect(test2.callCount).toBe(4);
        expect(test3.callCount).toBe(2);

        v.validate('k3.*.*.key');

        expect(test1.callCount).toBe(13);
        expect(test2.callCount).toBe(4);
        expect(test3.callCount).toBe(2);
      });


      test('Should be called normalize only for specified field', () => {
        const values = {
          k1: 'v1',
          k2: 'v2',
          k3: {
            foo: [
              { key: 'v1' },
              { key: 'v2' },
              { key: 'v3' },
            ],
            bar: [
              { key: 'v1' },
              { key: 'v2' },
              { key: 'v3' },
            ],
            baz: [
              { key: 'v1' },
              { key: 'v2' },
              { key: 'v3' },
            ],
          },
        };

        const normalizer1 = sinon.stub().returns(true);
        const normalizer2 = sinon.stub().returns(true);
        const normalizer3 = sinon.stub().returns(true);

        Validator.registerNormalizer('normalizer1', normalizer1);
        Validator.registerNormalizer('normalizer2', normalizer2);
        Validator.registerNormalizer('normalizer3', normalizer3);

        const v = new Validator(values, {}, {
          normalizers: {
            k1: {
              normalizer1: true,
              normalizer2: true,
              normalizer3: true,
            },
            k2: {
              normalizer1: true,
              normalizer2: true,
            },
            'k3.*.*.key': {
              normalizer1: true,
            },
          },
        });

        v.normalize('k1');

        expect(normalizer1.callCount).toBe(1);
        expect(normalizer2.callCount).toBe(1);
        expect(normalizer3.callCount).toBe(1);

        v.normalize('k2');

        expect(normalizer1.callCount).toBe(2);
        expect(normalizer2.callCount).toBe(2);
        expect(normalizer3.callCount).toBe(1);

        v.normalize(['k1', 'k2']);

        expect(normalizer1.callCount).toBe(4);
        expect(normalizer2.callCount).toBe(4);
        expect(normalizer3.callCount).toBe(2);

        v.normalize('k3.*.*.key');

        expect(normalizer1.callCount).toBe(13);
        expect(normalizer2.callCount).toBe(4);
        expect(normalizer3.callCount).toBe(2);
      });
    });
  });
});
