import * as assert from 'power-assert';
import { createNormalizeTester } from '../../src/';

const normalizer = 'toString';
const tester = createNormalizeTester(assert, normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    class Foo { toString() { return 'This is Foo'; } }

    tester([
      { value: null, params: true, expect: '' },
      { value: undefined, params: true, expect: '' },
      { value: NaN, params: true, expect: '' },
      { value: 0, params: true, expect: '0' },
      { value: 10.02, params: true, expect: '10.02' },
      { value: Infinity, params: true, expect: 'Infinity' },
      { value: 'foo', params: true, expect: 'foo' },
      { value: new Foo(), params: true, expect: 'This is Foo' },
    ]);
  });
});
