import * as assert from 'power-assert';
import { createNormalizeTester } from '../../src/';

const normalizer = 'toInt';
const tester = createNormalizeTester(assert, normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: null, params: true, expect: null },
      { value: undefined, params: true, expect: undefined },
      { value: 0, params: true, expect: 0 },
      { value: 10.02, params: true, expect: 10.02 },
      { value: '3', params: true, expect: 3 },
      { value: '3.3', params: true, expect: 3 },
      { value: 'ff', params: { radix: 16 }, expect: 255 },
      { value: 'foo', params: true, expect: NaN },
    ]);
  });
});
