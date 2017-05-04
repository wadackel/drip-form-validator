import * as assert from 'power-assert';
import { createNormalizeTester } from '../../src/';

const normalizer = 'max';
const tester = createNormalizeTester(assert, normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: null, params: { max: 5 }, expect: null },
      { value: undefined, params: { max: 5 }, expect: undefined },
      { value: NaN, params: { max: 5 }, expect: NaN },
      { value: 'foo', params: { max: 5 }, expect: NaN },
      { value: 10, params: { max: 5 }, expect: 5 },
      { value: 4, params: { max: 5 }, expect: 4 },
      { value: '6', params: { max: 5 }, expect: 5 },
      { value: '2', params: { max: 5 }, expect: 2 },
      { value: 0.6, params: { max: 0.5 }, expect: 0.5 },
    ]);
  });
});
