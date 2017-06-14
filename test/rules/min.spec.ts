import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'min';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 1, params: 0 },
      { value: 10, params: 10 },
      { value: -10, params: -10 },
      { value: '9', params: 9 },
      { value: '0.2', params: 0.2 },
      { value: '-0.2', params: -0.2 },
      { value: 'abcde', params: 5 },
      { value: 'こんにちは', params: 5 },
      { value: [1, 2, 3], params: 3 },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: true, params: 10 },
      { value: false, params: 10 },
      { value: undefined, params: 10 },
      { value: NaN, params: 10 },
      { value: 1, params: 2 },
      { value: 10, params: 11 },
      { value: -2, params: -1 },
      { value: '-2', params: -1 },
      { value: '0.8', params: 0.9 },
      { value: 'abcde', params: 6 },
      { value: 'こんにちは', params: 6 },
      { value: [1, 2, 3], params: 4 },
    ]);
  });
});
