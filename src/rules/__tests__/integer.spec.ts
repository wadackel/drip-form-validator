import createRuleTester from './createRuleTester';

const ruleName = 'integer';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 0 },
      { value: 10 },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: NaN },
      { value: 0.2 },
      { value: 10.9 },
      { value: '' },
      { value: {} },
    ]);
  });
});
