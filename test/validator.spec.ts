import * as sinon from 'sinon';
import * as assert from 'power-assert';
import { Validator, EventTypes } from '../src/';


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
      it('Should be defined locale messages', () => {
        const locale = 'hoge';
        const localeMessages = {
          defaultMessage: 'test defined locale messages',
        };

        Validator.defineLocale(locale, localeMessages);
        Validator.setLocale(locale);

        assert(Validator.getLocale() === locale);
        assert.deepStrictEqual(Validator.getMessages(), localeMessages);
      });


      it('Should throw a error when specify doesn\'t exist locale', () => {
        assert.throws(() => {
          Validator.setLocale('notfoundlocale');
        });
      });


      it('Should throw a error when missing defaultMessage field', () => {
        assert.throws(() => {
          Validator.defineLocale('hoge', <any>{});
        });
      });


      it('Should be get error message', () => {
        Validator.defineLocale('test1', { defaultMessage: '1', required: 'message1' });
        Validator.defineLocale('test2', { defaultMessage: '2', min: { string: 'msg2-1', number: 'msg2-2' } });

        Validator.setLocale('test1');
        assert(Validator.getMessage('required') === 'message1');

        Validator.setLocale('test2');
        assert(Validator.getMessage('min', 'string') === 'msg2-1');
        assert(Validator.getMessage('min', 'number') === 'msg2-2');
      });


      it('Should be set error message', () => {
        const locale = 'hoge';
        Validator.defineLocale(locale, { defaultMessage: 'DEFAULT' });
        Validator.setLocale(locale);

        Validator.setMessage('test-error1', 'value is {{test}}');
        Validator.setMessage('test-error2', { string: '{{key}}!!', number: '{{key}}??' });

        assert(Validator.getMessage('test-error1') === 'value is {{test}}');
        assert(Validator.getMessage('test-error2') === 'DEFAULT');
        assert(Validator.getMessage('test-error2', 'string') === '{{key}}!!');
        assert(Validator.getMessage('test-error2', 'number') === '{{key}}??');
      });


      it('Should be get default error message', () => {
        const locale = 'fuga';
        Validator.defineLocale(locale, { defaultMessage: 'default!!' });
        Validator.setLocale(locale);

        Validator.setMessage('msg1', 'notuse');
        Validator.setMessage('msg2', { string: 'notuse' });
        Validator.setMessage('msg3', { defaultMessage: 'local!!', number: 'notuse' });

        assert(Validator.getMessage('notfound') === 'default!!');
        assert(Validator.getMessage('msg2', 'number') === 'default!!');
        assert(Validator.getMessage('msg3') === 'local!!');
        assert(Validator.getMessage('msg3', 'string') === 'local!!');
      });
    });


    describe('Rules manipulation', () => {
      it('Should be registered', () => {
        let test: any;
        let o: any;

        test = () => false;
        Validator.registerRule('testRule', test, {});

        o = Validator.getRule('testRule');
        assert(o.sync === true);
        assert(o.test === test);
        assert(o.implicit === true);
        assert(o.mapArgsToParams(1) === 1);
        assert.deepStrictEqual(o.depends, {});

        test = () => true;
        Validator.registerRule('sampleRule', test, {
          implicit: false,
          depends: { string: true, format: /^\d$/ },
          mapArgsToParams: hoge => ({ hoge }),
        });

        o = Validator.getRule('sampleRule');
        assert(o.sync === true);
        assert(o.test === test);
        assert(o.implicit === false);
        assert.deepStrictEqual(o.mapArgsToParams(1), { hoge: 1 });
        assert.deepStrictEqual(o.depends, { string: true, format: /^\d$/ });
      });


      it('Should be throw a error when specify duplicate field', () => {
        Validator.registerRule('hoge', () => true);
        assert.throws(() => {
          Validator.registerRule('hoge', () => true);
        });
      });


      it('Should be override register', () => {
        const test1 = () => false;
        const test2 = () => true;
        const name = 'exampleName';
        let o: any;

        Validator.registerRule(name, test1, {
          depends: {},
          mapArgsToParams: a => a,
        });

        o = Validator.getRule(name);
        assert(o.test === test1);
        assert.deepStrictEqual(o.depends, {});
        assert(o.mapArgsToParams(10) === 10);

        Validator.registerRule(name, test2, {
          depends: { string: true },
          mapArgsToParams: foo => ({ foo }),
          override: true,
        });

        o = Validator.getRule(name);
        assert(o.test === test2);
        assert.deepStrictEqual(o.depends, { string: true });
        assert.deepStrictEqual(o.mapArgsToParams(10), { foo: 10 });
      });


      it('Should be throw a error when call rule does not exist', () => {
        assert.throws(() => {
          Validator.registerRule('fuga', () => false, { depends: { notfound: true } });
        });
      });
    });


    describe('Asynchronous rules manipulation', () => {
      it('Should be registered', () => {
        let rule: string;
        let test: any;
        let o: any;

        rule = 'asyncRule1';
        test = () => Promise.reject('hoge');
        Validator.registerAsyncRule(rule, test, {});

        o = Validator.getRule(rule);
        assert(o.sync === false);
        assert(o.test === test);
        assert(o.implicit === true);
        assert.deepStrictEqual(o.depends, {});
        assert(o.mapArgsToParams(10) === 10);

        rule = 'asyncRule2';
        test = () => Promise.resolve();
        Validator.registerAsyncRule(rule, test, {
          implicit: false,
          depends: { string: true },
          mapArgsToParams: hoge => ({ hoge }),
        });

        o = Validator.getRule(rule);
        assert(o.sync === false);
        assert(o.test === test);
        assert(o.implicit === false);
        assert.deepStrictEqual(o.depends, { string: true });
        assert.deepStrictEqual(o.mapArgsToParams(10), { hoge: 10 });
      });


      it('Should be throw a error when specify duplicate field', () => {
        Validator.registerAsyncRule('hoge', () => Promise.reject(null));
        assert.throws(() => {
          Validator.registerAsyncRule('hoge', () => Promise.reject(null));
        });
      });


      it('Should be throw a error when call rule does not exist', () => {
        assert.throws(() => {
          Validator.registerAsyncRule('fuga', () => Promise.reject(null), { depends: { notfound: true } });
        });
      });


      it('Should be override register', () => {
        const test1 = () => Promise.resolve();
        const test2 = () => Promise.reject(null);
        const name = 'exampleName';
        let o: any;

        Validator.registerAsyncRule(name, test1, {
          depends: {},
          mapArgsToParams: a => a,
        });

        o = Validator.getRule(name);
        assert(o.test === test1);
        assert.deepStrictEqual(o.depends, {});
        assert(o.mapArgsToParams(10) === 10);

        Validator.registerAsyncRule(name, test2, {
          depends: { string: true },
          mapArgsToParams: foo => ({ foo }),
          override: true,
        });

        o = Validator.getRule(name);
        assert(o.test === test2);
        assert.deepStrictEqual(o.depends, { string: true });
        assert.deepStrictEqual(o.mapArgsToParams(10), { foo: 10 });
      });
    });


    describe('Normalizers manipulation', () => {
      it('Should be registered', () => {
        let name: string;
        let normalizer: any;
        let o: any;

        name = 'testNormalizer1';
        Validator.registerNormalizer(name, normalizer);

        o = Validator.getNormalizer(name);
        assert(o.normalizer === normalizer);
        assert.deepStrictEqual(o.depends, {});

        name = 'testNormalizer2';
        Validator.registerNormalizer(name, normalizer, {
          depends: { testNormalizer1: true },
        });

        o = Validator.getNormalizer(name);
        assert(o.normalizer === normalizer);
        assert.deepStrictEqual(o.depends, { testNormalizer1: true });
      });


      it('Should be throw a error when specify duplicate field', () => {
        Validator.registerNormalizer('fuga', () => true);
        assert.throws(() => {
          Validator.registerNormalizer('fuga', () => true);
        });
      });


      it('Should be throw a error when call normalizer does not exist', () => {
        assert.throws(() => {
          Validator.registerNormalizer('hoge', () => false, {
            depends: { notfound: true },
          });
        });
      });


      it('Should be override register', () => {
        const normalizer1 = () => true;
        const normalizer2 = () => false;
        const name = 'exampleNormalizer';
        let o: any;

        Validator.registerNormalizer(name, normalizer1, {
          depends: {},
        });

        o = Validator.getNormalizer(name);
        assert(o.normalizer === normalizer1);
        assert.deepStrictEqual(o.depends, {});

        Validator.registerNormalizer(name, normalizer2, {
          depends: { toString: true },
          override: true,
        });

        o = Validator.getNormalizer(name);
        assert(o.normalizer === normalizer2);
        assert.deepStrictEqual(o.depends, { toString: true });
      });
    });
  });


  describe('Instance', () => {
    describe('Constructor', () => {
      it('Should be create instance', () => {
        const v1 = new Validator();
        assert(v1);

        const v2 = new Validator({}, {}, {});
        assert(v2);
      });


      it('Should be throw a error when pass invalid arguments', () => {
        assert.throws(() => new Validator(<any>null));
        assert.throws(() => new Validator({}, <any>null));
      });
    });


    describe('Values', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      it('Should be get/set values', () => {
        assert.deepStrictEqual(v.getValues(), {});
        v.setValues({ key: 'value' });
        assert.deepStrictEqual(v.getValues(), { key: 'value' });
        v.setValues({ key2: 'value2' });
        assert.deepStrictEqual(v.getValues(), { key2: 'value2' });

        assert.throws(() => v.setValues(<any>null));
        assert.throws(() => v.setValues(<any>'string'));
      });


      it('Should be set values with constructor', () => {
        const values = { k1: 'v1', k2: 'v2' };
        const vv = new Validator(values);
        assert.deepStrictEqual(vv.getValues(), values);
      });


      it('Should be merge values', () => {
        v.setValues({ key: 'value' });
        v.mergeValues({ key2: 'value2' });
        assert.deepStrictEqual(v.getValues(), {
          key: 'value',
          key2: 'value2',
        });

        assert.throws(() => v.mergeValues(<any>null));
      });


      it('Should be clear values', () => {
        v.setValues({ k1: 'v1', k2: 'v' });
        v.clearValues();
        assert.deepStrictEqual(v.getValues(), {});
      });


      it('Should be get value with key', () => {
        v.setValues({ key: 'value', deep: { foo: { bar: 'baz' } } });
        assert(v.getValue('key') === 'value');
        assert(v.getValue('deep.foo.bar') === 'baz');
        assert(v.getValue('hoge.fuga') === null);
      });


      it('Should be set value with key', () => {
        v.setValue('foo', 'bar');
        v.setValue('hoge.fuga', 'piyo');
        assert(v.getValue('foo') === 'bar');
        assert.deepStrictEqual(v.getValue('hoge'), { fuga: 'piyo' });
      });


      it('Should be check exist of value', () => {
        v.setValue('foo', 'bar');
        v.setValue('hoge.fuga', 'piyo');
        assert(v.hasValue('foo'));
        assert(v.hasValue('foo.bar') === false);
        assert(v.hasValue('hoge'));
        assert(v.hasValue('hoge.fuga'));
        assert(v.hasValue('hoge.fuga.piyo') === false);
        assert(v.hasValue('notfound') === false);
      });


      it('Should be get filtered values', () => {
        assert.deepStrictEqual(v.getFilteredValues(['foo', 'bar']), {});

        v.setValues({
          foo: 1,
        });

        assert.deepStrictEqual(v.getFilteredValues(['foo', 'bar']), { foo: 1 });

        v.setValues({
          foo: 1,
          bar: 2,
        });

        assert.deepStrictEqual(v.getFilteredValues(['foo', 'bar']), { foo: 1, bar: 2 });

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

        assert.deepStrictEqual(v.getFilteredValues(['foo.bar.*.id', 'hoge', 'fuga']), {
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


      it('Should be get/set messages', () => {
        assert.deepStrictEqual(v.getMessages(), {});
        v.setMessages({ key: { required: 'msg' } });
        assert.deepStrictEqual(v.getMessages(), { key: { required: 'msg' } });
        v.setMessages({ foo: { rule: 'bar' } });
        assert.deepStrictEqual(v.getMessages(), { foo: { rule: 'bar' } });

        assert.throws(() => v.setMessages(<any>null));
        assert.throws(() => v.setMessages(<any>'string'));
      });


      it('Should be set messages with constructor', () => {
        const messages = { foo: { bar: 'msg1' }, hoge: { fuga: 'msg2' } };
        const vv = new Validator({}, {}, { messages });
        assert.deepStrictEqual(vv.getMessages(), messages);
      });


      it('Should be merge messages', () => {
        v.setMessages({ k1: { required: 'msg1' } });
        v.mergeMessages({ k2: { required: 'msg2' } });
        assert.deepStrictEqual(v.getMessages(), {
          k1: { required: 'msg1' },
          k2: { required: 'msg2' },
        });

        assert.throws(() => v.mergeMessages(<any>null));
      });
    });


    describe('Errors', () => {
      let v: Validator;

      const clear = () => {
        v.clearValues();
        v.clearAllErrors();
        assert.deepStrictEqual(v.getAllErrors(), {});
      };

      beforeEach(() => {
        v = new Validator();
      });


      it('Should be adding error from global messages.', () => {
        const key = 'testkey';
        const rule = 'foobar';

        // String
        Validator.setMessage(rule, 'global {{key}}');
        v.addError(key, rule, false, { key: 'value' });

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'global value', params: { key: 'value' } },
        ]);

        clear();

        // Inline
        Validator.setMessage(rule, 'global {{key}}');
        v.addError(key, rule, 'inline error', { key: 'value' });

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'inline error', params: { key: 'value' } },
        ]);

        clear();

        // Creator (function)
        Validator.setMessage(rule, (key: string, value: any, params: any) => `${key} "${value}" ${params.key}`);
        v.setValue(key, 'value');
        v.addError(key, rule, false, { key: 'value' });

        assert.deepStrictEqual(v.getErrors(key), [
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

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'string', params: {} },
        ]);

        clear();

        v.setValue(key, 10);
        v.addError(key, rule, false, {});

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'number', params: {} },
        ]);

        clear();

        v.setValue(key, '10'); // numeric
        v.addError(key, rule, false, {});

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'number', params: {} },
        ]);

        clear();

        v.setValue(key, []);
        v.addError(key, rule, false, {});

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'default', params: {} },
        ]);
      });


      it('Should be adding error from local messages.', () => {
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

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'local value', params: { key: 'value' } },
        ]);

        clear();

        // Inline
        v.addError(key, rule, 'inline error', { key: 'value' });

        assert.deepStrictEqual(v.getErrors(key), [
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

        assert.deepStrictEqual(v.getErrors(key), [
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

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'local string', params: {} },
        ]);

        clear();

        v.setValue(key, 10);
        v.addError(key, rule, false, {});

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'local number', params: {} },
        ]);

        clear();

        v.setValue(key, []);
        v.addError(key, rule, false, {});

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'local default', params: {} },
        ]);
      });


      it('Should be manipulate errors', () => {
        v.addError('k1', 'foo', false, {});
        v.addError('k2', 'bar', false, {});

        // Get
        assert.deepStrictEqual(v.getAllErrors(), {
          k1: [
            { rule: 'foo', message: 'The k1 field is invalid.', params: {} },
          ],
          k2: [
            { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
          ],
        });

        assert.deepStrictEqual(v.getErrors('k1'), [
          { rule: 'foo', message: 'The k1 field is invalid.', params: {} },
        ]);

        assert.deepStrictEqual(v.getErrors('k2'), [
          { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
        ]);

        // Exist
        assert(v.hasErrors('k1'));
        assert(v.hasErrors('k2'));

        // Remove
        v.addError('k1', 'baz', false, {});
        v.removeError('k1', 'foo');

        assert.deepStrictEqual(v.getErrors('k1'), [
          { rule: 'baz', message: 'The k1 field is invalid.', params: {} },
        ]);

        // Clear
        v.clearErrors('k1');

        assert.deepStrictEqual(v.getAllErrors(), {
          k2: [
            { rule: 'bar', message: 'The k2 field is invalid.', params: {} },
          ],
        });

        v.clearAllErrors();

        assert.deepStrictEqual(v.getAllErrors(), {});
      });


      it('Should be return whether error exists', () => {
        assert(v.isValid());
        assert(v.isValid('k1'));
        assert(v.isValid('k2'));
        assert(v.isValid(['k1', 'k2']));
        assert(v.isValid(['k1', 'notfound']));
        assert(v.isValid('foo.bar'));
        assert(v.isValid('array.0.key'));
        assert(v.isValid('array.1.key'));
        assert(v.isValid('array.2.key'));
        assert(v.isValid('array.*.key'));
        assert(v.isValid(['array.0.key', 'array.1.key', 'array.2.key']));

        v.addError('k1', 'foo', false, {});
        v.addError('k2', 'bar', false, {});
        v.addError('foo.bar', 'baz', false, {});
        v.addError('array.0.key', 'hoge', false, {});
        v.addError('array.2.key', 'fuga', false, {});

        assert(v.isValid() === false);
        assert(v.isValid('k1') === false);
        assert(v.isValid('k2') === false);
        assert(v.isValid(['k1', 'k2']) === false);
        assert(v.isValid(['k1', 'notfound']) === false);
        assert(v.isValid('foo.bar') === false);
        assert(v.isValid('array.0.key') === false);
        assert(v.isValid('array.1.key'));
        assert(v.isValid('array.2.key') === false);
        assert(v.isValid('array.*.key') === false);
        assert(v.isValid(['array.0.key', 'array.1.key', 'array.2.key']) === false);
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


      it('Should be return all error messages', () => {
        assert.deepStrictEqual(v.getAllErrorMessages(), {
          foo: ['foo1', 'foo2'],
          bar: ['bar1'],
        });

        v.clearAllErrors();

        assert.deepStrictEqual(v.getAllErrorMessages(), {});
      });


      it('Should be return error message', () => {
        assert(v.getErrorMessages('notfound') === null);
        assert.deepStrictEqual(v.getErrorMessages('foo'), ['foo1', 'foo2']);
        assert.deepStrictEqual(v.getErrorMessages('bar'), ['bar1']);

        assert(v.getErrorMessage('notfound', 'notfound') === null);
        assert(v.getErrorMessage('foo', 'notfound') === null);
        assert(v.getErrorMessage('foo', 'bar1') === 'foo1');
        assert(v.getErrorMessage('foo', 'bar2') === 'foo2');
        assert(v.getErrorMessage('bar', 'baz1') === 'bar1');
      });
    });


    describe('Rules', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      it('Should be get/set rules', () => {
        assert.deepStrictEqual(v.getRules(), {});
        v.setRules({ key: { required: true }});
        assert.deepStrictEqual(v.getRules(), { key: { required: true } });
        v.setRules({ foo: { required: false }});
        assert.deepStrictEqual(v.getRules(), { foo: { required: false } });

        assert.throws(() => v.setRules(<any>null));
        assert.throws(() => v.setRules(<any>10));
      });


      it('Should be set rules with constructor', () => {
        const rules = { foo: { required: true }, bar: { rule: { param1: 'value' } } };
        const vv = new Validator({}, rules);
        assert.deepStrictEqual(vv.getRules(), rules);
      });


      it('Should be merge rules', () => {
        v.setRules({ k1: { required: true } });
        v.mergeRules({ k2: { required: false } });
        assert.deepStrictEqual(v.getRules(), {
          k1: { required: true },
          k2: { required: false },
        });

        assert.throws(() => v.mergeRules(<any>null));
      });


      it('Should be map arguments to params', () => {
        Validator.registerRule('rule1', () => true, {
          mapArgsToParams: a => a,
        });

        Validator.registerRule('rule2', () => true, {
          mapArgsToParams: foo => ({ foo }),
        });

        Validator.registerAsyncRule('rule3', () => Promise.resolve(), {
          mapArgsToParams: bar => ({ bar }),
        });

        v.setRules({
          key1: {
            rule1: true,
            rule2: 10,
            rule3: 'key1-rule3',
          },
          key2: {
            rule1: true,
            rule2: 20,
            rule3: 'key2-rule3',
          },
        });

        assert.deepStrictEqual(v.getRules(), {
          key1: {
            rule1: true,
            rule2: { foo: 10 },
            rule3: { bar: 'key1-rule3' },
          },
          key2: {
            rule1: true,
            rule2: { foo: 20 },
            rule3: { bar: 'key2-rule3' },
          },
        });
      });
    });


    describe('Normalizers', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      it('Should be get/set normalizers', () => {
        assert.deepStrictEqual(v.getNormalizers(), {});
        v.setNormalizers({ key: { trim: true } });
        assert.deepStrictEqual(v.getNormalizers(), { key: { trim: true } });
        v.setNormalizers({ foo: { ltrim: false } });
        assert.deepStrictEqual(v.getNormalizers(), { foo: { ltrim: false } });

        assert.throws(() => v.setNormalizers(<any>null));
        assert.throws(() => v.setNormalizers(<any>13));
      });


      it('Should be set nomralizers with constructor', () => {
        const normalizers = { foo: { trim: true }, bar: { rtrim: true } };
        const vv = new Validator({}, {}, { normalizers });
        assert.deepStrictEqual(vv.getNormalizers(), normalizers);
      });


      it('Should be merge normalizers', () => {
        v.setNormalizers({ k1: { trim: true } });
        v.mergeNormalizers({ k2: { rtrim: false } });
        assert.deepStrictEqual(v.getNormalizers(), {
          k1: { trim: true },
          k2: { rtrim: false },
        });

        assert.throws(() => v.mergeNormalizers(<any>null));
      });
    });


    describe('Field labels', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      it('Should be get/set field labels', () => {
        assert.deepStrictEqual(v.getLabels(), {});
        v.setLabels({ key: 'Custom Key' });
        assert.deepStrictEqual(v.getLabels(), { key: 'Custom Key' });
        v.setLabels({ foo: 'Foo Key', bar: 'Bar Key' });
        assert.deepStrictEqual(v.getLabels(), { foo: 'Foo Key', bar: 'Bar Key' });

        assert.throws(() => v.setLabels(<any>null));
        assert.throws(() => v.setLabels(<any>13));
      });


      it('Should be set field labels with constructor', () => {
        const labels = { foo: 'Foo123', bar: 'Bar456' };
        const vv = new Validator({}, {}, { labels });
        assert.deepStrictEqual(vv.getLabels(), labels);
      });


      it('Should be merge field labels', () => {
        v.setLabels({ k1: 'Key1' });
        v.mergeLabels({ k2: 'Key2' });
        assert.deepStrictEqual(v.getLabels(), {
          k1: 'Key1',
          k2: 'Key2',
        });

        assert.throws(() => v.mergeLabels(<any>null));
      });


      it('Should be get field label', () => {
        v.setLabels({
          foo: 'Foo123',
          bar: 'Bar456',
          'has.dot.key': 'DotKey1',
          'has.wild.*.key.*': 'DotKey2',
        });

        assert(v.getLabel('foo') === 'Foo123');
        assert(v.getLabel('bar') === 'Bar456');
        assert(v.getLabel('has.dot.key') === 'DotKey1');
        assert(v.getLabel('has.wild.*.key.*') === 'DotKey2');
        assert(v.getLabel('has.wild.0.key.0') === 'DotKey2');
        assert(v.getLabel('has.wild.0.key.1') === 'DotKey2');
        assert(v.getLabel('has.wild.1.key.2') === 'DotKey2');
        assert(v.getLabel('has.wild.1.key.3') === 'DotKey2');
        assert(v.getLabel('notfound') === 'notfound');
      });
    });


    describe('Normalize', () => {
      it('Should be called normalizer', () => {
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

        assert(v.validate());
        assert.deepStrictEqual(v.getValues(), {
          k1: 'called func2',
          k2: 'v2',
        });
      });


      it('Should be arguments passed to normalizer', () => {
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

        assert(v.validate());
        assert(normalizer.callCount === 1);
        assert(v.getValue('foo') === 'called');
      });


      it('Should be called dependent normalizers', () => {
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

        assert(v.validate());
        assert(n1.callCount === 3);
        assert(n2.callCount === 2);
        assert(n3.callCount === 1);
        assert(n4.callCount === 1);
      });
    });


    describe('Validation', () => {
      it('Should be called test when validation', () => {
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

        assert(v.validate());
        assert(pass1.callCount === 2);
        assert(pass2.callCount === 0);
      });


      it('Should be arguments passed to test', () => {
        const values = { foo: 'bar', hoge: 'fuga' };
        const params = { k1: 'v1', k2: 'v2' };

        const test = sinon.stub().returns(false);
        test.withArgs(values.foo, params, 'foo', values).returns(true);

        const v = new Validator(values, {
          foo: { rule: params },
        });

        Validator.registerRule('rule', test);

        assert(v.validate());
        assert(test.callCount === 1);
      });


      it('Should be called rules dependent on validation', () => {
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

        assert(v.validate() === false);
        assert(returnTrue.callCount === 2);
        assert(returnFalse.callCount === 1);
        assert(test1.callCount === 1);
        assert(test2.callCount === 0);
      });


      it('Should be call inline rule', () => {
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

        assert(v.validate());
        assert(other.callCount === 1);
        assert(inline.callCount === 1);
      });


      it('Should not be call async validations', () => {
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

        assert(v.validate());
        assert(test1.callCount === 0);
        assert(test2.callCount === 1);
      });


      it('Should be always return true for inline async rules', () => {
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

        assert(v.validate());
        assert(test1.callCount === 1);
        assert(test2.callCount === 1);
      });
    });


    describe('Asynchronous validation', () => {
      it('Should be return resolve (success)', (done) => {
        Validator.registerAsyncRule('returnPromise', () => Promise.resolve());

        const values = { key: 'value' };
        const v = new Validator(values, {
          key: {
            returnPromise: true,
          },
        });

        assert(v.isValidating() === false);

        v.asyncValidate()
          .then(resultValues => {
            assert(v.isValidating() === false);
            assert.deepStrictEqual(resultValues, v.getValues());
            assert.deepStrictEqual(resultValues, values);
            done();
          })
            .catch(() => {
              console.log(v.getAllErrors());
              assert(false);
              done();
            });

            assert(v.isValidating());
      });


      it('Should be return reject (failure)', (done) => {
        Validator.registerAsyncRule('test', () => Promise.reject('Error!!'));

        const values = { key: 'value' };
        const v = new Validator(values, {
          key: { test: true },
        });

        v.asyncValidate()
          .then(() => {
            assert(false);
            done();
          })
            .catch(errors => {
              assert(v.isValidating() === false);
              assert.deepStrictEqual(errors, v.getAllErrors());
              assert.deepStrictEqual(errors, {
                key: [
                  { rule: 'test', message: 'Error!!', params: true },
                ],
              });
              done();
            });

            assert(v.isValidating());
      });


      it('Should be called rules dependent on validation', (done) => {
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

        v.asyncValidate()
          .then(() => {
            assert(false);
            done();
          })
            .catch(() => {
              assert(returnTrue.callCount === 2);
              assert(returnResolve.callCount === 1);
              assert(returnReject.callCount === 1);
              assert(test1.callCount === 1);
              assert(test2.callCount === 0);
              done();
            });

            assert(v.isValidating() === true);
      });


      it('Should not be call inline rule', (done) => {
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

        v.asyncValidate()
          .then(() => {
            assert(test1.callCount === 0);
            assert(test2.callCount === 0);
            assert(test3.callCount === 1);
            done();
          })
            .catch(() => {
              assert(false);
              done();
            });
      });
    });


    describe('Sync & Asynchronous validation', () => {
      it('Should be return resolve', (done) => {
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

        assert(v.isValidating() === false);

        v.asyncValidate()
          .then(returnValues => {
            assert(v.isValidating() === false);
            assert.deepStrictEqual(returnValues, values);
            assert.deepStrictEqual(returnValues, v.getValues());
            assert(test1.callCount === 1);
            assert(test2.callCount === 0);
            assert(test3.callCount === 1);
            done();
          })
            .catch(() => {
              assert(false);
              done();
            });

            assert(v.isValidating());
      });


      it('Should be return reject', (done) => {
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

        const expect = {
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

        assert(v.isValidating() === false);

        v.asyncValidate()
          .then(() => {
            assert(false);
            done();
          })
            .catch(errors => {
              assert(v.isValidating() === false);
              assert.deepStrictEqual(errors, expect);
              assert(test1.callCount === 1);
              assert(test2.callCount === 0);
              assert(test3.callCount === 1);
              done();
            });

            assert(v.isValidating());
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


      it('Should be return custom error message from `messages` field', () => {
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

        assert(v.validate() === false);
        assert.deepStrictEqual(v.getAllErrors(), {
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


      it('Should be return custom error message from callback', () => {
        const inline = () => 'callback';
        const v = new Validator(values, {
          k1: { inline },
        });

        assert(v.validate() === false);
        assert.deepStrictEqual(v.getAllErrors(), {
          k1: [
            { rule: 'inline', message: 'callback', params: inline },
          ],
        });
      });


      it('Should be return custom error message from async rule', (done) => {
        Validator.registerAsyncRule('asyncError', () => Promise.reject(null));
        Validator.setMessage('asyncError', 'async message');

        const v = new Validator(values, {
          k1: { asyncError: true },
        });

        v.asyncValidate()
          .then(() => {
            assert(false);
            done();
          })
            .catch(errors => {
              assert.deepStrictEqual(errors, {
                k1: [
                  { rule: 'asyncError', message: 'async message', params: true },
                ],
              });
              done();
            });
      });
    });


    describe('Implicit flag', () => {
      it('Should not be called if null or key does not exist', () => {
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

        assert(v.validate() === false);
        assert(implicit.callCount === 3);
        assert(nonImplicit.callCount === 5);
      });
    });


    describe('Events', () => {
      it('Should be fire before and after validate event.', (done) => {
        const v = new Validator({ key: 'value' }, { key: { inline: () => true } });
        let str = '';

        v.on(EventTypes.BEFORE_VALIDATE, (vv: Validator) => {
          str += 'before';
          assert(v === vv);
        });

        v.on(EventTypes.AFTER_VALIDATE, (vv: Validator) => {
          str += '-after';
          assert(str === 'before-after');
          assert(v === vv);
          done();
        });

        v.validate();
      });


      it('Should be fire valid event', (done) => {
        const v = new Validator({ key: 'value' }, { key: { inline: () => true } });

        v.on(EventTypes.VALID, (vv: Validator) => {
          assert(v === vv);
          done();
        });

        v.validate();
      });


      it('Should be fire invalid event', (done) => {
        const v = new Validator({ key: 'value' }, { key: { inline: () => false } });

        v.on(EventTypes.INVALID, (vv: Validator) => {
          assert(v === vv);
          done();
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


      it('Should be validate', () => {
        const v = new Validator(getValues(), {
          text: { ok: true },
          code: { str: true },
          'data.users.*.id': { num: true },
          'data.users.*.profile.age': { num: true },
          'data.users.*.followers.*': { num: true },
        });

        assert(v.validate() === false);

        assert.deepStrictEqual(v.getAllErrors(), {
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

        assert.deepStrictEqual(v.getErrors('data.users.1.profile.age'), [
          { rule: 'num', message: 'The data.users.1.profile.age field is invalid.', params: true },
        ]);

        assert(v.hasErrors('data.users.1.profile.age'));
        assert(v.hasErrors('data.users[1]profile.age'));
        assert(v.hasErrors('data.users.2.profile.age') === false);
      });


      it('Should be async validate', (done) => {
        const v = new Validator(getValues(), {
          code: { ok: true },
          'data.users.*.username': { resolve: true },
          'data.users.*.followers.*': { reject: true },
        });

        v.asyncValidate()
          .then(() => {
            assert(false);
            done();
          })
            .catch(errors => {
              assert.deepStrictEqual(errors, {
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
              done();
            });
      });


      it('Should be called normalizer', () => {
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

        assert(v.validate());

        assert.deepStrictEqual(v.getValues().data.users, [
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


      it('Should be called test only for specified field', () => {
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

        assert(test1.callCount === 1);
        assert(test2.callCount === 1);
        assert(test3.callCount === 1);

        v.validate('k2');

        assert(test1.callCount === 2);
        assert(test2.callCount === 2);
        assert(test3.callCount === 1);

        v.validate(['k1', 'k2']);

        assert(test1.callCount === 4);
        assert(test2.callCount === 4);
        assert(test3.callCount === 2);

        v.validate('k3.*.*.key');

        assert(test1.callCount === 13);
        assert(test2.callCount === 4);
        assert(test3.callCount === 2);
      });


      it('Should be called normalize only for specified field', () => {
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

        assert(normalizer1.callCount === 1);
        assert(normalizer2.callCount === 1);
        assert(normalizer3.callCount === 1);

        v.normalize('k2');

        assert(normalizer1.callCount === 2);
        assert(normalizer2.callCount === 2);
        assert(normalizer3.callCount === 1);

        v.normalize(['k1', 'k2']);

        assert(normalizer1.callCount === 4);
        assert(normalizer2.callCount === 4);
        assert(normalizer3.callCount === 2);

        v.normalize('k3.*.*.key');

        assert(normalizer1.callCount === 13);
        assert(normalizer2.callCount === 4);
        assert(normalizer3.callCount === 2);
      });
    });
  });
});
