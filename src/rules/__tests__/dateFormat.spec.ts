import createRuleTester from './createRuleTester';

const ruleName = 'dateFormat';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: '2017-03-15 10:02:51', params: 'YYYY-MM-DD HH:mm:ss' },
      { value: '2017-03-15', params: 'YYYY-MM-DD' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: new Date(), params: 'YYYY-MM-DD HH:mm:ss' },
      { value: '2017-03-15', params: 'YYYY-MM-DD HH:mm:ss' },
      { value: '10:02:59', params: 'HH:mm:ss' },
    ]);
  });
});
