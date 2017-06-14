import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'max';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 0, params: 1 },
      { value: 10, params: 10 },
      { value: 5.5, params: 5.5 },
      { value: '10', params: 10 },
      { value: '5.5', params: 5.5 },
      { value: '-100', params: -100 },
      { value: 'abcde', params: 5 },
      { value: 'abcde', params: 6 },
      { value: 'こんにちは', params: 5 },
      { value: [1, 2, 3], params: 5 },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: true, params: 1 },
      { value: false, params: 1 },
      { value: undefined, params: 1 },
      { value: NaN, params: 1 },
      { value: 10, params: 9 },
      { value: '2', params: 1 },
      { value: '10', params: 9 },
      { value: '5.5', params: 5.4 },
      { value: 'abcde', params: 4 },
      { value: 'こんにちは', params: 4 },
      { value: [1, 2, 3], params: 2 },
    ]);
  });
});
