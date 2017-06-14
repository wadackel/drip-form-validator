import * as assert from 'power-assert';
import { Validator } from '../../src/';

const ruleName = 'same';

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    const v = new Validator({ k1: 'v1', k2: 'v1' }, { k1: { [ruleName]: 'k2' } });
    assert(v.validate());

    v.setValues({ k2: '' });
    assert(v.validate());
  });

  it('Should be return false', () => {
    const v = new Validator({ k1: 'v1', k2: 'v2' }, { k1: { [ruleName]: 'k2' } });
    assert(v.validate() === false);

    v.setValues({ k1: [1, 2], k2: [2, 1] });
    assert(v.validate() === false);

    v.setValues({ k1: { k: 'v' }, k2: { k: 'vv' } });
    assert(v.validate() === false);

    v.setValues({ k1: '' });
    assert(v.validate() === false);
  });
});
