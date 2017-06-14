import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'equals';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: true, params: true },
      { value: false, params: false },
      { value: 'foo', params: 'foo' },
      { value: 123, params: 123 },
      { value: 10.91, params: 10.91 },
      { value: ['foo', 'bar'], params: ['foo', 'bar'] },
      { value: { k: 'v', n: { i: 'j' } }, params: { k: 'v', n: { i: 'j' } } },
      { value: new Date('2017-01-01 00:00:00'), params: new Date('2017-01-01 00:00:00') },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined, params: null },
      { value: 'hoge', params: 'fuga' },
      { value: 821, params: '821' },
      { value: 21, params: 12 },
      { value: 10.91, params: '10.91' },
      { value: 10.91, params: 0.22 },
      { value: ['foo', 'bar'], params: ['bar', 'bar'] },
      { value: { k: 'v' }, params: { k: 'k' } },
      { value: new Date('2017-01-02 00:00:00'), params: new Date('2017-01-01 00:00:00') },
    ]);
  });
});
