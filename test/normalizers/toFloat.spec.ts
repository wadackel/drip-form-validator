import * as assert from 'power-assert';
import { createNormalizeTester } from '../../src/';

const normalizer = 'toFloat';
const tester = createNormalizeTester(assert, normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: null, params: true, expect: null },
      { value: undefined, params: true, expect: undefined },
      { value: 0, params: true, expect: 0 },
      { value: 10, params: true, expect: 10 },
      { value: 10.11, params: true, expect: 10.11 },
      { value: '10.11', params: true, expect: 10.11 },
      { value: '10.00', params: true, expect: 10.0 },
      { value: '+10.00', params: true, expect: 10.0 },
      { value: '-0.29', params: true, expect: -0.29 },
      { value: Infinity, params: true, expect: Infinity },
      { value: NaN, params: true, expect: NaN },
    ]);
  });
});
