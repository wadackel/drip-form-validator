import createNormalizeTester from './createNormalizeTester';

const normalizer = 'toBoolean';
const tester = createNormalizeTester(normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: 1, params: true, expect: true },
      { value: 10, params: true, expect: true },
      { value: '1', params: true, expect: true },
      { value: 'true', params: true, expect: true },
      { value: 'abc', params: true, expect: true },
      { value: new Date(), params: true, expect: true },
      { value: 0, params: true, expect: false },
      { value: null, params: true, expect: false },
      { value: undefined, params: true, expect: false },
      { value: 'false', params: true, expect: false },
      { value: '', params: true, expect: false },
      { value: '0', params: true, expect: false },
    ]);
  });
});
