import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'size';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 1, params: { value: 1 } },
      { value: 10, params: { value: 10 } },
      { value: 'abcde', params: { value: 5 } },
      { value: 'こんにちは', params: { value: 5 } },
      { value: [1, 2, 3], params: { value: 3 } },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: true, params: { value: 4 } },
      { value: false, params: { value: 5 } },
      { value: undefined, params: { value: 9 } },
      { value: NaN, params: { value: 3 } },
      { value: 1, params: { value: 0 } },
      { value: 10, params: { value: 9 } },
      { value: 'abcde', params: { value: 6 } },
      { value: 'こんにちは', params: { value: 4 } },
      { value: [1, 2, 3], params: { value: 2 } },
    ]);
  });
});
