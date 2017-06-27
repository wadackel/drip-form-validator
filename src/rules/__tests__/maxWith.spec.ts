import { Validator } from '../../';

const ruleName = 'maxWith';

describe(`Rules#${ruleName}`, () => {
  it('Should be return true', () => {
    const v = new Validator({ k1: 10, k2: 11 }, { k1: { [ruleName]: 'k2' } });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 4, k2: 4 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 4, k2: '4' });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 10.5, k2: 10.6 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: '101', k2: 101 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: '10.5', k2: 10.6 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: '10.5', k2: '10.6' });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 'str', k2: 3 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 'string', k2: 6 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: 'number', k2: 7 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: [0, 1], k2: 2 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: [10, 10, 10, 10], k2: 4 });
    expect(v.validate()).toBe(true);

    v.setValues({ k1: [10, 10, 10, 10], k2: '4' });
    expect(v.validate()).toBe(true);
  });

  it('Should be return false', () => {
    const v = new Validator({ k1: 10 }, { k1: { [ruleName]: 'k2' } });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 'string', k2: null });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 'string', k2: 'str' });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 'str', k2: [0] });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: [0, 1, 2], k2: [0, 1] });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 10, k2: 9 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 10, k2: '9' });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: 'str', k2: 2 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: '0.2', k2: 0.1 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: '0.2', k2: '0.1' });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: [0, 1, 2], k2: 2 });
    expect(v.validate()).toBe(false);

    v.setValues({ k1: [0, 1, 2], k2: '2' });
    expect(v.validate()).toBe(false);
  });
});
