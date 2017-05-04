import * as assert from 'power-assert';
import { createRuleTester } from '../../src/';

const ruleName = 'dateFormat';
const tester = createRuleTester(assert, ruleName);

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    tester(true, [
      { value: '2017-03-15 10:02:51', params: { format: 'YYYY-MM-DD HH:mm:ss' } },
      { value: '2017-03-15', params: { format: 'YYYY-MM-DD' } },
    ]);
  });

  it('Should be return false', () => {
    tester(false, [
      { value: new Date(), params: { format: 'YYYY-MM-DD HH:mm:ss' } },
      { value: '2017-03-15', params: { format: 'YYYY-MM-DD HH:mm:ss' } },
      { value: '10:02:59', params: { format: 'HH:mm:ss' } },
    ]);
  });
});
