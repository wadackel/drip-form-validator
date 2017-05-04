import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'truthy';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: true },
      { value: 'true' },
      { value: 'YES' },
      { value: 'Yes' },
      { value: 1 },
      { value: '1' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 0 },
      { value: false },
      { value: 'false' },
      { value: '' },
      { value: '0' },
      { value: {} },
      { value: [] },
    ]);
  });
});
