import createRuleTester from './createRuleTester';

const ruleName = 'before';
const tester = createRuleTester(ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: new Date('2017-01-01 10:10:10'), params: new Date('2017-01-02 00:00:00') },
      { value: '2017-01-01 10:10:10', params: '2017-02-01 00:00:00' },
      { value: Date.now(), params: Date.now() + 1 },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: undefined, params: new Date('2017-01-02 00:00:00') },
      { value: true, params: new Date('2017-01-02 00:00:00') },
      { value: false, params: new Date('2017-01-02 00:00:00') },
      { value: [], params: new Date('2017-01-02 00:00:00') },
      { value: {}, params: new Date('2017-01-02 00:00:00') },
      { value: new Date('2017-01-01 10:10:10'), params: new Date('2017-01-01 00:00:00') },
      { value: '2017-01-01 10:10:10', params: '2017-01-01 00:00:00' },
      { value: Date.now() + 100, params: Date.now() },
      { value: Date.now() + 100, params: new Date() },
      { value: Date.now() - 100, params: null },
    ]);
  });
});
