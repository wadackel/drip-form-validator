import Validator from '../Validator';

Validator.registerNormalizer('uppercase', (value: any) => {
  return value.toUpperCase();
}, {
  depends: { toString: true },
});
