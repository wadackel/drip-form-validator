import createRuleTester from './createRuleTester';

const ruleName = 'number';
const tester = createRuleTester(ruleName);

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
