import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'format';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 10110, params: { regex: /^\d+$/ } },
      { value: 'CONSTANCE_CASE', params: { regex: /^[A-Z_]+$/ } },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined, params: { regex: /\s\S*/ } },
      { value: true, params: { regex: /\s\S*/ } },
      { value: false, params: { regex: /\s\S*/ } },
      { value: [], params: { regex: /\s\S*/ } },
      { value: {}, params: { regex: /\s\S*/ } },
      { value: '', params: { regex: /^.+$/ } },
      { value: 'CONSTANCE_CASE', params: { regex: /^[A-Z]+$/ } },
      { value: 'foo', params: { regex: /^bar$/ } },
    ]);
  });
});
