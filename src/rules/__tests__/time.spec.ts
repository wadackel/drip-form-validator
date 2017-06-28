import createRuleTester from './createRuleTester';

const ruleName = 'time';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: '10:02:59' },
      { value: '02:01:33' },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: new Date() },
      { value: '2017-03-15 10:02:51' },
      { value: '2017-03-15' },
      { value: '9:4:2' },
      { value: '60:60:10' },
    ]);
  });
});
