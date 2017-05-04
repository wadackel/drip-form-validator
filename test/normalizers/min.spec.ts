import * as assert from 'power-assert';
import { createNormalizeTester } from '../../src/';

const normalizer = 'min';
const tester = createNormalizeTester(assert, normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: null, params: { min: 5 }, expect: null },
      { value: undefined, params: { min: 5 }, expect: undefined },
      { value: NaN, params: { min: 5 }, expect: NaN },
      { value: 'foo', params: { min: 5 }, expect: NaN },
      { value: 0, params: { min: 5 }, expect: 5 },
      { value: 10, params: { min: 5 }, expect: 10 },
      { value: '3', params: { min: 5 }, expect: 5 },
      { value: '10', params: { min: 5 }, expect: 10 },
      { value: 0.14, params: { min: 0.5 }, expect: 0.5 },
    ]);
  });
});
