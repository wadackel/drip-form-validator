import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'array';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: [] },
      { value: ['test'] },
      { value: [{ key: 'value' }] },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 0 },
      { value: '' },
      { value: {} },
      { value: new Date() },
    ]);
  });
});
