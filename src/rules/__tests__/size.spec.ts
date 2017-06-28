import createRuleTester from './createRuleTester';

const ruleName = 'size';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 1, params: 1 },
      { value: 10, params: 10 },
      { value: 'abcde', params: 5 },
      { value: 'こんにちは', params: 5 },
      { value: [1, 2, 3], params: 3 },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: true, params: 4 },
      { value: false, params: 5 },
      { value: undefined, params: 9 },
      { value: NaN, params: 3 },
      { value: 1, params: 0 },
      { value: 10, params: 9 },
      { value: 'abcde', params: 6 },
      { value: 'こんにちは', params: 4 },
      { value: [1, 2, 3], params: 2 },
    ]);
  });
});
