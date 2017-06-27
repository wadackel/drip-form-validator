import { Validator } from '../../';
import { hasProp } from '../../internal/utils';

export interface NormalizeTest {
  value: any;
  expect: any;
  params?: any;
}

const createNormalizeTester = (normalizer: string) => ((tests: NormalizeTest[]) => {
  tests.forEach(test => {
    const params = hasProp(test, 'params') ? test.params : true;
    const v = new Validator({
      key: test.value,
    }, {}, {
      normalizers: {
        key: { [normalizer]: params },
      },
    });

    v.normalize();

    expect(v.getValue('key')).toEqual(test.expect);
  });
});

export default createNormalizeTester;
