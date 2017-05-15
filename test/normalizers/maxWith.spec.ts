import * as assert from 'power-assert';
import { Validator } from '../../src/';

const normalizer = 'maxWith';

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    const v = new Validator();

    v.setValues({ k1: 20, k2: 10 });
    v.setNormalizers({ k1: { [normalizer]: { key: 'k2' } } });
    v.normalize();
    assert(v.getValue('k1') === 10);

    v.setValues({ k1: 5, k2: 10 });
    v.normalize();
    assert(v.getValue('k1') === 5);

    v.setValues({ k1: '5', k2: '10' });
    v.normalize();
    assert(v.getValue('k1') === 5);

    v.setValues({ k1: '5', k2: 'foo' });
    v.normalize();
    assert(v.getValue('k1') === '5');

    v.setValues({ k1: 'foo', k2: 10 });
    v.normalize();
    assert(v.getValue('k1') === 'foo');

    v.setValues({ k1: 'foo' });
    v.normalize();
    assert(v.getValue('k1') === 'foo');
  });
});