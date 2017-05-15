import * as assert from 'power-assert';
import { createNormalizeTester } from '../../src/';

const normalizer = 'numberWithCommas';
const tester = createNormalizeTester(assert, normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: null, params: true, expect: null },
      { value: undefined, params: true, expect: undefined },
      { value: NaN, params: true, expect: NaN },
      { value: 'foo', params: true, expect: 'foo' },
      { value: 0, params: true, expect: '0' },
      { value: 1234, params: true, expect: '1,234' },
      { value: 123456789, params: true, expect: '123,456,789' },
      { value: '1000', params: true, expect: '1,000' },
      { value: '1000000', params: true, expect: '1,000,000' },
      { value: '1000000.0011', params: true, expect: '1,000,000.0011' },
      { value: '1,000,000', params: true, expect: '1,000,000' },
      { value: '1,2,3,4,5,678', params: true, expect: '12,345,678' },
      { value: '1,2,3,4,5,678.01234', params: true, expect: '12,345,678.01234' },
    ]);
  });
});
