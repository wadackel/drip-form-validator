import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'lowercase';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 'lower' },
      { value: 'lower123' },
      { value: 'test_case' },
      { value: 'foo-bar' },
      { value: 'foo bar' },
      { value: '日本語 foo bar' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 0 },
      { value: NaN },
      { value: false },
      { value: true },
      { value: 'Uppercase' },
      { value: 'Camel case' },
      { value: 'CONSTANT' },
      { value: 'A_b_c' },
      { value: 'Paragraph text' },
      { value: {} },
      { value: [] },
    ]);
  });
});
