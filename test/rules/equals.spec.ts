import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'equals';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: true, params: { value: true } },
      { value: false, params: { value: false } },
      { value: 'foo', params: { value: 'foo' } },
      { value: 123, params: { value: 123 } },
      { value: 10.91, params: { value: 10.91 } },
      { value: ['foo', 'bar'], params: { value: ['foo', 'bar'] } },
      { value: { k: 'v', n: { i: 'j' } }, params: { value: { k: 'v', n: { i: 'j' } } } },
      { value: new Date('2017-01-01 00:00:00'), params: { value: new Date('2017-01-01 00:00:00') } },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined, params: { value: null } },
      { value: 'hoge', params: { value: 'fuga' } },
      { value: 821, params: { value: '821' } },
      { value: 21, params: { value: 12 } },
      { value: 10.91, params: { value: '10.91' } },
      { value: 10.91, params: { value: 0.22 } },
      { value: ['foo', 'bar'], params: { value: ['bar', 'bar'] } },
      { value: { k: 'v' }, params: { value: { k: 'k' } } },
      { value: new Date('2017-01-02 00:00:00'), params: { value: new Date('2017-01-01 00:00:00') } },
    ]);
  });
});
