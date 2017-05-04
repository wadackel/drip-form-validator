import * as sinon from 'sinon';
import * as assert from 'power-assert';
import { Validator, EventTypes } from '../src/';


let clock: any = null;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const defaultLocale = Validator._locale;
const defaultRules = { ...Validator._builtinRules };
const defaultNormalizers = { ...Validator._builtinNormalizers };


describe('Validator', () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers();

    Validator._locale = defaultLocale;
    Validator._localeMessages = { [defaultLocale]: Validator._localeMessages[defaultLocale] };
    Validator._builtinRules = { ...defaultRules };
    Validator._builtinNormalizers = { ...defaultNormalizers };
  });


  afterEach(() => {
    clock.restore();
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
        const rule = 'testRule';
        const d = {};
        const t = () => false;
        const b = false;
        Validator.registerRule(rule, d, t, b);

        const o: any = Validator.getRule(rule);
        assert(o.depends === d);
        assert(o.test === t);
        assert(o.implicit === b);
      });


      it('Should be throw a error when specify duplicate field', () => {
        Validator.registerRule('hoge', {}, () => true, true);
        assert.throws(() => {
          Validator.registerRule('hoge', {}, () => true, true);
        });
      });


      it('Should be throw a error when call rule does not exist', () => {
        assert.throws(() => {
          Validator.registerRule('fuga', { notfound: true }, () => false);
        });
      });
    });


    describe('Normalizers manipulation', () => {
      it('Should be registered', () => {
        const name = 'testNormalizer';
        const d = {};
        const n = (value: any) => value;
        const b = true;
        Validator.registerNormalizer(name, d, n, b);

        const o: any = Validator.getNormalizer(name);
        assert(o.depends === d);
        assert(o.normalizer === n);
        assert(o.before === b);
      });


      it('Should be throw a error when specify duplicate field', () => {
        Validator.registerNormalizer('fuga', {}, () => true, false);
        assert.throws(() => {
          Validator.registerNormalizer('fuga', {}, () => true, false);
        });
      });


      it('Should be throw a error when call normalizer does not exist', () => {
        assert.throws(() => {
          Validator.registerNormalizer('hoge', { notfound: false }, () => false);
        });
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

      beforeEach(() => {
        v = new Validator();
      });


      it('Should be adding error from global messages.', () => {
        const key = 'testkey';
        const rule = 'foobar';
        const clear = () => {
          v.clearValues();
          v.clearAllErrors();
          assert.deepStrictEqual(v.getAllErrors(), {});
        };

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

        v.setValue(key, []);
        v.addError(key, rule, false, {});

        assert.deepStrictEqual(v.getErrors(key), [
          { rule, message: 'default', params: {} },
        ]);
      });


      it('Should be adding error from local messages.', () => {
        const key = 'testkey';
        const rule = 'foobar';
        const clear = () => {
          v.clearValues();
          v.clearAllErrors();
          assert.deepStrictEqual(v.getAllErrors(), {});
        };

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
    });


    describe('Error messages', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      it('Should be return error message', () => {
        v.setErrors('foo', [
          { rule: 'bar1', message: 'foo1', params: true },
          { rule: 'bar2', message: 'foo2', params: true },
        ]);

        v.setErrors('bar', [
          { rule: 'baz1', message: 'bar1', params: true },
        ]);

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


    describe('Custom fields', () => {
      let v: Validator;

      beforeEach(() => {
        v = new Validator();
      });


      it('Should be get/set custom fields', () => {
        assert.deepStrictEqual(v.getCustomFields(), {});
        v.setCustomFields({ key: 'Custom Key' });
        assert.deepStrictEqual(v.getCustomFields(), { key: 'Custom Key' });
        v.setCustomFields({ foo: 'Foo Key', bar: 'Bar Key' });
        assert.deepStrictEqual(v.getCustomFields(), { foo: 'Foo Key', bar: 'Bar Key' });

        assert.throws(() => v.setCustomFields(<any>null));
        assert.throws(() => v.setCustomFields(<any>13));
      });


      it('Should be set custom fields with constructor', () => {
        const fields = { foo: 'Foo123', bar: 'Bar456' };
        const vv = new Validator({}, {}, { fields });
        assert.deepStrictEqual(vv.getCustomFields(), fields);
      });


      it('Should be merge custom fields', () => {
        v.setCustomFields({ k1: 'Key1' });
        v.mergeCustomFields({ k2: 'Key2' });
        assert.deepStrictEqual(v.getCustomFields(), {
          k1: 'Key1',
          k2: 'Key2',
        });

        assert.throws(() => v.mergeCustomFields(<any>null));
      });


      it('Should be get field title', () => {
        v.setCustomFields({
          foo: 'Foo123',
          bar: 'Bar456',
          'has.dot.key': 'DotKey1',
          'has.wild.*.key.*': 'DotKey2',
        });

        assert(v.getFieldTitle('foo') === 'Foo123');
        assert(v.getFieldTitle('bar') === 'Bar456');
        assert(v.getFieldTitle('has.dot.key') === 'DotKey1');
        assert(v.getFieldTitle('has.wild.*.key.*') === 'DotKey2');
        assert(v.getFieldTitle('has.wild.0.key.0') === 'DotKey2');
        assert(v.getFieldTitle('has.wild.0.key.1') === 'DotKey2');
        assert(v.getFieldTitle('has.wild.1.key.2') === 'DotKey2');
        assert(v.getFieldTitle('has.wild.1.key.3') === 'DotKey2');
        assert(v.getFieldTitle('notfound') === 'notfound');
      });
    });


    describe('Validate', () => {
      it('Should be called test when validation', () => {
        const values = {
          username: 'tsuyoshiwada',
          password: 'hogefuga',
          notcall: 'test',
        };

        const pass1 = sinon.stub().returns(false);
        pass1.withArgs(values.username, {}, 'username', values).returns(true);
        pass1.withArgs(values.password, {}, 'password', values).returns(true);

        const pass2 = sinon.stub().returns(false);

        Validator.registerRule('pass1', {}, pass1);
        Validator.registerRule('pass2', {}, pass2);

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

        Validator.registerRule('rule', {}, test);

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

        Validator.registerRule('returnTrue', {}, returnTrue);
        Validator.registerRule('returnFalse', {}, returnFalse);
        Validator.registerRule('rule1', { returnTrue: true }, test1);
        Validator.registerRule('rule2', { returnTrue: true, returnFalse: true }, test2);

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
        inline.withArgs(values.key, {}, 'key', values).returns(true);

        Validator.registerRule('other', {}, other);

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


      it('Should be called normalizer when before validation', () => {
        const values = { k1: 'v1', k2: 'v2' };

        const func1 = sinon.stub().returns(null);
        func1.withArgs(
          values.k1,
          {},
          values.k1,
          values,
          values,
        ).returns('called func1');

        const func2 = sinon.stub().returns(null);
        func2.withArgs('called func1',
          {},
          values.k1,
          { ...values, k1: 'called func1' },
          values,
        ).returns('called func2');

        Validator.registerNormalizer('func1', {}, func1);
        Validator.registerNormalizer('func2', {}, func2);

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
            },
          },
        );

        assert(v.validate());
        assert.deepStrictEqual(v.getValues(), {
          k1: 'called func2',
          k2: 'v2',
        });
      });


      it('Should be called normalizer when after validation', () => {
        const values = { k1: 'v1', k2: 'v2' };

        const func1 = sinon.stub().returns(null);
        func1.withArgs(
          values.k1,
          {},
          values.k1,
          values,
          values,
        ).returns('called func1');

        const func2 = sinon.stub().returns(null);
        func2.withArgs('called func1',
          {},
          values.k1,
          { ...values, k1: 'called func1' },
          values,
        ).returns('called func2');

        Validator.registerNormalizer('func1', {}, func1, false);
        Validator.registerNormalizer('func2', {}, func2, false);

        const v = new Validator(
          values,
          {
            k1: {
              inline: (value: any) => value === values.k1,
            },
          },
          {
            normalizers: {
              k1: { func1: true, func2: true },
            },
          },
        );

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

        Validator.registerNormalizer('example', {}, normalizer, true);

        const v = new Validator(values, {}, {
          normalizers: {
            foo: { example: params },
          },
        });

        assert(v.validate());
        assert(normalizer.callCount === 1);
        assert(v.getValue('foo') === 'called');
      });


      it('Should be called dependent normalizers', () => {
        const n1 = sinon.stub().returns(1);
        const n2 = sinon.stub().returns(2);
        const n3 = sinon.stub().returns(3);
        const n4 = sinon.stub().returns(4);

        Validator.registerNormalizer('n1', {}, n1);
        Validator.registerNormalizer('n2', {}, n2);
        Validator.registerNormalizer('n3', { n1: true }, n3);
        Validator.registerNormalizer('n4', { n1: true, n2: true }, n4);

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

        assert(v.validate());
        assert(n1.callCount === 3);
        assert(n2.callCount === 2);
        assert(n3.callCount === 1);
        assert(n4.callCount === 1);
      });
    });


    describe('Asynchronous validation', () => {
      it('Should be return resolve (success)', (done) => {
        const values = { key: 'value' };
        const v = new Validator(values, {
          key: {
            returnPromise: () => sleep(200),
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
            assert(false);
            done();
          });

        assert(v.isValidating());
        clock.tick(100);

        assert(v.isValidating());
        clock.tick(100);
      });


      it('Should be return reject (failure)', (done) => {
        const values = { key: 'value' };
        const test = () => sleep(200).then(() => Promise.reject('Error!!'));
        const v = new Validator(values, {
          key: { test },
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
                { rule: 'test', message: 'Error!!', params: test },
              ],
            });
            done();
          });

        assert(v.isValidating());
        clock.tick(200);
      });


      it('Should be called sync and async test (success)', (done) => {
        Validator.registerRule('returnFalse', {}, () => false);
        Validator.registerRule('returnTrue', {}, () => true);

        const values = {
          email: 'test@mail.com',
          password: '123456',
        };

        const v = new Validator(values, {
          email: {
            returnTrue: true,
            returnFalse: false,
            login: () => sleep(1000),
          },
          password: {
            returnTrue: true,
            returnFalse: false,
            passFormat: (value: any) => /^\d+$/.test(value),
          },
        });

        v.asyncValidate()
          .then(resultValues => {
            assert(v.isValidating() === false);
            assert.deepStrictEqual(resultValues, values);
            assert.deepStrictEqual(resultValues, v.getValues());
            done();
          })
          .catch(() => {
            assert(false);
            done();
          });

        assert(v.isValidating());
        clock.tick(1000);
      });


      it('Should be called sync and async test (failure)', (done) => {
        const returnFalse = () => false;
        const returnTrue = () => true;

        Validator.registerRule('returnFalse', {}, returnFalse);
        Validator.registerRule('returnTrue', {}, returnTrue);

        const values = {
          email: 'test@mail.com',
          password: '',
        };

        const login = () => sleep(1000).then(() => Promise.reject('Error!!'));
        const passFormat = (value: any) => /^\d+$/.test(value);

        const v = new Validator(values, {
          email: {
            returnTrue: true,
            returnFalse: true,
            login,
          },
          password: {
            returnTrue: true,
            returnFalse: true,
            passFormat,
          },
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
              email: [
                { rule: 'returnFalse', message: 'The email field is invalid.', params: true },
                { rule: 'login', message: 'Error!!', params: login },
              ],
              password: [
                { rule: 'returnFalse', message: 'The password field is invalid.', params: true },
                { rule: 'passFormat', message: 'The password field is invalid.', params: passFormat },
              ],
            });
            done();
          });

        clock.tick(1100);
      });
    });


    describe('Custom error message', () => {
      const returnFalse = () => false;
      const returnTrue = () => true;
      const values = { k1: 'v1', k2: 'v2' };

      beforeEach(() => {
        Validator.registerRule('returnFalse', {}, returnFalse);
        Validator.registerRule('returnTrue', {}, returnTrue);
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
            fields: {
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
        Validator.registerRule('asyncError', {}, () => sleep(200).then(() => Promise.reject(null)));
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

        clock.tick(200);
      });


      it('Should be return custom error message from inline async test', (done) => {
        const inline = () => sleep(100).then(() => Promise.reject('Inline async rule'));
        const v = new Validator(values, {
          k1: { inline },
        });

        v.asyncValidate()
          .then(() => {
            assert(false);
            done();
          })
          .catch(errors => {
            assert.deepStrictEqual(errors, {
              k1: [
                { rule: 'inline', message: 'Inline async rule', params: inline },
              ],
            });
            done();
          });

        clock.tick(100);
      });
    });


    describe('Implicit flag', () => {
      it('Should not be called if null or key does not exist', () => {
        const implicit = sinon.stub().returns(false);
        const nonImplicit = sinon.stub().returns(false);

        Validator.registerRule('implicit', {}, implicit, true);
        Validator.registerRule('nonImplicit', {}, nonImplicit, false);

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

        Validator.registerRule('ok', {}, (value: any) => value === 'ok', false);
        Validator.registerRule('num', {}, isNumber, false);
        Validator.registerRule('str', {}, isString, false);
        Validator.registerRule('resolve100', {}, () => sleep(100), false);
        Validator.registerRule('reject100', {}, () => sleep(100).then(() => Promise.reject(null)), false);
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
          'data.users.*.username': { resolve100: true },
          'data.users.*.followers.*': { reject100: true },
        });

        v.asyncValidate()
          .then(() => {
            assert(false);
            done();
          })
          .catch(errors => {
            assert.deepStrictEqual(errors, {
              code: [
                { rule: 'ok', params: true, message: 'The code field is invalid.' },
              ],
              'data.users.0.followers.0': [
                { rule: 'reject100', params: true, message: 'The data.users.0.followers.0 field is invalid.' },
              ],
              'data.users.0.followers.1': [
                { rule: 'reject100', params: true, message: 'The data.users.0.followers.1 field is invalid.' },
              ],
              'data.users.1.followers.0': [
                { rule: 'reject100', params: true, message: 'The data.users.1.followers.0 field is invalid.' },
              ],
              'data.users.2.followers.0': [
                { rule: 'reject100', params: true, message: 'The data.users.2.followers.0 field is invalid.' },
              ],
              'data.users.2.followers.1': [
                { rule: 'reject100', params: true, message: 'The data.users.2.followers.1 field is invalid.' },
              ],
            });
            done();
          });

        clock.tick(100);
      });


      it('Should be called normalizer', () => {
        const toInt = (value: any) => parseInt(value);

        Validator.registerNormalizer('nb', {}, toInt, true);
        Validator.registerNormalizer('na', {}, toInt, false);

        const v = new Validator(getValues(), {
          'data.users.*.profile.age': { num: true },
        }, {
          normalizers: {
            'data.users.*.profile.age': { nb: true },
            'data.users.*.followers.*': { na: true },
          },
        });

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
    });
  });


  it.only('', () => {
    const YOUR_SECRET_TOKEN = '987654321';

    const data = {
      firstName: null,
      lastName: 'wada',
      age: 18,
      email: 'email-address',
      website: 'foobarbaz',
      confirmed: null,
      token: '123456789',
      projects: [
        { title: 'Project 1', tags: [1] },
        { title: 'Project 2', tags: [4, 8] },
        { title: 'Project 3', tags: ['foo', 'bar', 3] },
      ],
    };

    const v = new Validator(data, {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      age: {
        required: true,
        min: { min: 22 },
      },
      email: {
        required: true,
        email: true,
      },
      website: {
        url: true,
      },
      confirmed: {
        required: true,
        truthy: true,
      },
      token: {
        checkToken: (value) => value === YOUR_SECRET_TOKEN,
      },
      'projects.*.tags.*': {
        numeric: true,
      },
    });

    v.validate();

    console.log(v.getAllErrors());
  });
});
