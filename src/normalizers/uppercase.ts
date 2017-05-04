import Validator from '../validator';

Validator.registerNormalizer('uppercase', { toString: true }, (value: any) => {
  return value.toUpperCase();
});
