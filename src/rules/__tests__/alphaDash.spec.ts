import createRuleTester from './createRuleTester';

const ruleName = 'alphaDash';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 'abcdef' },
      { value: 'ABCDEF' },
      { value: 'in-dash' },
      { value: 'in_underscore' },
      { value: '00' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined },
      { value: 0 },
      { value: '' },
      { value: 'paragraph paragraph' },
      { value: 'Hello!' },
      { value: '@test' },
      { value: 'こんにちは' },
      { value: {} },
      { value: [] },
    ]);
  });
});
