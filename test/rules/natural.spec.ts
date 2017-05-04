import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'natural';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 0 },
      { value: 1 },
      { value: 10 },
      { value: 2e64 },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: false },
      { value: '' },
      { value: '0' },
      { value: '1' },
      { value: 'abc' },
      { value: 0, params: { disallowZero: true } },
      { value: -1 },
      { value: 1.2 },
      { value: -1.2 },
      { value: NaN },
      { value: Infinity },
      { value: -Infinity },
      { value: {} },
      { value: [] },
    ]);
  });
});
