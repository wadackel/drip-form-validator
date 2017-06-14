import Validator from '../validator';

Validator.registerNormalizer('lowercase', (value: any) => {
  return value.toLowerCase();
}, {
  depends: { toString: true },
});
