import { Validator } from '../../';

const ruleName = 'different';

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    const v = new Validator({ k1: 'v1', k2: 'v2' }, { k1: { [ruleName]: 'k2' } });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: [1, 2], k2: [2, 1] });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: { k: 'v' }, k2: { k: 'vv' } });
    expect(v.validate()).toBe(true);

    v.setValues({ k2: '' });
    expect(v.validate()).toBe(true);
  });

  it('Should be return false', () => {
    const v = new Validator({ k1: 'v1', k2: 'v1' }, { k1: { [ruleName]: 'k2' } });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: '' });
    expect(v.validate()).toBe(false);
  });
});
