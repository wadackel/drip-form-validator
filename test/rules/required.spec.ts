import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'required';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: -3 },
      { value: -3.2 },
      { value: 0 },
      { value: 0.0 },
      { value: 3 },
      { value: 10.6 },
      { value: true },
      { value: 'str' },
      { value: new Date() },
      { value: { key: 'value' } },
      { value: ['foo', 'bar'] },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: false },
      { value: '' },
      { value: {} },
      { value: [] },
    ]);
  });
});
