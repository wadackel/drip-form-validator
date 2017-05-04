import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'float';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 0.1 },
      { value: 10.20 },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: NaN },
      { value: 0 },
      { value: 10 },
      { value: '' },
      { value: {} },
    ]);
  });
});
