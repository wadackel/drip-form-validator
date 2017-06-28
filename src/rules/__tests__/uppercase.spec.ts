import createRuleTester from './createRuleTester';

const ruleName = 'uppercase';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 'UPPER' },
      { value: 'UPPER123' },
      { value: 'TEST_CASE' },
      { value: 'FOO-BAR' },
      { value: 'FOO BAR' },
      { value: '日本語 FOO BAR' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 0 },
      { value: NaN },
      { value: false },
      { value: true },
      { value: 'lower' },
      { value: 'this is lower' },
      { value: 'CamelCase' },
      { value: 'A_b_c' },
      { value: 'Paragraph text' },
      { value: {} },
      { value: [] },
    ]);
  });
});
