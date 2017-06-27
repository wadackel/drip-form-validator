import createRuleTester from './createRuleTester';

const ruleName = 'between';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: 10, params: { min: 10, max: 10 } },
      { value: 2, params: { min: 1, max: 3 } },
      { value: -5, params: { min: -5, max: -2 } },
      { value: '5', params: { min: 4, max: 5 } },
      { value: '0.2', params: { min: 0, max: 1 } },
      { value: '1234567890', params: { min: 1234567890, max: 1234567890 } },
      { value: 'hoge', params: { min: 4, max: 4 } },
      { value: '日本語', params: { min: 3, max: 3 } },
      { value: [1, 2, 3], params: { min: 3, max: 3 } },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined, params: { min: 0, max: 0 } },
      { value: true, params: { min: 0, max: 0 } },
      { value: false, params: { min: 0, max: 0 } },
      { value: new Date(), params: { min: 0, max: 0 } },
      { value: '', params: { min: 1, max: 10 } },
      { value: 10, params: { min: 11, max: 11 } },
      { value: 3, params: { min: 1, max: 2 } },
      { value: '3', params: { min: 4, max: 5 } },
      { value: '1234567890', params: { min: 0, max: 1234567889 } },
      { value: 'foo', params: { min: 4, max: 30 } },
      { value: [1, 2, 3], params: { min: 4, max: 6 } },
      { value: [1, 2, 3], params: { min: 1, max: 2 } },
    ]);
  });
});
