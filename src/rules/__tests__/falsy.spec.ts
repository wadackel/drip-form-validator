import createRuleTester from './createRuleTester';

const ruleName = 'falsy';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: false },
      { value: 0 },
      { value: 'NO' },
      { value: 'No' },
      { value: 'no' },
      { value: 'false' },
      { value: '0' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 1 },
      { value: 10 },
      { value: true },
      { value: '' },
      { value: 'str' },
      { value: new Date() },
      { value: {} },
      { value: [] },
    ]);
  });
});
