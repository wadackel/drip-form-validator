import { Validator } from '../../';

const normalizer = 'maxWith';

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    const v = new Validator();

    v.setValues({ k1: 20, k2: 10 });
    v.setNormalizers({ k1: { [normalizer]: 'k2' } });
    v.normalize();
    expect(v.getValue('k1')).toBe(10);

    v.setValues({ k1: 5, k2: 10 });
    v.normalize();
    expect(v.getValue('k1')).toBe(5);

    v.setValues({ k1: '5', k2: '10' });
    v.normalize();
    expect(v.getValue('k1')).toBe(5);

    v.setValues({ k1: '5', k2: 'foo' });
    v.normalize();
    expect(v.getValue('k1')).toBe('5');

    v.setValues({ k1: 'foo', k2: 10 });
    v.normalize();
    expect(v.getValue('k1')).toBe('foo');

    v.setValues({ k1: 'foo' });
    v.normalize();
    expect(v.getValue('k1')).toBe('foo');
  });
});
