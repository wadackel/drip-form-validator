import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'numeric';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: -31 },
      { value: 0 },
      { value: 10 },
      { value: 40.2 },
      { value: '0' },
      { value: '+5' },
      { value: '+5.9' },
      { value: '-5' },
      { value: '-5.9' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: NaN },
      { value: undefined },
      { value: '' },
      { value: {} },
      { value: [] },
    ]);
  });
});
