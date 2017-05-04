import isEqual = require('lodash.isequal');
import Validator, { NormalizeParams } from './validator';
import { hasProp } from './internal/utils';

export interface NormalizeTest {
  value: any;
  expect: any;
  params?: NormalizeParams;
}

const createNormalizeTester = (assert: any, normalizer: string) => ((tests: NormalizeTest[]) => {
  tests.forEach(test => {
    const params = hasProp(test, 'params') ? <NormalizeParams>test.params : true;
    const v = new Validator({
      key: test.value,
    }, {}, {
      normalizers: {
        key: { [normalizer]: params },
      },
    });

    let prettyParams = '';

    try {
      prettyParams = JSON.stringify(params);
    } catch (e) {
      prettyParams = `${params}`;
    }

    v.validate();

    const result = v.getValue('key');
    assert(isEqual(result, test.expect), `'${normalizer}' ${test.value} = ${test.expect} (${prettyParams}), result = ${result}`);
  });
});

export default createNormalizeTester;
