import * as assert from 'power-assert';
import { createNormalizeTester } from '../../src/';

const normalizer = 'lowercase';
const tester = createNormalizeTester(assert, normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    tester([
      { value: null, params: true, expect: '' },
      { value: undefined, params: true, expect: '' },
      { value: NaN, params: true, expect: '' },
      { value: 0, params: true, expect: '0' },
      { value: 5, params: true, expect: '5' },
      { value: 'foobar', params: true, expect: 'foobar' },
      { value: 'FOO', params: true, expect: 'foo' },
      { value: 'Abc Def', params: true, expect: 'abc def' },
      { value: 'HoGE こんにちは FugA', params: true, expect: 'hoge こんにちは fuga' },
    ]);
  });
});
