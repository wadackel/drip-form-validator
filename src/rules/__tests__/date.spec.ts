import createRuleTester from './createRuleTester';

const ruleName = 'date';
const tester = createRuleTester(ruleName);

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
