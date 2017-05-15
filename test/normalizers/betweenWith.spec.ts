import * as assert from 'power-assert';
import { Validator } from '../../src/';

const normalizer = 'betweenWith';

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    const v = new Validator();

    v.setValues({ k1: 10, k2: 20, k3: 30 });
    v.setNormalizers({ k1: { [normalizer]: { min: 'k2', max: 'k3' } } });
    v.normalize();
    assert(v.getValue('k1') === 20);

    v.setValues({ k1: 20, k2: 5, k3: 15 });
    v.normalize();
    assert(v.getValue('k1') === 15);

    v.setValues({ k1: 15, k2: 10, k3: 20 });
    v.normalize();
    assert(v.getValue('k1') === 15);

    v.setValues({ k1: '15', k2: '10', k3: '20' });
    v.normalize();
    assert(v.getValue('k1') === 15);

    v.setValues({ k1: '15', k2: 'foo', k3: '20' });
    v.normalize();
    assert(v.getValue('k1') === '15');

    v.setValues({ k1: '15', k2: 20, k3: 'foo' });
    v.normalize();
    assert(v.getValue('k1') === '15');

    v.setValues({ k1: 'foo' });
    v.normalize();
    assert(v.getValue('k1') === 'foo');

    v.setValues({ k1: 'foo' });
    v.normalize();
    assert(v.getValue('k1') === 'foo');
  });
});
