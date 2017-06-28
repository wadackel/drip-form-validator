import { Validator } from '../../';

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
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 2, k2: 1, k3: 3 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: -5, k2: -5, k3: -2 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: '5', k2: 4, k3: 5 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: '0.2', k2: 0, k3: 1 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: '0.2', k2: '0', k3: '1' });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 'string', k2: 5, k3: 6 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 'string', k2: '5', k3: '6' });
    expect(v.validate());

    v.setValues({ k1: [0, 1], k2: 1, k3: 3 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: [], k2: 0, k3: 1 });
    expect(v.validate()).toBe(true);
  });

  it('Should be return false', () => {
    const v = new Validator({
      k1: 10,
    }, {
      k1: { betweenWith: { min: 'k2', max: 'k3' } },
    });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: undefined, k2: 1, k3: 2 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: true, k2: 1, k3: 2 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: false, k2: 1, k3: 2 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 0, k2: 1, k3: 2 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 3, k2: 1, k3: 2 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: '3', k2: '1', k3: '2' });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 'string', k2: 1, k3: 2 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 'string', k2: '1', k3: '2' });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: [], k2: 1, k3: 2 });
    expect(v.validate()).toBe(false);
  });
});
