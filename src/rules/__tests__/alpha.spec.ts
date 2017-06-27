import createRuleTester from './createRuleTester';

const ruleName = 'alpha';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 'abcdef' },
      { value: 'ABCDEF' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 0 },
      { value: '' },
      { value: 'paragraph paragraph' },
      { value: 'Hello!' },
      { value: 'in-dash' },
      { value: 'in_underscore' },
      { value: '@test' },
      { value: '00' },
      { value: 'こんにちは' },
      { value: {} },
      { value: [] },
    ]);
  });
});
