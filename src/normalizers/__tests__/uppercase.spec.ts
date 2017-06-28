import createNormalizeTester from './createNormalizeTester';

const normalizer = 'uppercase';
const tester = createNormalizeTester(normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: null, params: true, expect: '' },
      { value: undefined, params: true, expect: '' },
      { value: NaN, params: true, expect: '' },
      { value: 0, params: true, expect: '0' },
      { value: 5, params: true, expect: '5' },
      { value: 'foo', params: true, expect: 'FOO' },
      { value: 'Abc Def', params: true, expect: 'ABC DEF' },
      { value: 'hoge こんにちは fuga', params: true, expect: 'HOGE こんにちは FUGA' },
    ]);
  });
});
