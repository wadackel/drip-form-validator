import createRuleTester from './createRuleTester';

const ruleName = 'format';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 10110, params: /^\d+$/ },
      { value: 'CONSTANCE_CASE', params: /^[A-Z_]+$/ },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined, params: /\s\S*/ },
      { value: true, params: /\s\S*/ },
      { value: false, params: /\s\S*/ },
      { value: [], params: /\s\S*/ },
      { value: {}, params: /\s\S*/ },
      { value: '', params: /^.+$/ },
      { value: 'CONSTANCE_CASE', params: /^[A-Z]+$/ },
      { value: 'foo', params: /^bar$/ },
    ]);
  });
});
