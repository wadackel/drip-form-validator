import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'max';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 0, params: { max: 1 } },
      { value: 10, params: { max: 10 } },
      { value: 5.5, params: { max: 5.5 } },
      { value: '10', params: { max: 10 } },
      { value: '5.5', params: { max: 5.5 } },
      { value: '-100', params: { max: -100 } },
      { value: 'abcde', params: { max: 5 } },
      { value: 'abcde', params: { max: 6 } },
      { value: 'こんにちは', params: { max: 5 } },
      { value: [1, 2, 3], params: { max: 3 } },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: true, params: { max: 1 } },
      { value: false, params: { max: 1 } },
      { value: undefined, params: { max: 1 } },
      { value: NaN, params: { max: 1 } },
      { value: 10, params: { max: 9 } },
      { value: '2', params: { max: 1 } },
      { value: '10', params: { max: 9 } },
      { value: '5.5', params: { max: 5.4 } },
      { value: 'abcde', params: { max: 4 } },
      { value: 'こんにちは', params: { max: 4 } },
      { value: [1, 2, 3], params: { max: 2 } },
    ]);
  });
});
