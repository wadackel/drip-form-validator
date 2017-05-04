import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'min';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 1, params: { min: 0 } },
      { value: 10, params: { min: 10 } },
      { value: 'abcde', params: { min: 5 } },
      { value: 'こんにちは', params: { min: 5 } },
      { value: [1, 2, 3], params: { min: 3 } },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: true, params: { min: 10 } },
      { value: false, params: { min: 10 } },
      { value: undefined, params: { min: 10 } },
      { value: NaN, params: { min: 10 } },
      { value: 1, params: { min: 2 } },
      { value: 10, params: { min: 11 } },
      { value: 'abcde', params: { min: 6 } },
      { value: 'こんにちは', params: { min: 6 } },
      { value: [1, 2, 3], params: { min: 4 } },
    ]);
  });
});
