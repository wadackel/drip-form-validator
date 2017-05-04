import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'alphaNumeric';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 'abcdef' },
      { value: 'ABCDEF' },
      { value: '00' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 0 },
      { value: '' },
      { value: 'paragraph paragraph' },
      { value: 'Hello!' },
      { value: 'in-dash' },
      { value: 'in_underscore' },
      { value: '@test' },
      { value: 'こんにちは' },
      { value: {} },
      { value: [] },
    ]);
  });
});
