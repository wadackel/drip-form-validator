import * as assert from 'power-assert';
import { Validator } from '../../src/';

const ruleName = 'betweenWith';

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    const v = new Validator({
      k1: 10,
      k2: 10,
      k3: 10,
    }, {
      k1: { betweenWith: { min: 'k2', max: 'k3' } },
    });
    assert(v.validate());

    v.setValues({ k1: 2, k2: 1, k3: 3 });
    assert(v.validate());

    v.setValues({ k1: -5, k2: -5, k3: -2 });
    assert(v.validate());

    v.setValues({ k1: '5', k2: 4, k3: 5 });
    assert(v.validate());

    v.setValues({ k1: '0.2', k2: 0, k3: 1 });
    assert(v.validate());

    v.setValues({ k1: '0.2', k2: '0', k3: '1' });
    assert(v.validate());

    v.setValues({ k1: 'string', k2: 5, k3: 6 });
    assert(v.validate());

    v.setValues({ k1: 'string', k2: '5', k3: '6' });
    assert(v.validate());

    v.setValues({ k1: [0, 1], k2: 1, k3: 3 });
    assert(v.validate());

    v.setValues({ k1: [], k2: 0, k3: 1 });
    assert(v.validate());
  });

  it('Should be return false', () => {
    const v = new Validator({
      k1: 10,
    }, {
      k1: { betweenWith: { min: 'k2', max: 'k3' } },
    });
    assert(v.validate() === false);

    v.setValues({ k1: undefined, k2: 1, k3: 2 });
    assert(v.validate() === false);

    v.setValues({ k1: true, k2: 1, k3: 2 });
    assert(v.validate() === false);

    v.setValues({ k1: false, k2: 1, k3: 2 });
    assert(v.validate() === false);

    v.setValues({ k1: 0, k2: 1, k3: 2 });
    assert(v.validate() === false);

    v.setValues({ k1: 3, k2: 1, k3: 2 });
    assert(v.validate() === false);

    v.setValues({ k1: '3', k2: '1', k3: '2' });
    assert(v.validate() === false);

    v.setValues({ k1: 'string', k2: 1, k3: 2 });
    assert(v.validate() === false);

    v.setValues({ k1: 'string', k2: '1', k3: '2' });
    assert(v.validate() === false);

    v.setValues({ k1: [], k2: 1, k3: 2 });
    assert(v.validate() === false);
  });
});
