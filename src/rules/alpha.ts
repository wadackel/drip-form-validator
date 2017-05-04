import Validator from '../validator';

Validator.registerRule('alpha', { string: true }, (value: any) => {
  return /^[A-Za-z]+$/.test(value);
});
