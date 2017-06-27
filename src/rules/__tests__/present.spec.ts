import { Validator } from '../../';
import createRuleTester from './createRuleTester';

const ruleName = 'present';
const tester = createRuleTester(ruleName, false);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: true },
      { value: false },
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: '' },
      { value: {} },
      { value: [] },
    ]);
  });

  it('Should be return false', () => {
    const v = new Validator({}, { key: { [ruleName]: true } });
    expect(v.validate()).toBe(false);
  });
});
