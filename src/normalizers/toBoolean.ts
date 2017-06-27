import Validator from '../Validator';

Validator.registerNormalizer('toBoolean', (value: any) => {
  return value ? value !== 'false' && value !== '0' : !!value;
});
