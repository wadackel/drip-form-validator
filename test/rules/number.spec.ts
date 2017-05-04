import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'number';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 0 },
      { value: 5 },
      { value: 10.2 },
      { value: NaN },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: '' },
      { value: {} },
    ]);
  });
});
