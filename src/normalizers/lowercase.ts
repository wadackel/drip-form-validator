import Validator from '../validator';

Validator.registerNormalizer('lowercase', { toString: true }, (value: any) => {
  return value.toLowerCase();
});
