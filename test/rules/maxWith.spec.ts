import * as assert from 'power-assert';
import { Validator } from '../../src/';

const ruleName = 'maxWith';

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    const v = new Validator({ k1: 10, k2: 11 }, { k1: { [ruleName]: 'k2' } });
    assert(v.validate());

    v.setValues({ k1: 4, k2: 4 });
    assert(v.validate());

    v.setValues({ k1: 4, k2: '4' });
    assert(v.validate());

    v.setValues({ k1: 10.5, k2: 10.6 });
    assert(v.validate());

    v.setValues({ k1: '101', k2: 101 });
    assert(v.validate());

    v.setValues({ k1: '10.5', k2: 10.6 });
    assert(v.validate());

    v.setValues({ k1: '10.5', k2: '10.6' });
    assert(v.validate());

    v.setValues({ k1: 'str', k2: 3 });
    assert(v.validate());

    v.setValues({ k1: 'string', k2: 6 });
    assert(v.validate());

    v.setValues({ k1: 'number', k2: 7 });
    assert(v.validate());

    v.setValues({ k1: [0, 1], k2: 2 });
    assert(v.validate());

    v.setValues({ k1: [10, 10, 10, 10], k2: 4 });
    assert(v.validate());

    v.setValues({ k1: [10, 10, 10, 10], k2: '4' });
    assert(v.validate());
  });

  it('Should be return false', () => {
    const v = new Validator({ k1: 10 }, { k1: { [ruleName]: 'k2' } });
    assert(v.validate() === false);

    v.setValues({ k1: 'string', k2: null });
    assert(v.validate() === false);

    v.setValues({ k1: 'string', k2: 'str' });
    assert(v.validate() === false);

    v.setValues({ k1: 'str', k2: [0] });
    assert(v.validate() === false);

    v.setValues({ k1: [0, 1, 2], k2: [0, 1] });
    assert(v.validate() === false);

    v.setValues({ k1: 10, k2: 9 });
    assert(v.validate() === false);

    v.setValues({ k1: 10, k2: '9' });
    assert(v.validate() === false);

    v.setValues({ k1: 'str', k2: 2 });
    assert(v.validate() === false);

    v.setValues({ k1: '0.2', k2: 0.1 });
    assert(v.validate() === false);

    v.setValues({ k1: '0.2', k2: '0.1' });
    assert(v.validate() === false);

    v.setValues({ k1: [0, 1, 2], k2: 2 });
    assert(v.validate() === false);

    v.setValues({ k1: [0, 1, 2], k2: '2' });
    assert(v.validate() === false);
  });
});
