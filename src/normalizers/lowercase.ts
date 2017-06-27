import Validator from '../Validator';

Validator.registerNormalizer('lowercase', (value: any) => {
  return value.toLowerCase();
}, {
  depends: { toString: true },
});
