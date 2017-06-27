import createNormalizeTester from './createNormalizeTester';

const normalizer = 'between';
const tester = createNormalizeTester(normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: null, params: { min: 5, max: 10 }, expect: null },
      { value: undefined, params: { min: 5, max: 10 }, expect: undefined },
      { value: 'foo', params: { min: 5, max: 10 }, expect: 'foo' },
      { value: 0, params: { min: 5, max: 10 }, expect: 5 },
      { value: 16, params: { min: 5, max: 10 }, expect: 10 },
      { value: '51.23', params: { min: 23, max: 40.5 }, expect: 40.5 },
      { value: '51.23', params: { min: 23, max: 55 }, expect: 51.23 },
    ]);
  });
});
