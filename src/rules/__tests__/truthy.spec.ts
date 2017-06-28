import createRuleTester from './createRuleTester';

const ruleName = 'truthy';
const tester = createRuleTester(ruleName);

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
