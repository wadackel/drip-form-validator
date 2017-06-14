import Validator from '../validator';

Validator.registerNormalizer('uppercase', (value: any) => {
  return value.toUpperCase();
}, {
  depends: { toString: true },
});
