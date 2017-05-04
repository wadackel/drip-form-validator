import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'date';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: new Date() },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 0 },
      { value: '' },
      { value: {} },
    ]);
  });
});
